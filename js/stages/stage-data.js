/**
 * TNT ALIEN RUMBLE - C64 STAGE DEFINITIONS & ARCHITECTURAL ENGINE
 * Chunky 2.5D building facades, raster sky gradients,
 * running-bond brickwork, 3D striped awnings, wrought-iron fire escapes,
 * dripping A/C units, glowing neon signs, and sewer steam grates.
 */

const STAGES_DATA = [
  // -------------------------------------------------------------
  // STAGE 1: DOWNTOWN SLUMS & MELBOURNE STREET
  // -------------------------------------------------------------
  {
    id: 1,
    name: "STAGE 1: DOWNTOWN SLUMS",
    length: 2600,
    music: "stage1",
    skyGradient: ["#0a081e", "#1b143a", "#382348", "#6a3048", "#a84838"],
    sidewalkColor: "#58626e",
    sidewalkTileColor: "#424a54",
    streetColor: "#1e222a",
    curbColor: "#8292a4",
    buildings: [
      { x: 50, w: 240, h: 240, brick: "#7a3420", brickDark: "#4e1e12", winCols: 3, winRows: 4, sign: "MELBOURNE ARCADE", signColor: "#00f0ff", awning: { colors: ["#cc2222", "#ffffff"] }, hasFireEscape: true, hasAc: true },
      { x: 330, w: 280, h: 270, brick: "#8b2525", brickDark: "#541212", winCols: 4, winRows: 5, sign: "C64 BURGERS", signColor: "#ffd700", awning: { colors: ["#ffaa00", "#333333"] }, hasAc: true },
      { x: 650, w: 200, h: 220, brick: "#404856", brickDark: "#262c36", winCols: 2, winRows: 3, sign: "PAWN SHOP", signColor: "#39ff14", hasFireEscape: true },
      { x: 890, w: 300, h: 290, brick: "#2b3c66", brickDark: "#172342", winCols: 4, winRows: 6, sign: "DISCO 1987", signColor: "#ff007f", awning: { colors: ["#00f0ff", "#ff007f"] } },
      { x: 1230, w: 260, h: 240, brick: "#7a3420", brickDark: "#4e1e12", winCols: 3, winRows: 4, sign: "BAR & GRILL", signColor: "#ff7733", hasAc: true },
      { x: 1530, w: 310, h: 280, brick: "#8b2525", brickDark: "#541212", winCols: 4, winRows: 5, sign: "MOTEL 64", signColor: "#00f0ff", hasFireEscape: true },
      { x: 1880, w: 250, h: 230, brick: "#404856", brickDark: "#262c36", winCols: 3, winRows: 4, sign: "SUBWAY", signColor: "#ffd700", awning: { colors: ["#39ff14", "#ffffff"] } },
      { x: 2170, w: 340, h: 300, brick: "#2b3c66", brickDark: "#172342", winCols: 5, winRows: 6, sign: "WAREHOUSE 7", signColor: "#39ff14", hasFireEscape: true }
    ],
    props: [
      { x: 280, y: 350, type: 'trashcan' },
      { x: 580, y: 440, type: 'hydrant' },
      { x: 920, y: 360, type: 'trashcan' },
      { x: 1420, y: 450, type: 'trashcan' },
      { x: 1750, y: 370, type: 'hydrant' },
      { x: 2100, y: 430, type: 'trashcan' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'punk', x: 750, y: 360 }, { type: 'skater', x: 820, y: 430 }] },
      { triggerX: 450, enemies: [{ type: 'dog', x: 1100, y: 400 }, { type: 'punk', x: 1180, y: 350 }, { type: 'granny', x: 1250, y: 460 }] },
      { triggerX: 950, enemies: [{ type: 'dog', x: 1550, y: 360 }, { type: 'skater', x: 1600, y: 460 }, { type: 'punk', x: 1650, y: 410 }] },
      { triggerX: 1450, enemies: [{ type: 'granny', x: 2050, y: 370 }, { type: 'skater', x: 2100, y: 440 }, { type: 'bouncer', x: 2200, y: 400 }] },
      { triggerX: 2150, enemies: [{ type: 'biker', x: 2500, y: 410 }] }
    ]
  },

  // -------------------------------------------------------------
  // STAGE 2: CITY PARK & BASKETBALL COURTS
  // -------------------------------------------------------------
  {
    id: 2,
    name: "STAGE 2: CITY PARK & HOOPS",
    length: 2800,
    music: "stage2",
    skyGradient: ["#040a18", "#0e1e36", "#1c3854", "#2c546e", "#447888"],
    sidewalkColor: "#3d5c36", // Grassy cobblestone
    sidewalkTileColor: "#2a4224",
    streetColor: "#1a2a1a",
    curbColor: "#6ea85e",
    buildings: [
      { x: 60, w: 260, h: 230, brick: "#6a4025", brickDark: "#3d2212", winCols: 3, winRows: 4, sign: "PARK REC CENTER", signColor: "#ffd700", awning: { colors: ["#2b6cb0", "#ffffff"] }, hasAc: true },
      { x: 360, w: 270, h: 200, brick: "#384438", brickDark: "#1e261e", winCols: 3, winRows: 3, sign: "SNACK SHACK", signColor: "#ff007f", awning: { colors: ["#ff007f", "#ffd700"] } },
      { x: 670, w: 320, h: 260, brick: "#203450", brickDark: "#101e30", winCols: 4, winRows: 5, sign: "HOOP ARENA", signColor: "#00f0ff", hasFireEscape: true },
      { x: 1030, w: 240, h: 220, brick: "#7a2a2a", brickDark: "#481414", winCols: 3, winRows: 4, sign: "TENNIS CLUB", signColor: "#39ff14", awning: { colors: ["#39ff14", "#203450"] } },
      { x: 1310, w: 300, h: 280, brick: "#6a4025", brickDark: "#3d2212", winCols: 4, winRows: 5, sign: "SKATE RINK", signColor: "#ff007f", hasAc: true },
      { x: 1650, w: 250, h: 220, brick: "#384438", brickDark: "#1e261e", winCols: 3, winRows: 4, sign: "BOATHOUSE", signColor: "#00f0ff" },
      { x: 1940, w: 340, h: 290, brick: "#203450", brickDark: "#101e30", winCols: 5, winRows: 5, sign: "GRANDSTANDS", signColor: "#ffd700", hasFireEscape: true }
    ],
    props: [
      { x: 300, y: 360, type: 'trashcan' },
      { x: 700, y: 440, type: 'hydrant' },
      { x: 1100, y: 350, type: 'trashcan' },
      { x: 1550, y: 430, type: 'trashcan' },
      { x: 1950, y: 370, type: 'trashcan' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'basketballer', x: 700, y: 380 }, { type: 'dog', x: 780, y: 440 }] },
      { triggerX: 500, enemies: [{ type: 'basketballer', x: 1150, y: 360 }, { type: 'strongman', x: 1200, y: 430 }, { type: 'dog', x: 1260, y: 400 }] },
      { triggerX: 1000, enemies: [{ type: 'skater', x: 1600, y: 350 }, { type: 'basketballer', x: 1660, y: 420 }, { type: 'strongman', x: 1720, y: 460 }] },
      { triggerX: 1500, enemies: [{ type: 'granny', x: 2100, y: 360 }, { type: 'basketballer', x: 2160, y: 440 }, { type: 'bouncer', x: 2250, y: 400 }] },
      { triggerX: 2200, enemies: [{ type: 'biker', x: 2560, y: 370 }, { type: 'dog', x: 2620, y: 450 }] }
    ]
  },

  // -------------------------------------------------------------
  // STAGE 3: MUSCLE GYM & BAD STREET
  // -------------------------------------------------------------
  {
    id: 3,
    name: "STAGE 3: MUSCLE GYM & BAD STREET",
    length: 2900,
    music: "stage1",
    skyGradient: ["#160808", "#2d0f0f", "#4a1818", "#782222", "#b83838"],
    sidewalkColor: "#5e4434",
    sidewalkTileColor: "#422e22",
    streetColor: "#261616",
    curbColor: "#9a6c52",
    buildings: [
      { x: 50, w: 340, h: 290, brick: "#8b2020", brickDark: "#4a0e0e", winCols: 5, winRows: 5, sign: "DUKE'S IRON GYM", signColor: "#ffd700", awning: { colors: ["#ffd700", "#111111"] }, hasFireEscape: true, hasAc: true },
      { x: 430, w: 260, h: 240, brick: "#383838", brickDark: "#202020", winCols: 3, winRows: 4, sign: "HEAVYWEIGHTS ONLY", signColor: "#ff4444", hasAc: true },
      { x: 730, w: 290, h: 270, brick: "#253456", brickDark: "#141e34", winCols: 4, winRows: 5, sign: "PROTEIN SHAKES", signColor: "#00f0ff", awning: { colors: ["#00f0ff", "#253456"] } },
      { x: 1060, w: 250, h: 220, brick: "#6a3820", brickDark: "#3a1d10", winCols: 3, winRows: 4, sign: "BOXING RING", signColor: "#ffd700", hasFireEscape: true },
      { x: 1350, w: 320, h: 300, brick: "#8b2020", brickDark: "#4a0e0e", winCols: 5, winRows: 6, sign: "MELBOURNE BRAWL", signColor: "#39ff14", hasAc: true },
      { x: 1710, w: 280, h: 250, brick: "#383838", brickDark: "#202020", winCols: 4, winRows: 4, sign: "DUKE'S LAIR", signColor: "#ffd700", hasFireEscape: true }
    ],
    props: [
      { x: 320, y: 350, type: 'trashcan' },
      { x: 650, y: 440, type: 'hydrant' },
      { x: 1050, y: 360, type: 'trashcan' },
      { x: 1450, y: 450, type: 'trashcan' },
      { x: 1900, y: 380, type: 'hydrant' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'bouncer', x: 700, y: 390 }, { type: 'strongman', x: 760, y: 450 }] },
      { triggerX: 550, enemies: [{ type: 'bouncer', x: 1200, y: 360 }, { type: 'granny', x: 1260, y: 450 }, { type: 'skater', x: 1320, y: 410 }] },
      { triggerX: 1100, enemies: [{ type: 'strongman', x: 1700, y: 370 }, { type: 'basketballer', x: 1760, y: 450 }, { type: 'dog', x: 1820, y: 400 }] },
      { triggerX: 1650, enemies: [{ type: 'bouncer', x: 2300, y: 360 }, { type: 'strongman', x: 2360, y: 450 }, { type: 'punk', x: 2420, y: 410 }] },
      { triggerX: 2300, enemies: [{ type: 'biker', x: 2650, y: 370 }, { type: 'biker', x: 2720, y: 450 }] }
    ]
  },

  // -------------------------------------------------------------
  // STAGE 4: ROOFTOP SHOWDOWN (FINAL BOSS: DUKE DAVIS)
  // -------------------------------------------------------------
  {
    id: 4,
    name: "STAGE 4: ROOFTOP FINAL SHOWDOWN",
    length: 1200,
    music: "boss",
    skyGradient: ["#050711", "#0b1226", "#162348", "#283b6c", "#445e99"],
    sidewalkColor: "#3c434f",
    sidewalkTileColor: "#2b3039",
    streetColor: "#1a1c22",
    curbColor: "#56677f",
    buildings: [
      { x: 0, w: 1200, h: 320, brick: "#1b2438", brickDark: "#0d1320", winCols: 16, winRows: 6, sign: "DUKE DAVIS ROOFTOP HELIPAD", signColor: "#ffd700", hasFireEscape: true, hasAc: true }
    ],
    props: [
      { x: 250, y: 360, type: 'trashcan' },
      { x: 750, y: 440, type: 'trashcan' }
    ],
    waves: [
      { triggerX: 100, isBossWave: true, boss: { type: 'duke', x: 750, y: 410 } }
    ]
  }
];

