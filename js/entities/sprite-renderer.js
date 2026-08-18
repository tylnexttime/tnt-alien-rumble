/**
 * TNT ALIEN RUMBLE - C64 RETRO SPRITE RENDERER
 * Chunky 4-tone ramp character rendering in the spirit of the 1987 C64 original.
 * Features rich 4-tone shading ramps, micro-dithering, specular glints,
 * bioluminescent alien brain veins, and expressive multi-phase animation frames.
 */

class SpriteRenderer {
  constructor() {
    // Sprite palette — 9 material ramps x 4 tones (highlight/mid/shadow/deep).
    // Deliberately wider than the C64 VIC-II 16: an homage, not an emulation.
    this.pal = {
      // Alien Gray/Bio-plasma
      alienHighlight: '#e4edf2',
      alienMid: '#b2c2cc',
      alienShadow: '#7d919e',
      alienDeep: '#4c5d6a',
      alienVein: '#39ff14',
      alienGlow: '#00f0ff',
      alienEye: '#0a0d12',
      alienEyeGlint: '#ffffff',

      // Human Skin Ramps (Caucasian / Duke / Granny / Punk / Bouncer)
      skinHighlight: '#ffe2cf',
      skinMid: '#f2b58d',
      skinShadow: '#c47a4d',
      skinDeep: '#7a3e20',

      // Human Skin Ramps (Dark / Bronze / Hoops)
      bronzeHighlight: '#c68d63',
      bronzeMid: '#8e542e',
      bronzeShadow: '#5c3116',
      bronzeDeep: '#331607',

      // Denim Blue Ramps
      denimHighlight: '#8cb2ff',
      denimMid: '#4b75d6',
      denimShadow: '#264599',
      denimDeep: '#101e4a',

      // Leather Black & Steel Ramps
      leatherHighlight: '#686b7e',
      leatherMid: '#383b4b',
      leatherShadow: '#1e202d',
      leatherDeep: '#0c0d14',
      metalHighlight: '#ffffff',
      metalMid: '#a8b4c4',
      metalShadow: '#586475',

      // Punk Red / Mohawk
      redHighlight: '#ff7755',
      redMid: '#e62211',
      redShadow: '#990000',
      redDeep: '#4d0000',

      // Granny Floral & Cardigan (Magenta/Purple)
      purpleHighlight: '#ff99dd',
      purpleMid: '#c6429f',
      purpleShadow: '#7a195e',
      purpleDeep: '#3d082c',
      dressFloral: '#ffe6f2',

      // Poodle White/Silver Ramps
      furHighlight: '#ffffff',
      furMid: '#e2ebf5',
      furShadow: '#adc2d6',
      furDeep: '#6e859b',

      // Gold / Yellow (Duke Tank Top, Coins, Belts)
      goldHighlight: '#fff480',
      goldMid: '#f5c200',
      goldShadow: '#b38000',
      goldDeep: '#5c3d00',

      // Neon / 80s Accents
      neonGreen: '#39ff14',
      neonCyan: '#00f7ff',
      neonPink: '#ff007f',
      neonOrange: '#ff6600'
    };
  }

