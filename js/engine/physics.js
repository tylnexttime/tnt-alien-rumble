/**
 * TNT ALIEN RUMBLE - 2.5D BELT-SCROLLER PHYSICS ENGINE
 * Handles 3-axis coordinates (X horizontal, Y depth lane, Z vertical jump height),
 * gravity, shadows, hitboxes, and 2.5D spatial collision tests.
 */

class PhysicsEngine {
  constructor() {
    this.gravity = 0.55;
    this.groundYMin = 330; // Sidewalk back boundary
    this.groundYMax = 490; // Street front curb boundary
  }

  // Update an entity's 3D motion and apply gravity
  updateEntity(ent, dt = 1) {
    // Horizontal & depth movement
    ent.x += (ent.vx || 0) * dt;
    ent.y += (ent.vy || 0) * dt;

    // Apply friction to horizontal and depth velocity
    if (ent.friction) {
      ent.vx *= ent.friction;
      ent.vy *= ent.friction;
      if (Math.abs(ent.vx) < 0.05) ent.vx = 0;
      if (Math.abs(ent.vy) < 0.05) ent.vy = 0;
    }

    // Clamp Y to playable street sidewalk lanes (unless entity is flying away)
    if (ent.clampY !== false && !ent.isFlying && ent.state !== 'helicopter') {
      if (ent.y < this.groundYMin) ent.y = this.groundYMin;
      if (ent.y > this.groundYMax) ent.y = this.groundYMax;
    }

    // Vertical Jump / Knockup motion (Z axis)
    if (ent.z !== undefined) {
      if (ent.isFlying || ent.state === 'helicopter') {
        // Flying entities control their own Z motion without gravity pulling them down
        ent.vz = 0;
      } else {
        ent.z += (ent.vz || 0) * dt;
        ent.vz -= this.gravity * dt;

        // Ground hit
        if (ent.z <= 0) {
          ent.z = 0;
          const wasFalling = ent.vz < -2;
          ent.vz = 0;

          if (ent.onLand && wasFalling) {
            ent.onLand();
          }
        }
      }
    }
  }

  // Check 2.5D attack hit between attacker hitbox and defender hurtbox
  checkHit(attacker, attackBox, target, customDepthTolerance = 24) {
    if (!target.isAlive || target.isInvulnerable) return false;

    // 1. Calculate world attacker hitbox
    const facing = attacker.facing || 1; // 1 = right, -1 = left
    const hitX = attacker.x + attackBox.offsetX * facing;
    const hitY = attacker.y + (attackBox.offsetY || 0);
    const hitZ = attacker.z + (attackBox.offsetZ || 0);

    const hitWidth = attackBox.width;
    const hitHeight = attackBox.height;

    // 2. Target hurtbox
    const targetWidth = target.width || 36;
    const targetHeight = target.height || 64;

    // A. X-axis overlap
    const xDist = Math.abs(hitX - target.x);
    if (xDist > (hitWidth + targetWidth) / 2) return false;

    // B. Y-axis lane depth overlap (Crucial for 2.5D beat 'em ups)
    const yDist = Math.abs(hitY - target.y);
    if (yDist > customDepthTolerance) return false;

    // C. Z-axis vertical height overlap
    const zDist = Math.abs(hitZ - target.z);
    if (zDist > (hitHeight + targetHeight) / 2) return false;

    return true;
  }

  // Draw 2.5D dynamic shadow at ground position (x, y)
  renderShadow(ctx, camera, x, y, z, baseWidth = 36) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((x - camera.x) * s);
    const screenY = Math.round((y - camera.y) * s);

    const heightScale = Math.max(0.3, 1 - (z || 0) / 220);
    const shadowWidth = baseWidth * heightScale * s;
    const shadowHeight = (baseWidth * 0.35) * heightScale * s;
    const alpha = Math.max(0.15, 0.45 * heightScale);

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Global Physics Instance
window.physics = new PhysicsEngine();
