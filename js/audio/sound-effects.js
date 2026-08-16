/**
 * TNT ALIEN RUMBLE - PROCEDURAL 8-BIT ARCADE SOUND EFFECTS
 * Generates custom retro sound effects in real time using the Web Audio API.
 */

class SoundEffects {
  constructor() {
    this.enabled = true;
  }

  get ctx() {
    return window.sidSynth ? window.sidSynth.ctx : null;
  }

  get out() {
    return window.sidSynth ? window.sidSynth.sfxGain : null;
  }

  setEnabled(val) {
    this.enabled = val;
  }

  // 1. Standard Punch / Jab Hit
  playPunch() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    // Pitch sweep square wave
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.09);

    // Noise crack
    this.playNoiseBurst(0.04, 800, 0.3);
  }

  // 2. Iconic Stretchy Headbutt (The "BOP!" sound)
  playHeadbutt() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    // Springy resonant rubber stretch into deep wooden thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.06); // stretch up
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.16);  // heavy crash down

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.18);

    // Concussive pop
    this.playNoiseBurst(0.08, 1400, 0.5);
  }

  // 3. Low Trip / Shin Grab (Scrape)
  playTrip() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // 4. Bull Ram / Bulldozer Dash (Engine-like rocket rumble)
  playBulldozer() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.25);
    osc.frequency.linearRampToValueAtTime(90, t + 0.45);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.48);
  }

  // 5. Ear Twist / Cheek Pinch (Squeak & Crunch)
  playEarTwist() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.linearRampToValueAtTime(1400, t + 0.08);
    osc.frequency.linearRampToValueAtTime(700, t + 0.16);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 6. Flying Belly Flop (Heavy Earth-shattering body slam)
  playBellyFlop() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.28);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.3);

    this.playNoiseBurst(0.18, 400, 0.6);
  }

  // 7. Dropkick / Roundhouse Whoosh
  playWhoosh() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // 8. Handbag Whack (Heavy metal purse thud with coin jingling)
  playHandbag() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    // Heavy bell/frying pan thwack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.18);

    this.playNoiseBurst(0.1, 2400, 0.4);
  }

  // 9. Attack Poodle Bark & Bite
  playDogBark() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.linearRampToValueAtTime(450, t + 0.05);
    osc.frequency.linearRampToValueAtTime(800, t + 0.09);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // 10. Basketball Bounce
  playBallBounce() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // 11. Trash Can Smash & Prop Debris
  playTrashSmash() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.22);

    this.playNoiseBurst(0.25, 900, 0.55);
  }

  // 12. Powerup Pickup / Chime
  playPickup() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.001, t + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.25, t + i * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.08);

      osc.connect(gain);
      gain.connect(this.out);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.08);
    });
  }

  // 13. Alien Taunt (Wobbly frequency modulation)
  playAlienTaunt() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    lfo.frequency.setValueAtTime(14, t); // 14Hz fast wobble
    lfoGain.gain.setValueAtTime(120, t);
    lfo.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.out);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.4);
    osc.stop(t + 0.4);
  }

  // 14. Cosmic UFO Tractor Beam (Sci-fi laser hum & elevation)
  playTractorBeam() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(200, t);
    osc1.frequency.linearRampToValueAtTime(1200, t + 0.8);
    osc1.frequency.linearRampToValueAtTime(400, t + 1.6);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(100, t);
    osc2.frequency.linearRampToValueAtTime(600, t + 0.8);
    osc2.frequency.linearRampToValueAtTime(200, t + 1.6);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.out);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.7);
    osc2.stop(t + 1.7);
  }

  // 15. Basketball Bouncing on Asphalt
  playBasketballBounce() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.08);

    this.playNoiseBurst(0.025, 1000, 0.25);
  }

  // 16. Agnes Helicopter Handbag Rotor Spin (Clean, whimsical 8-bit cartoon rotor flutter)
  playHelicopterRotor() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;
    const dur = 0.15;

    // 1. Warm Whimsical Rotor Pulse (Triangle Wave)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + dur);

    oscGain.gain.setValueAtTime(0.001, t);
    oscGain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(oscGain);
    oscGain.connect(this.out);
    osc.start(t);
    osc.stop(t + dur);

    // 2. Soft Bandpass Filtered Blade Whoosh
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + dur);
    filter.Q.setValueAtTime(2.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.out);

    noise.start(t);
    noise.stop(t + dur);
  }

  // 17. Handbag Whack Impact
  playHandbag() {
    if (!this.enabled || !this.ctx || !this.out) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.out);
    osc.start(t);
    osc.stop(t + 0.14);

    this.playNoiseBurst(0.06, 1200, 0.4);
  }

  // Helper: Noise burst
  playNoiseBurst(duration, filterFreq, volume = 0.3) {
    if (!this.ctx || !this.out) return;
    const t = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.out);

    noise.start(t);
    noise.stop(t + duration);
  }
}

// Global Sound Effects instance
window.sfx = new SoundEffects();
