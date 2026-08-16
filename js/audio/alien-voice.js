/**
 * TNT ALIEN RUMBLE - LOW-POLY 8-BIT ALIEN SPEECH SYNTHESIZER
 * Simulates 1980s formant speech chips (e.g. SAM / SPO256 / Votrax)
 * to generate robotic, pitch-bent alien vocalizations and speech lines in real-time.
 */

class AlienVoiceSynth {
  constructor() {
    this.enabled = true;
    this.lastSpokenTime = 0;
  }

  get ctx() {
    return window.sidSynth ? window.sidSynth.ctx : null;
  }

  get out() {
    return window.sidSynth ? window.sidSynth.voiceGain : null;
  }

  setEnabled(val) {
    this.enabled = val;
  }

  // Formant frequencies for standard vowels (F1, F2, F3 in Hz)
  // Tuned for high-pitched, resonant skinny gray alien vocal tract
  getFormants(phoneme) {
    switch (phoneme) {
      case 'AA': // "Bop", "God"
        return [950, 1500, 2900];
      case 'EE': // "Gleep", "Duke-ee"
        return [380, 2700, 3700];
      case 'OO': // "Probe", "Dude"
        return [400, 1050, 2600];
      case 'EH': // "Earth", "Head"
        return [680, 2100, 3100];
      case 'OH': // "Glorp", "Bop"
        return [580, 1150, 2700];
      case 'UH': // "Scum", "Mug"
        return [750, 1400, 2800];
      case 'SS': // Sibilant noise
        return [0, 0, 5500];
      case 'CH': // Plosive burst
        return [0, 0, 4200];
      case 'KK': // Velar burst
        return [0, 0, 2000];
      default:
        return [600, 1600, 2800];
    }
  }

