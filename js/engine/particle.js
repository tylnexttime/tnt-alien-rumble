/**
 * TNT ALIEN RUMBLE - PARTICLE & COMIC FX ENGINE
 * Handles comic hit texts ("BOP!", "POW!"), hit sparks, dust clouds,
 * stun stars, debris, and UFO cosmic tractor beam visuals.
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  reset() {
    this.particles = [];
  }

  // 1. Comic Action Text Pop ("BOP!", "POW!", "WHACK!")
  spawnComicText(x, y, z, text = "BOP!", color = "#eeee77") {
    this.particles.push({
      type: 'comic-text',
      x: x + (Math.random() * 20 - 10),
      y: y,
      z: z + 50,
      vz: 1.8,
      text: text,
      color: color,
      scale: 0.5,
      maxScale: 1.3,
      alpha: 1,
      life: 36,
      maxLife: 36
    });
  }

  // 2. Hit Sparks / Retro 8-Bit Pixel Bursts
  spawnHitSparks(x, y, z, count = 12, color = "#aaffee") {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        z: z + 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * (speed * 0.4),
        vz: (Math.random() * 3) + 1,
        color: color,
        size: 3 + Math.floor(Math.random() * 3),
        alpha: 1,
        life: 18 + Math.floor(Math.random() * 10),
        maxLife: 28
      });
    }
  }

  // 3. Ground Dust Cloud (for dashing, jumping, belly flopping)
  spawnDust(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'dust',
        x: x + (Math.random() * 24 - 12),
        y: y + (Math.random() * 6 - 3),
        z: 0,
        vx: (Math.random() * 2 - 1) * 1.2,
        vy: (Math.random() * 2 - 1) * 0.4,
        vz: 0.6 + Math.random() * 0.8,
        size: 6 + Math.random() * 8,
        alpha: 0.7,
        life: 20,
        maxLife: 20
      });
    }
  }

  // 4. Trash Can / Prop Debris (Cans, paper, screws)
  spawnDebris(x, y, z, count = 8) {
    const debrisTypes = ['can', 'paper', 'apple', 'bolt'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'debris',
        subType: debrisTypes[Math.floor(Math.random() * debrisTypes.length)],
        x: x,
        y: y,
        z: z + 20,
        vx: (Math.random() * 2 - 1) * 4,
        vy: (Math.random() * 2 - 1) * 1.5,
        vz: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 2 - 1) * 0.2,
        life: 45,
        maxLife: 45
      });
    }
  }

  // 5. Stun Star (Circling head of dazed enemies)
  spawnStunStars(target, duration = 60) {
    target.stunTimer = duration;
  }

  // 6. UFO Cosmic Beam Effect
  spawnUfoBeam(targetX, targetY) {
    this.particles.push({
      type: 'ufo-beam',
      x: targetX,
      y: targetY,
      width: 140,
      alpha: 1,
      life: 50,
      maxLife: 50
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Type-specific update
      if (p.type === 'comic-text') {
        p.z += p.vz;
        p.vz *= 0.92;
        if (p.scale < p.maxScale) p.scale += 0.15;
        p.alpha = p.life / p.maxLife;
      } else if (p.type === 'spark') {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vz -= 0.2; // Gravity
        p.alpha = p.life / p.maxLife;
      } else if (p.type === 'dust') {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.size += 0.4;
        p.alpha = (p.life / p.maxLife) * 0.6;
      } else if (p.type === 'debris') {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vz -= 0.35;
        if (p.z <= 0) {
          p.z = 0;
          p.vz = -p.vz * 0.4; // Bounce
          p.vx *= 0.7;
        }
        p.rot += p.rotSpeed;
      } else if (p.type === 'ufo-beam') {
        p.alpha = Math.sin((p.life / p.maxLife) * Math.PI);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      const screenX = Math.round(p.x);
      const screenY = Math.round(p.y - (p.z || 0));

      if (p.type === 'comic-text') {
        ctx.save();
        ctx.font = 'bold 20px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(screenX, screenY);
        ctx.scale(p.scale, p.scale);

        // Black shadow outline
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(p.text, 0, 0);

        ctx.fillStyle = p.color;
        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      } else if (p.type === 'spark') {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(screenX - p.size / 2, screenY - p.size / 2, p.size, p.size);
        ctx.restore();
      } else if (p.type === 'dust') {
        ctx.save();
        ctx.fillStyle = `rgba(180, 180, 180, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'debris') {
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rot);
        if (p.subType === 'can') {
          ctx.fillStyle = '#aaffee';
          ctx.fillRect(-5, -7, 10, 14);
          ctx.fillStyle = '#ff7777';
          ctx.fillRect(-5, -2, 10, 4);
        } else if (p.subType === 'apple') {
          ctx.fillStyle = '#880000';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-4, -4, 8, 8);
        }
        ctx.restore();
      } else if (p.type === 'ufo-beam') {
        ctx.save();
        ctx.globalAlpha = p.alpha * 0.75;
        const grad = ctx.createLinearGradient(screenX, 0, screenX, screenY);
        grad.addColorStop(0, '#39ff14');
        grad.addColorStop(1, 'rgba(57, 255, 20, 0.1)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(screenX - p.width * 0.25, 0);
        ctx.lineTo(screenX + p.width * 0.25, 0);
        ctx.lineTo(screenX + p.width * 0.5, screenY);
        ctx.lineTo(screenX - p.width * 0.5, screenY);
        ctx.closePath();
        ctx.fill();

        // Target energy ring
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, p.width * 0.45, p.width * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

// Global Particle System Instance
window.particles = new ParticleSystem();
