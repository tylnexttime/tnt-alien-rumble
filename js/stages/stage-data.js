/**
 * TNT ALIEN RUMBLE - STAGE DEFINITIONS & 2.5D PARALLAX ENVIRONMENT
 * Procedural C64-styled 2.5D building facades, neon signs, graffiti,
 * sidewalks, and wave spawn scripts.
 */

const STAGES_DATA = [
  // -------------------------------------------------------------
  // STAGE 1: DOWNTOWN SLUMS & MELBOURNE STREET
  // -------------------------------------------------------------
  {
    id: 1,
    name: "STAGE 1: DOWNTOWN SLUMS",
    length: 2400,
    music: "stage1",
    skyColor: "#0b0c16",
    sidewalkColor: "#777777",
    streetColor: "#333333",
    curbColor: "#bbbbbb",
    buildings: [
      { x: 50, w: 220, h: 220, color: "#664400", winCols: 3, winRows: 4, sign: "MELBOURNE ARCADE", signColor: "#aaffee" },
      { x: 300, w: 260, h: 260, color: "#880000", winCols: 4, winRows: 5, sign: "C64 BURGERS", signColor: "#eeee77" },
      { x: 590, w: 180, h: 200, color: "#333333", winCols: 2, winRows: 3, sign: "PAWN SHOP", signColor: "#00cc55" },
      { x: 800, w: 280, h: 280, color: "#0000aa", winCols: 4, winRows: 6, sign: "DISCO 1987", signColor: "#ff7777" },
      { x: 1110, w: 240, h: 230, color: "#664400", winCols: 3, winRows: 4, sign: "BAR & GRILL", signColor: "#dd8855" },
      { x: 1380, w: 290, h: 270, color: "#880000", winCols: 4, winRows: 5, sign: "MOTEL 64", signColor: "#aaffee" },
      { x: 1700, w: 230, h: 210, color: "#333333", winCols: 3, winRows: 4, sign: "SUBWAY", signColor: "#eeee77" },
      { x: 1960, w: 320, h: 290, color: "#0000aa", winCols: 5, winRows: 6, sign: "WAREHOUSE 7", signColor: "#39ff14" }
    ],
    props: [
      { x: 280, y: 350, type: 'trashcan' },
      { x: 550, y: 440, type: 'hydrant' },
      { x: 920, y: 360, type: 'trashcan' },
      { x: 1320, y: 450, type: 'trashcan' },
      { x: 1650, y: 370, type: 'hydrant' },
      { x: 2050, y: 430, type: 'trashcan' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'punk', x: 750, y: 360 }, { type: 'punk', x: 850, y: 440 }] },
      { triggerX: 450, enemies: [{ type: 'dog', x: 1100, y: 400 }, { type: 'punk', x: 1200, y: 350 }, { type: 'granny', x: 1250, y: 460 }] },
      { triggerX: 950, enemies: [{ type: 'dog', x: 1550, y: 360 }, { type: 'dog', x: 1600, y: 470 }, { type: 'punk', x: 1650, y: 420 }] },
      { triggerX: 1450, enemies: [{ type: 'granny', x: 2050, y: 370 }, { type: 'punk', x: 2100, y: 430 }, { type: 'bouncer', x: 2200, y: 400 }] }
    ]
  },

  // -------------------------------------------------------------
  // STAGE 2: CITY PARK & BASKETBALL COURTS
  // -------------------------------------------------------------
  {
    id: 2,
    name: "STAGE 2: CITY PARK & HOOPS",
    length: 2600,
    music: "stage2",
    skyColor: "#05111d",
    sidewalkColor: "#4e7037", // Grassy park path
    streetColor: "#223322",
    curbColor: "#aaff66",
    buildings: [
      { x: 60, w: 240, h: 220, color: "#664400", winCols: 3, winRows: 4, sign: "PARK REC CENTER", signColor: "#eeee77" },
      { x: 330, w: 260, h: 180, color: "#333333", winCols: 3, winRows: 3, sign: "SNACK SHACK", signColor: "#ff7777" },
      { x: 620, w: 300, h: 250, color: "#0000aa", winCols: 4, winRows: 5, sign: "HOOP ARENA", signColor: "#aaffee" },
      { x: 950, w: 220, h: 200, color: "#880000", winCols: 3, winRows: 4, sign: "TENNIS CLUB", signColor: "#aaff66" },
      { x: 1200, w: 280, h: 270, color: "#664400", winCols: 4, winRows: 5, sign: "SKATE RINK", signColor: "#39ff14" },
      { x: 1510, w: 240, h: 210, color: "#333333", winCols: 3, winRows: 4, sign: "BOATHOUSE", signColor: "#aaffee" },
      { x: 1800, w: 320, h: 280, color: "#0000aa", winCols: 5, winRows: 5, sign: "GRANDSTANDS", signColor: "#eeee77" }
    ],
    props: [
      { x: 300, y: 360, type: 'trashcan' },
      { x: 700, y: 440, type: 'hydrant' },
      { x: 1100, y: 350, type: 'trashcan' },
      { x: 1550, y: 430, type: 'trashcan' },
      { x: 1950, y: 370, type: 'trashcan' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'basketballer', x: 700, y: 380 }, { type: 'dog', x: 800, y: 450 }] },
      { triggerX: 500, enemies: [{ type: 'basketballer', x: 1150, y: 360 }, { type: 'granny', x: 1200, y: 440 }, { type: 'dog', x: 1250, y: 400 }] },
      { triggerX: 1000, enemies: [{ type: 'punk', x: 1600, y: 350 }, { type: 'basketballer', x: 1650, y: 420 }, { type: 'basketballer', x: 1700, y: 460 }] },
      { triggerX: 1500, enemies: [{ type: 'dog', x: 2100, y: 360 }, { type: 'granny', x: 2150, y: 450 }, { type: 'bouncer', x: 2250, y: 400 }] }
    ]
  },

  // -------------------------------------------------------------
  // STAGE 3: MUSCLE GYM & BAD STREET
  // -------------------------------------------------------------
  {
    id: 3,
    name: "STAGE 3: MUSCLE GYM & BAD STREET",
    length: 2800,
    music: "stage1",
    skyColor: "#1a0808",
    sidewalkColor: "#664400",
    streetColor: "#2a1515",
    curbColor: "#dd8855",
    buildings: [
      { x: 50, w: 320, h: 280, color: "#880000", winCols: 5, winRows: 5, sign: "DUKE'S IRON GYM", signColor: "#ffd700" },
      { x: 400, w: 250, h: 230, color: "#333333", winCols: 3, winRows: 4, sign: "HEAVYWEIGHTS ONLY", signColor: "#ff7777" },
      { x: 680, w: 280, h: 260, color: "#0000aa", winCols: 4, winRows: 5, sign: "PROTEIN SHAKES", signColor: "#aaffee" },
      { x: 990, w: 240, h: 210, color: "#664400", winCols: 3, winRows: 4, sign: "BOXING RING", signColor: "#eeee77" },
      { x: 1260, w: 310, h: 290, color: "#880000", winCols: 5, winRows: 6, sign: "MELBOURNE BRAWL", signColor: "#39ff14" },
      { x: 1600, w: 260, h: 240, color: "#333333", winCols: 4, winRows: 4, sign: "DUKE'S LAIR", signColor: "#ffd700" }
    ],
    props: [
      { x: 320, y: 350, type: 'trashcan' },
      { x: 650, y: 440, type: 'hydrant' },
      { x: 1050, y: 360, type: 'trashcan' },
      { x: 1450, y: 450, type: 'trashcan' },
      { x: 1900, y: 380, type: 'hydrant' }
    ],
    waves: [
      { triggerX: 100, enemies: [{ type: 'bouncer', x: 700, y: 390 }, { type: 'punk', x: 750, y: 450 }] },
      { triggerX: 550, enemies: [{ type: 'bouncer', x: 1200, y: 360 }, { type: 'granny', x: 1250, y: 450 }, { type: 'punk', x: 1300, y: 410 }] },
      { triggerX: 1100, enemies: [{ type: 'bouncer', x: 1700, y: 370 }, { type: 'basketballer', x: 1750, y: 460 }, { type: 'dog', x: 1800, y: 400 }] },
      { triggerX: 1650, enemies: [{ type: 'bouncer', x: 2300, y: 360 }, { type: 'bouncer', x: 2350, y: 460 }, { type: 'punk', x: 2400, y: 410 }] }
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
    skyColor: "#050711",
    sidewalkColor: "#444444",
    streetColor: "#222222",
    curbColor: "#0088ff",
    buildings: [
      { x: 0, w: 1200, h: 320, color: "#111122", winCols: 16, winRows: 6, sign: "DUKE DAVIS ROOFTOP HELIPAD", signColor: "#ffd700" }
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
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 180,
        size: Math.random() < 0.7 ? 1.5 : 2.5,
        twinkle: Math.random() * 10
      });
    }
  }

  renderBackground(ctx, camera, stageData) {
    const w = camera.viewportWidth;
    const h = camera.viewportHeight;
    const s = camera.scale || 1.0;
    const effW = w / s;
    const effH = h / s;

    // 1. Retro Sky
    ctx.fillStyle = stageData.skyColor || "#0b0c16";
    ctx.fillRect(0, 0, w, h);

    // 2. Twinkling Stars
    ctx.fillStyle = "#ffffff";
    const now = Date.now() * 0.003;
    for (const st of this.stars) {
      const starScreenX = (st.x - camera.x * 0.1) % w;
      const alpha = 0.4 + Math.sin(now + st.twinkle) * 0.4;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillRect(starScreenX >= 0 ? starScreenX : starScreenX + w, st.y * s, st.size * s, st.size * s);
    }
    ctx.globalAlpha = 1.0;

    // 3. Parallax Skyline (Far Buildings)
    ctx.fillStyle = "#151928";
    const farOffset = camera.x * 0.2;
    for (let i = 0; i < 16; i++) {
      const bX = (i * 180 - farOffset) % (w + 200);
      const drawX = bX < -180 ? bX + w + 360 : bX;
      const skyY = (100 + (i % 4) * 20 - camera.y * 0.3) * s;
      ctx.fillRect(drawX * (s > 1 ? s * 0.6 : 1), Math.max(0, skyY), 140 * s, 260 * s);
      // Skyline antenna
      ctx.fillRect((drawX * (s > 1 ? s * 0.6 : 1)) + 68 * s, Math.max(0, skyY - 20 * s), 4 * s, 25 * s);
    }

    // 4. Mid-Ground 2.5D Buildings (Street level facades)
    camera.applyTransform(ctx);

    const isInfinite = !!(window.cutscenes && window.cutscenes.inPracticeMode) || camera.isInfinite;
    const loopChunk = stageData.length || 2400;

    if (stageData.buildings) {
      if (isInfinite) {
        // Infinite modular building tiling across visible chunks
        const curChunk = Math.floor(camera.x / loopChunk);
        for (let chunkIdx = curChunk - 1; chunkIdx <= curChunk + 1; chunkIdx++) {
          const chunkOffset = chunkIdx * loopChunk;
          for (const b of stageData.buildings) {
            this.drawBuilding(ctx, b, chunkOffset);
          }
        }
      } else {
        for (const b of stageData.buildings) {
          this.drawBuilding(ctx, b, 0);
        }
      }
    }

    // 5. 2.5D Sidewalk & Road Planes
    const groundStartX = isInfinite ? Math.floor((camera.x - 200) / 60) * 60 : 0;
    const groundEndX = isInfinite ? camera.x + effW + 400 : stageData.length + 500;
    const groundWidth = groundEndX - groundStartX;

    // Upper Sidewalk Back Wall / Curb
    ctx.fillStyle = "#222222";
    ctx.fillRect(groundStartX, 300, groundWidth, 24);

    // Sidewalk Ground Plane
    ctx.fillStyle = stageData.sidewalkColor;
    ctx.fillRect(groundStartX, 324, groundWidth, 70);

    // Sidewalk Paver Lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 2;
    for (let x = groundStartX; x < groundEndX; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 324);
      ctx.lineTo(x - 20, 394);
      ctx.stroke();
    }

    // Street Curb Transition
    ctx.fillStyle = stageData.curbColor;
    ctx.fillRect(groundStartX, 394, groundWidth, 8);

    // Lower Asphalt Street
    ctx.fillStyle = stageData.streetColor;
    ctx.fillRect(groundStartX, 402, groundWidth, 160);

    // Yellow Dashed Street Lane Line
    ctx.fillStyle = "#eeee77";
    const dashStartX = Math.floor(groundStartX / 90) * 90;
    for (let x = dashStartX; x < groundEndX; x += 90) {
      ctx.fillRect(x, 465, 45, 6);
    }

    camera.restoreTransform(ctx);
  }

  drawBuilding(ctx, b, xOffset = 0) {
    const drawX = b.x + xOffset;

    // Building main brick facade
    ctx.fillStyle = b.color;
    ctx.fillRect(drawX, 300 - b.h, b.w, b.h);

    // Brick outlines & roof trim
    ctx.fillStyle = "#111111";
    ctx.fillRect(drawX - 4, 300 - b.h - 6, b.w + 8, 8); // Cornice

    // Windows with warm C64 lighting
    const colW = b.w / (b.winCols + 1);
    const rowH = (b.h - 60) / (b.winRows + 1);
    for (let r = 1; r <= b.winRows; r++) {
      for (let c = 1; c <= b.winCols; c++) {
        const winX = drawX + c * colW - 8;
        const winY = (300 - b.h + 20) + r * rowH - 10;
        const isLit = ((r * 7 + c * 13 + b.x) % 3 !== 0);

        ctx.fillStyle = isLit ? "#eeee77" : "#222233";
        ctx.fillRect(winX, winY, 16, 20);
        ctx.fillStyle = "#000000";
        ctx.fillRect(winX + 7, winY, 2, 20); // Window crossbar
        ctx.fillRect(winX, winY + 9, 16, 2);
      }
    }

    // Neon Sign
    if (b.sign) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(drawX + 10, 300 - b.h + 16, b.w - 20, 26);
      ctx.strokeStyle = b.signColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX + 10, 300 - b.h + 16, b.w - 20, 26);

      ctx.fillStyle = b.signColor;
      ctx.font = 'bold 10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.sign, drawX + b.w / 2, 300 - b.h + 30);
      ctx.restore();
    }
  }
}

// Global Stage Renderer Instance
window.stageRenderer = new StageRenderer();
