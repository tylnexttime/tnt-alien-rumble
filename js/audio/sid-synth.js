/**
 * TNT ALIEN RUMBLE - COMMODORE 64 SID CHIP SYNTHESIZER
 * Real-time Web Audio API multi-channel SID sound synthesis engine.
 * Emulates MOS 6581 / 8580 SID chip features:
 * - Voice 1: Pulse wave with PWM & rapid arpeggiator
 * - Voice 2: Triangle / Sawtooth wave with resonant filtering
 * - Voice 3: Noise channel with envelopes for retro 8-bit drums
 */

class SidSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.voiceGain = null;
    this.enabled = true;
    this.currentTrack = null;
    this.isPlaying = false;
    this.bpm = 135;
    this.step = 0;
    this.timerId = null;
    this.tracks = {};

    // Load saved volume levels from localStorage or defaults
    const masterSaved = localStorage.getItem('tnt_master_vol');
    const musicSaved = localStorage.getItem('tnt_music_vol');
    const sfxSaved = localStorage.getItem('tnt_sfx_vol');
    const voiceSaved = localStorage.getItem('tnt_voice_vol');

    this.masterVolume = masterSaved !== null ? parseFloat(masterSaved) / 100 : 0.7;
    this.musicVolume = musicSaved !== null ? parseFloat(musicSaved) / 100 : 0.5;
    this.sfxVolume = sfxSaved !== null ? parseFloat(sfxSaved) / 100 : 0.7;
    this.voiceVolume = voiceSaved !== null ? parseFloat(voiceSaved) / 100 : 0.8;

    this.initTracks();
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, Math.min(1, this.masterVolume)), this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music sub-bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(Math.max(0.0001, Math.min(1, this.musicVolume)), this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX sub-bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(Math.max(0.0001, Math.min(1, this.sfxVolume)), this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Voice sub-bus
      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(Math.max(0.0001, Math.min(1, this.voiceVolume)), this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      console.log("C64 SID Synthesizer initialized with saved volumes:", {
        master: this.masterVolume,
        music: this.musicVolume,
        sfx: this.sfxVolume,
        voice: this.voiceVolume
      });
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setVoiceVolume(val) {
    this.voiceVolume = Math.max(0, Math.min(1, val));
    if (this.voiceGain && this.ctx) {
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);
    }
  }

  setMusicEnabled(val) {
    this.enabled = val;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(val ? this.musicVolume : 0.0001, this.ctx.currentTime);
    }
    if (!val && this.isPlaying) {
      this.stopMusic();
    }
  }

  // Note frequency calculation (A4 = 440Hz, 12-TET)
  noteToFreq(note) {
    if (!note || note === '---' || note === '...') return 0;
    const notes = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
    const key = note.substring(0, 2);
    const octave = parseInt(note.substring(2), 10);
    const index = notes.indexOf(key);
    if (index === -1) return 0;
    const semitones = index + (octave - 4) * 12 - 9; // A4 is reference
    return 440 * Math.pow(2, semitones / 12);
  }

  // Play a single SID lead pulse note with PWM and arpeggio
  playSidLead(freq, duration, arpeggioOffsets = [0, 3, 7]) {
    if (!this.ctx || !this.enabled || freq <= 0) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pulse / Square wave with sharp retro edge
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    // Rapid C64-style 50Hz arpeggiator if multiple offsets
    if (arpeggioOffsets && arpeggioOffsets.length > 1) {
      const arpSpeed = 0.035; // 35ms per arp step
      for (let i = 0; i < Math.floor(duration / arpSpeed); i++) {
        const offset = arpeggioOffsets[i % arpeggioOffsets.length];
        const arpFreq = freq * Math.pow(2, offset / 12);
        osc.frequency.setValueAtTime(arpFreq, t + i * arpSpeed);
      }
    }

    // SID Envelope ADSR
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.28, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.06);
    gain.gain.setValueAtTime(0.18, t + duration - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Play a SID bass note (Sawtooth / Triangle with lowpass filter)
  playSidBass(freq, duration) {
    if (!this.ctx || !this.enabled || freq <= 0) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Resonant C64 SID Low-pass filter envelope
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(6.0, t);
    filter.frequency.setValueAtTime(freq * 4.5, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + duration * 0.8);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.08);
    gain.gain.setValueAtTime(0.2, t + duration - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Play SID 8-bit Noise Drum (Kick, Snare, Hi-Hat)
  playSidDrum(type, duration = 0.12) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;

    // Buffer noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    if (type === 'kick') {
      // SID Pitch dropped tonal kick
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.1);

      oscGain.gain.setValueAtTime(0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.12);
      return;
    } else if (type === 'snare') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.setValueAtTime(2.0, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    } else if (type === 'hihat') {
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  // Definition of Commodore 64 Music Tracks
  initTracks() {
    // 1. Title Theme: Upbeat 1987 Melbourne House Arcade Style (in C Minor / Eb Major)
    this.tracks.title = {
      bpm: 140,
      lead: [
        'C-4', 'D#4', 'G-4', 'A#4', 'C-5', 'A#4', 'G-4', 'D#4',
        'F-4', 'G-4', 'G#4', 'C-5', 'D-5', 'C-5', 'G#4', 'F-4',
        'D#4', 'F-4', 'G-4', 'A#4', 'C-5', 'D-5', 'D#5', 'D-5',
        'C-5', 'G-4', 'D#4', 'C-4', 'D-4', 'D#4', 'F-4', 'G-4'
      ],
      leadArps: [
        [0, 3, 7], [0, 3, 7], [0, 3, 7], [0, 3, 7],
        [0, 4, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7],
        [0, 3, 7, 10], [0, 3, 7, 10], [0, 3, 7, 10], [0, 3, 7, 10],
        [0, 7, 12], [0, 7, 12], [0, 7, 12], [0, 7, 12]
      ],
      bass: [
        'C-2', 'C-2', 'C-3', 'C-2', 'C-2', 'C-2', 'D#2', 'G-2',
        'F-2', 'F-2', 'F-3', 'F-2', 'F-2', 'F-2', 'G#2', 'C-3',
        'G-2', 'G-2', 'G-3', 'G-2', 'G-2', 'G-2', 'A#2', 'D-3',
        'C-2', 'C-2', 'D#2', 'F-2', 'G-2', 'A#2', 'C-3', 'A#2'
      ],
      drums: [
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'snare',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'snare', 'snare', 'kick', 'hihat'
      ]
    };

    // 2. Stage 1: Downtown Street Beat (Funky C64 groove in A Minor)
    this.tracks.stage1 = {
      bpm: 130,
      lead: [
        'A-4', '...', 'C-5', '...', 'D-5', 'E-5', 'D-5', 'C-5',
        'A-4', 'C-5', 'A-4', 'G-4', 'A-4', '...', '...', '...',
        'E-5', '...', 'G-5', '...', 'A-5', 'G-5', 'E-5', 'D-5',
        'C-5', 'D-5', 'C-5', 'A-4', 'G-4', 'A-4', 'C-5', 'D-5'
      ],
      leadArps: [
        [0, 7, 12], [0, 7, 12], [0, 7, 12], [0, 7, 12],
        [0, 3, 7], [0, 3, 7], [0, 3, 7], [0, 3, 7],
        [0, 5, 10], [0, 5, 10], [0, 5, 10], [0, 5, 10],
        [0, 3, 7, 12], [0, 3, 7, 12], [0, 3, 7, 12], [0, 3, 7, 12]
      ],
      bass: [
        'A-2', 'A-2', 'C-3', 'A-2', 'G-2', 'A-2', 'C-3', 'D-3',
        'A-2', 'A-2', 'C-3', 'A-2', 'G-2', 'E-2', 'G-2', 'G#-2',
        'F-2', 'F-2', 'A-2', 'F-2', 'G-2', 'G-2', 'B-2', 'G-2',
        'A-2', 'A-2', 'C-3', 'A-2', 'D-3', 'C-3', 'B-2', 'G-2'
      ],
      drums: [
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat',
        'kick', 'kick', 'snare', 'hihat', 'kick', 'snare', 'snare', 'hihat'
      ]
    };

    // 3. Stage 2: Urban Park & Basketball Courts (Bouncy Synth-Funk in D Minor)
    this.tracks.stage2 = {
      bpm: 136,
      lead: [
        'D-4', 'F-4', 'A-4', 'C-5', 'D-5', 'C-5', 'A-4', 'F-4',
        'G-4', 'A-4', 'A#4', 'D-5', 'C-5', 'A#4', 'A-4', 'G-4',
        'F-4', 'G-4', 'A-4', 'C-5', 'D-5', 'F-5', 'E-5', 'D-5',
        'C-5', 'A-4', 'F-4', 'D-4', 'E-4', 'F-4', 'G-4', 'A-4'
      ],
      leadArps: [
        [0, 3, 7], [0, 3, 7], [0, 3, 7], [0, 3, 7],
        [0, 4, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7],
        [0, 3, 8], [0, 3, 8], [0, 3, 8], [0, 3, 8],
        [0, 7, 12], [0, 7, 12], [0, 7, 12], [0, 7, 12]
      ],
      bass: [
        'D-2', 'D-2', 'F-2', 'D-2', 'A-2', 'D-2', 'F-2', 'G-2',
        'G-2', 'G-2', 'A#2', 'G-2', 'D-3', 'C-3', 'A#2', 'A-2',
        'A#-2', 'A#-2', 'D-3', 'A#-2', 'C-3', 'C-3', 'E-3', 'C-3',
        'D-2', 'D-2', 'F-2', 'A-2', 'C-3', 'A-2', 'F-2', 'E-2'
      ],
      drums: [
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'kick',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'kick',
        'kick', 'hihat', 'snare', 'hihat', 'snare', 'hihat', 'snare', 'snare'
      ]
    };

    // 4. Boss Battle: Duke Davis Showdown (Heavy, Fast, Aggressive in E Minor)
    this.tracks.boss = {
      bpm: 152,
      lead: [
        'E-4', 'E-4', 'G-4', 'E-4', 'A-4', 'E-4', 'A#4', 'B-4',
        'E-5', 'D-5', 'B-4', 'A#4', 'A-4', 'G-4', 'E-4', 'D-4',
        'E-4', 'G-4', 'B-4', 'D-5', 'E-5', 'G-5', 'F#5', 'F-5',
        'E-5', 'B-4', 'G-4', 'E-4', 'D-4', 'D#4', 'E-4', '...'
      ],
      leadArps: [
        [0, 3, 6, 9], [0, 3, 6, 9], [0, 3, 6, 9], [0, 3, 6, 9],
        [0, 3, 7, 12], [0, 3, 7, 12], [0, 3, 7, 12], [0, 3, 7, 12],
        [0, 6, 12], [0, 6, 12], [0, 6, 12], [0, 6, 12],
        [0, 3, 7], [0, 3, 7], [0, 3, 7], [0, 3, 7]
      ],
      bass: [
        'E-2', 'E-2', 'E-3', 'E-2', 'E-2', 'G-2', 'A-2', 'A#2',
        'B-2', 'B-2', 'D-3', 'B-2', 'A-2', 'G-2', 'F#-2', 'F-2',
        'E-2', 'E-2', 'E-3', 'E-2', 'G-2', 'A-2', 'A#2', 'B-2',
        'C-3', 'C-3', 'B-2', 'A-2', 'G-2', 'F#-2', 'F-2', 'D#-2'
      ],
      drums: [
        'kick', 'snare', 'kick', 'snare', 'kick', 'snare', 'kick', 'snare',
        'kick', 'snare', 'kick', 'snare', 'kick', 'kick', 'snare', 'snare',
        'kick', 'snare', 'kick', 'snare', 'kick', 'snare', 'kick', 'snare',
        'kick', 'snare', 'snare', 'snare', 'kick', 'kick', 'snare', 'hihat'
      ]
    };

    // 5. Victory UFO Fanfare (Majestic Cosmic C Major)
    this.tracks.victory = {
      bpm: 125,
      lead: [
        'C-4', 'E-4', 'G-4', 'C-5', 'E-5', 'G-5', 'C-6', '...',
        'G-5', 'E-5', 'C-5', 'G-4', 'A-4', 'B-4', 'C-5', '...',
        'F-4', 'A-4', 'C-5', 'F-5', 'G-4', 'B-4', 'D-5', 'G-5',
        'C-5', 'E-5', 'G-5', 'C-6', '...', '...', '...', '...'
      ],
      leadArps: [
        [0, 4, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12],
        [0, 4, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7],
        [0, 5, 9, 12], [0, 5, 9, 12], [0, 4, 7, 11], [0, 4, 7, 11],
        [0, 4, 7, 12, 16], [0, 4, 7, 12, 16], [0, 4, 7, 12, 16], [0, 4, 7, 12, 16]
      ],
      bass: [
        'C-2', 'C-3', 'E-2', 'G-2', 'C-2', 'C-3', 'E-2', 'G-2',
        'A-2', 'A-3', 'E-2', 'G-2', 'F-2', 'F-3', 'A-2', 'C-3',
        'F-2', 'F-2', 'A-2', 'C-3', 'G-2', 'G-2', 'B-2', 'D-3',
        'C-2', 'G-2', 'C-3', 'E-3', 'C-3', '...', '...', '...'
      ],
      drums: [
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'hihat',
        'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'hihat',
        'kick', 'snare', 'kick', 'snare', 'kick', 'kick', 'snare', 'snare'
      ]
    };
  }

  // Play a named music track in loop
  playTrack(name) {
    if (!this.tracks[name]) return;
    this.init();
    this.resume();
    this.stopMusic();

    this.currentTrack = this.tracks[name];
    this.bpm = this.currentTrack.bpm || 135;
    this.step = 0;
    this.isPlaying = true;

    const stepInterval = (60 / this.bpm / 4) * 1000; // 16th note timing

    const tick = () => {
      if (!this.isPlaying || !this.currentTrack) return;

      const track = this.currentTrack;
      const totalSteps = track.lead.length;
      const s = this.step % totalSteps;
      const stepDuration = 60 / this.bpm / 4;

      // 1. Lead note
      const leadNote = track.lead[s];
      if (leadNote && leadNote !== '...' && leadNote !== '---') {
        const freq = this.noteToFreq(leadNote);
        const arp = track.leadArps ? track.leadArps[s % track.leadArps.length] : [0, 4, 7];
        this.playSidLead(freq, stepDuration * 1.8, arp);
      }

      // 2. Bass note
      const bassNote = track.bass[s];
      if (bassNote && bassNote !== '...' && bassNote !== '---') {
        const freq = this.noteToFreq(bassNote);
        this.playSidBass(freq, stepDuration * 1.5);
      }

      // 3. Drum beat
      const drumType = track.drums[s];
      if (drumType && drumType !== '---') {
        this.playSidDrum(drumType, stepDuration);
      }

      this.step++;
      this.timerId = setTimeout(tick, stepInterval);
    };

    tick();
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

// Global Synthesizer Instance
window.sidSynth = new SidSynthesizer();
