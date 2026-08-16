/**
 * TNT ALIEN RUMBLE - ENEMY AI SYSTEM
 * Distinct enemy behaviors from Bop'n Rumble:
 * - Mohawk Punks (Switchblade & Dropkicks)
 * - Handbag Grannies (Heavy Purse Smash & Throw)
 * - Attack Poodles (Fast Ankle Biters)
 * - Basketballers (Bouncing Ball Projectiles)
 * - Bouncers (Heavy Grapplers)
 */

class Enemy {
  constructor(x, y, type = 'punk') {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.friction = 0.8;
    this.facing = -1; // Usually face player left

    this.type = type;
    this.isAlive = true;
    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.stunTimer = 0;

    this.state = 'walk'; // 'idle', 'walk', 'attack', 'throw_purse', 'helicopter', 'throw_ball', 'dropkick', 'charge_tackle', 'hurt', 'knockdown'
    this.stateTimer = 0;
    this.animTimer = Math.random() * 10;
    this.attackCooldown = 15 + Math.random() * 20;
    this.avoidedCount = 0;
    this.isFlying = false;
    this.hasFiredAttack = false;
    this.attackMode = 'ranged'; // 'ranged' vs 'melee' for hybrid enemies

    this.initStats(type);
  }

  initStats(type) {
    switch (type) {
      case 'punk':
        this.maxHp = 35;
        this.hp = 35;
        this.width = 30;
        this.height = 54;
        this.speed = 2.2;
        this.scoreValue = 300;
        this.attackRangeX = 42;
        this.attackDamage = 10;
        break;

      case 'granny':
        this.maxHp = 45;
        this.hp = 45;
        this.width = 32;
        this.height = 50;
        this.speed = 1.4;
        this.scoreValue = 400;
        this.attackRangeX = 46;
        this.attackDamage = 16;
        break;

      case 'dog':
        this.maxHp = 22;
        this.hp = 22;
        this.width = 28;
        this.height = 24;
        this.speed = 3.6; // Very fast
        this.scoreValue = 250;
        this.attackRangeX = 38;
        this.attackDamage = 8;
        break;

      case 'basketballer':
        this.maxHp = 50;
        this.hp = 50;
        this.width = 30;
        this.height = 84; // Towering C64 proportion!
        this.speed = 2.2;
        this.scoreValue = 500;
        this.attackRangeX = 140; // Can throw ball
        this.attackDamage = 12;
        break;

      case 'bouncer':
        this.maxHp = 90;
        this.hp = 90;
        this.width = 44;
        this.height = 64;
        this.speed = 1.3;
        this.scoreValue = 800;
        this.attackRangeX = 44;
        this.attackDamage = 22;
        break;
    }
  }

  takeDamage(amount, knockback = 4, knockAir = false, isTrip = false) {
    if (!this.isAlive) return;

    this.hp -= amount;
    this.invulnTimer = 20;

    if (this.hp <= 0) {
      this.hp = 0;
      this.die(knockback);
    } else {
      if (isTrip || knockAir || amount >= 25) {
        this.state = 'knockdown';
        this.stateTimer = 0;
        this.hasFiredAttack = false;
        this.vz = 5.5;
        this.vx = -this.facing * (knockback + 3);
      } else {
        this.state = 'hurt';
        this.stateTimer = 0;
        this.hasFiredAttack = false;
        this.vx = -this.facing * knockback;
      }
    }
  }

  die(knockback = 5) {
    this.isAlive = false;
    this.state = 'knockdown';
    this.hasFiredAttack = false;
    this.vz = 6.5;
    this.vx = -this.facing * knockback;
    this.despawnTimer = 300; // 5.0 seconds at 60fps
    this.despawnTriggered = false;

    if (window.game) {
      window.game.addScore(this.scoreValue);
      window.game.onEnemyDefeated(this);
    }

    // Chance to drop pizza or crystal
    if (Math.random() < 0.35 && window.game && window.game.spawnPickup) {
      const drop = Math.random() < 0.5 ? 'pizza' : 'crystal';
      window.game.spawnPickup(this.x, this.y, drop);
    }
  }

