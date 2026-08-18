/**
 * TNT ALIEN RUMBLE - PROPS & PICKUPS SYSTEM
 * Breakable trash cans, spouting fire hydrants, food and energy crystal pickups.
 */

class StreetProp {
  constructor(x, y, type = 'trashcan') {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.type = type;
    this.isAlive = true;
    this.hp = type === 'trashcan' ? 2 : 3;
    this.width = 30;
    this.height = 36;
    this.isBroken = false;
    this.breakTimer = 0;
  }

  takeDamage(amount = 1) {
    if (this.isBroken) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.break();
    } else {
      if (window.sfx) window.sfx.playTrashSmash();
      if (window.particles) window.particles.spawnHitSparks(this.x, this.y, 15, 6, '#bbbbbb');
    }
  }

  break() {
    this.isBroken = true;
    if (window.sfx) window.sfx.playTrashSmash();
    if (window.camera) window.camera.shake(6);
    if (window.particles) {
      window.particles.spawnDebris(this.x, this.y, 10, 10);
      window.particles.spawnComicText(this.x, this.y, 20, "CRASH!", "#ff7777");
    }

    // Spawn item drop
    const dropType = Math.random() < 0.5 ? 'pizza' : (Math.random() < 0.5 ? 'crystal' : 'cassette');
    if (window.game && window.game.spawnPickup) {
      window.game.spawnPickup(this.x, this.y, dropType);
    }
  }

  render(ctx, camera) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);

    // Shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, 0, this.width);

    ctx.save();
    ctx.translate(screenX, screenY);
    if (s > 1.0) {
      ctx.scale(s, s);
    }

    if (this.type === 'trashcan') {
      if (!this.isBroken) {
        // Metallic C64 Trash Can
        ctx.fillStyle = '#777777';
        ctx.fillRect(-12, -32, 24, 32);

        // Can Ridges
        ctx.fillStyle = '#333333';
        ctx.fillRect(-10, -26, 20, 2);
        ctx.fillRect(-10, -18, 20, 2);
        ctx.fillRect(-10, -10, 20, 2);

        // Lid & Handle
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(-14, -36, 28, 4);
        ctx.fillRect(-4, -40, 8, 4);
      } else {
        // Crushed Can
        ctx.fillStyle = '#555555';
        ctx.fillRect(-14, -12, 28, 12);
        ctx.fillStyle = '#bbbbbb';
        ctx.fillRect(-16, -15, 12, 3);
      }
    } else if (this.type === 'hydrant') {
      // Fire Hydrant
      ctx.fillStyle = '#880000';
      ctx.fillRect(-8, -26, 16, 26);
      ctx.fillStyle = '#ff7777';
      ctx.fillRect(-10, -28, 20, 4); // top cap
      ctx.fillRect(-11, -16, 6, 6); // side nozzle
      ctx.fillRect(5, -16, 6, 6);

      if (this.isBroken) {
        // Water Geyser
        const t = Date.now() * 0.01;
        ctx.fillStyle = 'rgba(170, 255, 238, 0.75)';
        ctx.beginPath();
        ctx.moveTo(-6, -28);
        ctx.lineTo(6, -28);
        ctx.lineTo(12 + Math.sin(t) * 4, -80);
        ctx.lineTo(-12 - Math.sin(t) * 4, -80);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

class PickupItem {
  constructor(x, y, type = 'pizza') {
    this.x = x;
    this.y = y;
    this.z = 15;
    this.vz = 3;
    this.type = type; // 'pizza', 'crystal', 'cassette', 'heart'
    this.isAlive = true;
    this.life = 450; // Despawn timer
    this.width = 20;
    this.height = 20;
    this.animTimer = 0;
  }

  update(dt = 1) {
    this.animTimer += 0.05 * dt;
    this.life -= dt;
    if (this.life <= 0) this.isAlive = false;

    // Bounce on ground
    this.z += this.vz * dt;
    this.vz -= 0.3 * dt;
    if (this.z <= 0) {
      this.z = 0;
      this.vz = -this.vz * 0.4;
    }
  }

  collect(player) {
    this.isAlive = false;
    if (window.sfx) window.sfx.playPickup();

    if (this.type === 'pizza') {
      player.hp = Math.min(player.maxHp, player.hp + 35);
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 25, "+35 HP", "#00ff66");
    } else if (this.type === 'crystal') {
      player.rageMeter = Math.min(100, player.rageMeter + 50);
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 25, "+50 UFO", "#39ff14");
    } else if (this.type === 'cassette') {
      if (window.game) window.game.addScore(1500);
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 25, "+1500 PTS", "#eeee77");
    } else if (this.type === 'heart') {
      // The dwarf's gift, straight out of the 1987 original.
      player.hp = Math.min(player.maxHp, player.hp + 25);
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 25, "+25 HP", "#ff007f");
    }
  }

  render(ctx, camera) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);
    const bob = Math.sin(this.animTimer * 4) * 3 * s;

    // Shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, 20);

    ctx.save();
    ctx.translate(screenX, screenY + bob);
    if (s > 1.0) {
      ctx.scale(s, s);
    }

    if (this.type === 'pizza') {
      // Hot Pizza Slice
      ctx.fillStyle = '#dd8855';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(-9, -8);
      ctx.lineTo(9, -8);
      ctx.closePath();
      ctx.fill();

      // Cheese & Pepperoni
      ctx.fillStyle = '#eeee77';
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(-7, -6);
      ctx.lineTo(7, -6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#880000';
      ctx.beginPath();
      ctx.arc(-2, -2, 2, 0, Math.PI * 2);
      ctx.arc(2, 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'crystal') {
      // Glowing Green Alien UFO Energy Crystal
      ctx.fillStyle = '#39ff14';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(3, 0);
      ctx.lineTo(0, 6);
      ctx.lineTo(-3, 0);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'cassette') {
      // 1987 Commodore Cassette Tape
      ctx.fillStyle = '#333333';
      ctx.fillRect(-10, -7, 20, 14);
      ctx.fillStyle = '#eeee77';
      ctx.fillRect(-7, -4, 14, 8);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-3, 0, 2, 0, Math.PI * 2);
      ctx.arc(3, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'heart') {
      // The dwarf's energy heart (1987 original)
      const pulse = 1 + Math.sin(this.animTimer * 6) * 0.08;
      ctx.scale(pulse, pulse);
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(-4, -3, 4.5, 0, Math.PI * 2);
      ctx.arc(4, -3, 4.5, 0, Math.PI * 2);
      ctx.moveTo(-8.4, -1.5);
      ctx.lineTo(0, 9);
      ctx.lineTo(8.4, -1.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff99dd';
      ctx.beginPath();
      ctx.arc(-4, -4, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// =======================================================
// ENEMY PROJECTILES (Basketballs, Flying Handbags)
// =======================================================

class BasketballProjectile {
  constructor(x, y, z, facing, isTrainingDummy = false) {
    this.x = x;
    this.y = y;
    this.z = z || 26;
    this.vx = facing * 4.6;
    this.vy = (Math.random() * 0.4 - 0.2);
    this.vz = 2.4;
    this.gravity = 0.42;
    this.bounces = 0;
    this.maxBounces = 6;
    this.isAlive = true;
    this.facing = facing;
    this.rotation = 0;
    this.radius = 9;
    this.width = 18;
    this.height = 18;
    this.damage = 14;
    this.isTrainingDummy = isTrainingDummy;
    this.type = 'basketball';
  }

  update(dt = 1) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;
    this.vz -= this.gravity * dt;
    this.rotation += this.facing * 0.2 * dt;

    // Ground bounce with realistic elastic impulse
    if (this.z <= 0) {
      this.z = 0;
      this.bounces++;
      this.vz = Math.abs(this.vz) * 0.82;
      this.vx *= 0.94;
      if (window.sfx) window.sfx.playBasketballBounce();
      if (window.particles) window.particles.spawnDust(this.x, this.y, 6);

      if (this.bounces >= this.maxBounces || Math.abs(this.vz) < 0.9) {
        this.isAlive = false;
      }
    }

    if (this.x < -100 || this.x > 50000) this.isAlive = false;
  }

  render(ctx, camera) {
    if (!this.isAlive) return;
    const s = camera.scale || 1.0;
    const sx = Math.round((this.x - camera.x) * s);
    const sy = Math.round((this.y - camera.y - this.z) * s);

    // Ground shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, 18);

    ctx.save();
    ctx.translate(sx, sy);
    if (s > 1.0) ctx.scale(s, s);
    ctx.rotate(this.rotation);

    // Orange Rubber Basketball with black seams
    ctx.fillStyle = '#ee7722';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-this.radius, 0);
    ctx.lineTo(this.radius, 0);
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(0, this.radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-this.radius * 0.35, 0, this.radius * 0.75, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.restore();
  }
}

class HandbagProjectile {
  constructor(x, y, z, facing, isTrainingDummy = false) {
    this.x = x;
    this.y = y;
    this.z = z || 26; // Head / Chest height
    this.vx = facing * 5.0;
    this.vy = 0;
    this.vz = 0.2;
    this.gravity = 0.06;
    this.isAlive = true;
    this.facing = facing;
    this.rotation = 0;
    this.width = 22;
    this.height = 18;
    this.damage = 18;
    this.life = 140;
    this.isTrainingDummy = isTrainingDummy;
    this.type = 'handbag';
  }

  update(dt = 1) {
    this.x += this.vx * dt;
    this.z += this.vz * dt;
    this.vz -= this.gravity * dt;
    this.rotation += this.facing * 0.26 * dt;
    this.life -= dt;

    if (this.z <= 0) {
      this.z = 0;
      this.isAlive = false;
      if (window.particles) window.particles.spawnDust(this.x, this.y, 8);
    }

    if (this.life <= 0 || this.x < -100 || this.x > 50000) {
      this.isAlive = false;
    }
  }

  render(ctx, camera) {
    if (!this.isAlive) return;
    const s = camera.scale || 1.0;
    const sx = Math.round((this.x - camera.x) * s);
    const sy = Math.round((this.y - camera.y - this.z) * s);

    // Ground shadow
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, 20);

    ctx.save();
    ctx.translate(sx, sy);
    if (s > 1.0) ctx.scale(s, s);
    ctx.rotate(this.rotation);

    // Heavy Brown Handbag with Golden Brass Clasp
    ctx.fillStyle = '#8a4b2a';
    ctx.fillRect(-10, -8, 20, 16);
    ctx.fillStyle = '#ffd700'; // Gold buckle
    ctx.fillRect(-3, -10, 6, 4);
    // Leather handle loop
    ctx.strokeStyle = '#5c3a21';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -10, 6, Math.PI, 0);
    ctx.stroke();

    ctx.restore();
  }
}

// =======================================================
// THE TRENCH-COAT DWARF & HIS BOMB
// Restored from the 1987 C64 original. There, a dwarf in a trench coat lobbed
// you a heart to top up your energy — and on the later levels he lobbed a bomb
// instead, which you could defuse by standing in front of it, pulling back on
// the joystick and hitting fire. Our defuse is the same gesture on this pad:
// stand over it and press the Low Shin Grab (L, or Down+J).
// =======================================================

class TrenchDwarf {
  constructor(x, y, fromLeft, givesBomb) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.facing = fromLeft ? 1 : -1;
    this.givesBomb = givesBomb;
    this.isAlive = true;
    this.state = 'walk';          // walk -> throw -> flee
    this.stateTimer = 0;
    this.animTimer = 0;
    this.speed = 1.5;
    this.hasThrown = false;
    this.height = 46;
    this.width = 20;
    // Walk in this far (in world px) before stopping to lob
    this.throwAtX = x + this.facing * (110 + Math.random() * 90);
  }

  update(dt = 1) {
    this.animTimer += 0.05 * dt;
    this.stateTimer += dt;

    if (this.state === 'walk') {
      this.x += this.speed * this.facing * dt;
      const arrived = this.facing > 0 ? this.x >= this.throwAtX : this.x <= this.throwAtX;
      if (arrived) { this.state = 'throw'; this.stateTimer = 0; }
    } else if (this.state === 'throw') {
      if (!this.hasThrown && this.stateTimer >= 14) {
        this.hasThrown = true;
        this.lob();
      }
      if (this.stateTimer > 34) { this.state = 'flee'; this.stateTimer = 0; this.facing *= -1; }
    } else if (this.state === 'flee') {
      this.x += this.speed * 1.5 * this.facing * dt;
      if (this.stateTimer > 220) this.isAlive = false;
    }
  }

  lob() {
    if (!window.game) return;
    const dropX = this.x + this.facing * 46;
    if (this.givesBomb) {
      window.game.hazards.push(new BombHazard(dropX, this.y));
      if (window.sfx && window.sfx.playHandbag) window.sfx.playHandbag();
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 56, "CATCH!", "#ff6600");
    } else {
      window.game.spawnPickup(dropX, this.y, 'heart');
      if (window.sfx && window.sfx.playPickup) window.sfx.playPickup();
      if (window.particles) window.particles.spawnComicText(this.x, this.y, 56, "FOR YOU!", "#ff007f");
    }
  }

  render(ctx, camera) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, 18);
    ctx.save();
    ctx.translate(screenX, screenY);
    if (s > 1.0) ctx.scale(s, s);
    window.spriteRenderer.drawDwarf(ctx, this.state, this.facing, this.animTimer);
    ctx.restore();
  }
}