  // =========================================================================
  // 1. GLEEP-GLORP (ALIEN PROTAGONIST)
  // =========================================================================
  drawAlien(ctx, state, facing, animTimer, options = {}) {
    ctx.save();
    ctx.scale(facing, 1);

    const pal = this.pal;
    const t = animTimer || 0;

    // Flash white when invulnerable
    if (options.isInvulnerable && Math.floor(t * 12) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    switch (state) {
      case 'idle': {
        const breathe = Math.sin(t * 3.5);
        const bob = breathe * 2.5;

        // Dynamic Alien Ground Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spindly Alien Feet with 3 Toes
        this.drawAlienFoot(ctx, -8, -1, pal);
        this.drawAlienFoot(ctx, 4, -1, pal);

        // Articulated Skinny Legs
        this.drawAlienLeg(ctx, -6, -20, -7, -2, pal);
        this.drawAlienLeg(ctx, 5, -20, 5, -2, pal);

        // Slender Biomechanical Torso & Cybernetic Belt
        this.drawAlienTorso(ctx, 0, -36 + bob, pal, t);

        // Back Arm
        this.drawAlienArm(ctx, -10, -34 + bob, -14, -20 + bob, pal, false);
        // Front Arm with Glowing Wrist Gauntlet
        this.drawAlienArm(ctx, 8, -34 + bob, 12, -20 + bob, pal, true, t);

        // Translucent Cranium with Pulsing Cosmic Brain
        this.drawAlienHead(ctx, 0, -50 + bob, 0, false, t);
        break;
      }

      case 'walk': {
        const walk = Math.sin(t * 9);
        const leg1 = walk * 10;
        const leg2 = -walk * 10;
        const bob = Math.abs(Math.sin(t * 9)) * 3;

        // Feet & Legs
        this.drawAlienFoot(ctx, -7 + leg1, -1, pal);
        this.drawAlienFoot(ctx, 5 + leg2, -1, pal);
        this.drawAlienLeg(ctx, -5, -20, -7 + leg1, -2, pal);
        this.drawAlienLeg(ctx, 4, -20, 5 + leg2, -2, pal);

        // Torso
        this.drawAlienTorso(ctx, 0, -36 + bob, pal, t);

        // Swinging Arms
        this.drawAlienArm(ctx, -10, -34 + bob, -14 - leg1 * 0.8, -20 + bob, pal, false);
        this.drawAlienArm(ctx, 8, -34 + bob, 12 + leg1 * 0.8, -20 + bob, pal, true, t);

        // Head with slight swagger tilt
        this.drawAlienHead(ctx, 0, -50 + bob, walk * 0.06, false, t);
        break;
      }

      case 'jab': {
        // High-speed 1-2 skinny punch
        this.drawAlienFoot(ctx, -10, -1, pal);
        this.drawAlienFoot(ctx, 4, -1, pal);
        this.drawAlienLeg(ctx, -6, -20, -10, -2, pal);
        this.drawAlienLeg(ctx, 4, -20, 6, -2, pal);

        this.drawAlienTorso(ctx, 2, -36, pal, t);

        // Back Arm tucked to chest
        this.drawAlienArm(ctx, -10, -34, -8, -24, pal, false);

        // Punching Arm extended far with energy blast
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(6, -34, 28, 5);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(6, -35, 28, 2);
        // Fist
        ctx.fillStyle = pal.alienShadow;
        ctx.beginPath();
        ctx.arc(36, -32, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pal.alienHighlight;
        ctx.beginPath();
        ctx.arc(35, -34, 3, 0, Math.PI * 2);
        ctx.fill();

        // Punch speed glint
        ctx.fillStyle = pal.alienGlow;
        ctx.fillRect(38, -33, 8, 2);

        this.drawAlienHead(ctx, 3, -50, 0.12, false, t);
        break;
      }

      case 'headbutt': {
        // Elastic Rubber Headbutt (The Legendary Melbourne Bop!)
        const stretch = options.progress !== undefined ? Math.sin(options.progress * Math.PI) * 36 : 28;

        this.drawAlienFoot(ctx, -14, -1, pal);
        this.drawAlienFoot(ctx, -2, -1, pal);
        this.drawAlienLeg(ctx, -8, -18, -14, -2, pal);
        this.drawAlienLeg(ctx, 0, -18, -2, -2, pal);

        // Leaning Torso
        ctx.save();
        ctx.translate(-4, -26);
        ctx.rotate(0.35);
        this.drawAlienTorso(ctx, 0, 0, pal, t);
        ctx.restore();

        // Stretched Rubber Neck with Muscle Fiber Bands
        ctx.fillStyle = pal.alienShadow;
        ctx.fillRect(2, -42, stretch, 8);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(2, -43, stretch, 2);
        ctx.fillStyle = pal.alienVein;
        ctx.fillRect(4, -40, stretch - 4, 2); // Glowing neck sinew

        // Shooting Head with dynamic angle
        this.drawAlienHead(ctx, stretch + 8, -44, 0.5, true, t);

        // Comic Kinetic Sparks
        ctx.fillStyle = pal.neonCyan;
        ctx.fillRect(stretch - 2, -48, 4, 4);
        ctx.fillRect(stretch - 8, -38, 5, 3);
        ctx.fillRect(stretch + 4, -46, 3, 3);
        break;
      }

      case 'trip': {
        // Low Shin Grab / Ankle Sweep
        ctx.fillStyle = pal.alienShadow;
        // Crouched splayed legs
        this.drawAlienLeg(ctx, -14, -10, -20, -1, pal);
        this.drawAlienLeg(ctx, 0, -10, 8, -1, pal);
        this.drawAlienFoot(ctx, -20, -1, pal);
        this.drawAlienFoot(ctx, 8, -1, pal);

        // Low Torso
        this.drawAlienTorso(ctx, -4, -18, pal, t);

        // Extended Arms sweeping ground
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(4, -14, 26, 5);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(4, -15, 26, 2);
        // Spindly Claws Grabbing
        ctx.fillStyle = pal.alienDeep;
        ctx.fillRect(28, -16, 8, 7);
        ctx.fillStyle = pal.alienGlow;
        ctx.fillRect(32, -18, 3, 3);

        this.drawAlienHead(ctx, 6, -28, 0.25, false, t);
        break;
      }

      case 'bulldozer': {
        // Bulldozer Rocket Dash / Bull Ram
        // Sprinted low body
        this.drawAlienLeg(ctx, -18, -14, -26, -3, pal);
        this.drawAlienLeg(ctx, -6, -14, -12, -3, pal);
        this.drawAlienFoot(ctx, -26, -2, pal);
        this.drawAlienFoot(ctx, -12, -2, pal);

        // Horizontal Torso
        ctx.save();
        ctx.translate(-8, -20);
        ctx.rotate(0.6);
        this.drawAlienTorso(ctx, 0, 0, pal, t);
        ctx.restore();

        // Arms tucked back like speed racer
        ctx.fillStyle = pal.alienShadow;
        ctx.fillRect(-26, -28, 16, 5);
        ctx.fillStyle = pal.alienGlow;
        ctx.fillRect(-28, -27, 4, 3);

        // Armored Cranium Ramming Forward
        this.drawAlienHead(ctx, 16, -26, 0.75, true, t);

        // Rocket Jet Exhaust Trails
        const ex = Math.sin(t * 25) * 6;
        ctx.fillStyle = pal.neonCyan;
        ctx.fillRect(-38 + ex, -24, 14, 3);
        ctx.fillStyle = pal.neonGreen;
        ctx.fillRect(-32 + ex, -18, 10, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-42 + ex, -23, 8, 2);
        break;
      }

      case 'ear_twist': {
        // Ear Twist / Cheek Pinch Grab
        this.drawAlienFoot(ctx, -6, -1, pal);
        this.drawAlienFoot(ctx, 4, -1, pal);
        this.drawAlienLeg(ctx, -4, -20, -6, -2, pal);
        this.drawAlienLeg(ctx, 4, -20, 4, -2, pal);
        this.drawAlienTorso(ctx, 0, -36, pal, t);

        // Dual Spindly Arms Reaching Forward Twisting Opponent
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(4, -38, 22, 4);
        ctx.fillRect(4, -28, 22, 4);
        // Alien Fingers Twisting
        ctx.fillStyle = pal.alienDeep;
        ctx.fillRect(24, -40, 6, 7);
        ctx.fillRect(24, -30, 6, 7);
        ctx.fillStyle = pal.neonPink; // Pain sparks
        ctx.fillRect(28, -42, 4, 4);
        ctx.fillRect(28, -26, 4, 4);

        this.drawAlienHead(ctx, -2, -50, -0.1, false, t);
        break;
      }

      case 'belly_flop': {
        // Airborne Splayed Belly Flop (Mid-air squishy impact)
        ctx.save();
        ctx.rotate(0.25);
        // Plump wobbly Alien Belly
        ctx.fillStyle = pal.alienMid;
        ctx.beginPath();
        ctx.ellipse(0, -28, 18, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = pal.alienHighlight;
        ctx.beginPath();
        ctx.ellipse(0, -32, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Splayed limbs
        ctx.fillStyle = pal.alienShadow;
        ctx.fillRect(-22, -36, 8, 5);
        ctx.fillRect(14, -36, 8, 5);
        ctx.fillRect(-22, -22, 8, 5);
        ctx.fillRect(14, -22, 8, 5);

        this.drawAlienHead(ctx, 0, -42, 0, false, t);
        ctx.restore();
        break;
      }

      case 'roundhouse': {
        // Flying Dropkick / Airborne Double Kick
        ctx.save();
        ctx.rotate(-0.35);
        this.drawAlienTorso(ctx, -8, -24, pal, t);

        // Extended Dual Legs Kicking Forward
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(4, -26, 30, 7);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(4, -27, 30, 2);
        // High-velocity Feet
        this.drawAlienFoot(ctx, 32, -28, pal);
        this.drawAlienFoot(ctx, 36, -22, pal);

        this.drawAlienHead(ctx, -18, -38, -0.3, true, t);
        ctx.restore();
        break;
      }

      case 'macho_elbow': {
        // Descending Macho Alien Elbow
        ctx.save();
        ctx.rotate(0.45);
        this.drawAlienTorso(ctx, -4, -30, pal, t);

        // Pointed Sharp Alien Elbow Smash
        ctx.fillStyle = pal.alienHighlight;
        ctx.beginPath();
        ctx.moveTo(8, -28);
        ctx.lineTo(26, -14);
        ctx.lineTo(16, -6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = pal.alienShadow;
        ctx.beginPath();
        ctx.moveTo(6, -26);
        ctx.lineTo(24, -14);
        ctx.lineTo(14, -6);
        ctx.closePath();
        ctx.fill();

        this.drawAlienHead(ctx, -6, -44, 0.2, true, t);
        ctx.restore();
        break;
      }

      case 'donkey_kick': {
        // Mule Back Kick
        this.drawAlienFoot(ctx, 4, -1, pal);
        this.drawAlienLeg(ctx, 4, -20, 4, -2, pal);
        this.drawAlienTorso(ctx, 0, -34, pal, t);

        // Back leg blasting straight backward
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(-30, -26, 26, 6);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(-30, -27, 26, 2);
        this.drawAlienFoot(ctx, -34, -28, pal);

        this.drawAlienHead(ctx, 6, -48, 0.2, false, t);
        break;
      }

      case 'taunt': {
        // Cosmic Taunt (Wiggling antennae, hips & glowing gauntlet)
        const wiggle = Math.sin(t * 18) * 5;
        this.drawAlienFoot(ctx, -6, -1, pal);
        this.drawAlienFoot(ctx, 4, -1, pal);
        this.drawAlienLeg(ctx, -4, -20, -6, -2, pal);
        this.drawAlienLeg(ctx, 4, -20, 4, -2, pal);

        this.drawAlienTorso(ctx, wiggle, -36, pal, t);

        // Hands on hips wiggling
        this.drawAlienArm(ctx, -10 + wiggle, -34, -16 + wiggle, -24, pal, false);
        this.drawAlienArm(ctx, 8 + wiggle, -34, 14 + wiggle, -24, pal, true, t);

        this.drawAlienHead(ctx, -wiggle * 0.4, -50, wiggle * 0.08, true, t);
        break;
      }

      case 'hurt': {
        ctx.save();
        ctx.rotate(-0.35);
        this.drawAlienFoot(ctx, -8, -1, pal);
        this.drawAlienFoot(ctx, 2, -1, pal);
        this.drawAlienLeg(ctx, -6, -18, -8, -2, pal);
        this.drawAlienLeg(ctx, 2, -18, 2, -2, pal);

        ctx.fillStyle = pal.redMid;
        this.drawAlienTorso(ctx, -4, -34, pal, t);
        this.drawAlienHead(ctx, -6, -48, -0.4, false, t);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Flat on back with dazed stars
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.alienShadow;
        ctx.fillRect(-28, -6, 56, 10);
        ctx.fillStyle = pal.alienHighlight;
        ctx.fillRect(-28, -7, 56, 2);
        this.drawAlienHead(ctx, -30, -14, -Math.PI / 2, false, t);
        ctx.restore();
        break;
      }

      case 'victory': {
        // Cosmic Alien Breakdance / Victory
        const dance = Math.sin(t * 12) * 6;
        this.drawAlienFoot(ctx, -8, -1 + Math.abs(dance), pal);
        this.drawAlienFoot(ctx, 4, -1 - Math.abs(dance), pal);
        this.drawAlienTorso(ctx, 0, -36, pal, t);

        // Arms raised in V with glowing energy orbs
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(-16, -50, 4, 16);
        ctx.fillRect(12, -50, 4, 16);
        ctx.fillStyle = pal.neonGreen;
        ctx.beginPath();
        ctx.arc(-14, -54, 5, 0, Math.PI * 2);
        ctx.arc(14, -54, 5, 0, Math.PI * 2);
        ctx.fill();

        this.drawAlienHead(ctx, dance * 0.2, -50, dance * 0.05, true, t);
        break;
      }
    }

    ctx.restore();
  }

  drawAlienFoot(ctx, x, y, pal) {
    ctx.fillStyle = pal.alienDeep;
    ctx.fillRect(x - 3, y - 3, 8, 4);
    ctx.fillStyle = pal.alienHighlight;
    ctx.fillRect(x - 3, y - 4, 8, 1); // Toe highlight
  }

  drawAlienLeg(ctx, topX, topY, botX, botY, pal) {
    ctx.strokeStyle = pal.alienMid;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(botX, botY);
    ctx.stroke();

    ctx.strokeStyle = pal.alienHighlight;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(topX - 1, topY);
    ctx.lineTo(botX - 1, botY);
    ctx.stroke();
  }

  drawAlienTorso(ctx, x, y, pal, t) {
    ctx.save();
    ctx.translate(x, y);

    // Slim Gray Alien Ribcage
    ctx.fillStyle = pal.alienMid;
    ctx.fillRect(-6, 0, 12, 18);

    // Highlights & Shadows
    ctx.fillStyle = pal.alienHighlight;
    ctx.fillRect(-6, 0, 2, 18);
    ctx.fillStyle = pal.alienShadow;
    ctx.fillRect(4, 0, 2, 18);

    // Rib contours
    ctx.fillStyle = pal.alienDeep;
    ctx.fillRect(-4, 4, 8, 1.5);
    ctx.fillRect(-4, 8, 8, 1.5);
    ctx.fillRect(-4, 12, 8, 1.5);

    // Biomechanical Cybernetic Utility Belt
    ctx.fillStyle = pal.leatherMid;
    ctx.fillRect(-7, 16, 14, 4);
    ctx.fillStyle = pal.goldMid;
    ctx.fillRect(-2, 16, 4, 4); // Buckle
    ctx.fillStyle = pal.alienGlow;
    ctx.fillRect(-1, 17, 2, 2); // Belt Power LED

    ctx.restore();
  }

  drawAlienArm(ctx, shoulderX, shoulderY, handX, handY, pal, hasGauntlet = false, t = 0) {
    ctx.strokeStyle = pal.alienMid;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    if (hasGauntlet) {
      // Biomechanical Wrist Gauntlet with Plasma Meter
      ctx.fillStyle = pal.leatherMid;
      ctx.fillRect(handX - 3, handY - 4, 6, 7);
      ctx.fillStyle = pal.alienGlow;
      ctx.fillRect(handX - 2, handY - 2, 4, 3);
      // Plasma Spark
      const glow = Math.sin(t * 15) > 0;
      if (glow) {
        ctx.fillStyle = pal.neonGreen;
        ctx.fillRect(handX - 1, handY - 1, 2, 2);
      }
    }
  }

  // Draw Gleep-Glorp's Translucent Cranium with Pulsing Cosmic Brain Veins
  drawAlienHead(ctx, x, y, angle = 0, isGlow = false, t = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const pal = this.pal;

    // Giant Bulbous Alien Skull (Classic Area 51 / Melbourne House Gray)
    ctx.fillStyle = isGlow ? pal.alienHighlight : pal.alienMid;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cranium 3D Specular Highlight Ramp
    ctx.fillStyle = pal.alienHighlight;
    ctx.beginPath();
    ctx.ellipse(-4, -8, 7, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Inner Brain Silhouette & Pulsing Neural Veins
    const pulse = 0.4 + Math.sin(t * 8) * 0.35;
    ctx.fillStyle = `rgba(57, 255, 20, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, -7, 6, 0, Math.PI * 2);
    ctx.fill();

    // Neural Vein Filaments
    ctx.strokeStyle = pal.alienVein;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3, -11);
    ctx.lineTo(-1, -7);
    ctx.lineTo(2, -8);
    ctx.lineTo(4, -5);
    ctx.stroke();

    // Tapered Alien Chin & Cheekbones
    ctx.fillStyle = pal.alienShadow;
    ctx.beginPath();
    ctx.moveTo(-9, 8);
    ctx.lineTo(9, 8);
    ctx.lineTo(0, 19);
    ctx.closePath();
    ctx.fill();

    // Glossy Multifaceted Black Almond Eyes with Specular Glints
    ctx.fillStyle = pal.alienEye;
    // Left Eye
    ctx.beginPath();
    ctx.ellipse(-7, 3, 5, 8.5, -0.38, 0, Math.PI * 2);
    ctx.fill();
    // Right Eye
    ctx.beginPath();
    ctx.ellipse(7, 3, 5, 8.5, 0.38, 0, Math.PI * 2);
    ctx.fill();

    // Dual Specular Glints (Gives wet glassy 3D look)
    ctx.fillStyle = pal.alienEyeGlint;
    ctx.beginPath();
    ctx.arc(-8, 0, 1.8, 0, Math.PI * 2);
    ctx.arc(-6, 4, 1.0, 0, Math.PI * 2);
    ctx.arc(6, 0, 1.8, 0, Math.PI * 2);
    ctx.arc(8, 4, 1.0, 0, Math.PI * 2);
    ctx.fill();

    // Nostril Slits & Narrow Alien Mouth
    ctx.fillStyle = pal.alienDeep;
    ctx.fillRect(-2, 11, 1.5, 1.5);
    ctx.fillRect(1, 11, 1.5, 1.5);
    ctx.fillRect(-3, 15, 6, 1.5);

    // Twin Bioluminescent Antennae
    const antWave = Math.sin(t * 12) * 2;
    ctx.strokeStyle = pal.alienShadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -17);
    ctx.quadraticCurveTo(-10 + antWave, -26, -12 + antWave, -30);
    ctx.moveTo(6, -17);
    ctx.quadraticCurveTo(10 - antWave, -26, 12 - antWave, -30);
    ctx.stroke();

    // Glowing Antenna Tip Orbs
    ctx.fillStyle = pal.alienGlow;
    ctx.beginPath();
    ctx.arc(-12 + antWave, -30, 2.5, 0, Math.PI * 2);
    ctx.arc(12 - antWave, -30, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 2. MOHAWK STREET PUNK (SPIKE)
  // =========================================================================
  drawPunk(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    switch (state) {
      case 'walk': {
        const walk = Math.sin(t * 8) * 7;
        // Torn Jeans with knee patches
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-8 + walk, -20, 6, 20);
        ctx.fillRect(3 - walk, -20, 6, 20);
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(-7 + walk, -12, 4, 3); // Ripped knee hole

        // Heavy Combat Boots
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(-10 + walk, -4, 9, 5);
        ctx.fillRect(1 - walk, -4, 9, 5);
        ctx.fillStyle = pal.metalMid;
        ctx.fillRect(-6 + walk, -4, 2, 2); // Steel eyelets

        // Studded Motorcycle Leather Jacket with Zippers
        ctx.fillStyle = pal.leatherMid;
        ctx.fillRect(-9, -40, 18, 22);
        ctx.fillStyle = pal.leatherHighlight;
        ctx.fillRect(-9, -40, 3, 22);
        // Silver Zippers & Skull Belt
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(-1, -38, 2, 16);
        ctx.fillRect(-3, -20, 6, 3);

        // Swagger Arms holding Glistening Switchblade
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(8, -36, 12, 5);
        // Metallic Knife Blade with Glint
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(20, -35, 10, 3);
        ctx.fillStyle = pal.neonCyan;
        ctx.fillRect(28, -36, 3, 2); // Glint

        // Head with Textured Spiked Mohawk
        this.drawPunkHead(ctx, 0, -52, pal, t);
        break;
      }

      case 'attack': {
        // Switchblade Shank Lunge
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-12, -20, 7, 20);
        ctx.fillRect(5, -20, 7, 20);
        ctx.fillStyle = pal.leatherMid;
        ctx.fillRect(-9, -40, 18, 22);

        // Lunge Arm with Blade Thrusting Forward
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(8, -36, 20, 6);
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(28, -36, 14, 3);
        ctx.fillStyle = pal.neonCyan;
        ctx.fillRect(40, -37, 4, 2);

        this.drawPunkHead(ctx, 3, -52, pal, t);
        break;
      }

      case 'dropkick': {
        // Horizontal Airborne Dropkick
        ctx.save();
        ctx.rotate(-0.35);
        ctx.fillStyle = pal.leatherMid;
        ctx.fillRect(-18, -28, 20, 15);

        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(2, -24, 24, 8);
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(26, -26, 9, 11);

        this.drawPunkHead(ctx, -26, -34, pal, t);
        ctx.restore();
        break;
      }

      case 'hurt': {
        ctx.save();
        ctx.rotate(-0.35);
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-6, -20, 6, 20);
        ctx.fillRect(3, -20, 6, 20);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-9, -40, 18, 22);
        this.drawPunkHead(ctx, -5, -52, pal, t);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Flat on Back with Broken Sunglasses
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(-34, -4, 11, 8);
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-24, -6, 22, 10);
        ctx.fillStyle = pal.leatherMid;
        ctx.fillRect(-4, -9, 24, 14);
        this.drawPunkHead(ctx, 22, -12, pal, t, true);
        ctx.restore();
        break;
      }

      default: {
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-7, -20, 6, 20);
        ctx.fillRect(3, -20, 6, 20);
        ctx.fillStyle = pal.leatherMid;
        ctx.fillRect(-9, -40, 18, 22);
        this.drawPunkHead(ctx, 0, -52, pal, t);
        break;
      }
    }

    ctx.restore();
  }

  drawPunkHead(ctx, x, y, pal, t, isKnocked = false) {
    ctx.save();
    ctx.translate(x, y);

    // Face
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(-6, -6, 12, 13);
    ctx.fillStyle = pal.skinHighlight;
    ctx.fillRect(-6, -6, 3, 13);

    // Spiked Textured Punk Mohawk (Orange & Red Ramps)
    ctx.fillStyle = pal.redMid;
    ctx.fillRect(-3, -18, 6, 13);
    ctx.fillStyle = pal.redHighlight;
    ctx.fillRect(-1, -20, 3, 15); // Spikes
    ctx.fillRect(-2, -22, 4, 3);
    ctx.fillRect(1, -24, 2, 4);

    // Dark Aviator Sunglasses with Horizon Specular Reflection
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-1, -2, 8, 4);
    ctx.fillStyle = pal.metalHighlight;
    ctx.fillRect(0, -2, 2, 2); // Lens Glint

    // Sneering Mouth
    ctx.fillStyle = pal.skinDeep;
    ctx.fillRect(0, 4, 6, 2);

    ctx.restore();
  }

  // =========================================================================
  // 3. HANDBAG GRANNY (AGNES)
  // =========================================================================
  drawGranny(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    switch (state) {
      case 'walk': {
        const w = Math.sin(t * 6) * 4;
        // Fuzzy Slippers
        ctx.fillStyle = pal.purpleMid;
        ctx.fillRect(-9 + w, -4, 7, 4);
        ctx.fillRect(3 - w, -4, 7, 4);

        // Floral Pattern Dress with 3D folds
        ctx.fillStyle = pal.purpleHighlight;
        ctx.beginPath();
        ctx.moveTo(-11, -20);
        ctx.lineTo(11, -20);
        ctx.lineTo(15, -4);
        ctx.lineTo(-15, -4);
        ctx.closePath();
        ctx.fill();

        // Floral Print Dots
        ctx.fillStyle = pal.dressFloral;
        ctx.fillRect(-8, -14, 2, 2);
        ctx.fillRect(4, -16, 2, 2);
        ctx.fillRect(-4, -8, 2, 2);
        ctx.fillRect(6, -10, 2, 2);

        // Warm Cardigan & Pearl Necklace
        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-9, -38, 18, 18);
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(-4, -36, 8, 2); // Pearl necklace

        // Massive Heavy Handbag Swing
        ctx.fillStyle = pal.skinDeep;
        ctx.fillRect(10, -28 + w * 2, 14, 15);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(14, -30 + w * 2, 6, 3); // Metal clasp

        // Granny Head with Curler Net
        this.drawGrannyHead(ctx, 0, -50, pal);
        break;
      }

      case 'attack': {
        // Windup & Heavy Handbag Wallop
        ctx.fillStyle = pal.purpleHighlight;
        ctx.fillRect(-12, -20, 24, 16);
        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-9, -38, 18, 18);

        // Overhead Handbag Smash with Glint
        ctx.fillStyle = pal.skinDeep;
        ctx.fillRect(16, -44, 18, 18);
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(22, -47, 8, 4);

        this.drawGrannyHead(ctx, 2, -50, pal);
        break;
      }

      case 'umbrella_block': {
        // Open Polka-Dot Umbrella Shield (Deflects frontal attacks!)
        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-9, -38, 18, 20);

        // Giant Open Umbrella Dome
        ctx.fillStyle = pal.purpleMid;
        ctx.beginPath();
        ctx.arc(14, -28, 22, -Math.PI / 2, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(14, -28, 2, 2);
        // Polka dots
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, -36, 3, 3);
        ctx.fillRect(24, -26, 3, 3);
        ctx.fillRect(20, -16, 3, 3);

        this.drawGrannyHead(ctx, -2, -50, pal);
        break;
      }

      case 'helicopter': {
        // Helicopter Handbag Flight (Spinning handbag rotors)
        const rotorAngle = t * 38;
        const rotorSpan = Math.sin(rotorAngle) * 32;
        const flutter = Math.sin(t * 22) * 4;

        // Fluttering Dress
        ctx.fillStyle = pal.purpleHighlight;
        ctx.beginPath();
        ctx.moveTo(-11, -20);
        ctx.lineTo(11, -20);
        ctx.lineTo(14 + flutter, -2);
        ctx.lineTo(-14 - flutter, -2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-9, -36, 18, 16);

        // Arms stretched straight up holding purse straps
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(-7, -50, 4, 16);
        ctx.fillRect(3, -50, 4, 16);

        // Rotor Disc & Spinning Handbag Blur
        ctx.fillStyle = pal.skinDeep;
        ctx.fillRect(-rotorSpan, -58, rotorSpan * 2, 4);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-4, -60, 8, 6);
        // Rotor Blur Ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, -58, 30, 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        this.drawGrannyHead(ctx, 0, -44, pal);
        break;
      }

      case 'knockdown': {
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.purpleMid;
        ctx.fillRect(-32, -6, 9, 6);
        ctx.fillStyle = pal.purpleHighlight;
        ctx.fillRect(-24, -8, 26, 12);
        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-2, -10, 20, 14);
        this.drawGrannyHead(ctx, 20, -12, pal);
        ctx.restore();
        break;
      }

      default: {
        ctx.fillStyle = pal.purpleHighlight;
        ctx.fillRect(-11, -20, 22, 16);
        ctx.fillStyle = pal.purpleShadow;
        ctx.fillRect(-9, -38, 18, 18);
        this.drawGrannyHead(ctx, 0, -50, pal);
        break;
      }
    }

    ctx.restore();
  }

  drawGrannyHead(ctx, x, y, pal) {
    ctx.save();
    ctx.translate(x, y);

    // Face & Wrinkles
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = pal.skinHighlight;
    ctx.fillRect(-6, -6, 3, 12);

    // Gray Perm Hair & Bright Cyan Hair Curlers
    ctx.fillStyle = pal.furShadow;
    ctx.fillRect(-9, -12, 18, 7);
    ctx.fillStyle = pal.neonCyan;
    ctx.fillRect(-8, -14, 4, 4);
    ctx.fillRect(4, -14, 4, 4);
    ctx.fillRect(-2, -16, 4, 4);

    // Rimless Cat-Eye Glasses with Specular Glint
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-1, -2, 8, 3);
    ctx.fillStyle = pal.metalHighlight;
    ctx.fillRect(0, -2, 2, 2);

    ctx.restore();
  }

  // =========================================================================
  // 4. ATTACK POODLE & PITBULL (BARNABY)
  // =========================================================================
  drawDog(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    switch (state) {
      case 'attack':
      case 'latch_bite': {
        // High-velocity Ankle Clamp Snarl
        ctx.save();
        ctx.rotate(-0.25);
        ctx.fillStyle = pal.furMid;
        ctx.fillRect(-18, -16, 26, 12);
        ctx.fillStyle = pal.furHighlight;
        ctx.beginPath();
        ctx.arc(-16, -10, 7, 0, Math.PI * 2);
        ctx.arc(8, -10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Jaws Open Wide Clamping Ankle
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(16, -18, 8, 8);
        ctx.fillStyle = pal.furHighlight;
        ctx.fillRect(16, -18, 3, 3); // Sharp fangs
        ctx.fillRect(21, -13, 3, 3);

        // Pink Hair Bow
        ctx.fillStyle = pal.neonPink;
        ctx.fillRect(12, -26, 6, 5);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.furMid;
        ctx.fillRect(-18, -6, 28, 10);
        // 4 Paws pointing up in defeat
        ctx.fillStyle = pal.furHighlight;
        ctx.fillRect(-14, -16, 3, 10);
        ctx.fillRect(-8, -16, 3, 10);
        ctx.fillRect(2, -16, 3, 10);
        ctx.fillRect(8, -16, 3, 10);
        // Lolling Tongue
        ctx.fillStyle = pal.redHighlight;
        ctx.fillRect(18, -4, 6, 4);
        ctx.restore();
        break;
      }

      default: {
        // Fast Running Gait
        const run = Math.sin(t * 14) * 8;
        ctx.fillStyle = pal.furMid;
        ctx.fillRect(-16, -14, 24, 11);
        ctx.fillStyle = pal.furHighlight;
        ctx.beginPath();
        ctx.arc(-14, -9, 7, 0, Math.PI * 2);
        ctx.arc(8, -10, 8, 0, Math.PI * 2);
        ctx.fill();

        // 4 Running Legs
        ctx.fillStyle = pal.furShadow;
        ctx.fillRect(-14 + run, -8, 3, 9);
        ctx.fillRect(-7 - run, -8, 3, 9);
        ctx.fillRect(4 + run, -8, 3, 9);
        ctx.fillRect(11 - run, -8, 3, 9);

        // Fluffy Tail
        ctx.fillStyle = pal.furHighlight;
        ctx.beginPath();
        ctx.arc(-20, -20, 5, 0, Math.PI * 2);
        ctx.fill();

        // Head with Pink Bow
        ctx.fillStyle = pal.furHighlight;
        ctx.fillRect(10, -24, 11, 13);
        ctx.fillStyle = pal.neonPink;
        ctx.fillRect(12, -28, 7, 5);

        // Snout with Fangs
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(18, -17, 6, 5);
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(19, -13, 2, 2);
        break;
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // 5. BASKETBALL HOOP DUDE (HOOPS #23 - TOWERING SPRITE)
  // =========================================================================
  drawBasketballer(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    switch (state) {
      case 'throw_ball':
      case 'dunk_slam': {
        // Towering Monster Dunk / High Two-Hand Ball Launch
        ctx.fillStyle = pal.bronzeMid;
        ctx.fillRect(-8, -44, 6, 40);
        ctx.fillRect(3, -44, 6, 40);
        // High Top Sneakers
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-10, -6, 10, 6);
        ctx.fillRect(2, -6, 10, 6);
        // Red Mesh Jersey #23
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-10, -78, 20, 28);
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(-10, -52, 20, 16); // Shorts
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('23', -6, -60);

        // Overhead Arms Slamming Ball
        ctx.fillStyle = pal.bronzeMid;
        ctx.fillRect(6, -82, 24, 7);

        // Tall Head with High Afro Fade
        this.drawBasketballerHead(ctx, 0, -92, pal);
        break;
      }

      case 'knockdown': {
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-48, -6, 13, 8);
        ctx.fillStyle = pal.bronzeMid;
        ctx.fillRect(-35, -7, 26, 7);
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(-9, -9, 20, 13);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(11, -11, 28, 15);
        this.drawBasketballerHead(ctx, 42, -14, pal);
        ctx.restore();
        break;
      }

      default: {
        // Active Pavement Dribbling
        const walk = Math.sin(t * 8) * 8;
        const bounce = Math.abs(Math.sin(t * 10)) * 20;

        ctx.fillStyle = pal.bronzeMid;
        ctx.fillRect(-8 + walk, -44, 6, 40);
        ctx.fillRect(3 - walk, -44, 6, 40);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-10 + walk, -6, 10, 6);
        ctx.fillRect(1 - walk, -6, 10, 6);

        // Shorts & Jersey #23
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(-10, -52, 20, 16);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-10, -78, 20, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('23', -6, -60);

        // Long Dribbling Arm
        ctx.fillStyle = pal.bronzeMid;
        ctx.fillRect(8, -70, 7, 26);

        // 2.5D Bouncing Basketball
        ctx.fillStyle = pal.neonOrange;
        ctx.beginPath();
        ctx.arc(18, -6 - bounce, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pal.leatherDeep;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.drawBasketballerHead(ctx, 0, -92, pal);
        break;
      }
    }

    ctx.restore();
  }

  drawBasketballerHead(ctx, x, y, pal) {
    ctx.save();
    ctx.translate(x, y);

    // Head
    ctx.fillStyle = pal.bronzeMid;
    ctx.fillRect(-6, -6, 13, 16);
    ctx.fillStyle = pal.bronzeHighlight;
    ctx.fillRect(-6, -6, 3, 16);

    // High Afro Fade Haircut
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-9, -18, 18, 12);
    ctx.fillRect(-9, -8, 5, 10);

    // White Terrycloth Sweatband
    ctx.fillStyle = pal.metalHighlight;
    ctx.fillRect(-8, -10, 16, 4);

    ctx.restore();
  }

  // =========================================================================
  // 6. BRUTUS THE BOUNCER (HEAVYWEIGHT BRAWLER)
  // =========================================================================
  drawBouncer(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    switch (state) {
      case 'airplane_spin': {
        // 360° Airplane Spin Grapple (Spinning Gleep-Glorp overhead!)
        const spin = Math.sin(t * 24);
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-14, -22, 13, 22);
        ctx.fillRect(2, -22, 13, 22);

        // Barrel Checkered Torso
        this.drawBouncerTorso(ctx, 0, -50, pal);

        // Huge Arms holding alien overhead
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(-16, -64, 32, 8);

        // Spinning victim silhouette overhead
        ctx.fillStyle = pal.alienMid;
        ctx.fillRect(-spin * 24, -72, 28, 7);

        this.drawBouncerHead(ctx, 0, -58, pal);
        break;
      }

      case 'knockdown': {
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-40, -8, 24, 12);
        this.drawBouncerTorso(ctx, -10, -12, pal);
        this.drawBouncerHead(ctx, 30, -8, pal);
        ctx.restore();
        break;
      }

      default: {
        // Swagger walk in flannel shirt
        const w = Math.sin(t * 6) * 4;
        ctx.fillStyle = pal.denimMid;
        ctx.fillRect(-14 + w, -22, 12, 22);
        ctx.fillRect(2 - w, -22, 12, 22);

        this.drawBouncerTorso(ctx, 0, -50, pal);

        // Muscular Arms with Brass Knuckles
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(-22, -48, 9, 20);
        ctx.fillRect(15, -48, 9, 20);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(15, -30, 9, 4); // Brass Knuckles

        this.drawBouncerHead(ctx, 0, -58, pal);
        break;
      }
    }

    ctx.restore();
  }

  drawBouncerTorso(ctx, x, y, pal) {
    ctx.save();
    ctx.translate(x, y);

    // Blue/Black Checkered Flannel Shirt
    ctx.fillStyle = pal.denimHighlight;
    ctx.fillRect(-18, 0, 36, 30);
    ctx.fillStyle = pal.leatherDeep;
    // Checkered Grid Pattern
    ctx.fillRect(-18, 6, 36, 4);
    ctx.fillRect(-18, 16, 36, 4);
    ctx.fillRect(-18, 24, 36, 4);
    ctx.fillRect(-8, 0, 4, 30);
    ctx.fillRect(4, 0, 4, 30);

    ctx.restore();
  }

  drawBouncerHead(ctx, x, y, pal) {
    ctx.save();
    ctx.translate(x, y);

    // Bald Muscular Head
    ctx.fillStyle = pal.skinMid;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.skinHighlight;
    ctx.beginPath();
    ctx.arc(-3, -3, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5 O'clock Stubble Shadow
    ctx.fillStyle = pal.leatherHighlight;
    ctx.fillRect(-6, 2, 12, 6);

    // Dark Sunglasses
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-6, -3, 12, 4);

    ctx.restore();
  }

  // =========================================================================
  // 7. AXEL THE ROLLER-SKATER (NEW ENEMY)
  // =========================================================================
  drawSkater(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    if (state === 'knockdown') {
      // WIPEOUT! Flat out, skates still spinning in the air, boombox tumbled.
      ctx.save();
      ctx.translate(0, -6);

      // Legs up, skates aloft with wheels still turning
      ctx.fillStyle = pal.neonPink;
      ctx.fillRect(-26, -6, 18, 11);
      ctx.fillStyle = pal.neonCyan;
      ctx.fillRect(-34, -12, 10, 6);
      ctx.fillRect(-34, 2, 10, 6);
      ctx.fillStyle = pal.neonGreen;
      const spin = t * 18;
      for (let i = 0; i < 4; i++) {
        const wx = -36 + (i % 2) * 7;
        const wy = i < 2 ? -14 : 6;
        ctx.beginPath();
        ctx.arc(wx, wy, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pal.leatherDeep;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + Math.cos(spin + i) * 2.6, wy + Math.sin(spin + i) * 2.6);
        ctx.stroke();
      }

      // Tank top, horizontal
      ctx.fillStyle = pal.neonGreen;
      ctx.fillRect(-9, -10, 24, 19);

      // Boombox flung clear, still playing
      ctx.fillStyle = pal.metalMid;
      ctx.fillRect(-4, -30, 16, 11);
      ctx.fillStyle = pal.leatherDeep;
      ctx.beginPath();
      ctx.arc(0, -25, 3.4, 0, Math.PI * 2);
      ctx.arc(8, -25, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.neonCyan;
      ctx.font = '7px monospace';
      ctx.fillText('~', 14, -27);

      // Head, cap knocked askew
      ctx.fillStyle = pal.skinMid;
      ctx.fillRect(16, -7, 13, 13);
      ctx.fillStyle = pal.neonPink;
      ctx.fillRect(20, -12, 14, 6);
      ctx.fillStyle = pal.leatherDeep;
      ctx.fillRect(21, -3, 3, 3);
      ctx.fillRect(23, -1, 3, 3);
      ctx.fillRect(23, -5, 3, 3);
      ctx.restore();
      ctx.restore();
      return;
    }

    // Slalom roll animation
    const roll = Math.sin(t * 12) * 5;
    const wheelRot = t * 25;

    // Shorts & Knee Pads
    ctx.fillStyle = pal.neonPink;
    ctx.fillRect(-8, -24, 16, 14);
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-7, -14, 5, 5); // Knee pads
    ctx.fillRect(2, -14, 5, 5);

    // Retro 80s Quad Roller Skates with Spinning Wheels
    ctx.fillStyle = pal.neonCyan;
    ctx.fillRect(-10, -6, 9, 5);
    ctx.fillRect(2, -6, 9, 5);
    // 4 Glowing Wheels
    ctx.fillStyle = pal.neonGreen;
    ctx.beginPath();
    ctx.arc(-8, -1, 3, 0, Math.PI * 2);
    ctx.arc(-2, -1, 3, 0, Math.PI * 2);
    ctx.arc(4, -1, 3, 0, Math.PI * 2);
    ctx.arc(10, -1, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sleeveless Muscle Tank & Boombox on shoulder
    ctx.fillStyle = pal.neonGreen;
    ctx.fillRect(-8, -44 + roll * 0.5, 16, 20);

    // Silver 80s Boombox
    ctx.fillStyle = pal.metalMid;
    ctx.fillRect(-16, -48 + roll * 0.5, 12, 16);
    ctx.fillStyle = pal.leatherDeep;
    ctx.beginPath();
    ctx.arc(-10, -40 + roll * 0.5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Skater Head with Backwards Neon Cap
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(-5, -56 + roll * 0.5, 11, 12);
    ctx.fillStyle = pal.neonPink; // Backwards cap
    ctx.fillRect(-7, -62 + roll * 0.5, 15, 6);
    ctx.fillRect(-12, -58 + roll * 0.5, 6, 3); // Cap bill behind

    ctx.restore();
  }

  // =========================================================================
  // 8. BRUNO THE CIRCUS STRONGMAN (NEW ENEMY)
  // =========================================================================
  drawStrongman(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    switch (state) {
      case 'barbell_spin': {
        // Whirlwind 360° Barbell Spin (Invulnerable whirlwind)
        const spin = Math.sin(t * 30);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-12, -22, 11, 22);
        ctx.fillRect(2, -22, 11, 22);

        // Striped Circus Singlet
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-14, -48, 28, 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-14, -44, 28, 4);
        ctx.fillRect(-14, -34, 28, 4);

        // 100KG Iron Barbell Spinning 360
        ctx.fillStyle = pal.metalMid;
        ctx.fillRect(-spin * 36, -42, spin * 72, 6);
        ctx.fillStyle = pal.leatherDeep;
        ctx.beginPath();
        ctx.arc(-spin * 36, -39, 11, 0, Math.PI * 2);
        ctx.arc(spin * 36, -39, 11, 0, Math.PI * 2);
        ctx.fill();

        this.drawStrongmanHead(ctx, 0, -58, pal);
        break;
      }

      case 'knockdown': {
        // TIMBER! Felled like a tree, pinned under his own 100KG barbell.
        ctx.save();
        ctx.translate(0, -7);

        // Legs out flat, boots splayed
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-36, -5, 14, 10);
        ctx.fillRect(-24, -7, 12, 12);
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(-42, -6, 8, 5);
        ctx.fillRect(-42, 1, 8, 5);

        // Striped singlet, now horizontal
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-14, -12, 30, 22);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-8, -12, 4, 22);
        ctx.fillRect(4, -12, 4, 22);

        // The barbell that finished him, lying across his chest
        ctx.fillStyle = pal.metalMid;
        ctx.fillRect(-6, -18, 6, 30);
        ctx.fillStyle = pal.leatherDeep;
        ctx.beginPath();
        ctx.arc(-3, -20, 9, 0, Math.PI * 2);
        ctx.arc(-3, 14, 9, 0, Math.PI * 2);
        ctx.fill();

        // Head on its side, moustache still magnificent
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(18, -9, 15, 16);
        ctx.fillStyle = pal.bronzeShadow;
        ctx.fillRect(20, -2, 13, 4);           // handlebar moustache
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(24, -7, 3, 3);            // eye, out cold (X)
        ctx.fillRect(26, -5, 3, 3);
        ctx.fillRect(26, -9, 3, 3);
        ctx.restore();
        break;
      }

      default: {
        // Heavy Stride carrying Barbell
        const w = Math.sin(t * 6) * 4;
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-12 + w, -22, 11, 22);
        ctx.fillRect(2 - w, -22, 11, 22);

        // Red/White Striped Circus Singlet
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-14, -48, 28, 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-14, -44, 28, 4);
        ctx.fillRect(-14, -34, 28, 4);

        // Barbell in Hands
        ctx.fillStyle = pal.metalMid;
        ctx.fillRect(4, -36, 26, 5);
        ctx.fillStyle = pal.leatherDeep;
        ctx.beginPath();
        ctx.arc(30, -34, 10, 0, Math.PI * 2);
        ctx.fill();

        this.drawStrongmanHead(ctx, 0, -58, pal);
        break;
      }
    }

    ctx.restore();
  }

  drawStrongmanHead(ctx, x, y, pal) {
    ctx.save();
    ctx.translate(x, y);

    // Bald Head
    ctx.fillStyle = pal.skinMid;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Giant Twirled Handlebar Mustache
    ctx.fillStyle = pal.leatherDeep;
    ctx.beginPath();
    ctx.moveTo(-10, 4);
    ctx.quadraticCurveTo(-4, 0, 0, 3);
    ctx.quadraticCurveTo(4, 0, 10, 4);
    ctx.quadraticCurveTo(6, 9, 0, 6);
    ctx.quadraticCurveTo(-6, 9, -10, 4);
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 9. DUKE DAVIS - FINAL BOSS (1987 BRAWLER)
  // =========================================================================
  drawDukeBoss(ctx, state, facing, animTimer, options = {}) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);
    const isEnraged = options.phase >= 2;

    // Enraged Fiery Aura in Phase 2/3
    if (isEnraged) {
      const aura = Math.sin(t * 18) * 4;
      ctx.save();
      ctx.strokeStyle = pal.neonGreen;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.65;
      ctx.strokeRect(-22 - aura, -72 - aura, 44 + aura * 2, 74 + aura * 2);
      ctx.restore();
    }

    switch (state) {
      case 'idle':
      case 'walk': {
        const w = state === 'walk' ? Math.sin(t * 8) * 6 : 0;
        const bob = Math.abs(Math.sin(t * 8)) * 2;

        // Stonewashed Denim Jeans & High Tops
        ctx.fillStyle = pal.denimHighlight;
        ctx.fillRect(-12 + w, -24, 10, 24);
        ctx.fillRect(3 - w, -24, 10, 24);
        ctx.fillStyle = pal.metalHighlight;
        ctx.fillRect(-14 + w, -5, 12, 5);
        ctx.fillRect(1 - w, -5, 12, 5);

        // Golden Yellow Muscle Tank Top
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-16, -52 + bob, 32, 28);
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(-16, -52 + bob, 4, 28);
        // Pec & Ab Definition
        ctx.fillStyle = pal.goldShadow;
        ctx.fillRect(-6, -44 + bob, 12, 2);
        ctx.fillRect(-6, -36 + bob, 12, 2);

        // Huge Muscular Biceps with Red Boxing Wraps
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(-24, -50 + bob, 9, 22);
        ctx.fillRect(15, -50 + bob, 9, 22);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(-24, -36 + bob, 9, 5);
        ctx.fillRect(15, -36 + bob, 9, 5);

        // Championship Gold Belt
        ctx.fillStyle = pal.goldHighlight;
        ctx.fillRect(-16, -26 + bob, 32, 5);
        ctx.fillStyle = pal.leatherDeep;
        ctx.fillRect(-4, -27 + bob, 8, 7);

        this.drawDukeHead(ctx, 0, -62 + bob, pal, isEnraged);
        break;
      }

      case 'punch': {
        // Heavy Haymaker Knockout Punch
        ctx.fillStyle = pal.denimHighlight;
        ctx.fillRect(-14, -24, 10, 24);
        ctx.fillRect(5, -24, 10, 24);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-14, -52, 28, 28);

        // Extended Haymaker Punch with Motion Blur
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(8, -48, 30, 11);
        ctx.fillStyle = pal.redMid;
        ctx.fillRect(28, -48, 10, 11); // Red Boxing Glove

        this.drawDukeHead(ctx, 2, -62, pal, isEnraged);
        break;
      }

      case 'ram': {
        // Bulldozer Shoulder Charge
        ctx.fillStyle = pal.denimHighlight;
        ctx.fillRect(-18, -18, 16, 18);
        ctx.fillRect(2, -18, 16, 18);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-16, -40, 32, 22);

        // Ramming Shoulder
        ctx.fillStyle = pal.skinMid;
        ctx.fillRect(14, -42, 16, 16);

        this.drawDukeHead(ctx, 12, -50, pal, isEnraged, 0.4);
        break;
      }

      case 'knockdown': {
        ctx.save();
        ctx.translate(0, -8);
        ctx.fillStyle = pal.denimHighlight;
        ctx.fillRect(-36, -8, 26, 12);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-10, -12, 34, 16);
        this.drawDukeHead(ctx, 28, -10, pal, false, Math.PI / 2);
        ctx.restore();
        break;
      }

      default: {
        ctx.fillStyle = pal.denimHighlight;
        ctx.fillRect(-12, -24, 10, 24);
        ctx.fillRect(3, -24, 10, 24);
        ctx.fillStyle = pal.goldMid;
        ctx.fillRect(-16, -52, 32, 28);
        this.drawDukeHead(ctx, 0, -62, pal, isEnraged);
        break;
      }
    }

    ctx.restore();
  }

  // Draw Duke Davis's 80s Mullet & Mirrored Shades
  drawDukeHead(ctx, x, y, pal, isEnraged = false, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Luxurious 1987 Mullet Flowing Behind
    ctx.fillStyle = pal.goldShadow;
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, -12);
    ctx.lineTo(16, 16);
    ctx.lineTo(-16, 16);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(-7, -8, 16, 16);
    ctx.fillStyle = pal.skinHighlight;
    ctx.fillRect(-7, -8, 3, 16);

    // Red Headband / Bandana
    ctx.fillStyle = pal.redMid;
    ctx.fillRect(-9, -10, 20, 6);
    ctx.fillRect(-14, -9, 6, 5); // Knot

    // Mirrored Aviator Sunglasses with Sunset Sky Reflection
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-5, -4, 7, 5);
    ctx.fillRect(3, -4, 7, 5);
    ctx.fillStyle = pal.neonCyan; // Mirror horizon reflection
    ctx.fillRect(-4, -4, 3, 2);
    ctx.fillRect(4, -4, 3, 2);

    // Rugged Stubble & Winning Grin
    ctx.fillStyle = pal.skinShadow;
    ctx.fillRect(-3, 4, 9, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, 4, 7, 1.5); // White teeth

    ctx.restore();
  }


  // =========================================================================
  // 11. THE MOTORCYCLIST (from the 1987 original, where a speeding
  // motorcyclist was a stage boss). Denim through and through: measured at
  // ΔE 17.7 minimum against every other character in the cast under
  // protanopia/deuteranopia, so he is the one enemy who cannot be confused
  // with anybody else. He does not brawl — he does drive-bys.
  // =========================================================================
  drawBiker(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    if (state === 'hurt') this.applyHurtRecoil(ctx, t);

    if (state === 'knockdown') {
      // STACKED IT! Rider down, bike on its side, front wheel still turning.
      ctx.save();
      ctx.translate(0, -6);

      // Bike on its flank
      ctx.fillStyle = pal.leatherDeep;
      ctx.beginPath();
      ctx.arc(-30, -4, 10, 0, Math.PI * 2);
      ctx.arc(-4, -4, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = pal.metalHighlight;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-30, -4, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-4, -4, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      const sp = t * 14;
      ctx.beginPath();
      ctx.moveTo(-30, -4);
      ctx.lineTo(-30 + Math.cos(sp) * 9, -4 + Math.sin(sp) * 9);
      ctx.stroke();
      ctx.fillStyle = pal.metalMid;
      ctx.fillRect(-28, -10, 24, 6);

      // Rider sprawled beyond the bike
      ctx.fillStyle = pal.denimMid;
      ctx.fillRect(4, -10, 22, 12);
      ctx.fillStyle = pal.denimShadow;
      ctx.fillRect(4, -4, 22, 4);
      ctx.fillStyle = pal.leatherDeep;
      ctx.fillRect(2, -12, 6, 5);          // boot
      ctx.fillStyle = pal.metalMid;         // helmet, visor popped
      ctx.beginPath();
      ctx.arc(32, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.neonCyan;
      ctx.fillRect(34, -11, 7, 3);
      ctx.restore();
      ctx.restore();
      return;
    }

    const charging = state === 'charging';
    const lean = charging ? -0.22 : 0;
    const wheelRot = t * (charging ? 34 : 10);

    ctx.save();
    ctx.rotate(lean);

    // Speed streaks behind him at pace
    if (charging) {
      ctx.strokeStyle = pal.metalHighlight;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const y = -14 - i * 8;
        ctx.beginPath();
        ctx.moveTo(-34 - (i % 2) * 12, y);
        ctx.lineTo(-56 - (i % 2) * 14, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Wheels — black tyre with a bright rim, so they still read as wheels
    // against dark asphalt instead of merging into it.
    ctx.fillStyle = pal.leatherDeep;
    ctx.beginPath();
    ctx.arc(-19, -10, 10, 0, Math.PI * 2);
    ctx.arc(17, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pal.metalHighlight;
    ctx.lineWidth = 2;
    for (const cx of [-19, 17]) {
      ctx.beginPath();
      ctx.arc(cx, -10, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = pal.metalMid;
      ctx.beginPath();
      ctx.arc(cx, -10, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = pal.metalMid;
    ctx.lineWidth = 1.5;
    for (const cx of [-19, 17]) {
      for (let k = 0; k < 3; k++) {
        const a = wheelRot + k * 2.1;
        ctx.beginPath();
        ctx.moveTo(cx, -10);
        ctx.lineTo(cx + Math.cos(a) * 8.5, -10 + Math.sin(a) * 8.5);
        ctx.stroke();
      }
    }

    // Frame, tank and exhaust
    ctx.fillStyle = pal.metalMid;
    ctx.fillRect(-19, -20, 36, 6);
    ctx.fillStyle = pal.denimShadow;
    ctx.fillRect(-8, -28, 20, 9);          // fuel tank
    ctx.fillStyle = pal.metalHighlight;
    ctx.fillRect(-8, -28, 20, 2);
    ctx.fillStyle = pal.metalShadow;
    ctx.fillRect(-26, -16, 10, 4);         // exhaust pipe
    ctx.fillStyle = pal.metalMid;
    ctx.fillRect(14, -34, 4, 10);          // fork
    ctx.fillRect(10, -36, 14, 3);          // handlebars

    // Rider — denim jeans and vest
    ctx.fillStyle = pal.denimMid;
    ctx.fillRect(-8, -40, 9, 16);          // leg
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-9, -26, 10, 5);          // boot on the peg
    ctx.fillStyle = pal.denimMid;
    ctx.fillRect(-9, -56, 20, 18);         // torso
    ctx.fillStyle = pal.denimHighlight;
    ctx.fillRect(-9, -56, 20, 4);          // shoulder light
    ctx.fillStyle = pal.denimShadow;
    ctx.fillRect(-2, -56, 3, 18);          // vest seam
    ctx.fillStyle = pal.denimMid;
    ctx.fillRect(6, -50, 14, 5);           // arm out to the bars

    // Helmet with a cyan visor
    ctx.fillStyle = pal.metalMid;
    ctx.beginPath();
    ctx.arc(3, -62, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.metalHighlight;
    ctx.beginPath();
    ctx.arc(1, -65, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.neonCyan;
    ctx.fillRect(7, -64, 7, 4);

    ctx.restore();
    ctx.restore();
  }

  // A flinch, applied as a transform rather than seven hand-drawn poses so every
  // character recoils identically: rock back off the hit, sink slightly, and
  // shudder. Call immediately after ctx.scale(facing, 1); the existing artwork
  // then draws leaning. Alien and Punk keep their own authored hurt frames.
  applyHurtRecoil(ctx, t) {
    const shudder = Math.sin((t || 0) * 40) * 1.4;
    ctx.rotate(-0.15);
    ctx.translate(-6 + shudder, 3);
  }

  // =========================================================================
  // 10. THE TRENCH-COAT DWARF (NON-COMBATANT — from the 1987 original)
  // In Bop'n Rumble a dwarf in a trench coat lobbed you a heart to top up your
  // energy; on later levels he lobbed a bomb instead. He is deliberately NOT
  // enemy-shaped: half height, khaki coat, and a cyan hatband nobody else wears,
  // so he reads as "not a threat" at a glance even mid-brawl.
  // =========================================================================
  drawDwarf(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const pal = this.pal;
    const t = animTimer || 0;

    const waddle = Math.sin(t * 9) * 2;      // short-legged waddle
    const throwArm = state === 'throw' ? Math.min(1, (t % 1) * 3) : 0;

    // Stubby legs below the coat hem
    ctx.fillStyle = pal.leatherShadow;
    ctx.fillRect(-6, -8 + waddle * 0.4, 4, 8);
    ctx.fillRect(2, -8 - waddle * 0.4, 4, 8);
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-7, -2 + waddle * 0.4, 6, 3);   // shoes
    ctx.fillRect(1, -2 - waddle * 0.4, 6, 3);

    // Khaki trench coat — long, boxy, past the knees
    ctx.fillStyle = pal.goldShadow;
    ctx.fillRect(-9, -30, 18, 23);
    ctx.fillStyle = pal.goldMid;
    ctx.fillRect(-9, -30, 18, 4);                // shoulder highlight
    ctx.fillStyle = pal.bronzeShadow;
    ctx.fillRect(-1, -30, 2, 23);                // centre seam
    ctx.fillRect(-9, -14, 18, 2);                // belt
    ctx.fillStyle = pal.goldHighlight;
    ctx.fillRect(-8, -13, 4, 2);                 // buckle glint

    // Throwing arm — swings up when lobbing
    ctx.fillStyle = pal.goldShadow;
    ctx.save();
    ctx.translate(7, -26);
    ctx.rotate(-throwArm * 2.1);
    ctx.fillRect(0, -2, 9, 5);
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(8, -2, 4, 5);                   // hand
    ctx.restore();

    // Head + fedora with the cyan band
    ctx.fillStyle = pal.skinMid;
    ctx.fillRect(-5, -38, 10, 9);
    ctx.fillStyle = pal.skinShadow;
    ctx.fillRect(-5, -31, 10, 2);                // jaw shadow
    ctx.fillStyle = pal.leatherDeep;
    ctx.fillRect(-9, -41, 18, 3);                // brim
    ctx.fillRect(-6, -46, 12, 5);                // crown
    ctx.fillStyle = pal.neonCyan;
    ctx.fillRect(-6, -42, 12, 2);                // hatband — his tell

    ctx.restore();
  }

  // The lobbed bomb: black sphere, lit fuse, flashes faster as the fuse burns.
  // `urgency` runs 0 -> 1 across the fuse; `defusable` draws the prompt ring.
  drawBomb(ctx, animTimer, urgency = 0, defusable = false) {
    ctx.save();
    const pal = this.pal;
    const t = animTimer || 0;

    if (defusable) {
      ctx.strokeStyle = pal.neonGreen;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5 + Math.sin(t * 10) * 0.3;
      ctx.beginPath();
      ctx.arc(0, -7, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Body — flashes toward red as the fuse runs down
    const hot = Math.sin(t * (6 + urgency * 26)) > 0;
    ctx.fillStyle = hot && urgency > 0.25 ? pal.redMid : pal.leatherDeep;
    ctx.beginPath();
    ctx.arc(0, -7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.leatherHighlight;
    ctx.beginPath();
    ctx.arc(-2.5, -9.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Fuse + spark
    ctx.strokeStyle = pal.bronzeShadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(3, -13);
    ctx.quadraticCurveTo(7, -18, 4, -21);
    ctx.stroke();
    ctx.fillStyle = Math.sin(t * 22) > 0 ? pal.goldHighlight : pal.neonOrange;
    ctx.beginPath();
    ctx.arc(4, -22, 2 + urgency * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Global Sprite Renderer Instance
window.spriteRenderer = new SpriteRenderer();
