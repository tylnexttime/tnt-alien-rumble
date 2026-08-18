/**
 * TNT ALIEN RUMBLE - ENEMY AI SYSTEM
 * Distinct, highly detailed enemy behaviors from Bop'n Rumble:
 * - Mohawk Punks (Switchblade & Dropkicks)
 * - Handbag Grannies (Heavy Purse Smash, Boomerang Throw, Umbrella Shield Block & Helicopter Escape)
 * - Attack Poodles / Bulldogs (Sonic Bark Stun & Ankle Latch Bites)
 * - Basketballers (Active Dribbling, Bouncing Balls, Monster Dunk Shockwaves)
 * - Bouncers (Bulldozer Rush, Ground Pound, 360° Airplane Spin Throws)
 * - [NEW] Axel the Skater (High-speed Slalom, 360° Spin Kicks)
 * - [NEW] Bruno the Strongman (Whirling Barbell Whirlwind, Heavy Iron Clangs)
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
    this.facing = -1; // Face player left by default

    this.type = type;
    this.isAlive = true;
    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.stunTimer = 0;

    this.state = 'walk'; // 'idle', 'walk', 'attack', 'throw_purse', 'umbrella_block', 'helicopter', 'throw_ball', 'dunk_slam', 'dropkick', 'charge_tackle', 'airplane_spin', 'barbell_spin', 'hurt', 'knockdown'
    this.stateTimer = 0;
    this.animTimer = Math.random() * 10;
    this.attackCooldown = 15 + Math.random() * 20;
    this.avoidedCount = 0;
    this.isFlying = false;
    this.hasFiredAttack = false;
    this.attackMode = 'ranged'; // 'ranged' vs 'melee'

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
        this.attackRangeX = 44;
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
        this.speed = 3.6; // High speed
        this.scoreValue = 250;
        this.attackRangeX = 38;
        this.attackDamage = 8;
        break;

      case 'basketballer':
        this.maxHp = 50;
        this.hp = 50;
        this.width = 30;
        this.height = 84; // Towering proportion — the 4-metre basketballer from the 1987 original
        this.speed = 2.2;
        this.scoreValue = 500;
        this.attackRangeX = 140;
        this.attackDamage = 14;
        break;

      case 'bouncer':
        this.maxHp = 90;
        this.hp = 90;
        this.width = 44;
        this.height = 64;
        this.speed = 1.3;
        this.scoreValue = 800;
        this.attackRangeX = 46;
        this.attackDamage = 22;
        break;

      case 'skater':
        this.maxHp = 38;
        this.hp = 38;
        this.width = 32;
        this.height = 56;
        this.speed = 3.2; // Very agile
        this.scoreValue = 450;
        this.attackRangeX = 48;
        this.attackDamage = 12;
        break;

      case 'biker':
        // Fast, heavy, and he does NOT stop to brawl — he does passes.
        this.maxHp = 55;
        this.hp = 55;
        this.width = 46;
        this.height = 48;
        this.speed = 5.6;          // fastest thing in the game
        this.scoreValue = 700;
        this.attackRangeX = 60;
        this.attackDamage = 20;
        break;

      case 'strongman':
        this.maxHp = 75;
        this.hp = 75;
        this.width = 40;
        this.height = 62;
        this.speed = 1.5;
        this.scoreValue = 650;
        this.attackRangeX = 54;
        this.attackDamage = 20;
        break;
    }
  }

  takeDamage(amount, knockback = 4, knockAir = false, isTrip = false) {
    if (!this.isAlive) return;

    // 1. Granny Umbrella Shield Block Check (Deflects frontal jabs!)
    if (this.state === 'umbrella_block') {
      if (window.sfx) window.sfx.playUmbrellaBlock();
      if (window.particles) {
        window.particles.spawnHitSparks(this.x + this.facing * 16, this.y, 25, 8, '#00f0ff');
        window.particles.spawnComicText(this.x, this.y, 45, "BLOCKED!", "#00f0ff");
      }
      return; // 0 Damage taken!
    }

    // 2. Strongman Barbell Whirlwind Invulnerability
    // Charging on two wheels: light jabs glance off the bike. You need an
    // airborne or heavy move — the jump-kick the original taught you.
    if (this.state === 'charging' && !knockAir) {
      this.hp += 0;
      if (window.particles) {
        window.particles.spawnHitSparks(this.x, this.y, 28, 8, '#8cb2ff');
        window.particles.spawnComicText(this.x, this.y, 46, "CLANG!", "#8cb2ff");
      }
      if (window.sfx && window.sfx.playBarbellClang) window.sfx.playBarbellClang();
      return;
    }

    if (this.state === 'barbell_spin' && !isTrip) {
      if (window.sfx) window.sfx.playBarbellClang();
      if (window.particles) {
        window.particles.spawnHitSparks(this.x, this.y, 30, 10, '#ffd700');
        window.particles.spawnComicText(this.x, this.y, 50, "DEFLECT!", "#ffd700");
      }
      return;
    }

    this.hp -= amount;
    this.invulnTimer = 18;

    // Granny coin scatter on hit
    if (this.type === 'granny' && window.particles) {
      window.particles.spawnCoinScatter(this.x, this.y, 25, 4);
    }

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

    if (this.type === 'granny' && window.particles) {
      window.particles.spawnCoinScatter(this.x, this.y, 25, 8);
    }

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

      case 'skater':
        window.particles.spawnHitSparks(this.x, this.y, 20, 10, '#00f7ff');
        window.particles.spawnComicText(this.x, this.y, 28, "WIPEOUT!", "#00f7ff");
        if (window.sfx) window.sfx.playWhoosh();
        break;

      case 'biker':
        window.particles.spawnDust(this.x, this.y, 22);
        window.particles.spawnHitSparks(this.x, this.y, 22, 14, '#8cb2ff');
        window.particles.spawnComicText(this.x, this.y, 30, "STACKED IT!", "#8cb2ff");
        if (window.sfx) window.sfx.playBulldozer();
        break;

      case 'strongman':
        window.particles.spawnDust(this.x, this.y, 20);
        window.particles.spawnComicText(this.x, this.y, 30, "TIMBER!", "#ffd700");
        if (window.sfx) window.sfx.playBarbellClang();
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

    // Hurt / Knockdown recovery
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

    // 2. Granny Handbag Boomerang Throw
    if (this.state === 'throw_purse') {
      this.stateTimer += dt;
      this.vx = 0;
      this.vy = 0;

      if (!this.hasFiredAttack && this.stateTimer >= 8) {
        this.hasFiredAttack = true;
        if (window.game && window.game.projectiles) {
          const spawnX = this.x + this.facing * 20;
          const spawnY = this.y;
          const spawnZ = 24;
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

        // Check helicopter escape if low HP
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

    // 3. Granny Umbrella Shield Block Stance
    if (this.state === 'umbrella_block') {
      this.stateTimer += dt;
      this.vx = 0;
      this.vy = 0;
      if (this.stateTimer > 45) {
        this.state = 'walk';
        this.attackCooldown = 40 + Math.random() * 20;
      }
      return;
    }

    // 4. Basketballer Bouncing Ball Throw
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
      }
      return;
    }

    // 5. Basketballer Monster Dunk Slam
    if (this.state === 'dunk_slam') {
      this.stateTimer += dt;
      if (!this.hasFiredAttack && this.z <= 2 && this.stateTimer >= 15 && player.isAlive) {
        this.hasFiredAttack = true;
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 50 && depthDist <= 28) {
          if (!this.isTrainingDummy) player.takeDamage(this.attackDamage + 8, 8, true);
        }
        if (window.sfx) window.sfx.playBasketballBounce();
        if (window.camera) window.camera.shake(10);
        if (window.particles) {
          window.particles.spawnShockwave(this.x, this.y, 50, '#ff6600');
          window.particles.spawnComicText(this.x, this.y, 60, "SLAM DUNK!", "#ff6600");
        }
      }

      if (this.z === 0 && this.stateTimer > 25) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 50 + Math.random() * 30;
      }
      return;
    }

    // 6. Bouncer Bulldozer Charging Tackle
    if (this.state === 'charge_tackle') {
      this.stateTimer += dt;
      this.vx = this.facing * 4.8;
      if (Math.floor(this.stateTimer) % 6 === 0 && window.particles) {
        window.particles.spawnDust(this.x - this.facing * 12, this.y, 8);
      }

      if (!this.hasFiredAttack && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 38 && depthDist <= 24 && player.z <= 25) {
          this.hasFiredAttack = true;
          if (!this.isTrainingDummy) {
            player.takeDamage(this.attackDamage + 6, 8, true);
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

    // Motorcyclist — rev on the spot as a telegraph, then a flat-out pass.
    if (this.state === 'revving') {
      this.stateTimer += dt;
      this.vx = 0;
      if (Math.floor(this.stateTimer) % 6 === 0 && window.particles) {
        window.particles.spawnDust(this.x - this.facing * 22, this.y, 5);
      }
      if (this.stateTimer > 34) {
        this.state = 'charging';
        this.stateTimer = 0;
        this.hasFiredAttack = false;
        if (window.sfx) window.sfx.playBulldozer();
      }
      return;
    }

    if (this.state === 'charging') {
      this.stateTimer += dt;
      this.vx = this.facing * this.speed;
      if (Math.floor(this.stateTimer) % 4 === 0 && window.particles) {
        window.particles.spawnDust(this.x - this.facing * 26, this.y, 6);
      }

      if (!this.hasFiredAttack && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 34 && depthDist <= 26) {
          this.hasFiredAttack = true;
          if (player.z > 26) {
            // Jump and he goes underneath — the counter the original taught.
            if (window.particles) {
              window.particles.spawnComicText(player.x, player.y, player.z + 40, "CLEARED HIM!", "#39ff14");
            }
          } else {
            if (!this.isTrainingDummy) player.takeDamage(this.attackDamage, 10, true);
            if (window.sfx) window.sfx.playBulldozer();
            if (window.camera) window.camera.shake(10);
          }
        }
      }

      if (this.stateTimer > 95) {
        // End of the pass: wheel around and line up another one.
        this.state = 'walk';
        this.facing *= -1;
        this.hasFiredAttack = false;
        this.attackCooldown = 45 + Math.random() * 35;
      }
      return;
    }

    // 7. Bouncer 360° Airplane Spin Grapple / Throw
    if (this.state === 'airplane_spin') {
      this.stateTimer += dt;
      this.vx = 0;
      this.vy = 0;

      if (!this.hasFiredAttack && this.stateTimer >= 30 && player.isAlive) {
        this.hasFiredAttack = true;
        if (!this.isTrainingDummy) {
          player.takeDamage(this.attackDamage + 8, 12, true);
        }
        if (window.sfx) window.sfx.playSuplex();
        if (window.camera) window.camera.shake(12);
        if (window.particles) {
          window.particles.spawnComicText(this.x, this.y, 70, "SPUN OUT!", "#ffd700");
          window.particles.spawnDust(this.x, this.y, 16);
        }
      }

      if (this.stateTimer > 40) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 60 + Math.random() * 30;
      }
      return;
    }

    // 8. Bruno Strongman Barbell Whirlwind
    if (this.state === 'barbell_spin') {
      this.stateTimer += dt;
      this.vx = this.facing * 3.5;
      if (Math.floor(this.stateTimer) % 4 === 0 && window.sfx) {
        window.sfx.playBarbellSpin();
      }

      if (!this.hasFiredAttack && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 48 && depthDist <= 26 && player.z <= 30) {
          this.hasFiredAttack = true;
          if (!this.isTrainingDummy) player.takeDamage(this.attackDamage + 6, 8, true);
          if (window.sfx) window.sfx.playBarbellClang();
          if (window.camera) window.camera.shake(8);
        }
      }

      if (this.stateTimer > 45) {
        this.state = 'walk';
        this.hasFiredAttack = false;
        this.attackCooldown = 60 + Math.random() * 30;
      }
      return;
    }

    // 9. Mohawk Punk Flying Dropkick
    if (this.state === 'dropkick') {
      this.stateTimer += dt;
      if (!this.hasFiredAttack && this.z > 5 && player.isAlive) {
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= 38 && depthDist <= 24 && player.z <= 35) {
          this.hasFiredAttack = true;
          if (!this.isTrainingDummy) player.takeDamage(this.attackDamage + 4, 6, true);
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

    // 10. Close-Range / Melee Attack
    if (this.state === 'attack') {
      this.stateTimer += dt;
      if (!this.hasFiredAttack && this.stateTimer >= 8 && player.isAlive) {
        this.hasFiredAttack = true;
        const dist = Math.abs(this.x - player.x);
        const depthDist = Math.abs(this.y - player.y);
        if (dist <= this.attackRangeX + 20 && depthDist <= 26 && player.z <= 32) {
          if (!this.isTrainingDummy) {
            player.takeDamage(this.attackDamage, 4);
          }

          if (this.type === 'granny' && window.sfx) window.sfx.playHandbag();
          else if (this.type === 'dog' && window.sfx) {
            window.sfx.playDogLatch();
            if (window.particles) window.particles.spawnSonicRing(this.x, this.y, this.z, this.facing);
          }
          else if (this.type === 'skater' && window.sfx) window.sfx.playSkateWhir();
          else if (this.type === 'strongman' && window.sfx) window.sfx.playBarbellClang();
          else if (window.sfx) window.sfx.playPunch();
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

    // --- DECIDE SPECIAL ATTACKS ---
    if (this.attackCooldown <= 0 && player.isAlive) {
      if (this.type === 'granny') {
        if (dist >= 60 && dist <= 240 && depthDist <= 30) {
          this.state = 'throw_purse';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist <= 48 && depthDist <= 24) {
          if (Math.random() < 0.35) {
            this.state = 'umbrella_block';
            this.stateTimer = 0;
            if (window.sfx) window.sfx.playUmbrellaBlock();
            return;
          } else {
            this.state = 'attack';
            this.stateTimer = 0;
            this.hasFiredAttack = false;
            return;
          }
        }
      } else if (this.type === 'basketballer') {
        if (dist >= 70 && dist <= 260 && depthDist <= 30) {
          this.state = 'throw_ball';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist <= 50 && depthDist <= 24) {
          if (Math.random() < 0.5) {
            this.state = 'dunk_slam';
            this.stateTimer = 0;
            this.hasFiredAttack = false;
            this.vz = 6.2;
            this.vx = this.facing * 3.5;
            return;
          } else {
            this.state = 'attack';
            this.stateTimer = 0;
            this.hasFiredAttack = false;
            return;
          }
        }
      } else if (this.type === 'punk') {
        if (dist >= 55 && dist <= 150 && depthDist <= 24 && Math.random() < 0.65) {
          this.state = 'dropkick';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vz = 4.8;
          this.vx = this.facing * 4.5;
          if (window.sfx) window.sfx.playWhoosh();
          return;
        } else if (dist <= 46 && depthDist <= 22) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        }
      } else if (this.type === 'dog') {
        if (dist <= 70 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          this.vz = 3.8;
          this.vx = this.facing * 4.2;
          if (window.sfx) window.sfx.playDogBark();
          return;
        }
      } else if (this.type === 'bouncer') {
        if (dist <= 42 && depthDist <= 20 && Math.random() < 0.45) {
          this.state = 'airplane_spin';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist >= 60 && dist <= 170 && depthDist <= 24 && Math.random() < 0.6) {
          this.state = 'charge_tackle';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          if (window.sfx) window.sfx.playBulldozer();
          return;
        } else if (dist <= 48 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        }
      } else if (this.type === 'skater') {
        if (dist <= 50 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          if (window.sfx) window.sfx.playSkateWhir();
          return;
        }
      } else if (this.type === 'biker') {
        // He never brawls. Anywhere in range of a run-up, he lines one up.
        if (dist >= 40 && dist <= 320 && depthDist <= 30) {
          this.state = 'revving';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          if (window.sfx) window.sfx.playSkateWhir();
          return;
        }
      } else if (this.type === 'strongman') {
        if (dist >= 50 && dist <= 180 && depthDist <= 28 && Math.random() < 0.55) {
          this.state = 'barbell_spin';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        } else if (dist <= 52 && depthDist <= 24) {
          this.state = 'attack';
          this.stateTimer = 0;
          this.hasFiredAttack = false;
          return;
        }
      }
    }

    // Move towards player lane
    let targetOffsetX = 34;
    if (this.type === 'basketballer') targetOffsetX = this.attackMode === 'ranged' ? 110 : 36;
    else if (this.type === 'granny') targetOffsetX = this.attackMode === 'ranged' ? 95 : 34;

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
    } else if (this.type === 'skater') {
      window.spriteRenderer.drawSkater(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'strongman') {
      window.spriteRenderer.drawStrongman(ctx, this.state, this.facing, this.animTimer);
    } else if (this.type === 'biker') {
      window.spriteRenderer.drawBiker(ctx, this.state, this.facing, this.animTimer);
    }

    // Render Stun Stars if dazed
    if (this.stunTimer > 0 && this.isAlive) {
      const t = Date.now() * 0.01;
      ctx.fillStyle = '#ffd700';
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
