/**
 * TNT ALIEN RUMBLE - CUTSCENES & SPECIAL MODES
 * Star Wars Intro Crawl, Practice Gym Mode, Stage Clear Intermissions,
 * and UFO Cosmic Abduction Ending Sequence.
 */

class CutsceneManager {
  constructor() {
    this.inPracticeMode = false;
    this.practiceDummy = null;
  }

  // 1. Star Wars Style Escaping Text Crawl Intro (With [P] Pause / Resume Support)
  startIntroCrawl(onComplete) {
    const crawlScreen = document.getElementById('intro-crawl-screen');
    const wrapper = document.getElementById('intro-crawl-wrapper');
    const pauseIndicator = document.getElementById('crawl-pause-indicator');
    const btnPause = document.getElementById('btn-crawl-pause');
    const btnSkip = document.getElementById('btn-crawl-skip');
    if (!crawlScreen || !wrapper) return;

    this.isCrawlPaused = false;
    wrapper.classList.remove('paused');
    if (pauseIndicator) pauseIndicator.classList.add('hidden');
    if (btnPause) btnPause.innerHTML = '<strong>[P]</strong> PAUSE';

    // Restart CSS animation cleanly
    wrapper.style.animation = 'none';
    wrapper.offsetHeight; // trigger reflow
    wrapper.style.animation = '';

    crawlScreen.classList.remove('hidden');
    if (window.sidSynth) window.sidSynth.playTrack('title');

    let completed = false;
    let crawlTimer = null;

    const finish = () => {
      if (completed) return;
      completed = true;
      if (crawlTimer) clearTimeout(crawlTimer);
      crawlScreen.classList.add('hidden');
      window.removeEventListener('keydown', handleKey);
      if (btnPause) btnPause.onclick = null;
      if (btnSkip) btnSkip.onclick = null;
      if (pauseIndicator) pauseIndicator.onclick = null;
      if (onComplete) onComplete();
    };

    const togglePause = () => {
      this.isCrawlPaused = !this.isCrawlPaused;
      wrapper.classList.toggle('paused', this.isCrawlPaused);
      if (pauseIndicator) pauseIndicator.classList.toggle('hidden', !this.isCrawlPaused);
      if (btnPause) {
        btnPause.innerHTML = this.isCrawlPaused ? '<strong>[P]</strong> RESUME' : '<strong>[P]</strong> PAUSE';
      }
    };

    const handleKey = (e) => {
      if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
      } else if (['Space', 'Enter', 'Escape'].includes(e.code)) {
        e.preventDefault();
        finish();
      }
    };

    if (btnPause) btnPause.onclick = (e) => { e.stopPropagation(); togglePause(); };
    if (btnSkip) btnSkip.onclick = (e) => { e.stopPropagation(); finish(); };
    if (pauseIndicator) pauseIndicator.onclick = (e) => { e.stopPropagation(); togglePause(); };

    window.addEventListener('keydown', handleKey);

