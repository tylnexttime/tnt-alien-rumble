/**
 * TNT ALIEN RUMBLE - VECTOR & RETRO SPRITE RENDERER
 * High-detail procedural vector sprite renderer for all characters,
 * styled in authentic Commodore 64 colors with fluid multi-frame animations.
 */

class SpriteRenderer {
  constructor() {
    this.c64 = {
      black: '#000000',
      white: '#ffffff',
      red: '#880000',
      cyan: '#aaffee',
      purple: '#cc44cc',
      green: '#00cc55',
      blue: '#0000aa',
      yellow: '#eeee77',
      orange: '#dd8855',
      brown: '#664400',
      lightRed: '#ff7777',
      darkGrey: '#333333',
      grey: '#777777',
      lightGreen: '#aaff66',
      lightBlue: '#0088ff',
      lightGrey: '#bbbbbb',
      skinAlien: '#a4b2bc',
      skinAlienDark: '#6d7f8d',
      skinHuman: '#e0a97c',
      skinHumanDark: '#b87b4b'
    };
  }

  // ==========================================
  // 1. GLEEP-GLORP (ALIEN PROTAGONIST)
  // ==========================================
  drawAlien(ctx, state, facing, animTimer, options = {}) {
    ctx.save();
    ctx.scale(facing, 1);

    const c = this.c64;
    const t = animTimer || 0;

    // Flash white when receiving damage / invulnerable
    if (options.isInvulnerable && Math.floor(t * 10) % 2 === 0) {
      ctx.fillStyle = '#ffffff';
    }

    switch (state) {
      case 'idle': {
        const bob = Math.sin(t * 4) * 2;
        // Shadow / Feet
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-8, -4, 6, 4);
        ctx.fillRect(2, -4, 6, 4);

        // Skinny Legs
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6, -18, 3, 14);
        ctx.fillRect(3, -18, 3, 14);

        // Spindly Torso
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-5, -34 + bob, 10, 16);
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-2, -30 + bob, 4, 10); // rib shading

        // Spindly Arms
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-9, -32 + bob, 3, 12);
        ctx.fillRect(6, -32 + bob, 3, 12);

        // Giant Bulbous Gray Alien Head
        this.drawAlienHead(ctx, 0, -48 + bob, 0);
        break;
      }

      case 'walk': {
        const walkCycle = Math.sin(t * 10);
        const leg1 = walkCycle * 8;
        const leg2 = -walkCycle * 8;
        const bob = Math.abs(Math.sin(t * 10)) * 2;

        // Legs
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6 + leg1 * 0.5, -18, 3, 18);
        ctx.fillRect(3 + leg2 * 0.5, -18, 3, 18);

        // Feet
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-8 + leg1, -3, 6, 4);
        ctx.fillRect(2 + leg2, -3, 6, 4);

        // Torso
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-5, -34 + bob, 10, 16);

        // Arms swinging
        ctx.fillRect(-9 - leg1 * 0.6, -32 + bob, 3, 12);
        ctx.fillRect(6 - leg2 * 0.6, -32 + bob, 3, 12);

        // Head
        this.drawAlienHead(ctx, 0, -48 + bob, walkCycle * 0.05);
        break;
      }

      case 'jab': {
        // Quick 1-2 skinny punch
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6, -18, 4, 18);
        ctx.fillRect(2, -18, 4, 18);
        ctx.fillRect(-5, -34, 10, 16);

        // Back arm tucked
        ctx.fillRect(-9, -30, 4, 8);
        // Punching extended arm
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(4, -30, 24, 4);
        // Gray Alien Fist
        ctx.fillStyle = c.skinAlienDark;
        ctx.beginPath();
        ctx.arc(28, -28, 5, 0, Math.PI * 2);
        ctx.fill();

        this.drawAlienHead(ctx, 2, -48, 0.1);
        break;
      }

      case 'headbutt': {
        // Rubber Stretchy Headbutt (The iconic Bop!)
        const stretch = options.progress !== undefined ? Math.sin(options.progress * Math.PI) * 28 : 22;

        // Planted stance
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-10, -16, 4, 16);
        ctx.fillRect(0, -16, 4, 16);

        // Leaning Torso
        ctx.save();
        ctx.translate(-4, -28);
        ctx.rotate(0.3);
        ctx.fillRect(0, 0, 10, 16);
        ctx.restore();

        // Stretched rubber neck
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(0, -40, stretch, 6);

        // Head shooting forward
        this.drawAlienHead(ctx, stretch + 6, -42, 0.4);

        // Impact spark trail
        ctx.fillStyle = c.cyan;
        ctx.fillRect(stretch - 4, -44, 3, 3);
        ctx.fillRect(stretch - 10, -38, 4, 4);
        break;
      }

      case 'trip': {
        // Low Trip / Shin Grab (fondling ankles)
        ctx.fillStyle = c.skinAlien;
        // Crouched legs
        ctx.fillRect(-12, -8, 12, 6);
        ctx.fillRect(2, -8, 10, 6);

        // Low Torso
        ctx.fillRect(-8, -18, 12, 10);

        // Extended arms grabbing ground
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(4, -12, 22, 4);
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(26, -14, 6, 6);

        this.drawAlienHead(ctx, 4, -26, 0.2);
        break;
      }

      case 'bulldozer': {
        // Bull Ram / Bulldozer rocket dash
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-16, -12, 12, 6);
        ctx.fillRect(-4, -12, 12, 6);

        // Horizontal Torso
        ctx.fillRect(-14, -22, 18, 10);

        // Arms tucked back like speed skater
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-22, -26, 12, 4);

        // Lowered Alien Skull Ram
        this.drawAlienHead(ctx, 12, -24, 0.65);

        // Ram speed lines
        ctx.fillStyle = c.cyan;
        ctx.fillRect(-30, -22, 12, 2);
        ctx.fillRect(-26, -16, 8, 2);
        ctx.fillRect(-34, -28, 14, 2);
        break;
      }

      case 'ear_twist': {
        // Ear Twist / Cheek Pinch
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6, -18, 4, 18);
        ctx.fillRect(2, -18, 4, 18);
        ctx.fillRect(-5, -34, 10, 16);

        // Two spindly arms grabbing opponent's ears
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(4, -36, 18, 3);
        ctx.fillRect(4, -26, 18, 3);
        // Hands twisting
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(22, -38, 5, 5);
        ctx.fillRect(22, -28, 5, 5);

        this.drawAlienHead(ctx, 0, -48, -0.1);
        break;
      }

      case 'belly_flop': {
        // Flying Belly Flop (splayed out in mid air)
        ctx.save();
        ctx.rotate(0.3);
        // Wide wobbly belly
        ctx.fillStyle = c.skinAlien;
        ctx.beginPath();
        ctx.ellipse(0, -25, 14, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms and legs splayed
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-18, -32, 6, 4);
        ctx.fillRect(12, -32, 6, 4);
        ctx.fillRect(-18, -18, 6, 4);
        ctx.fillRect(12, -18, 6, 4);

        this.drawAlienHead(ctx, 0, -38, 0);
        ctx.restore();
        break;
      }

      case 'roundhouse': {
        // Flying Dropkick / Roundhouse
        ctx.save();
        ctx.rotate(-0.4);
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-8, -25, 10, 14);

        // Extended double legs
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(4, -26, 26, 6);
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(28, -28, 8, 8); // Feet impact

        this.drawAlienHead(ctx, -14, -36, -0.3);
        ctx.restore();
        break;
      }

      case 'macho_elbow': {
        // Descending Macho Elbow
        ctx.save();
        ctx.rotate(0.5);
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6, -30, 10, 14);

        // Pointed Sharp Alien Elbow
        ctx.fillStyle = c.skinAlienDark;
        ctx.beginPath();
        ctx.moveTo(6, -26);
        ctx.lineTo(22, -12);
        ctx.lineTo(14, -6);
        ctx.closePath();
        ctx.fill();

        this.drawAlienHead(ctx, -4, -42, 0.2);
        ctx.restore();
        break;
      }

      case 'donkey_kick': {
        // Mule Back Kick
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(2, -18, 4, 18);
        ctx.fillRect(-4, -30, 10, 14);

        // Back leg kicking backwards hard
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-26, -24, 22, 5);
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-30, -26, 6, 7);

        this.drawAlienHead(ctx, 4, -44, 0.2);
        break;
      }

      case 'taunt': {
        // Alien Taunt (Wiggling antennae & hips)
        const wiggle = Math.sin(t * 18) * 4;
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-6, -18, 4, 18);
        ctx.fillRect(2, -18, 4, 18);

        // Wiggling hips
        ctx.fillRect(-6 + wiggle, -34, 12, 16);

        // Hands on hips
        ctx.fillRect(-10 + wiggle, -30, 4, 8);
        ctx.fillRect(6 + wiggle, -30, 4, 8);

        this.drawAlienHead(ctx, -wiggle * 0.5, -48, wiggle * 0.08, true);
        break;
      }

      case 'hurt': {
        // Recoil / Knockback
        ctx.save();
        ctx.rotate(-0.35);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-6, -18, 4, 18);
        ctx.fillRect(2, -18, 4, 18);
        ctx.fillRect(-6, -34, 10, 16);

        this.drawAlienHead(ctx, -4, -48, -0.4);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Flat on ground
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = c.skinAlienDark;
        ctx.fillRect(-24, -4, 48, 8);
        this.drawAlienHead(ctx, -26, -12, -Math.PI / 2);
        ctx.restore();
        break;
      }

      case 'victory': {
        // Alien Breakdance / Victory pose
        const dance = Math.sin(t * 12) * 6;
        ctx.fillStyle = c.skinAlien;
        ctx.fillRect(-8, -18 + Math.abs(dance), 4, 18);
        ctx.fillRect(4, -18 - Math.abs(dance), 4, 18);
        ctx.fillRect(-6, -34, 12, 16);

        // Arms raised in V
        ctx.fillRect(-14, -46, 4, 14);
        ctx.fillRect(10, -46, 4, 14);

        this.drawAlienHead(ctx, dance * 0.3, -48, dance * 0.05, true);
        break;
      }
    }

    ctx.restore();
  }

  // Draw Gleep-Glorp's classic bulbous head with glossy almond eyes
  drawAlienHead(ctx, x, y, angle = 0, isGlow = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const c = this.c64;

    // Giant Cranium Ellipse
    ctx.fillStyle = isGlow ? c.lightGreen : c.skinAlien;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle head gradient / highlight
    ctx.fillStyle = c.white;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(-3, -8, 5, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Chin taper
    ctx.fillStyle = isGlow ? c.lightGreen : c.skinAlienDark;
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(8, 8);
    ctx.lineTo(0, 18);
    ctx.closePath();
    ctx.fill();

    // Glossy Black Almond Eyes
    ctx.fillStyle = c.black;
    // Left eye
    ctx.beginPath();
    ctx.ellipse(-6, 2, 4.5, 7.5, -0.35, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.ellipse(6, 2, 4.5, 7.5, 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Eye Glints
    ctx.fillStyle = c.white;
    ctx.beginPath();
    ctx.arc(-7, 0, 1.5, 0, Math.PI * 2);
    ctx.arc(5, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Tiny alien nostril slits & mouth
    ctx.fillStyle = c.skinAlienDark;
    ctx.fillRect(-2, 10, 1.5, 1.5);
    ctx.fillRect(1, 10, 1.5, 1.5);
    ctx.fillRect(-3, 14, 6, 1);

    ctx.restore();
  }

  // ==========================================
  // 2. MOHAWK STREET PUNK (ENEMY)
  // ==========================================
  drawPunk(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'walk': {
        const walk = Math.sin(t * 8) * 6;
        // Torn Jeans
        ctx.fillStyle = c.blue;
        ctx.fillRect(-8 + walk, -18, 6, 18);
        ctx.fillRect(2 - walk, -18, 6, 18);
        // Boots
        ctx.fillStyle = c.darkGrey;
        ctx.fillRect(-10 + walk, -3, 8, 4);
        ctx.fillRect(0 - walk, -3, 8, 4);

        // Leather Studded Jacket
        ctx.fillStyle = c.black;
        ctx.fillRect(-8, -38, 16, 20);
        // Belt with skull
        ctx.fillStyle = c.white;
        ctx.fillRect(-2, -20, 4, 3);

        // Swagger Arms with Switchblade
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(6, -34, 12, 5);
        ctx.fillStyle = c.cyan; // Blade
        ctx.fillRect(18, -33, 8, 2);

        // Punk Head with Red Mohawk
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -50, 11, 12);
        ctx.fillStyle = c.red; // Mohawk
        ctx.fillRect(-2, -58, 5, 8);
        // Sunglasses
        ctx.fillStyle = c.black;
        ctx.fillRect(0, -46, 7, 3);
        break;
      }

      case 'attack': {
        // Knife stab lunge
        ctx.fillStyle = c.blue;
        ctx.fillRect(-10, -18, 6, 18);
        ctx.fillRect(4, -18, 6, 18);
        ctx.fillStyle = c.black;
        ctx.fillRect(-8, -38, 16, 20);

        // Lunge arm with blade
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(6, -34, 18, 5);
        ctx.fillStyle = c.cyan;
        ctx.fillRect(24, -34, 12, 3);

        // Head
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-2, -50, 11, 12);
        ctx.fillStyle = c.red;
        ctx.fillRect(1, -58, 5, 8);
        break;
      }

      case 'dropkick': {
        // Horizontal Mid-Air Flying Dropkick
        ctx.save();
        ctx.rotate(-0.3);
        ctx.fillStyle = c.black;
        ctx.fillRect(-16, -26, 18, 14); // Torso

        // Extended double kicking legs
        ctx.fillStyle = c.blue;
        ctx.fillRect(2, -22, 22, 7);
        ctx.fillStyle = c.darkGrey;
        ctx.fillRect(24, -24, 8, 9); // Boots out

        // Head & flying mohawk
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-26, -32, 10, 10);
        ctx.fillStyle = c.red;
        ctx.fillRect(-32, -36, 12, 6);
        ctx.restore();
        break;
      }

      case 'hurt': {
        ctx.save();
        ctx.rotate(-0.35);
        ctx.fillStyle = c.blue;
        ctx.fillRect(-6, -18, 6, 18);
        ctx.fillRect(2, -18, 6, 18);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-8, -38, 16, 20);
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -50, 11, 12);
        ctx.fillStyle = c.red;
        ctx.fillRect(-2, -58, 5, 8);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Horizontal Defeated Punk Flat on Asphalt
        ctx.save();
        ctx.translate(0, -6);
        // Boots
        ctx.fillStyle = c.darkGrey;
        ctx.fillRect(-32, -4, 10, 8);
        // Torn Jeans
        ctx.fillStyle = c.blue;
        ctx.fillRect(-24, -5, 20, 9);
        // Studded Leather Jacket
        ctx.fillStyle = c.black;
        ctx.fillRect(-6, -8, 22, 13);
        ctx.fillStyle = c.white; // Studs
        ctx.fillRect(-4, -6, 3, 3);
        ctx.fillRect(4, -6, 3, 3);
        // Head & Mohawk Flat
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(16, -10, 12, 11);
        ctx.fillStyle = c.red; // Mohawk touching floor
        ctx.fillRect(18, -16, 14, 6);
        // Shades Knocked Crooked
        ctx.fillStyle = c.black;
        ctx.fillRect(26, -4, 6, 4);
        ctx.restore();
        break;
      }

      default: {
        // Idle
        ctx.fillStyle = c.blue;
        ctx.fillRect(-6, -18, 5, 18);
        ctx.fillRect(2, -18, 5, 18);
        ctx.fillStyle = c.black;
        ctx.fillRect(-8, -38, 16, 20);
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -50, 11, 12);
        ctx.fillStyle = c.red;
        ctx.fillRect(-2, -58, 5, 8);
        ctx.fillStyle = c.black;
        ctx.fillRect(0, -46, 7, 3);
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 3. HANDBAG GRANNY AGNES (ENEMY)
  // ==========================================
  drawGranny(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'walk': {
        const w = Math.sin(t * 6) * 4;
        // Slippers
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8 + w, -3, 6, 3);
        ctx.fillRect(2 - w, -3, 6, 3);

        // Floral Dress
        ctx.fillStyle = c.lightRed;
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        ctx.lineTo(10, -18);
        ctx.lineTo(14, -4);
        ctx.lineTo(-14, -4);
        ctx.closePath();
        ctx.fill();

        // Upper Cardigan
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -36, 16, 18);

        // Massive Heavy Handbag Swing
        ctx.fillStyle = c.brown;
        ctx.fillRect(8, -28 + w * 2, 12, 14);
        ctx.fillStyle = c.yellow; // Clasp
        ctx.fillRect(12, -30 + w * 2, 4, 3);

        // Granny Head with Curlers
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -48, 11, 12);
        ctx.fillStyle = c.lightGrey; // Curly hair
        ctx.fillRect(-8, -52, 16, 6);
        ctx.fillStyle = c.cyan; // Curlers
        ctx.fillRect(-7, -54, 4, 4);
        ctx.fillRect(2, -54, 4, 4);

        // Cat-eye Glasses
        ctx.fillStyle = c.black;
        ctx.fillRect(0, -44, 7, 3);
        break;
      }

      case 'attack': {
        // Windup & Heavy Handbag Smash
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-12, -18, 24, 15);
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -36, 16, 18);

        // Massive Overhead Handbag Swing
        ctx.fillStyle = c.brown;
        ctx.fillRect(14, -40, 16, 18);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(20, -43, 6, 4);

        // Granny Head
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-2, -48, 11, 12);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(-5, -52, 16, 6);
        break;
      }

      case 'throw_purse': {
        // Hurl Handbag Forward
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -18, 20, 15);
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -36, 16, 18);

        // Arm reaching far out in throwing pose
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(6, -34, 16, 5);

        // Granny Head
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-3, -48, 11, 12);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(-6, -52, 16, 6);
        break;
      }

      case 'helicopter': {
        // Helicopter Handbag Flight (Spinning handbag overhead like rotors)
        const rotorAngle = t * 35;
        const rotorSpan = Math.sin(rotorAngle) * 28;

        // Fluttering Floral Dress in downdraft
        const flutter = Math.sin(t * 20) * 3;
        ctx.fillStyle = c.lightRed;
        ctx.beginPath();
        ctx.moveTo(-10, -18);
        ctx.lineTo(10, -18);
        ctx.lineTo(12 + flutter, -2);
        ctx.lineTo(-12 - flutter, -2);
        ctx.closePath();
        ctx.fill();

        // Purple Slippers Dangling
        ctx.fillStyle = c.purple;
        ctx.fillRect(-6, -2, 5, 5);
        ctx.fillRect(2, -2, 5, 5);

        // Cardigan
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -34, 16, 16);

        // Arms stretched straight UP holding handbag handle
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-6, -48, 4, 16);
        ctx.fillRect(2, -48, 4, 16);

        // Granny Head Looking Up
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-4, -42, 10, 10);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(-6, -46, 14, 5);
        ctx.fillStyle = c.black;
        ctx.fillRect(0, -40, 6, 2);

        // Spinning Handbag Blades (Rotor Disc Blur)
        ctx.fillStyle = c.brown;
        ctx.fillRect(-rotorSpan, -56, rotorSpan * 2, 4);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-3, -58, 6, 6); // Rotor center hub
        // Motion blur ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, -56, 26, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'hurt': {
        ctx.save();
        ctx.rotate(-0.35);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -18, 20, 15);
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -36, 16, 18);
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -48, 11, 12);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(-8, -52, 16, 6);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Horizontal Defeated Granny Flat on Back
        ctx.save();
        ctx.translate(0, -6);
        // Purple Slippers
        ctx.fillStyle = c.purple;
        ctx.fillRect(-30, -5, 8, 6);
        // Floral Dress Sprawled
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-24, -7, 24, 11);
        // Purple Cardigan
        ctx.fillStyle = c.purple;
        ctx.fillRect(-2, -9, 18, 13);
        // Granny Head & Curlers
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(16, -11, 12, 12);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(16, -16, 14, 6);
        ctx.fillStyle = c.cyan;
        ctx.fillRect(22, -19, 4, 4);
        ctx.fillRect(30, -14, 4, 4);
        // Open Handbag Spilled on Floor
        ctx.fillStyle = c.brown;
        ctx.fillRect(6, 1, 12, 9);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(20, 3, 3, 3);
        ctx.fillRect(25, 4, 3, 3);
        ctx.restore();
        break;
      }

      default: {
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -18, 20, 15);
        ctx.fillStyle = c.purple;
        ctx.fillRect(-8, -36, 16, 18);
        ctx.fillStyle = c.brown;
        ctx.fillRect(8, -26, 12, 14);
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-5, -48, 11, 12);
        ctx.fillStyle = c.lightGrey;
        ctx.fillRect(-8, -52, 16, 6);
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 4. ATTACK POODLE / PITBULL (ENEMY)
  // ==========================================
  drawDog(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'attack':
      case 'leap': {
        // Leaping Ankle Strike
        ctx.save();
        ctx.rotate(-0.25);
        // Body
        ctx.fillStyle = c.white;
        ctx.fillRect(-16, -16, 24, 10);
        ctx.fillStyle = c.lightGrey;
        ctx.beginPath();
        ctx.arc(-16, -12, 6, 0, Math.PI * 2);
        ctx.arc(8, -12, 7, 0, Math.PI * 2);
        ctx.fill();

        // Front paws lunging forward
        ctx.fillStyle = c.white;
        ctx.fillRect(10, -10, 10, 4);
        ctx.fillRect(10, -5, 10, 4);
        // Back legs extended
        ctx.fillRect(-22, -12, 8, 4);

        // Head Snarl wide open with fangs
        ctx.fillStyle = c.white;
        ctx.fillRect(12, -24, 12, 12);
        ctx.fillStyle = c.lightRed; // Bow
        ctx.fillRect(14, -28, 6, 4);
        ctx.fillStyle = c.red; // Open mouth
        ctx.fillRect(20, -18, 6, 6);
        ctx.fillStyle = c.white; // Sharp fangs
        ctx.fillRect(20, -18, 2, 2);
        ctx.fillRect(24, -14, 2, 2);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Horizontal Defeated Poodle (4 Paws in the Air)
        ctx.save();
        ctx.translate(0, -6);
        // Fluffy Body Flat on Side
        ctx.fillStyle = c.white;
        ctx.fillRect(-16, -6, 26, 9);
        ctx.fillStyle = c.lightGrey;
        ctx.beginPath();
        ctx.arc(-14, -2, 6, 0, Math.PI * 2);
        ctx.arc(6, -2, 6, 0, Math.PI * 2);
        ctx.fill();

        // 4 Paws Pointing Up In The Air
        ctx.fillStyle = c.white;
        ctx.fillRect(-12, -16, 3, 10);
        ctx.fillRect(-6, -16, 3, 10);
        ctx.fillRect(2, -16, 3, 10);
        ctx.fillRect(8, -16, 3, 10);

        // Head on ground with lolling tongue
        ctx.fillStyle = c.white;
        ctx.fillRect(10, -8, 10, 10);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(20, -4, 5, 3);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(12, 0, 5, 4);
        ctx.restore();
        break;
      }

      default: {
        const run = Math.sin(t * 14) * 8;

        // Body
        ctx.fillStyle = c.white;
        ctx.fillRect(-14, -14, 22, 10);

        // Fluffy Poodle Puffs
        ctx.fillStyle = c.lightGrey;
        ctx.beginPath();
        ctx.arc(-14, -10, 6, 0, Math.PI * 2);
        ctx.arc(8, -12, 7, 0, Math.PI * 2);
        ctx.fill();

        // 4 Running Legs
        ctx.fillStyle = c.white;
        ctx.fillRect(-12 + run, -8, 3, 8);
        ctx.fillRect(-6 - run, -8, 3, 8);
        ctx.fillRect(4 + run, -8, 3, 8);
        ctx.fillRect(10 - run, -8, 3, 8);

        // Tail with puff
        ctx.fillStyle = c.white;
        ctx.fillRect(-18, -18, 3, 8);
        ctx.fillStyle = c.lightGrey;
        ctx.beginPath();
        ctx.arc(-18, -20, 4, 0, Math.PI * 2);
        ctx.fill();

        // Head with Snarl & Pink Bow
        ctx.fillStyle = c.white;
        ctx.fillRect(10, -22, 10, 12);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(12, -26, 6, 4);

        // Snout with teeth
        ctx.fillStyle = c.black;
        ctx.fillRect(18, -16, 5, 4);
        ctx.fillStyle = c.white;
        ctx.fillRect(18, -12, 2, 2);
        ctx.fillRect(21, -12, 2, 2);
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 5. BASKETBALL HOOP DUDE (ENEMY - TOWERING C64 SPRITE)
  // ==========================================
  drawBasketballer(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'throw_ball': {
        // High Overhead Chest/Two-Hand Pass Throw
        // Long skinny legs
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-7, -42, 5, 38);
        ctx.fillRect(2, -42, 5, 38);
        // High-top sneakers
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-9, -6, 9, 6);
        ctx.fillRect(1, -6, 9, 6);
        // Basketball Shorts
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -50, 20, 16);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-10, -36, 20, 2);

        // Tall Torso in Jersey #23
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-9, -74, 18, 26);
        ctx.fillStyle = c.white;
        ctx.font = 'bold 9px monospace';
        ctx.fillText('23', -6, -56);

        // Two long arms extended forward launching ball
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(4, -72, 22, 5);
        ctx.fillRect(4, -64, 22, 5);

        // Tall Head with Afro & High Profile Face
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-6, -88, 12, 16);
        // Profile Nose & Jaw
        ctx.fillRect(6, -84, 5, 6);
        ctx.fillRect(6, -78, 4, 4);
        // Tall Black Hair / Afro
        ctx.fillStyle = c.black;
        ctx.fillRect(-9, -96, 17, 10);
        ctx.fillRect(-9, -88, 5, 10);
        // White Sweatband
        ctx.fillStyle = c.white;
        ctx.fillRect(-7, -90, 14, 3);
        break;
      }

      case 'attack': {
        // Towering Dunk Slam / High Elbow Check
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-9, -42, 5, 38);
        ctx.fillRect(4, -42, 5, 38);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-11, -6, 9, 6);
        ctx.fillRect(3, -6, 9, 6);

        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -50, 20, 16);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-9, -74, 18, 26);

        // Massive Overhand Dunk Smash
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(6, -78, 22, 10);

        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-4, -88, 12, 16);
        ctx.fillRect(8, -84, 5, 6);
        ctx.fillStyle = c.black;
        ctx.fillRect(-7, -96, 17, 10);
        ctx.fillStyle = c.white;
        ctx.fillRect(-5, -90, 14, 3);
        break;
      }

      case 'knockdown': {
        // Horizontal Defeated Tall Basketballer Flat on Ground
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-46, -6, 12, 8); // High sneakers
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-34, -7, 24, 6); // Long legs
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-10, -9, 18, 12); // Shorts
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(8, -11, 26, 14); // Tall Jersey #23
        ctx.fillStyle = c.white;
        ctx.font = '8px monospace';
        ctx.fillText('23', 14, -1);
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(34, -13, 14, 13);
        ctx.fillStyle = c.black;
        ctx.fillRect(36, -20, 14, 9);
        // Deflated Basketball
        ctx.fillStyle = c.orange;
        ctx.beginPath();
        ctx.ellipse(54, -2, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = c.black;
        ctx.stroke();
        ctx.restore();
        break;
      }

      default: {
        // Walking while actively dribbling basketball (Towering gangly C64 proportion)
        const walk = Math.sin(t * 8) * 8;
        const bounce = Math.abs(Math.sin(t * 10)) * 18;
        const armY = Math.sin(t * 10) * 6;

        // Long Skinny Legs
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-7 + walk, -42, 5, 38);
        ctx.fillRect(2 - walk, -42, 5, 38);

        // High-Top Sneakers
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-9 + walk, -6, 9, 6);
        ctx.fillRect(0 - walk, -6, 9, 6);

        // High-Waisted Shorts
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-9, -50, 18, 16);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-9, -36, 18, 2);

        // Tall Slender Jersey #23
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-8, -74, 16, 26);
        ctx.fillStyle = c.white;
        ctx.font = 'bold 9px monospace';
        ctx.fillText('23', -6, -56);

        // Long Dribbling Arm
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(6, -68 + armY, 6, 24);

        // Bouncing Basketball on pavement
        ctx.fillStyle = c.orange;
        ctx.beginPath();
        ctx.arc(16, -6 - bounce, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = c.black;
        ctx.stroke();

        // Tall Head with Afro & High Profile Face (Matching C64 original!)
        ctx.fillStyle = c.skinHumanDark;
        ctx.fillRect(-5, -88, 11, 16);
        ctx.fillRect(6, -84, 5, 6); // Nose
        ctx.fillRect(6, -78, 4, 4); // Mouth
        ctx.fillStyle = c.black;
        ctx.fillRect(-8, -96, 16, 10);
        ctx.fillRect(-8, -88, 5, 10);
        ctx.fillStyle = c.white;
        ctx.fillRect(-6, -90, 13, 3);
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 6. BRUTUS THE BOUNCER (HEAVY ENEMY)
  // ==========================================
  drawBouncer(ctx, state, facing, animTimer) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'charge_tackle': {
        // Bulldozer Charging Belly Tackle / Headbutt Rush
        ctx.save();
        ctx.rotate(0.2);
        // Sturdy Legs
        ctx.fillStyle = c.blue;
        ctx.fillRect(-16, -20, 12, 20);
        ctx.fillRect(2, -20, 12, 20);

        // Stout Belly in Checkered Flannel Shirt
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-16, -46, 36, 28);
        // Checkered Grid Pattern
        ctx.fillStyle = c.blue;
        ctx.fillRect(-16, -42, 36, 3);
        ctx.fillRect(-16, -34, 36, 3);
        ctx.fillRect(-16, -26, 36, 3);
        ctx.fillRect(-8, -46, 3, 28);
        ctx.fillRect(4, -46, 3, 28);
        ctx.fillRect(14, -46, 3, 28);

        // Lowered Head Charging Forward
        ctx.fillStyle = c.skinHuman;
        ctx.beginPath();
        ctx.arc(18, -46, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.black;
        ctx.fillRect(16, -48, 10, 3); // Sunglasses
        ctx.restore();
        break;
      }

      case 'attack':
      case 'ground_pound': {
        // Double Fists Raised Overhead for Ground Smash
        ctx.fillStyle = c.blue;
        ctx.fillRect(-14, -22, 12, 22);
        ctx.fillRect(2, -22, 12, 22);

        // Checkered Torso
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-18, -48, 36, 28);
        ctx.fillStyle = c.blue;
        ctx.fillRect(-18, -42, 36, 3);
        ctx.fillRect(-18, -34, 36, 3);
        ctx.fillRect(-10, -48, 3, 28);
        ctx.fillRect(2, -48, 3, 28);

        // Massive Double Fists Slamming Down
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(10, -56, 14, 18);
        ctx.fillRect(12, -40, 14, 14);

        ctx.fillStyle = c.skinHuman;
        ctx.beginPath();
        ctx.arc(0, -56, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.black;
        ctx.fillRect(-5, -57, 10, 3);
        break;
      }

      case 'knockdown': {
        // Massive Horizontal Defeated Brawler
        ctx.save();
        ctx.translate(0, -6);
        ctx.fillStyle = c.blue;
        ctx.fillRect(-38, -6, 12, 10);
        ctx.fillRect(-28, -8, 22, 14);
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-8, -12, 34, 18);
        ctx.fillStyle = c.blue;
        ctx.fillRect(-8, -7, 34, 3);
        ctx.fillRect(4, -12, 3, 18);
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(8, 4, 18, 8);
        ctx.fillStyle = c.skinHuman;
        ctx.beginPath();
        ctx.arc(28, -6, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.black;
        ctx.fillRect(24, -8, 10, 3);
        ctx.restore();
        break;
      }

      default: {
        // Walking Swagger (Stout belly in checkered shirt)
        const w = Math.sin(t * 6) * 4;
        ctx.fillStyle = c.blue;
        ctx.fillRect(-12 + w, -22, 10, 22);
        ctx.fillRect(2 - w, -22, 10, 22);

        // Checkered Flannel Shirt
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-16, -48, 32, 28);
        ctx.fillStyle = c.blue;
        ctx.fillRect(-16, -42, 32, 3);
        ctx.fillRect(-16, -34, 32, 3);
        ctx.fillRect(-8, -48, 3, 28);
        ctx.fillRect(2, -48, 3, 28);

        // Muscular Arms
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-22, -46, 8, 18);
        ctx.fillRect(14, -46, 8, 18);

        // Bald Head with Sunglasses
        ctx.fillStyle = c.skinHuman;
        ctx.beginPath();
        ctx.arc(0, -56, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = c.black;
        ctx.fillRect(-5, -57, 10, 3);
        ctx.fillRect(-3, -50, 6, 4);
        break;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 7. DUKE DAVIS - FINAL BOSS (1987 BRAWLER)
  // ==========================================
  drawDukeBoss(ctx, state, facing, animTimer, options = {}) {
    ctx.save();
    ctx.scale(facing, 1);
    const c = this.c64;
    const t = animTimer || 0;

    switch (state) {
      case 'idle':
      case 'walk': {
        const w = state === 'walk' ? Math.sin(t * 8) * 6 : 0;
        const bob = Math.abs(Math.sin(t * 8)) * 2;

        // Blue Jeans & White High Tops
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-10 + w, -22, 9, 22);
        ctx.fillRect(2 - w, -22, 9, 22);
        ctx.fillStyle = c.white;
        ctx.fillRect(-12 + w, -4, 11, 4);
        ctx.fillRect(0 - w, -4, 11, 4);

        // Iconic Yellow Muscle Tank Top
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-14, -48 + bob, 28, 26);
        ctx.fillStyle = c.orange; // muscle shading
        ctx.fillRect(-4, -42 + bob, 8, 16);

        // Huge Muscular Arms
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(-20, -46 + bob, 8, 20);
        ctx.fillRect(12, -46 + bob, 8, 20);
        // Wristbands
        ctx.fillStyle = c.red;
        ctx.fillRect(-20, -32 + bob, 8, 4);
        ctx.fillRect(12, -32 + bob, 8, 4);

        // Duke's Head, Red Headband, Mullet & Shades
        this.drawDukeHead(ctx, 0, -58 + bob);
        break;
      }

      case 'punch': {
        // Heavy Haymaker Punch
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-12, -22, 9, 22);
        ctx.fillRect(4, -22, 9, 22);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-12, -48, 26, 26);

        // Extended Haymaker Arm
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(8, -44, 28, 10);
        ctx.fillStyle = c.red;
        ctx.fillRect(26, -44, 6, 10); // Red boxing wrap

        this.drawDukeHead(ctx, 2, -58);
        break;
      }

      case 'ram': {
        // Duke's Bulldozer / Shoulder Ram
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-16, -16, 14, 16);
        ctx.fillRect(0, -16, 14, 16);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-14, -36, 28, 20);

        // Ramming Shoulder
        ctx.fillStyle = c.skinHuman;
        ctx.fillRect(12, -38, 14, 14);

        this.drawDukeHead(ctx, 10, -46, 0.4);
        break;
      }

      case 'hurt': {
        ctx.save();
        ctx.rotate(-0.3);
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-10, -22, 9, 22);
        ctx.fillRect(2, -22, 9, 22);
        ctx.fillStyle = c.lightRed;
        ctx.fillRect(-14, -48, 28, 26);
        this.drawDukeHead(ctx, -2, -58);
        ctx.restore();
        break;
      }

      case 'knockdown': {
        // Defeated flat on ground
        ctx.save();
        ctx.translate(0, -10);
        ctx.fillStyle = c.lightBlue;
        ctx.fillRect(-30, -6, 24, 10);
        ctx.fillStyle = c.yellow;
        ctx.fillRect(-10, -10, 30, 14);
        this.drawDukeHead(ctx, 24, -8, Math.PI / 2);
        ctx.restore();
        break;
      }
    }

    ctx.restore();
  }

  // Draw Duke Davis's head with 80s Mullet and Cool Shades
  drawDukeHead(ctx, x, y, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const c = this.c64;

    // Mullet Hair flowing behind
    ctx.fillStyle = '#5c3a21'; // Brown Mullet
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(8, -10);
    ctx.lineTo(12, 14);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.fillStyle = c.skinHuman;
    ctx.fillRect(-6, -6, 14, 14);

    // Red Headband / Bandana
    ctx.fillStyle = c.red;
    ctx.fillRect(-8, -8, 18, 5);
    ctx.fillRect(-12, -7, 5, 4); // Bandana knot

    // Dark Sunglasses
    ctx.fillStyle = c.black;
    ctx.fillRect(-4, -2, 6, 4);
    ctx.fillRect(3, -2, 6, 4);
    ctx.fillStyle = c.white;
    ctx.fillRect(-3, -2, 2, 2);

    // Rugged Stubble & Grin
    ctx.fillStyle = c.skinHumanDark;
    ctx.fillRect(-2, 4, 8, 3);

    ctx.restore();
  }
}

// Global Sprite Renderer Instance
window.spriteRenderer = new SpriteRenderer();
