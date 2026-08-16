/**
 * TNT ALIEN RUMBLE - INPUT MANAGER
 * Supports Keyboard (WASD / Arrows / Action keys), Gamepad API, and Touch controls.
 * Features double-tap detection for dashing / Bull Ram attacks.
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.lastKeyPressTime = {};
    this.doubleTapThreshold = 280; // ms
    this.doubleTapped = {};

    this.axisX = 0;
    this.axisY = 0;

    this.initKeyboard();
    this.initTouch();
    this.initGamepad();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Resume Web Audio context on first user key press
      if (window.sidSynth) window.sidSynth.resume();

      const code = e.code;
      if (!this.keys[code]) {
        this.keysJustPressed[code] = true;

        // Check double tap for directions
        const now = Date.now();
        const last = this.lastKeyPressTime[code] || 0;
        if (now - last < this.doubleTapThreshold) {
          this.doubleTapped[code] = true;
        }
        this.lastKeyPressTime[code] = now;
      }
      this.keys[code] = true;

      // Prevent default scrolling on arrow keys & space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      this.keys[code] = false;
      this.doubleTapped[code] = false;
    });
  }

  initTouch() {
    const buttons = document.querySelectorAll('.dpad-btn, .v-btn');
    buttons.forEach(btn => {
      const key = btn.getAttribute('data-key');
      if (!key) return;

      const triggerPress = (e) => {
        e.preventDefault();
        if (window.sidSynth) window.sidSynth.resume();

        if (!this.keys[key]) {
          this.keysJustPressed[key] = true;
          const now = Date.now();
          const last = this.lastKeyPressTime[key] || 0;
          if (now - last < this.doubleTapThreshold) {
            this.doubleTapped[key] = true;
          }
          this.lastKeyPressTime[key] = now;
        }
        this.keys[key] = true;
        btn.classList.add('active');
      };

      const triggerRelease = (e) => {
        e.preventDefault();
        this.keys[key] = false;
        this.doubleTapped[key] = false;
        btn.classList.remove('active');
      };

      btn.addEventListener('touchstart', triggerPress, { passive: false });
      btn.addEventListener('touchend', triggerRelease, { passive: false });
      btn.addEventListener('touchcancel', triggerRelease, { passive: false });
      btn.addEventListener('mousedown', triggerPress);
      btn.addEventListener('mouseup', triggerRelease);
      btn.addEventListener('mouseleave', triggerRelease);
    });
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}`);
    });
  }

  pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp) return;

    // Left Stick / D-Pad
    const deadzone = 0.25;
    const stickX = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    const stickY = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;

    this.keys['ArrowLeft'] = this.keys['ArrowLeft'] || stickX < -0.4 || gp.buttons[14]?.pressed;
    this.keys['ArrowRight'] = this.keys['ArrowRight'] || stickX > 0.4 || gp.buttons[15]?.pressed;
    this.keys['ArrowUp'] = this.keys['ArrowUp'] || stickY < -0.4 || gp.buttons[12]?.pressed;
    this.keys['ArrowDown'] = this.keys['ArrowDown'] || stickY > 0.4 || gp.buttons[13]?.pressed;

    // Face buttons: X/A = Punch/Jump, Y/B = Headbutt/Trip, LB/RB = Ram/Ear, LT/RT = Taunt/Super
    if (gp.buttons[0]?.pressed) this.keys['KeyJ'] = true; // A = Punch
    if (gp.buttons[1]?.pressed) this.keys['KeyK'] = true; // B = Headbutt (Bop)
    if (gp.buttons[2]?.pressed) this.keys['KeyL'] = true; // X = Trip
    if (gp.buttons[3]?.pressed) this.keys['KeyU'] = true; // Y = Bull Ram
    if (gp.buttons[4]?.pressed) this.keys['KeyI'] = true; // LB = Ear Twist
    if (gp.buttons[5]?.pressed) this.keys['KeyO'] = true; // RB = Donkey Kick
    if (gp.buttons[8]?.pressed) this.keys['KeyT'] = true; // Select = Taunt
    if (gp.buttons[9]?.pressed || gp.buttons[7]?.pressed) this.keys['Space'] = true; // Start / RT = Super
  }

  update() {
    this.pollGamepad();

    // Directional Axis calculation
    this.axisX = 0;
    this.axisY = 0;

    if (this.isDown('ArrowLeft') || this.isDown('KeyA')) this.axisX -= 1;
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) this.axisX += 1;
    if (this.isDown('ArrowUp') || this.isDown('KeyW')) this.axisY -= 1;
    if (this.isDown('ArrowDown') || this.isDown('KeyS')) this.axisY += 1;
  }

  postUpdate() {
    // Reset one-frame triggers
    this.keysJustPressed = {};
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isJustPressed(code) {
    return !!this.keysJustPressed[code];
  }

  isDoubleTapped(code) {
    return !!this.doubleTapped[code];
  }
}

// Global Input Instance
window.input = new InputManager();