class BombHazard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = 40;
    this.vz = 2.2;
    this.isAlive = true;
    this.animTimer = 0;
    this.fuse = 190;              // ~3s at 60fps
    this.maxFuse = 190;
    this.exploded = false;
    this.defused = false;
    this.blastRadius = 62;
    this.damage = 18;
    this.width = 16;
    this.height = 16;
  }

  get urgency() { return 1 - Math.max(0, this.fuse) / this.maxFuse; }

  update(dt = 1) {
    this.animTimer += 0.05 * dt;

    // Settle onto the pavement
    if (this.z > 0) {
      this.z += this.vz * dt;
      this.vz -= 0.35 * dt;
      if (this.z <= 0) { this.z = 0; this.vz = -this.vz * 0.3; if (Math.abs(this.vz) < 0.6) this.vz = 0; }
    }

    this.fuse -= dt;
    if (this.fuse <= 0 && !this.exploded) this.explode();
  }

  // Standing over it and ducking = the original's pull-back-and-fire defuse.
  tryDefuse(player) {
    if (this.exploded || this.defused) return false;
    if (player.state !== 'low_trip') return false;
    if (Math.abs(player.x - this.x) > 34) return false;
    if (Math.abs(player.y - this.y) > 24) return false;

    this.defused = true;
    this.isAlive = false;
    if (window.sfx && window.sfx.playPickup) window.sfx.playPickup();
    if (window.particles) {
      window.particles.spawnComicText(this.x, this.y, 40, "DEFUSED!", "#39ff14");
      window.particles.spawnHitSparks(this.x, this.y, 14, 8, '#39ff14');
    }
    if (window.game) {
      window.game.addScore(750);
      window.game.spawnPickup(this.x, this.y, 'heart');   // nerves of steel, rewarded
    }
    return true;
  }

  explode() {
    this.exploded = true;
    this.isAlive = false;

    if (window.particles) {
      window.particles.spawnShockwave(this.x, this.y, this.blastRadius, '#ff6600');
      window.particles.spawnHitSparks(this.x, this.y, 34, 16, '#ff6600');
      window.particles.spawnComicText(this.x, this.y, 46, "KA-BOOM!", "#ff6600");
    }
    if (window.sfx && window.sfx.playNoiseBurst) window.sfx.playNoiseBurst(0.35, 220, 0.55); // long, low, loud = a blast
    if (window.camera && window.camera.shake) window.camera.shake(9);

    const g = window.game;
    if (!g) return;

    const caught = (e) => Math.abs(e.x - this.x) < this.blastRadius && Math.abs(e.y - this.y) < 40;

    if (g.player && g.player.isAlive && caught(g.player)) {
      g.player.takeDamage(this.damage, 6);
    }
    // It is a street bomb — it does not check ID.
    for (const e of g.enemies) if (e.isAlive && caught(e)) e.takeDamage(this.damage, 6, true);
    if (g.boss && g.boss.isAlive && caught(g.boss)) g.boss.takeDamage(this.damage, 4);
  }

  render(ctx, camera) {
    const s = camera.scale || 1.0;
    const screenX = Math.round((this.x - camera.x) * s);
    const screenY = Math.round((this.y - camera.y - this.z) * s);
    window.physics.renderShadow(ctx, camera, this.x, this.y, this.z, 16);

    const p = window.game && window.game.player;
    const defusable = !!(p && p.isAlive && Math.abs(p.x - this.x) < 34 && Math.abs(p.y - this.y) < 24 && this.z <= 2);

    ctx.save();
    ctx.translate(screenX, screenY);
    if (s > 1.0) ctx.scale(s, s);
    window.spriteRenderer.drawBomb(ctx, this.animTimer, this.urgency, defusable);
    ctx.restore();
  }
}
