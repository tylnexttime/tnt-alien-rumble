/**
 * TNT ALIEN RUMBLE - FINAL BOSS ENTITY: DUKE DAVIS
 * The 1987 Melbourne House Brawler in yellow muscle shirt, mullet, headband and shades.
 * Multi-phase boss AI with heavyweight haymakers, bulldozer rams, and comic dialogue bubbles.
 */

class DukeBoss {
  constructor(x = 800, y = 420) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.friction = 0.82;
    this.facing = -1;

    this.width = 42;
    this.height = 68;
    this.isAlive = true;
    this.isBoss = true;
    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.stunTimer = 0;

    // Boss Stats
    this.name = "DUKE DAVIS";
    this.maxHp = 300;
    this.hp = 300;
    this.phase = 1; // 1, 2, 3

    // State Machine
    this.state = 'idle'; // 'idle', 'walk', 'punch', 'ram', 'hurt', 'knockdown'
    this.stateTimer = 0;
    this.animTimer = 0;
    this.attackCooldown = 30;

    // Dialogue State
    this.dialogue = "";
    this.dialogueTimer = 0;

    this.say("HEY OLD DUDE, READY FOR ANOTHER BEATING?!");
  }

  say(text, duration = 120) {
    this.dialogue = text;
    this.dialogueTimer = duration;
  }

  takeDamage(amount, knockback = 3, knockAir = false) {
    if (!this.isAlive) return;

    this.hp -= amount;
    this.invulnTimer = 18;

    // Phase checks
    if (this.hp <= 200 && this.phase === 1) {
      this.phase = 2;
      this.say("WAIT! YOU'RE NOT AN OLD MAN... YOU'RE AN ALIEN?!");
      if (window.camera) window.camera.shake(8);
    } else if (this.hp <= 90 && this.phase === 2) {
      this.phase = 3;
      this.say("MY 1987 MULLET IS INVINCIBLE! EAT THIS!");
      if (window.camera) window.camera.shake(12);
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    } else {
      if (knockAir || amount >= 35) {
        this.state = 'knockdown';
        this.stateTimer = 0;
        this.vz = 5;
        this.vx = -this.facing * 5;
      } else {
        this.state = 'hurt';
        this.stateTimer = 0;
        this.vx = -this.facing * knockback;
      }
    }
  }

  die() {
    this.isAlive = false;
    this.state = 'knockdown';
    this.vz = 7;
    this.vx = -this.facing * 6;
    this.despawnTimer = 300; // 5.0 seconds

    this.say("UUGHH... MY PROPORTIONS... MELBOURNE HOUSE...!");

    if (window.camera) window.camera.shake(20);
    if (window.game) {
      window.game.addScore(10000);
      // ONLY trigger victory ending if in real game mode (NOT in Dojo / training dummy mode)
      if (!this.isTrainingDummy && (!window.cutscenes || !window.cutscenes.inPracticeMode)) {
        window.game.onBossDefeated(this);
      }
    }
  }

  updateAI(player, dt = 1) {
    if (!this.isAlive) return;

    // Dialogue bubble timer
    if (this.dialogueTimer > 0) {
      this.dialogueTimer -= dt;
      if (this.dialogueTimer <= 0) this.dialogue = "";
    }

    if (this.state === 'hurt') {
      this.stateTimer += dt;
      if (this.stateTimer > 20) this.state = 'idle';
      return;
    }

    if (this.state === 'knockdown') {
      this.stateTimer += dt;
      if (this.z === 0 && this.stateTimer > 55) {
        this.state = 'idle';
      }
      return;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    // Active Attack execution
    if (this.state === 'punch') {
      this.stateTimer += dt;
      if (this.stateTimer === 12 && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 52 && depthDist <= 22 && player.z <= 30) {
          if (!this.isTrainingDummy) {
            player.takeDamage(24, 7, true);
          } else {
            if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 30, "PRACTICE!", "#ffd700");
          }
          if (window.sfx) window.sfx.playPunch();
          if (window.camera) window.camera.shake(8);
          if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 30, "POW!", "#ff0055");
        }
      }
      if (this.stateTimer > 28) {
        this.state = 'idle';
        this.attackCooldown = 35;
      }
      return;
    }

    if (this.state === 'ram') {
      this.stateTimer += dt;
      this.vx = this.facing * 7;
      if (player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 40 && depthDist <= 24 && player.z <= 25) {
          if (!this.isTrainingDummy) {
            player.takeDamage(30, 9, true);
          } else {
            if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 30, "PRACTICE!", "#ffd700");
          }
          if (window.sfx) window.sfx.playBulldozer();
          if (window.camera) window.camera.shake(12);
        }
      }
      if (this.stateTimer > 40) {
        this.state = 'idle';
        this.attackCooldown = 50;
      }
      return;
    }

    // Decision Making
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.abs(dx);
    const depthDist = Math.abs(dy);

    this.facing = dx > 0 ? 1 : -1;

    // Special Ram Attack (Phase 2 & 3)
    if (this.phase >= 2 && dist > 140 && depthDist <= 18 && this.attackCooldown <= 0) {
      this.state = 'ram';
      this.stateTimer = 0;
      if (window.sfx) window.sfx.playBulldozer();
      if (window.particles) window.particles.spawnDust(this.x, this.y, 8);
      return;
    }

    // Close-range Haymaker
    if (dist <= 46 && depthDist <= 16 && this.attackCooldown <= 0 && player.isAlive) {
      this.state = 'punch';
      this.stateTimer = 0;
      this.vx = 0;
      this.vy = 0;
      if (window.sfx) window.sfx.playWhoosh();
      return;
    }

    // Approach player
    const speed = this.phase === 3 ? 2.6 : 1.9;
    const targetX = player.x - this.facing * 38;
    const targetY = player.y;

    const moveX = targetX - this.x;
    const moveY = targetY - this.y;

    if (Math.abs(moveX) > 8) this.vx = Math.sign(moveX) * speed;
    if (Math.abs(moveY) > 5) this.vy = Math.sign(moveY) * (speed * 0.7);

    this.state = 'walk';
  }

  update(player, dt = 1) {
    this.animTimer += 0.05 * dt;

    if (!this.isAlive) {
      this.state = 'knockdown';
      if (this.isTrainingDummy) {
        this.despawnTimer -= dt;
        if (this.despawnTimer <= 0) {
          this.isDespawned = true;
        }
      }
      window.physics.updateEntity(this, dt);
      return;
    }

    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
      this.isInvulnerable = this.invulnTimer > 0;
    }

    this.updateAI(player, dt);
    window.physics.updateEntity(this, dt);
  }

  render(ctx, camera) {
    if (this.isDespawned) return;

    if (this.isTrainingDummy && !this.isAlive && this.despawnTimer <= 60 && Math.floor(this.despawnTimer / 4) % 2 === 0) {
      return;
    }
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);

    // Shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, this.width);

    ctx.save();
    ctx.translate(screenX, screenY);
    if (s > 1.0) {
      ctx.scale(s, s);
    }

    window.spriteRenderer.drawDukeBoss(ctx, this.state, this.facing, this.animTimer, {
      phase: this.phase,
      isInvulnerable: this.isInvulnerable
    });

    // Boss Dialogue Speech Bubble above Duke
    if (this.dialogue) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      const textWidth = ctx.measureText(this.dialogue).width;
      const bubbleW = textWidth + 16;
      const bubbleH = 24;

      ctx.fillRect(-bubbleW / 2, -this.height - 35, bubbleW, bubbleH);
      ctx.strokeRect(-bubbleW / 2, -this.height - 35, bubbleW, bubbleH);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-4, -this.height - 11);
      ctx.lineTo(4, -this.height - 11);
      ctx.lineTo(0, -this.height - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#880000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.dialogue, 0, -this.height - 23);
      ctx.restore();
    }

    ctx.restore();
  }
}