  // Synthesize a single phoneme with formant filter bank
  playPhoneme(phoneme, startTime, duration, basePitch = 220, isVoiced = true) {
    if (!this.ctx || !this.out || !this.enabled) return;
    const t = startTime;
    const [f1, f2, f3] = this.getFormants(phoneme);

    if (isVoiced && f1 > 0) {
      // Voiced sound (Alien glottal pulse train using modulated Sawtooth)
      const osc = this.ctx.createOscillator();
      const pitchMod = this.ctx.createOscillator();
      const pitchModGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(basePitch, t);
      // Alien metallic vibrato
      pitchMod.frequency.setValueAtTime(30, t);
      pitchModGain.gain.setValueAtTime(15, t);
      pitchMod.connect(osc.frequency);

      // 3 Formant Bandpass Filters (F1, F2, F3)
      const gainF1 = this.ctx.createGain();
      const gainF2 = this.ctx.createGain();
      const gainF3 = this.ctx.createGain();

      const bp1 = this.ctx.createBiquadFilter();
      bp1.type = 'bandpass';
      bp1.frequency.setValueAtTime(f1, t);
      bp1.Q.setValueAtTime(8, t);

      const bp2 = this.ctx.createBiquadFilter();
      bp2.type = 'bandpass';
      bp2.frequency.setValueAtTime(f2, t);
      bp2.Q.setValueAtTime(10, t);

      const bp3 = this.ctx.createBiquadFilter();
      bp3.type = 'bandpass';
      bp3.frequency.setValueAtTime(f3, t);
      bp3.Q.setValueAtTime(12, t);

      // Envelope
      const masterEnv = this.ctx.createGain();
      masterEnv.gain.setValueAtTime(0.001, t);
      masterEnv.gain.linearRampToValueAtTime(0.4, t + 0.02);
      masterEnv.gain.setValueAtTime(0.35, t + duration - 0.02);
      masterEnv.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(bp1);
      osc.connect(bp2);
      osc.connect(bp3);

      bp1.connect(gainF1);
      bp2.connect(gainF2);
      bp3.connect(gainF3);

      gainF1.gain.setValueAtTime(0.7, t);
      gainF2.gain.setValueAtTime(0.5, t);
      gainF3.gain.setValueAtTime(0.3, t);

      gainF1.connect(masterEnv);
      gainF2.connect(masterEnv);
      gainF3.connect(masterEnv);

      masterEnv.connect(this.out);

      pitchMod.start(t);
      osc.start(t);
      pitchMod.stop(t + duration);
      osc.stop(t + duration);
    } else {
      // Unvoiced noise fricative (S, CH, K)
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(f3, t);
      bp.Q.setValueAtTime(4, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(bp);
      bp.connect(gain);
      gain.connect(this.out);

      noise.start(t);
      noise.stop(t + duration);
    }
  }

  // Synthesize speech phrase from phoneme sequence
  speakSequence(sequence, basePitch = 240) {
    if (!this.enabled || !this.ctx || !this.out) return;
    const now = Date.now();
    if (now - this.lastSpokenTime < 450) return; // Prevent overlapping spam
    this.lastSpokenTime = now;

    let timeOffset = this.ctx.currentTime + 0.02;

    sequence.forEach(item => {
      const { p, dur, pitchOffset = 0, voiced = true } = item;
      this.playPhoneme(p, timeOffset, dur, basePitch + pitchOffset, voiced);
      timeOffset += dur * 0.95; // Slight overlap for natural blending
    });
  }

  // Public Alien Voice Lines
  speakBopEm() {
    this.showSpeechHUD("BOP 'EM!");
    this.speakSequence([
      { p: 'AA', dur: 0.05, pitchOffset: -20, voiced: true },
      { p: 'AA', dur: 0.12, pitchOffset: 40, voiced: true },
      { p: 'KK', dur: 0.04, pitchOffset: 0, voiced: false },
      { p: 'EH', dur: 0.10, pitchOffset: -10, voiced: true },
      { p: 'OH', dur: 0.08, pitchOffset: 20, voiced: true }
    ], 260);
  }

  speakOuchie() {
    this.showSpeechHUD("OUCHIE!");
    this.speakSequence([
      { p: 'AA', dur: 0.09, pitchOffset: 80, voiced: true },
      { p: 'OO', dur: 0.10, pitchOffset: 50, voiced: true },
      { p: 'CH', dur: 0.05, pitchOffset: 0, voiced: false },
      { p: 'EE', dur: 0.14, pitchOffset: 110, voiced: true }
    ], 300);
  }

  speakEarthScum() {
    this.showSpeechHUD("EARTH SCUM!");
    this.speakSequence([
      { p: 'EH', dur: 0.14, pitchOffset: 30, voiced: true },
      { p: 'SS', dur: 0.06, pitchOffset: 0, voiced: false },
      { p: 'KK', dur: 0.04, pitchOffset: 0, voiced: false },
      { p: 'UH', dur: 0.12, pitchOffset: -30, voiced: true },
      { p: 'OH', dur: 0.08, pitchOffset: -20, voiced: true }
    ], 250);
  }

  speakTakeThatDuke() {
    this.showSpeechHUD("TAKE THAT DUKE!");
    this.speakSequence([
      { p: 'EH', dur: 0.08, pitchOffset: 30, voiced: true },
      { p: 'KK', dur: 0.04, pitchOffset: 0, voiced: false },
      { p: 'AA', dur: 0.10, pitchOffset: 10, voiced: true },
      { p: 'OO', dur: 0.14, pitchOffset: 70, voiced: true },
      { p: 'KK', dur: 0.04, pitchOffset: 0, voiced: false }
    ], 270);
  }

  speakMyProbeIsReady() {
    this.showSpeechHUD("MY PROBE IS READY!");
    this.speakSequence([
      { p: 'AA', dur: 0.08, pitchOffset: 0, voiced: true },
      { p: 'EE', dur: 0.06, pitchOffset: 20, voiced: true },
      { p: 'OH', dur: 0.12, pitchOffset: 40, voiced: true },
      { p: 'OO', dur: 0.08, pitchOffset: 60, voiced: true },
      { p: 'EH', dur: 0.08, pitchOffset: 30, voiced: true },
      { p: 'EE', dur: 0.12, pitchOffset: 80, voiced: true }
    ], 280);
  }

  speakKlaatuBaradaBop() {
    this.showSpeechHUD("KLAATU BARADA BOP!");
    this.speakSequence([
      { p: 'KK', dur: 0.04, pitchOffset: 0, voiced: false },
      { p: 'AA', dur: 0.08, pitchOffset: 10, voiced: true },
      { p: 'OO', dur: 0.09, pitchOffset: 30, voiced: true },
      { p: 'AA', dur: 0.07, pitchOffset: 0, voiced: true },
      { p: 'AA', dur: 0.08, pitchOffset: 40, voiced: true },
      { p: 'AA', dur: 0.14, pitchOffset: 80, voiced: true }
    ], 270);
  }

  // Hysterical high-pitched alien laughter
  laughVictory() {
    this.showSpeechHUD("HAHAHA! EAT LASERS, DUKE!");
    if (!this.enabled || !this.ctx || !this.out) return;
    let t = this.ctx.currentTime + 0.05;

    for (let i = 0; i < 8; i++) {
      const pitch = 320 + (i % 2 === 0 ? 90 : -40) + Math.random() * 40;
      this.playPhoneme('AA', t + i * 0.11, 0.08, pitch, true);
    }
  }

  // Display speech bubble on game HUD
  showSpeechHUD(text) {
    const bubble = document.getElementById('hud-speech-bubble');
    const bubbleText = document.getElementById('hud-speech-text');
    if (!bubble || !bubbleText) return;

    bubbleText.textContent = text;
    bubble.classList.remove('hidden');

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    this.bubbleTimeout = setTimeout(() => {
      bubble.classList.add('hidden');
    }, 1800);
  }
}

// Global Alien Voice Instance
window.alienVoice = new AlienVoiceSynth();