  triggerUniqueDespawnEffect() {
    if (!window.particles) return;

    switch (this.type) {
      case 'punk':
        window.particles.spawnHitSparks(this.x, this.y, 15, 12, '#ff0055');
        window.particles.spawnComicText(this.x, this.y, 24, "POOF!", "#ff0055");
        if (window.sfx) window.sfx.playWhoosh();
        break;

      case 'granny':
        window.particles.spawnHitSparks(this.x, this.y, 15, 10, '#cc44cc');
        window.particles.spawnComicText(this.x, this.y, 24, "NAP TIME!", "#eeee77");
        if (window.sfx) window.sfx.playWhoosh();
        break;

      case 'dog':
        window.particles.spawnDust(this.x, this.y, 14);
        window.particles.spawnComicText(this.x, this.y, 20, "YIP!", "#ffffff");
        if (window.sfx) window.sfx.playDogBark();
        break;

      case 'basketballer':
        window.particles.spawnHitSparks(this.x, this.y, 25, 14, '#dd8855');
        window.particles.spawnComicText(this.x, this.y, 35, "AIRBALL!", "#dd8855");
        if (window.sfx) window.sfx.playWhoosh();
        break;

      case 'bouncer':
        window.particles.spawnDust(this.x, this.y, 24);
        window.particles.spawnComicText(this.x, this.y, 25, "K.O.!", "#ffff55");
        if (window.sfx) window.sfx.playPunch();
        break;
    }
  }

  updateAI(player, dt = 1) {
    if (!this.isAlive) return;

    // 1. Granny Agnes Helicopter Flight Escape
    if (this.state === 'helicopter') {
      this.isFlying = true;
      this.clampY = false;
      this.stateTimer += dt;
      this.vz = 0;
      this.z += 4.6 * dt;
      this.y -= 0.6 * dt;
      this.vx = this.facing * 0.4;

      if (Math.floor(this.stateTimer) % 8 === 0 && window.sfx) {
        window.sfx.playHelicopterRotor();
      }

      // Fly off the top of screen into the clouds
      if (this.z > 350) {
        this.isDespawned = true;
        this.isAlive = false;
        if (window.game) window.game.onEnemyDefeated(this);
      }
      return;
    }

    // Stun / Dazed
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      this.state = 'hurt';
      return;
    }

    // Recovering from hurt or knockdown
    if (this.state === 'hurt') {
      this.stateTimer += dt;
      if (this.stateTimer > 24) {
        this.state = 'walk';
        this.hasFiredAttack = false;
      }
      return;
    }

    if (this.state === 'knockdown') {
      this.stateTimer += dt;
      if (this.z === 0 && this.stateTimer > 50) {
        this.state = 'walk';
        this.hasFiredAttack = false;
      }
      return;
    }

    // Attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    // 2. Granny Handbag Throw
    if (this.state === 'throw_purse') {
      this.stateTimer += dt;
      this.vx = 0;
      this.vy = 0;

      if (!this.hasFiredAttack && this.stateTimer >= 8) {
        this.hasFiredAttack = true;
        if (window.game && window.game.projectiles) {
          const spawnX = this.x + this.facing * 20;
          const spawnY = this.y;
          const spawnZ = 24; // Chest height
          window.game.projectiles.push(new HandbagProjectile(spawnX, spawnY, spawnZ, this.facing, this.isTrainingDummy));
          if (window.sfx) window.sfx.playWhoosh();
          if (window.particles) window.particles.spawnComicText(this.x, this.y, 48, "CATCH!", "#cc44cc");
        }
      }

      if (this.stateTimer > 30) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 40 + Math.random() * 30;
        this.attackMode = Math.random() < 0.5 ? 'melee' : 'ranged';

        // Check if avoided multiple times or low HP -> Fly away on helicopter handbag!
        if (this.avoidedCount >= 2 || (this.hp < this.maxHp * 0.45 && Math.random() < 0.6)) {
          this.state = 'helicopter';
          this.stateTimer = 0;
          this.isFlying = true;
          if (window.particles) window.particles.spawnComicText(this.x, this.y, 40, "TALLY HO, DEARIE!", "#ffff55");
          if (window.sfx) window.sfx.playHelicopterRotor();
        }
      }
      return;
    }

    // 3. Basketballer Bouncing Ball Throw
    if (this.state === 'throw_ball') {
      this.stateTimer += dt;
      this.vx = 0;
      this.vy = 0;

      if (!this.hasFiredAttack && this.stateTimer >= 8) {
        this.hasFiredAttack = true;
        if (window.game && window.game.projectiles) {
          const spawnX = this.x + this.facing * 22;
          const spawnY = this.y;
          const spawnZ = 35;
          window.game.projectiles.push(new BasketballProjectile(spawnX, spawnY, spawnZ, this.facing, this.isTrainingDummy));
          if (window.sfx) window.sfx.playBasketballBounce();
          if (window.particles) window.particles.spawnComicText(this.x, this.y, 65, "PASS!", "#dd8855");
        }
      }

      if (this.stateTimer > 28) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 45 + Math.random() * 30;
        this.attackMode = Math.random() < 0.5 ? 'melee' : 'ranged';
      }
      return;
    }

    // 4. Bouncer Bulldozer Charging Tackle
    if (this.state === 'charge_tackle') {
      this.stateTimer += dt;
      this.vx = this.facing * 4.6;
      if (Math.floor(this.stateTimer) % 6 === 0 && window.particles) {
        window.particles.spawnDust(this.x - this.facing * 12, this.y, 8);
      }

      if (!this.hasFiredAttack && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 36 && depthDist <= 22 && player.z <= 25) {
          this.hasFiredAttack = true;
          if (!this.isTrainingDummy) {
            player.takeDamage(this.attackDamage + 6, 8, true);
          } else {
            if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 35, "BULLDOZED!", "#ff0055");
          }
          if (window.sfx) window.sfx.playBulldozer();
          if (window.camera) window.camera.shake(8);
        }
      }

      if (this.stateTimer > 35) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 50 + Math.random() * 30;
      }
      return;
    }

    // 5. Mohawk Punk Flying Dropkick
    if (this.state === 'dropkick') {
      this.stateTimer += dt;
      // Hit check while airborne
      if (!this.hasFiredAttack && this.z > 5 && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 36 && depthDist <= 22 && player.z <= 35) {
          this.hasFiredAttack = true;
          if (!this.isTrainingDummy) {
            player.takeDamage(this.attackDamage + 4, 6, true);
          } else {
            if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 30, "DROPKICK!", "#ff0055");
          }
          if (window.sfx) window.sfx.playPunch();
        }
      }

      if (this.z === 0 && this.stateTimer > 20) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 45 + Math.random() * 35;
      }
      return;
    }

    // 6. Close-Range / Melee Attack (Knife stab, handbag smash, dog bite, dunk, bouncer hammer)
    if (this.state === 'attack') {
      this.stateTimer += dt;
      if (!this.hasFiredAttack && this.stateTimer >= 8 && player.isAlive) {
        this.hasFiredAttack = true;
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= this.attackRangeX + 20 && depthDist <= 26 && player.z <= 32) {
          if (!this.isTrainingDummy) {
            player.takeDamage(this.attackDamage, 4);
          } else {
            if (window.particles) window.particles.spawnComicText(player.x, player.y, player.z + 30, "PRACTICE!", "#aaffee");
          }

          if (this.type === 'granny' && window.sfx) window.sfx.playHandbag();
          else if (this.type === 'dog' && window.sfx) window.sfx.playDogBark();
          else if (this.type === 'bouncer') {
            if (window.sfx) window.sfx.playPunch();
            if (window.camera) window.camera.shake(6);
            if (window.particles) window.particles.spawnDust(this.x + this.facing * 20, this.y, 16);
          } else if (window.sfx) {
            window.sfx.playPunch();
          }
        }
      }

      if (this.stateTimer > 28) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 35 + Math.random() * 30;
      }
      return;
    }

    // Navigation & Flanking behavior
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.abs(dx);
    const depthDist = Math.abs(dy);

    this.facing = dx > 0 ? 1 : -1;

    // --- DECIDE ATTACK BASED ON ENEMY TYPE & DISTANCE ---
    if (this.attackCooldown <= 0 && player.isAlive) {
      if (this.type === 'granny') {
        // Granny: If in ranged mode or at distance, throw purse! If close, heavy smash!
        if (dist >= 60 && dist <= 240 && depthDist <= 30) {
          this.state = 'throw_purse';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist <= 48 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vx = 0;
          this.vy = 0;
          return;
        }
      } else if (this.type === 'basketballer') {
        // Basketballer: If at distance, throw bouncing ball! If close, dunk!
        if (dist >= 60 && dist <= 260 && depthDist <= 30) {
          this.state = 'throw_ball';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist <= 50 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vx = 0;
          this.vy = 0;
          return;
        }
      } else if (this.type === 'punk') {
        // Punk: If mid-range, launch Flying Dropkick! If close, knife stab!
        if (dist >= 55 && dist <= 140 && depthDist <= 22 && Math.random() < 0.65) {
          this.state = 'dropkick';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vz = 4.6;
          this.vx = this.facing * 4.2;
          if (window.sfx) window.sfx.playWhoosh();
          return;
        } else if (dist <= 46 && depthDist <= 22) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vx = 0;
          this.vy = 0;
          return;
        }
      } else if (this.type === 'dog') {
        // Dog: Fast leap bite
        if (dist <= 60 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vz = 3.6;
          this.vx = this.facing * 4.0;
          if (window.sfx) window.sfx.playDogBark();
          return;
        }
      } else if (this.type === 'bouncer') {
        // Bouncer: Mid-range bulldozer tackle, or close-range ground hammer!
        if (dist >= 60 && dist <= 160 && depthDist <= 24 && Math.random() < 0.6) {
          this.state = 'charge_tackle';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          if (window.sfx) window.sfx.playBulldozer();
          return;
        } else if (dist <= 48 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vx = 0;
          this.vy = 0;
          return;
        }
      }
    }

    // Move towards player lane and offset based on attack mode
    let targetOffsetX = 32;
    if (this.type === 'basketballer') {
      targetOffsetX = this.attackMode === 'ranged' ? 110 : 36;
    } else if (this.type === 'granny') {
      targetOffsetX = this.attackMode === 'ranged' ? 95 : 34;
    }

    const targetX = player.x + (-this.facing * targetOffsetX);
    const targetY = player.y;

    const moveX = targetX - this.x;
    const moveY = targetY - this.y;

    if (Math.abs(moveX) > 6) {
      this.vx = Math.sign(moveX) * this.speed;
    }
    if (Math.abs(moveY) > 4) {
      this.vy = Math.sign(moveY) * (this.speed * 0.75);
    }
    this.state = 'walk';
  }

  update(player, dt = 1) {
    this.animTimer += 0.05 * dt;

    if (!this.isAlive) {
      this.state = 'knockdown';
      this.despawnTimer -= dt;

      if (this.despawnTimer <= 20 && !this.despawnTriggered) {
        this.despawnTriggered = true;
        this.triggerUniqueDespawnEffect();
      }

      if (this.despawnTimer <= 0) {
        this.isDespawned = true;
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

    // Flash before disappearing
    if (!this.isAlive && this.despawnTimer <= 60 && Math.floor(this.despawnTimer / 4) % 2 === 0) {
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

    if (this.type === 'punk') {
      window.spriteRenderer.drawPunk(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'granny') {
      window.spriteRenderer.drawGranny(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'dog') {
      window.spriteRenderer.drawDog(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'basketballer') {
      window.spriteRenderer.drawBasketballer(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'bouncer') {
      window.spriteRenderer.drawBouncer(ctx, this.state, this.facing, this.animTimer);
    }

    // Render Stun Stars if dazed
    if (this.stunTimer > 0 && this.isAlive) {
      const t = Date.now() * 0.01;
      ctx.fillStyle = '#eeee77';
      for (let i = 0; i < 3; i++) {
        const angle = t + (i * Math.PI * 2 / 3);
        const starX = Math.cos(angle) * 16;
        const starY = -this.height - 8 + Math.sin(angle) * 4;
        ctx.fillRect(starX - 2, starY - 2, 4, 4);
      }
    }

    ctx.restore();
  }
}