    // Auto complete after crawl finishes (~45s)
    crawlTimer = setTimeout(finish, 46000);
  }

  // 2. Dojo / Practice Gym Mode (Inspired by Bop'n Rumble's gym!)
  enterPracticeGym() {
    this.inPracticeMode = true;
    this.isFreePlay = false;
    const practiceScreen = document.getElementById('practice-screen');
    const guideLayer = document.getElementById('practice-guide-layer');
    const freeToolbar = document.getElementById('dojo-free-toolbar');
    const mainMenu = document.getElementById('main-menu-screen');
    const hud = document.getElementById('hud-container');

    if (mainMenu) mainMenu.classList.add('hidden');
    if (practiceScreen) practiceScreen.classList.remove('hidden');
    if (guideLayer) guideLayer.classList.remove('hidden');
    if (freeToolbar) freeToolbar.classList.add('hidden');
    if (hud) hud.classList.remove('hidden');

    if (window.sidSynth) window.sidSynth.playTrack('stage2');

    // Ensure stage and bounds are initialized
    window.game.currentStageIndex = 0;
    window.game.currentStageData = STAGES_DATA[0];

    // Set infinite scrolling camera for Dojo
    if (window.camera) window.camera.setStageBounds(2400, true);

    // Create player and punching bag dummy
    window.game.player.reset(160, 420);
    window.game.enemies = [];
    window.game.boss = null;
    window.game.props = [];
    window.game.pickups = [];
    window.game.projectiles = [];

    this.enemyHints = {
      punk: "COUNTER PUNK: Mid-air dropkick! Duck or interrupt with [K] Stretchy Headbutt.",
      granny: "COUNTER GRANNY: Flying handbag & Umbrella shield! Duck under with [L] Shin Grab. Watch for helicopter escape!",
      dog: "COUNTER POODLE: Low ankle-biter! Jump over with [W] or trip flat using [L] Low Shin Grab.",
      basketballer: "COUNTER HOOPS: Towering giant bounces balls & dunks! Jump over balls with [W] and close in with [U] Bull Ram.",
      bouncer: "COUNTER BRUTUS: Bulldozer charge & airplane spin! Jump over charge with [W] or counter-ram with [U].",
      skater: "COUNTER SKATER: High-speed roller slalom! Intercept with [K] Headbutt or catch with [L] Low Trip.",
      strongman: "COUNTER STRONGMAN: Whirling Barbell Spin! Keep distance during spin; attack from behind with [O] Donkey Kick!"
    };

    this.resetPracticeDummy();
    this.initPracticeButtons();
  }

  resetPracticeDummy() {
    this.practiceDummy = {
      x: 350,
      y: 420,
      z: 0,
      width: 36,
      height: 60,
      isAlive: true,
      isInvulnerable: false,
      hp: 999,
      maxHp: 999,
      takeDamage: (amt, knock) => {
        if (window.sfx) window.sfx.playPunch();
        if (window.particles) {
          window.particles.spawnHitSparks(350, 420, 30, 8, '#eeee77');
          window.particles.spawnComicText(350, 420, 45, "BOP!", "#39ff14");
        }
      },
      render: (ctx, camera) => {
        const s = camera.scale || 1.0;
        const sx = Math.round((350 - camera.x) * s);
        const sy = Math.round((420 - camera.y) * s);
        window.physics.renderShadow(ctx, camera, 350, 420, 0, 40);

        ctx.save();
        ctx.translate(sx, sy);
        if (s > 1.0) {
          ctx.scale(s, s);
        }
        // Stand base
        ctx.fillStyle = '#333333';
        ctx.fillRect(-16, -6, 32, 6);
        ctx.fillRect(-4, -60, 8, 54);

        // Duke Punching Bag Face
        ctx.fillStyle = '#d49b6a';
        ctx.fillRect(-14, -58, 28, 44);
        ctx.fillStyle = '#ff0055'; // Headband
        ctx.fillRect(-14, -58, 28, 8);
        ctx.fillStyle = '#000000'; // Shades
        ctx.fillRect(-10, -46, 20, 6);
        ctx.fillStyle = '#ffd700'; // Tank top body
        ctx.fillRect(-12, -34, 24, 20);
        ctx.restore();
      }
    };
  }

  startFreePlay() {
    this.isFreePlay = true;
    const guideLayer = document.getElementById('practice-guide-layer');
    const freeToolbar = document.getElementById('dojo-free-toolbar');

    if (guideLayer) guideLayer.classList.add('hidden');
    if (freeToolbar) freeToolbar.classList.remove('hidden');

    if (window.alienVoice) window.alienVoice.speakBopEm();
  }

  toggleGuide() {
    const guideLayer = document.getElementById('practice-guide-layer');
    if (!guideLayer) return;
    const isHidden = guideLayer.classList.toggle('hidden');
    const freeToolbar = document.getElementById('dojo-free-toolbar');
    if (freeToolbar) {
      if (isHidden) freeToolbar.classList.remove('hidden');
    }
  }

  initPracticeButtons() {
    // "LET ME TRY" Button
    const btnTry = document.getElementById('btn-let-me-try');
    if (btnTry) btnTry.onclick = () => this.startFreePlay();

    // Spawner buttons in toolbar
    document.querySelectorAll('.dojo-spawn-btn').forEach(btn => {
      btn.onclick = () => {
        const type = btn.getAttribute('data-spawn');
        this.spawnTrainingEntity(type);
      };
    });

    const btnClear = document.getElementById('btn-dojo-clear');
    if (btnClear) btnClear.onclick = () => this.clearTrainingEntities();

    const btnGuide = document.getElementById('btn-dojo-guide');
    if (btnGuide) btnGuide.onclick = () => this.toggleGuide();

    const btnDojoExit = document.getElementById('btn-dojo-exit');
    if (btnDojoExit) btnDojoExit.onclick = () => this.exitPracticeGym();
  }

  spawnTrainingEntity(type) {
    if (!this.inPracticeMode) return;
    const spawnX = window.game.player.x + (window.game.player.facing * 140);
    const spawnY = Math.max(340, Math.min(480, window.game.player.y + (Math.random() * 40 - 20)));

    if (type === 'trashcan' || type === 'hydrant') {
      window.game.props.push(new StreetProp(spawnX, spawnY, type));
      if (window.sfx) window.sfx.playWhoosh();
      return;
    }

    if (type === 'duke') {
      const duke = new DukeBoss(spawnX, spawnY);
      duke.isTrainingDummy = true;
      duke.say("LET'S SPAR, ALIEN DUDE!");
      window.game.boss = duke;
      if (window.sfx) window.sfx.playWhoosh();
      this.hideTacticalHint();
      return;
    }

    const enemy = new Enemy(spawnX, spawnY, type);
    enemy.isTrainingDummy = true;
    window.game.enemies.push(enemy);
    if (window.sfx) window.sfx.playWhoosh();

    // Show tactical defeat hint if enabled in options
    if (this.enemyHints && this.enemyHints[type]) {
      this.showTacticalHint(this.enemyHints[type]);
    }
  }

  showTacticalHint(text) {
    const hintPill = document.getElementById('dojo-tactical-hint');
    const hintText = document.getElementById('dojo-hint-text');
    if (!hintPill || !hintText) return;

    if (window.game && window.game.dojoHintsEnabled === false) {
      hintPill.classList.add('hidden');
      return;
    }

    hintText.textContent = text;
    hintPill.classList.remove('hidden');

    if (this.hintTimer) clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => {
      hintPill.classList.add('hidden');
    }, 7000);
  }

  hideTacticalHint() {
    const hintPill = document.getElementById('dojo-tactical-hint');
    if (hintPill) hintPill.classList.add('hidden');
  }

  clearTrainingEntities() {
    window.game.enemies = [];
    window.game.boss = null;
    window.game.props = [];
    window.game.pickups = [];
    window.game.projectiles = [];
    this.hideTacticalHint();
    this.resetPracticeDummy();
    if (window.particles) {
      window.particles.spawnComicText(window.game.player.x, window.game.player.y, 40, "CLEARED!", "#ff7777");
    }
  }

  handlePracticeKey(key) {
    if (!this.inPracticeMode) return;

    if (key === 'Digit1') this.spawnTrainingEntity('punk');
    else if (key === 'Digit2') this.spawnTrainingEntity('granny');
    else if (key === 'Digit3') this.spawnTrainingEntity('dog');
    else if (key === 'Digit4') this.spawnTrainingEntity('basketballer');
    else if (key === 'Digit5') this.spawnTrainingEntity('bouncer');
    else if (key === 'Digit6') this.spawnTrainingEntity('skater');
    else if (key === 'Digit7') this.spawnTrainingEntity('strongman');
    else if (key === 'Digit8') this.spawnTrainingEntity('duke');
    else if (key === 'Digit9') this.clearTrainingEntities();
    else if (key === 'Digit0') this.resetPracticeDummy();
    else if (key === 'KeyH') this.toggleGuide();
  }

  exitPracticeGym() {
    this.inPracticeMode = false;
    this.practiceDummy = null;
    this.hideTacticalHint();
    window.game.enemies = [];
    window.game.boss = null;
    window.game.props = [];
    window.game.pickups = [];
    window.game.projectiles = [];

    const practiceScreen = document.getElementById('practice-screen');
    const guideLayer = document.getElementById('practice-guide-layer');
    const freeToolbar = document.getElementById('dojo-free-toolbar');
    const mainMenu = document.getElementById('main-menu-screen');
    const hud = document.getElementById('hud-container');

    if (practiceScreen) practiceScreen.classList.add('hidden');
    if (guideLayer) guideLayer.classList.remove('hidden');
    if (freeToolbar) freeToolbar.classList.add('hidden');
    if (mainMenu) mainMenu.classList.remove('hidden');
    if (hud) hud.classList.add('hidden');

    if (window.game) window.game.showMainMenu();
  }

  // 3. Stage Clear Intermission
  showStageClear(stageNum, enemiesBopped, comboBonus, onNext) {
    const clearScreen = document.getElementById('stage-clear-screen');
    if (!clearScreen) return;

    if (window.sidSynth) window.sidSynth.playTrack('victory');
    if (window.alienVoice) window.alienVoice.laughVictory();

    document.getElementById('stage-clear-title').textContent = `STAGE ${stageNum} CLEARED!`;
    document.getElementById('stat-enemies-defeated').textContent = enemiesBopped;
    document.getElementById('stat-combo-bonus').textContent = `+${comboBonus}`;
    document.getElementById('stat-total-score').textContent = window.game ? window.game.player.score : '0';

    clearScreen.classList.remove('hidden');

    const nextBtn = document.getElementById('btn-next-stage');
    const handleNext = () => {
      clearScreen.classList.add('hidden');
      nextBtn.removeEventListener('click', handleNext);
      if (onNext) onNext();
    };

    nextBtn.addEventListener('click', handleNext);
  }

  // 4. UFO Cosmic Abduction Victory Ending
  showVictoryEnding(finalScore) {
    const victoryScreen = document.getElementById('victory-screen');
    const hud = document.getElementById('hud-container');
    if (!victoryScreen) return;

    if (hud) hud.classList.add('hidden');
    victoryScreen.classList.remove('hidden');

    document.getElementById('victory-final-score').textContent = finalScore;

    if (window.sidSynth) window.sidSynth.playTrack('victory');
    if (window.alienVoice) window.alienVoice.laughVictory();
    if (window.sfx) window.sfx.playTractorBeam();

    const restartBtn = document.getElementById('btn-victory-restart');
    restartBtn.onclick = () => {
      victoryScreen.classList.add('hidden');
      if (window.game) window.game.showMainMenu();
    };
  }
}

// Global Cutscene Manager Instance
window.cutscenes = new CutsceneManager();
