/**
 * TNT ALIEN RUMBLE - PLAYER ENTITY (GLEEP-GLORP)
 * Full Bop'n Rumble moveset controller, stamina, rage meter, and state machine.
 */

class Player {
  constructor(x = 100, y = 400) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.friction = 0.82;
    this.facing = 1; // 1 = right, -1 = left

    this.width = 32;
    this.height = 54;
    this.isAlive = true;
    this.isInvulnerable = false;
    this.invulnTimer = 0;

    // Stats
    this.maxHp = 100;
    this.hp = 100;
    this.lives = 3;
    this.rageMeter = 0; // 0 to 100
    this.score = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    // State Machine
    this.state = 'idle'; // 'idle', 'walk', 'jab', 'headbutt', 'trip', 'bulldozer', 'ear_twist', 'belly_flop', 'roundhouse', 'macho_elbow', 'donkey_kick', 'taunt', 'hurt', 'knockdown', 'super'
    this.stateTimer = 0;
    this.stateDuration = 0;
    this.animTimer = 0;
    this.isAttacking = false;
    this.hasHitThisAttack = false;

    // Active attack hitbox definition
    this.activeHitbox = null;
  }

  reset(x = 100, y = 400) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.hp = this.maxHp;
    this.isAlive = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.invulnTimer = 90;
    this.isInvulnerable = true;
  }

  // Set new state with duration
  setState(newState, duration = 20) {
    this.state = newState;
    this.stateTimer = 0;
    this.stateDuration = duration;
    this.hasHitThisAttack = false;
    this.isAttacking = [
      'jab', 'headbutt', 'trip', 'bulldozer', 'ear_twist',
      'belly_flop', 'roundhouse', 'macho_elbow', 'donkey_kick', 'super'
    ].includes(newState);

    this.setupHitbox(newState);
  }

  setupHitbox(state) {
    switch (state) {
      case 'jab':
        this.activeHitbox = { offsetX: 22, offsetY: -5, offsetZ: 24, width: 34, height: 26, damage: 12, knockback: 3, comic: "BOP!" };
        break;
      case 'headbutt':
        this.activeHitbox = { offsetX: 34, offsetY: 0, offsetZ: 28, width: 44, height: 32, damage: 22, knockback: 8, comic: "KAPOW!" };
        break;
      case 'trip':
        this.activeHitbox = { offsetX: 20, offsetY: 0, offsetZ: 5, width: 38, height: 18, damage: 14, knockback: 2, knockTrip: true, comic: "TRIP!" };
        break;
      case 'bulldozer':
        this.activeHitbox = { offsetX: 20, offsetY: 0, offsetZ: 20, width: 42, height: 36, damage: 28, knockback: 12, knockAir: true, comic: "RAMMED!" };
        break;
      case 'ear_twist':
        this.activeHitbox = { offsetX: 18, offsetY: 0, offsetZ: 32, width: 30, height: 24, damage: 26, knockback: 4, stun: 45, comic: "TWIST!" };
        break;
      case 'belly_flop':
        this.activeHitbox = { offsetX: 0, offsetY: 0, offsetZ: 10, width: 48, height: 30, damage: 32, knockback: 10, knockAir: true, comic: "SPLAT!" };
        break;
      case 'roundhouse':
        this.activeHitbox = { offsetX: 26, offsetY: 0, offsetZ: 25, width: 46, height: 34, damage: 25, knockback: 10, knockAir: true, comic: "WHACK!" };
        break;
      case 'macho_elbow':
        this.activeHitbox = { offsetX: 18, offsetY: 0, offsetZ: 15, width: 36, height: 36, damage: 30, knockback: 8, knockAir: true, comic: "CRUSH!" };
        break;
      case 'donkey_kick':
        this.activeHitbox = { offsetX: -24, offsetY: 0, offsetZ: 22, width: 40, height: 26, damage: 20, knockback: 7, comic: "DONKEY!" };
        break;
      default:
        this.activeHitbox = null;
    }
  }

  handleInput(input) {
    if (!this.isAlive || ['hurt', 'knockdown', 'super'].includes(this.state)) return;

    const moveSpeed = 3.4;
    const depthSpeed = 2.2;

    // 1. Cosmic Super Trigger (Space)
    if (input.isJustPressed('Space') && this.rageMeter >= 100) {
      this.executeCosmicSuper();
      return;
    }

    // 2. Taunt / Alien Wiggle (T)
    if (input.isJustPressed('KeyT') && this.state !== 'taunt' && this.z === 0) {
      this.setState('taunt', 35);
      if (window.sfx) window.sfx.playAlienTaunt();
      if (window.alienVoice && Math.random() < 0.5) window.alienVoice.speakBopEm();
      this.rageMeter = Math.min(100, this.rageMeter + 15);
      return;
    }

    // 3. Aerial Moves & Mid-Air Steering (While in Air Z > 0)
    if (this.z > 0) {
      // Allow steering mid-air
      if (input.axisX !== 0) {
        this.vx = input.axisX * (moveSpeed * 1.25);
        this.facing = input.axisX > 0 ? 1 : -1;
      }
      if (input.axisY !== 0) {
        this.vy = input.axisY * (depthSpeed * 0.85);
      }

      if (input.isJustPressed('KeyJ')) {
        if (input.isDown('ArrowDown') || input.isDown('KeyS')) {
          // Flying Belly Flop
          this.setState('belly_flop', 35);
          if (input.axisX !== 0) this.facing = input.axisX > 0 ? 1 : -1;
          this.vx = this.facing * 5.2;
          this.vz = -6.0;
          if (window.sfx) window.sfx.playBellyFlop();
          if (window.alienVoice && Math.random() < 0.4) window.alienVoice.speakEarthScum();
        } else {
          // Macho Elbow
          this.setState('macho_elbow', 25);
          if (input.axisX !== 0) this.facing = input.axisX > 0 ? 1 : -1;
          this.vx = this.facing * 5.0;
          if (window.sfx) window.sfx.playWhoosh();
        }
      } else if (input.isJustPressed('KeyK')) {
        // Roundhouse Dropkick
        this.setState('roundhouse', 28);
        if (input.axisX !== 0) this.facing = input.axisX > 0 ? 1 : -1;
        this.vx = this.facing * 6.8;
        if (window.sfx) window.sfx.playWhoosh();
      }
      return;
    }

    // If currently performing ground attack, let it finish unless state is over
    if (this.isAttacking || this.state === 'taunt') {
      return;
    }

    // 4. Ground Direct Attacks
    // Bull Ram / Bulldozer (Key U or Double Tap Forward)
    if (input.isJustPressed('KeyU') || input.isDoubleTapped('ArrowRight') || input.isDoubleTapped('ArrowLeft')) {
      this.facing = (input.isDoubleTapped('ArrowLeft') || input.isDown('ArrowLeft')) ? -1 : 1;
      this.setState('bulldozer', 32);
      this.vx = this.facing * 8.5;
      if (window.sfx) window.sfx.playBulldozer();
      if (window.alienVoice && Math.random() < 0.4) window.alienVoice.speakKlaatuBaradaBop();
      if (window.particles) window.particles.spawnDust(this.x, this.y, 8);
      return;
    }

    // Ear Twist (Key I)
    if (input.isJustPressed('KeyI')) {
      this.setState('ear_twist', 28);
      if (window.sfx) window.sfx.playEarTwist();
      return;
    }

    // Donkey Back Kick (Key O)
    if (input.isJustPressed('KeyO')) {
      this.setState('donkey_kick', 24);
      if (window.sfx) window.sfx.playWhoosh();
      return;
    }

    // Low Trip / Shin Grab (Key L or Down + Attack)
    if (input.isJustPressed('KeyL') || (input.isJustPressed('KeyJ') && (input.isDown('ArrowDown') || input.isDown('KeyS')))) {
      this.setState('trip', 24);
      if (window.sfx) window.sfx.playTrip();
      return;
    }

    // Stretchy Headbutt / The Bop (Key K or Forward + Attack)
    if (input.isJustPressed('KeyK') || (input.isJustPressed('KeyJ') && (input.isDown('ArrowRight') || input.isDown('ArrowLeft')))) {
      this.setState('headbutt', 26);
      if (window.sfx) window.sfx.playHeadbutt();
      if (window.alienVoice && Math.random() < 0.4) window.alienVoice.speakBopEm();
      return;
    }

    // Standard Jab / Punch (Key J)
    if (input.isJustPressed('KeyJ')) {
      this.setState('jab', 18);
      if (window.sfx) window.sfx.playPunch();
      return;
    }

    // 5. Jump (Key W or Key Z) - Combines with direction for arc jumping over dogs/obstacles
    if (input.isJustPressed('KeyW') || input.isJustPressed('KeyZ')) {
      this.z = 1;
      this.vz = 8.8;
      if (input.axisX !== 0) {
        this.vx = input.axisX * (moveSpeed * 1.35);
        this.facing = input.axisX > 0 ? 1 : -1;
      }
      if (input.axisY !== 0) {
        this.vy = input.axisY * (depthSpeed * 0.9);
      }
      if (window.sfx) window.sfx.playWhoosh();
      if (window.particles) window.particles.spawnDust(this.x, this.y, 4);
      return;
    }

    // 6. Walking & Movement
    if (input.axisX !== 0 || input.axisY !== 0) {
      this.vx = input.axisX * moveSpeed;
      this.vy = input.axisY * depthSpeed;
      if (input.axisX !== 0) {
        this.facing = input.axisX > 0 ? 1 : -1;
      }
      this.state = 'walk';
    } else {
      this.state = 'idle';
    }
  }

  executeCosmicSuper() {
    this.rageMeter = 0;
    this.setState('super', 90);
    this.vx = 0;
    this.vy = 0;
    if (window.sfx) window.sfx.playTractorBeam();
    if (window.alienVoice) window.alienVoice.speakMyProbeIsReady();
    if (window.camera) window.camera.shake(16);

    // Call game engine to zap / abduct all enemies
    if (window.game && window.game.triggerSuperAttack) {
      window.game.triggerSuperAttack(this);
    }
  }

  takeDamage(amount, knockback = 4, knockAir = false) {
    if (!this.isAlive || this.isInvulnerable) return;

    this.hp -= amount;
    this.comboCount = 0; // Break player combo
    this.invulnTimer = 45;
    this.isInvulnerable = true;

    if (window.alienVoice && Math.random() < 0.5) window.alienVoice.speakOuchie();
    if (window.camera) window.camera.shake(5);

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    } else {
      if (knockAir || amount >= 20) {
        this.setState('knockdown', 55);
        this.vz = 5;
        this.vx = -this.facing * knockback;
      } else {
        this.setState('hurt', 20);
        this.vx = -this.facing * knockback;
      }
    }
  }

  die() {
    this.isAlive = false;
    this.lives--;
    this.setState('knockdown', 120);
    this.vz = 6;
    this.vx = -this.facing * 5;

    if (window.alienVoice) window.alienVoice.speakOuchie();
    if (window.game && window.game.onPlayerDeath) {
      window.game.onPlayerDeath();
    }
  }

  onLand() {
    if (this.state === 'belly_flop') {
      if (window.sfx) window.sfx.playBellyFlop();
      if (window.camera) window.camera.shake(12);
      if (window.particles) {
        window.particles.spawnDust(this.x, this.y, 14);
        window.particles.spawnComicText(this.x, this.y, 10, "KER-SPLAT!", "#eeee77");
      }
    } else if (this.state === 'knockdown') {
      if (window.particles) window.particles.spawnDust(this.x, this.y, 8);
    }
  }

  update(dt = 1) {
    this.animTimer += 0.05 * dt;

    // Invulnerability flashing
    if (this.isInvulnerable) {
      this.invulnTimer -= dt;
      if (this.invulnTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    // Combo timer
    if (this.comboCount > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // State Timer
    if (this.stateDuration > 0) {
      this.stateTimer += dt;
      if (this.stateTimer >= this.stateDuration) {
        if (this.state === 'knockdown') {
          if (this.isAlive) {
            this.setState('idle', 0);
            this.invulnTimer = 40;
            this.isInvulnerable = true;
          }
        } else {
          this.setState('idle', 0);
        }
      }
    }

    // Apply 2.5D physics & gravity
    window.physics.updateEntity(this, dt);
  }

  onHitEnemy(enemy, hitbox) {
    this.hasHitThisAttack = true;
    this.comboCount++;
    this.comboTimer = 70;

    // Gain Cosmic Rage meter on hits
    this.rageMeter = Math.min(100, this.rageMeter + (hitbox.damage * 0.7));

    // Particles & SFX
    if (window.particles) {
      window.particles.spawnHitSparks(enemy.x, enemy.y, enemy.z + 20, 10, '#aaffee');
      window.particles.spawnComicText(enemy.x, enemy.y, enemy.z + 30, hitbox.comic || "BOP!", "#eeee77");
    }

    if (window.game) {
      window.game.addScore(hitbox.damage * 10 * this.comboCount);
    }
  }

  render(ctx, camera) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);

    // Ground Shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, this.width);

    // Render Gleep-Glorp Vector Sprite
    ctx.save();
    ctx.translate(screenX, screenY);
    if (s > 1.0) {
      ctx.scale(s, s);
    }

    const progress = this.stateDuration > 0 ? (this.stateTimer / this.stateDuration) : 0;
    window.spriteRenderer.drawAlien(ctx, this.state, this.facing, this.animTimer, {
      isInvulnerable: this.isInvulnerable,
      progress: progress
    });

    ctx.restore();
  }
}
