/**
 * TNT ALIEN RUMBLE - CAMERA SYSTEM
 * Handles horizontal scrolling, viewport clamping, wave/boss arena locking,
 * and high-impact screen shake effects.
 */

class Camera {
  constructor(viewportWidth = 960, viewportHeight = 540) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    // View Zoom Scale: 1.0 (1X Classic) or 2.0 (2X Double C64 Size)
    this.scale = parseFloat(localStorage.getItem('tnt_scale_mode') || '1.0');

    this.minX = 0;
    this.maxX = 3200;
    this.rawStageLength = 3200;
    this.lockX = null; // Arena lock boundary

    // Screen Shake properties
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  setScale(scale) {
    this.scale = scale;
    localStorage.setItem('tnt_scale_mode', scale.toString());
  }

  // Set new stage boundaries
  setStageBounds(stageLength, isInfinite = false) {
    this.isInfinite = isInfinite;
    this.rawStageLength = stageLength;
    this.minX = 0;
    const viewW = this.viewportWidth / this.scale;
    this.maxX = isInfinite ? Infinity : Math.max(0, stageLength - viewW);
    this.lockX = null;
    this.x = 0;
    this.y = this.scale > 1.0 ? 190 : 0;
  }

  // Lock camera to current screen for a fight wave
  lockCurrentArea() {
    this.lockX = {
      min: this.x,
      max: this.x
    };
  }

  unlockArea() {
    this.lockX = null;
  }

  // Trigger high impact screen shake
  shake(intensity = 10) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  update(targetEntity) {
    const viewW = this.viewportWidth / this.scale;
    const viewH = this.viewportHeight / this.scale;

    if (targetEntity) {
      // Keep player centered in the horizontal third of the screen
      const desiredX = targetEntity.x - viewW * 0.35;

      if (this.lockX) {
        this.x = this.lockX.min;
      } else if (this.isInfinite) {
        // Infinite mode (Dojo): camera follows player smoothly in both directions
        this.x = Math.max(0, desiredX);
      } else {
        const maxX = Math.max(0, this.rawStageLength - viewW);
        this.x = Math.max(this.x, Math.min(maxX, Math.max(this.minX, desiredX)));
      }

      // Vertical Camera Framing for 2X zoom mode
      if (this.scale > 1.0) {
        const desiredY = Math.max(130, Math.min(230, targetEntity.y - viewH * 0.68));
        this.y = desiredY;
      } else {
        this.y = 0;
      }
    }

    // Apply and decay screen shake
    if (this.shakeIntensity > 0.5) {
      this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  // Apply camera translation to Canvas context
  applyTransform(ctx) {
    ctx.save();
    if (this.scale > 1.0) {
      ctx.scale(this.scale, this.scale);
    }
    ctx.translate(-Math.round(this.x + this.shakeOffsetX), -Math.round(this.y + this.shakeOffsetY));
  }

  restoreTransform(ctx) {
    ctx.restore();
  }
}

// Global Camera Instance
window.camera = new Camera();