class StageRenderer {
  constructor() {
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * 2400,
        y: Math.random() * 160,
        size: Math.random() < 0.65 ? 1.5 : 2.5,
        twinkle: Math.random() * 10
      });
    }

    // Sewer Grate Steam Plume Timers
    this.steamTimer = 0;
    this.dripTimer = 0;
  }

  renderBackground(ctx, camera, stageData) {
    const w = camera.viewportWidth;
    const h = camera.viewportHeight;
    const s = camera.scale || 1.0;
    const effW = w / s;

    // 1. Raster Sky Gradient (VIC-II raster-bar homage)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 310 * s);
    const colors = stageData.skyGradient || ["#0a081e", "#1b143a", "#382348", "#6a3048", "#a84838"];
    const step = 1 / (colors.length - 1);
    colors.forEach((c, idx) => {
      skyGrad.addColorStop(Math.min(1.0, idx * step), c);
    });

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Twinkling Stars
    ctx.fillStyle = "#ffffff";
    const now = Date.now() * 0.003;
    for (const st of this.stars) {
      const starScreenX = (st.x - camera.x * 0.08) % w;
      const alpha = 0.35 + Math.sin(now + st.twinkle) * 0.45;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillRect(starScreenX >= 0 ? starScreenX : starScreenX + w, st.y * s, st.size * s, st.size * s);
    }
    ctx.globalAlpha = 1.0;

    // 3. Parallax Skyline (Distant Skyscrapers with Illuminated Windows & Red Beacon Lights)
    ctx.save();
    const farOffset = camera.x * 0.15;
    for (let i = 0; i < 18; i++) {
      const bX = (i * 160 - farOffset) % (w + 220);
      const drawX = (bX < -160 ? bX + w + 320 : bX) * (s > 1 ? s * 0.6 : 1);
      const skyY = (90 + (i % 5) * 22 - camera.y * 0.25) * s;
      const bW = 120 * s;
      const bH = 260 * s;

      // Skyline Building Body
      ctx.fillStyle = (i % 2 === 0) ? "#121626" : "#181e33";
      ctx.fillRect(drawX, Math.max(0, skyY), bW, bH);

      // Lit office windows
      ctx.fillStyle = (i % 3 === 0) ? "rgba(255, 240, 150, 0.4)" : "rgba(100, 200, 255, 0.25)";
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          if ((r + c + i) % 2 === 0) {
            ctx.fillRect(drawX + (c * 24 + 12) * s, skyY + (r * 28 + 16) * s, 10 * s, 14 * s);
          }
        }
      }

      // Spire & Blinking Red Beacon
      ctx.fillStyle = "#0d101c";
      ctx.fillRect(drawX + 58 * s, Math.max(0, skyY - 30 * s), 4 * s, 32 * s);
      // Red Beacon Blink
      const redBlink = Math.sin(now * 4 + i) > 0.5;
      if (redBlink) {
        ctx.fillStyle = "#ff2222";
        ctx.beginPath();
        ctx.arc(drawX + 60 * s, Math.max(0, skyY - 30 * s), 3 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 4. Mid-Ground 2.5D Buildings (Textured Architecture)
    camera.applyTransform(ctx);

    const isInfinite = !!(window.cutscenes && window.cutscenes.inPracticeMode) || camera.isInfinite;
    const loopChunk = stageData.length || 2600;

    if (stageData.buildings) {
      if (isInfinite) {
        const curChunk = Math.floor(camera.x / loopChunk);
        for (let chunkIdx = curChunk - 1; chunkIdx <= curChunk + 1; chunkIdx++) {
          const chunkOffset = chunkIdx * loopChunk;
          for (const b of stageData.buildings) {
            this.drawC64Building(ctx, b, chunkOffset);
          }
        }
      } else {
        for (const b of stageData.buildings) {
          this.drawC64Building(ctx, b, 0);
        }
      }
    }

    // 5. 2.5D Textured Sidewalk & Street Ground Plane
    const groundStartX = isInfinite ? Math.floor((camera.x - 200) / 60) * 60 : 0;
    const groundEndX = isInfinite ? camera.x + effW + 400 : stageData.length + 500;
    const groundWidth = groundEndX - groundStartX;

    // Back Wall Ledge
    ctx.fillStyle = "#161a22";
    ctx.fillRect(groundStartX, 298, groundWidth, 26);
    ctx.fillStyle = "#2c3342";
    ctx.fillRect(groundStartX, 298, groundWidth, 3); // Highlight edge

    // Sidewalk Ground Plane
    ctx.fillStyle = stageData.sidewalkColor || "#58626e";
    ctx.fillRect(groundStartX, 324, groundWidth, 72);

    // Textured Stone Paver Tiles with Beveled Expansion Joints
    ctx.strokeStyle = stageData.sidewalkTileColor || "#424a54";
    ctx.lineWidth = 2;
    for (let x = groundStartX; x < groundEndX; x += 55) {
      ctx.beginPath();
      ctx.moveTo(x, 324);
      ctx.lineTo(x - 22, 396);
      ctx.stroke();

      // Horizontal paver joints
      ctx.beginPath();
      ctx.moveTo(x, 348);
      ctx.lineTo(x + 55, 348);
      ctx.moveTo(x - 11, 372);
      ctx.lineTo(x + 44, 372);
      ctx.stroke();
    }

    // Street Curb Transition with Bevel Highlight & Shadow
    ctx.fillStyle = stageData.curbColor || "#8292a4";
    ctx.fillRect(groundStartX, 396, groundWidth, 9);
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.3;
    ctx.fillRect(groundStartX, 396, groundWidth, 2); // Curb specular highlight
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(groundStartX, 403, groundWidth, 2); // Curb shadow
    ctx.globalAlpha = 1.0;

    // Lower Asphalt Street with asphalt grain
    ctx.fillStyle = stageData.streetColor || "#1e222a";
    ctx.fillRect(groundStartX, 405, groundWidth, 160);

    // Yellow Dashed Street Lane Lines with Drop Shadows
    const dashStartX = Math.floor(groundStartX / 90) * 90;
    for (let x = dashStartX; x < groundEndX; x += 90) {
      ctx.fillStyle = "#111111"; // Shadow
      ctx.fillRect(x, 468, 46, 6);
      ctx.fillStyle = "#f5c200"; // Yellow
      ctx.fillRect(x, 466, 46, 6);
      ctx.fillStyle = "#fff480"; // Top highlight
      ctx.fillRect(x, 466, 46, 2);
    }

    // Cast-Iron Sewer Grates & Manhole Covers (with rising steam!)
    for (let x = Math.floor(groundStartX / 450) * 450; x < groundEndX; x += 450) {
      this.drawSewerGrate(ctx, x + 160, 400);
      this.drawManholeCover(ctx, x + 340, 475);
    }

    // Street Lamps with Warm Radial Light Pooling on Pavement
    for (let x = Math.floor(groundStartX / 400) * 400; x < groundEndX; x += 400) {
      this.drawStreetLamp(ctx, x + 80, 390);
    }

    camera.restoreTransform(ctx);

    // Periodic Environmental Particle Spawners (Steam & Water Drips)
    this.steamTimer++;
    if (this.steamTimer >= 18 && window.particles) {
      this.steamTimer = 0;
      for (let x = Math.floor((camera.x - 100) / 450) * 450; x < camera.x + effW + 100; x += 450) {
        window.particles.spawnSewerSteam(x + 160, 398);
      }
    }
  }

  // Draw High-Detail Textured Building Facade
  drawC64Building(ctx, b, xOffset = 0) {
    const drawX = b.x + xOffset;
    const topY = 300 - b.h;

    // 1. Running-Bond Textured Brickwork
    ctx.fillStyle = b.brick || "#7a3420";
    ctx.fillRect(drawX, topY, b.w, b.h);

    // Individual Brick Mortar Grid
    ctx.fillStyle = b.brickDark || "#4e1e12";
    const brickH = 8;
    const brickW = 16;
    for (let y = topY; y < 300; y += brickH) {
      // Horizontal mortar line
      ctx.fillRect(drawX, y, b.w, 1.5);
      const isOffset = Math.floor((y - topY) / brickH) % 2 === 1;
      const startX = isOffset ? drawX + brickW * 0.5 : drawX;
      for (let x = startX; x < drawX + b.w; x += brickW) {
        ctx.fillRect(x, y, 1.5, brickH);
      }
    }

    // Weathered Plaster Cracks & Damp Moss Gradient near Base
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(drawX, 270, b.w, 30); // Base grime

    // 2. Multi-tiered Victorian / Classical Stone Cornices & Dentil Moldings
    ctx.fillStyle = "#1e222d";
    ctx.fillRect(drawX - 6, topY - 14, b.w + 12, 16);
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(drawX - 6, topY - 14, b.w + 12, 4); // Cornice highlight
    // Dentil Molding blocks
    ctx.fillStyle = "#cbd5e0";
    for (let x = drawX - 2; x < drawX + b.w + 2; x += 14) {
      ctx.fillRect(x, topY - 8, 8, 6);
    }

    // 3. Copper Rain Downspout Pipe
    ctx.fillStyle = "#3d2817";
    ctx.fillRect(drawX + 4, topY - 10, 5, b.h + 10);
    ctx.fillStyle = "#8a5830";
    ctx.fillRect(drawX + 4, topY - 10, 2, b.h + 10); // Pipe highlight
    // Pipe wall brackets
    ctx.fillStyle = "#1a1a1a";
    for (let y = topY + 20; y < 300; y += 45) {
      ctx.fillRect(drawX + 2, y, 9, 3);
    }

    // 4. Deluxe Windows with Stone Sills, Blinds & Warm Interior Silhouettes
    const colW = b.w / (b.winCols + 1);
    const rowH = (b.h - 70) / (b.winRows + 1);
    for (let r = 1; r <= b.winRows; r++) {
      for (let c = 1; c <= b.winCols; c++) {
        const winX = drawX + c * colW - 10;
        const winY = (topY + 30) + r * rowH - 12;
        const isLit = ((r * 7 + c * 13 + b.x) % 3 !== 0);

        // Stone Window Frame & Arch Top
        ctx.fillStyle = "#2d3748";
        ctx.fillRect(winX - 3, winY - 3, 26, 30);
        ctx.fillStyle = "#4a5568";
        ctx.fillRect(winX - 3, winY - 3, 26, 3);

        // Glass Pane (Warm Room Lighting vs Dark Night Glass)
        ctx.fillStyle = isLit ? "#f6e05e" : "#1a202c";
        ctx.fillRect(winX, winY, 20, 24);

        if (isLit) {
          // Half-Drawn Venetian Blinds / Curtains
          ctx.fillStyle = "#d69e2e";
          ctx.fillRect(winX, winY, 20, 8);
          ctx.fillStyle = "#b7791f";
          ctx.fillRect(winX, winY + 2, 20, 1.5);
          ctx.fillRect(winX, winY + 5, 20, 1.5);

          // Room Silhouette (Plant or Lamp)
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = "#744210";
            ctx.fillRect(winX + 7, winY + 14, 6, 10);
            ctx.fillRect(winX + 5, winY + 11, 10, 4);
          }
        }

        // Window Wooden Crossbars
        ctx.fillStyle = "#1a202c";
        ctx.fillRect(winX + 9, winY, 2, 24);
        ctx.fillRect(winX, winY + 12, 20, 2);

        // Stone Window Sill with Cast Drop Shadow
        ctx.fillStyle = "#4a5568";
        ctx.fillRect(winX - 4, winY + 24, 28, 4);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(winX - 4, winY + 28, 28, 3);
      }
    }

    // 5. Wrought-Iron Fire Escape with Zigzag Stairs
    if (b.hasFireEscape) {
      const feX = drawX + b.w - 48;
      ctx.fillStyle = "#111827";
      for (let r = 1; r <= b.winRows; r++) {
        const platY = (topY + 30) + r * rowH + 14;
        // Platform Grid
        ctx.fillRect(feX, platY, 42, 4);
        ctx.fillRect(feX, platY - 12, 42, 2); // Handrail
        ctx.fillRect(feX, platY - 12, 3, 12);
        ctx.fillRect(feX + 40, platY - 12, 3, 12);

        // Angled Stairs
        if (r < b.winRows) {
          ctx.beginPath();
          ctx.moveTo(feX + 38, platY);
          ctx.lineTo(feX + 4, platY + rowH - 4);
          ctx.strokeStyle = "#111827";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }
    }

    // 6. Window Air Conditioner Unit with Condensed Water Drips
    if (b.hasAc) {
      const acX = drawX + 28;
      const acY = topY + 68;

      // Metal A/C Body with Cooling Louvers
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(acX, acY, 24, 16);
      ctx.fillStyle = "#475569";
      ctx.fillRect(acX + 2, acY + 3, 12, 10);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(acX + 2, acY + 5, 12, 1.5);
      ctx.fillRect(acX + 2, acY + 8, 12, 1.5);

      // A/C Water Drop Spawner
      this.dripTimer++;
      if (this.dripTimer >= 40 && window.particles) {
        this.dripTimer = 0;
        window.particles.spawnAcDrip(acX + 12, 360, 300 - (acY + 16));
      }
    }

    // 7. 3D Striped Storefront Awning
    if (b.awning) {
      const awnY = 262;
      const awnH = 26;
      const stripeW = 16;
      const c1 = b.awning.colors[0];
      const c2 = b.awning.colors[1];

      // Cast Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(drawX + 6, awnY + awnH, b.w - 12, 8);

      // Sloped Striped Fabric
      for (let x = drawX + 8; x < drawX + b.w - 8; x += stripeW) {
        const isC1 = Math.floor((x - drawX) / stripeW) % 2 === 0;
        ctx.fillStyle = isC1 ? c1 : c2;
        ctx.beginPath();
        ctx.moveTo(x, awnY);
        ctx.lineTo(x + stripeW, awnY);
        ctx.lineTo(x + stripeW - 4, awnY + awnH);
        ctx.lineTo(x - 4, awnY + awnH);
        ctx.closePath();
        ctx.fill();

        // Scalloped Flap Edge
        ctx.beginPath();
        ctx.arc(x + stripeW * 0.5 - 4, awnY + awnH, stripeW * 0.5, 0, Math.PI);
        ctx.fill();
      }
    }

    // 8. Glowing Neon Channel Sign
    if (b.sign) {
      ctx.save();
      const signY = topY + 16;
      const signW = b.w - 24;
      const signH = 26;

      // Dark Backing Frame
      ctx.fillStyle = "#0a0d14";
      ctx.fillRect(drawX + 12, signY, signW, signH);
      ctx.strokeStyle = "#2d3748";
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX + 12, signY, signW, signH);

      // Neon Tube Glow Outer Ring
      ctx.shadowColor = b.signColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = b.signColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(drawX + 14, signY + 2, signW - 4, signH - 4);

      // Neon Lettering
      ctx.fillStyle = b.signColor;
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.sign, drawX + b.w / 2, signY + 14);

      ctx.restore();
    }
  }

  // Draw Cast-Iron Sewer Grate
  drawSewerGrate(ctx, x, y) {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(x - 14, y - 4, 28, 8);
    ctx.fillStyle = "#555f6d";
    ctx.fillRect(x - 15, y - 5, 30, 2);
    // Grate Slits
    ctx.fillStyle = "#1e222a";
    for (let i = -10; i <= 10; i += 4) {
      ctx.fillRect(x + i, y - 3, 2, 6);
    }
  }

  // Draw Cast-Iron Waffle Manhole Cover
  drawManholeCover(ctx, x, y) {
    ctx.fillStyle = "#12151c";
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#404856";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Waffle cross-hatch texture
    ctx.fillStyle = "#555f6d";
    ctx.fillRect(x - 8, y - 2, 16, 1.5);
    ctx.fillRect(x - 1, y - 4, 2, 8);
  }

  // Draw Victorian / 80s Cast-Iron Street Lamp with Warm Pavement Light Cone
  drawStreetLamp(ctx, x, y) {
    // 1. Warm Golden Light Pool on Sidewalk & Asphalt
    ctx.save();
    const lightGrad = ctx.createRadialGradient(x, y - 10, 10, x, y - 10, 90);
    lightGrad.addColorStop(0, "rgba(255, 235, 150, 0.22)");
    lightGrad.addColorStop(0.5, "rgba(255, 200, 100, 0.08)");
    lightGrad.addColorStop(1, "rgba(255, 200, 100, 0)");
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.ellipse(x, y - 10, 85, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Cast-Iron Lamp Post
    ctx.fillStyle = "#111620";
    ctx.fillRect(x - 3, y - 90, 6, 90);
    ctx.fillStyle = "#2c3545";
    ctx.fillRect(x - 3, y - 90, 2, 90); // Post highlight

    // Lamp Base
    ctx.fillStyle = "#111620";
    ctx.fillRect(x - 7, y - 10, 14, 10);

    // Lamp Lantern Head & Glowing Bulb
    ctx.fillStyle = "#111620";
    ctx.fillRect(x - 8, y - 104, 16, 14);
    // Glowing Yellow Bulb
    ctx.fillStyle = "#fff480";
    ctx.fillRect(x - 5, y - 101, 10, 8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 2, y - 99, 4, 4);
  }
}

// Global Stage Renderer Instance
window.stageRenderer = new StageRenderer();
