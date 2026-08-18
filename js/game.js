/**
 * TNT ALIEN RUMBLE - MASTER GAME CONTROLLER
 * Main game loop, stage/wave coordinator, HUD manager, and state machine.
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.gameState = 'menu'; // 'menu', 'playing', 'practice', 'paused', 'gameover', 'clear', 'victory'
    this.currentStageIndex = 0;
    this.currentStageData = STAGES_DATA[0];

    // Entities
    this.player = new Player(120, 420);
    this.enemies = [];
    this.boss = null;
    this.props = [];
    this.pickups = [];
    this.projectiles = [];
    this.hazards = [];
    this.dwarfTimer = 300 + Math.floor(Math.random() * 360);
    this.hazards = [];      // trench-dwarf + his bombs
    this.dwarfTimer = 420;  // frames until the next dwarf wanders on

    // Stage / Wave State
    this.currentWaveIndex = 0;
    this.stageTimer = 99;
    this.stageTimerAccumulator = 0;
    this.enemiesDefeatedInStage = 0;
    this.highScore = parseInt(localStorage.getItem('tnt_high_score') || '50000', 10);
    this.dojoHintsEnabled = localStorage.getItem('tnt_dojo_hints') !== 'false';

    // Continue Timer
    this.continueCountdown = 9;
    this.continueTimerId = null;

    this.initUI();
    this.initLoop();
  }

  initUI() {
    // Buttons
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) btnStart.onclick = () => this.startNewGame();

    const btnPractice = document.getElementById('btn-practice-mode');
    if (btnPractice) btnPractice.onclick = () => window.cutscenes.enterPracticeGym();

    const btnExitPractice = document.getElementById('btn-exit-practice');
    if (btnExitPractice) btnExitPractice.onclick = () => window.cutscenes.exitPracticeGym();

    const btnManual = document.getElementById('btn-moves-manual');
    if (btnManual) {
      btnManual.onclick = () => document.getElementById('moves-manual-screen').classList.remove('hidden');
    }
    const btnCloseManual = document.getElementById('btn-close-manual');
    if (btnCloseManual) {
      btnCloseManual.onclick = () => document.getElementById('moves-manual-screen').classList.add('hidden');
    }
    const btnBackManual = document.getElementById('btn-back-from-manual');
    if (btnBackManual) {
      btnBackManual.onclick = () => document.getElementById('moves-manual-screen').classList.add('hidden');
    }

    const btnStory = document.getElementById('btn-story-intro');
    if (btnStory) {
      btnStory.onclick = () => window.cutscenes.startIntroCrawl(() => this.showMainMenu());
    }

    const btnOptions = document.getElementById('btn-options');
    if (btnOptions) {
      btnOptions.onclick = () => document.getElementById('options-screen').classList.remove('hidden');
    }
    const btnCloseOptions = document.getElementById('btn-close-options');
    if (btnCloseOptions) {
      btnCloseOptions.onclick = () => document.getElementById('options-screen').classList.add('hidden');
    }
    const btnBackOptions = document.getElementById('btn-back-from-options');
    if (btnBackOptions) {
      btnBackOptions.onclick = () => document.getElementById('options-screen').classList.add('hidden');
    }

    // Dojo Hints Toggle
    const btnDojoHints = document.getElementById('btn-toggle-dojo-hints');
    if (btnDojoHints) {
      btnDojoHints.textContent = this.dojoHintsEnabled ? 'ENABLED' : 'DISABLED';
      btnDojoHints.classList.toggle('active', this.dojoHintsEnabled);
      btnDojoHints.onclick = () => {
        this.dojoHintsEnabled = !this.dojoHintsEnabled;
        btnDojoHints.textContent = this.dojoHintsEnabled ? 'ENABLED' : 'DISABLED';
        btnDojoHints.classList.toggle('active', this.dojoHintsEnabled);
        localStorage.setItem('tnt_dojo_hints', this.dojoHintsEnabled ? 'true' : 'false');
      };
    }

    // Game View Zoom Scale Toggle (1X Classic vs 2X Double C64)
    const btnScale = document.getElementById('btn-toggle-scale');
    if (btnScale) {
      const is2X = window.camera.scale > 1.0;
      btnScale.textContent = is2X ? '2X DOUBLE (C64)' : '1X CLASSIC';
      btnScale.classList.toggle('active', is2X);
      btnScale.onclick = () => {
        const nextScale = window.camera.scale > 1.0 ? 1.0 : 2.0;
        window.camera.setScale(nextScale);
        const active2X = nextScale > 1.0;
        btnScale.textContent = active2X ? '2X DOUBLE (C64)' : '1X CLASSIC';
        btnScale.classList.toggle('active', active2X);
      };
    }

    const btnCrt = document.getElementById('btn-toggle-crt');
    if (btnCrt) {
      btnCrt.onclick = () => {
        const active = btnCrt.classList.toggle('active');
        btnCrt.textContent = active ? 'ENABLED' : 'DISABLED';
        const container = document.getElementById('game-container');
        if (active) container.classList.add('crt-scanlines');
        else container.classList.remove('crt-scanlines');
      };
    }

    const btnFullscreen = document.getElementById('btn-toggle-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.onclick = () => {
        if (!document.fullscreenElement) {
          document.getElementById('game-container').requestFullscreen().catch(err => alert(err.message));
        } else {
          document.exitFullscreen();
        }
      };
    }

    // Volume Sliders
    this.initVolumeSliders();

    // High Scores Modal Controls
    this.currentHighScoreRange = 10;
    this.initHighScoresUI();
  }

  initVolumeSliders() {
    // 1. Master Volume
    const sliderMaster = document.getElementById('slider-master-vol');
    const labelMaster = document.getElementById('label-master-vol');
    const savedMaster = localStorage.getItem('tnt_master_vol') || '70';
    if (sliderMaster && labelMaster) {
      sliderMaster.value = savedMaster;
      labelMaster.textContent = `${savedMaster}%`;
      sliderMaster.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        labelMaster.textContent = `${val}%`;
        localStorage.setItem('tnt_master_vol', val.toString());
        if (window.sidSynth) window.sidSynth.setMasterVolume(val / 100);
      };
    }

    // 2. Music Volume
    const sliderMusic = document.getElementById('slider-music-vol');
    const labelMusic = document.getElementById('label-music-vol');
    const savedMusic = localStorage.getItem('tnt_music_vol') || '50';
    if (sliderMusic && labelMusic) {
      sliderMusic.value = savedMusic;
      labelMusic.textContent = `${savedMusic}%`;
      sliderMusic.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        labelMusic.textContent = `${val}%`;
        localStorage.setItem('tnt_music_vol', val.toString());
        if (window.sidSynth) window.sidSynth.setMusicVolume(val / 100);
      };
    }

    // 3. SFX Volume
    const sliderSfx = document.getElementById('slider-sfx-vol');
    const labelSfx = document.getElementById('label-sfx-vol');
    const savedSfx = localStorage.getItem('tnt_sfx_vol') || '70';
    if (sliderSfx && labelSfx) {
      sliderSfx.value = savedSfx;
      labelSfx.textContent = `${savedSfx}%`;
      sliderSfx.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        labelSfx.textContent = `${val}%`;
        localStorage.setItem('tnt_sfx_vol', val.toString());
        if (window.sidSynth) window.sidSynth.setSfxVolume(val / 100);
      };
    }

    // 4. Voice Volume
    const sliderVoice = document.getElementById('slider-voice-vol');
    const labelVoice = document.getElementById('label-voice-vol');
    const savedVoice = localStorage.getItem('tnt_voice_vol') || '80';
    if (sliderVoice && labelVoice) {
      sliderVoice.value = savedVoice;
      labelVoice.textContent = `${savedVoice}%`;
      sliderVoice.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        labelVoice.textContent = `${val}%`;
        localStorage.setItem('tnt_voice_vol', val.toString());
        if (window.sidSynth) window.sidSynth.setVoiceVolume(val / 100);
      };
    }

    // Apply all saved volume settings immediately on startup
    if (window.sidSynth) {
      window.sidSynth.setMasterVolume(parseInt(savedMaster, 10) / 100);
      window.sidSynth.setMusicVolume(parseInt(savedMusic, 10) / 100);
      window.sidSynth.setSfxVolume(parseInt(savedSfx, 10) / 100);
      window.sidSynth.setVoiceVolume(parseInt(savedVoice, 10) / 100);
    }
  }

  initHighScoresUI() {
    // Main Menu High Scores Button
    const btnHighScores = document.getElementById('btn-high-scores');
    if (btnHighScores) {
      btnHighScores.onclick = () => this.showHighScoresModal(10);
    }

    // Modal Close Buttons
    const btnClose = document.getElementById('btn-close-high-scores');
    if (btnClose) {
      btnClose.onclick = () => document.getElementById('high-scores-screen').classList.add('hidden');
    }
    const btnBack = document.getElementById('btn-back-from-high-scores');
    if (btnBack) {
      btnBack.onclick = () => document.getElementById('high-scores-screen').classList.add('hidden');
    }

    // Tabs: Top 10, Top 50, All 100
    const tabs = [
      { id: 'tab-top-10', range: 10 },
      { id: 'tab-top-50', range: 50 },
      { id: 'tab-top-100', range: 100 }
    ];
    tabs.forEach(tab => {
      const el = document.getElementById(tab.id);
      if (el) {
        el.onclick = () => {
          this.currentHighScoreRange = tab.range;
          tabs.forEach(t => {
            const btn = document.getElementById(t.id);
            if (btn) btn.classList.toggle('active', t.range === tab.range);
          });
          this.renderHighScoresTable(tab.range);
        };
      }
    });

    // Reset Defaults Button
    const btnReset = document.getElementById('btn-reset-high-scores');
    if (btnReset) {
      btnReset.onclick = () => {
        if (confirm("Reset leaderboard to default 50,000 pts seed?")) {
          window.highScores.resetToDefaults();
          this.highScore = window.highScores.getTopScore();
          document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
          this.renderHighScoresTable(this.currentHighScoreRange);
        }
      };
    }

    // Game Over & Victory View Scores Buttons
    const btnGameOverScores = document.getElementById('btn-view-scores-gameover');
    if (btnGameOverScores) {
      btnGameOverScores.onclick = () => this.showHighScoresModal(10);
    }
    const btnVictoryScores = document.getElementById('btn-view-scores-victory');
    if (btnVictoryScores) {
      btnVictoryScores.onclick = () => this.showHighScoresModal(10);
    }

    // Return to Menu on Game Over
    const btnQuit = document.getElementById('btn-quit-game');
    if (btnQuit) {
      btnQuit.onclick = () => this.showMainMenu();
    }

    // High Score Submission on Game Over
    const btnSubmitGameOver = document.getElementById('btn-submit-high-score');
    const inputPlayerName = document.getElementById('input-player-name');
    if (btnSubmitGameOver && inputPlayerName) {
      const submitGameOverScore = () => {
        const name = (inputPlayerName.value || 'GLEEP!').trim().slice(0, 6).toUpperCase();
        const stageReached = `STAGE ${this.currentStageIndex + 1}`;
        const rank = window.highScores.addScore(name, this.player.score, stageReached);
        this.highScore = window.highScores.getTopScore();
        document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
        document.getElementById('game-over-highscore-entry').classList.add('hidden');
        this.showHighScoresModal(Math.max(10, Math.ceil(rank / 10) * 10), rank - 1);
      };

      btnSubmitGameOver.onclick = submitGameOverScore;
      inputPlayerName.onkeydown = (e) => {
        if (e.key === 'Enter') submitGameOverScore();
      };
    }

    // High Score Submission on Victory
    const btnSubmitVictory = document.getElementById('btn-submit-victory-score');
    const inputVictoryName = document.getElementById('input-victory-name');
    if (btnSubmitVictory && inputVictoryName) {
      const submitVictoryScore = () => {
        const name = (inputVictoryName.value || 'GLEEP!').trim().slice(0, 6).toUpperCase();
        const rank = window.highScores.addScore(name, this.player.score, 'VICTORY');
        this.highScore = window.highScores.getTopScore();
        document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
        document.getElementById('victory-highscore-entry').classList.add('hidden');
        this.showHighScoresModal(Math.max(10, Math.ceil(rank / 10) * 10), rank - 1);
      };

      btnSubmitVictory.onclick = submitVictoryScore;
      inputVictoryName.onkeydown = (e) => {
        if (e.key === 'Enter') submitVictoryScore();
      };
    }

    // ROLL THE CREDITS, from the victory screen.
    const btnVictoryCredits = document.getElementById('btn-victory-credits');
    if (btnVictoryCredits) {
      btnVictoryCredits.onclick = () => {
        // A qualifying score that has NOT been submitted yet must not be lost
        // behind the credits: bank it under the name currently in the box
        // (defaulting to GLEEP!) before the crawl covers the screen.
        const entry = document.getElementById('victory-highscore-entry');
        if (entry && !entry.classList.contains('hidden')) {
          const nameEl = document.getElementById('input-victory-name');
          const name = ((nameEl && nameEl.value) || 'GLEEP!').trim().slice(0, 6).toUpperCase() || 'GLEEP!';
          window.highScores.addScore(name, this.player.score, 'VICTORY');
          this.highScore = window.highScores.getTopScore();
          const menuScore = document.getElementById('menu-high-score');
          if (menuScore) menuScore.textContent = this.formatScore(this.highScore);
          entry.classList.add('hidden');
        }

        const victoryScreen = document.getElementById('victory-screen');
        if (victoryScreen) victoryScreen.classList.add('hidden');
        window.cutscenes.startEndCredits(() => this.showMainMenu());
      };
    }

    // Set initial menu score
    if (window.highScores) {
      this.highScore = window.highScores.getTopScore();
      document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
    }
  }

  showHighScoresModal(range = 10, highlightIndex = -1) {
    this.currentHighScoreRange = range;
    document.getElementById('high-scores-screen').classList.remove('hidden');

    const tabs = [
      { id: 'tab-top-10', range: 10 },
      { id: 'tab-top-50', range: 50 },
      { id: 'tab-top-100', range: 100 }
    ];
    tabs.forEach(t => {
      const btn = document.getElementById(t.id);
      if (btn) btn.classList.toggle('active', t.range === range);
    });

    this.renderHighScoresTable(range, highlightIndex);
  }

  renderHighScoresTable(range = 10, highlightIndex = -1) {
    const tbody = document.getElementById('high-scores-table-body');
    if (!tbody || !window.highScores) return;

    const list = window.highScores.scores.slice(0, range);
    let html = '';

    list.forEach((item, idx) => {
      let rowClass = '';
      if (item.rank === 1) rowClass = 'rank-top1';
      else if (item.rank === 2) rowClass = 'rank-top2';
      else if (item.rank === 3) rowClass = 'rank-top3';

      if (idx === highlightIndex || (window.highScores.lastAddedIndex === idx && highlightIndex !== -1)) {
        rowClass += ' highlight-row';
      }

      let rankLabel = `#${item.rank}`;
      if (item.rank === 1) rankLabel = `🥇 #1`;
      else if (item.rank === 2) rankLabel = `🥈 #2`;
      else if (item.rank === 3) rankLabel = `🥉 #3`;

      const safeName = item.name.slice(0, 6).padEnd(6, ' ');
      const safeScore = this.formatScore(item.score);
      const safeStage = item.stage || 'STAGE 1';

      html += `
        <tr class="${rowClass}">
          <td class="col-rank">${rankLabel}</td>
          <td class="col-name">${safeName}</td>
          <td class="col-score">${safeScore}</td>
          <td class="col-stage">${safeStage}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  showMainMenu() {
    this.gameState = 'menu';
    document.getElementById('main-menu-screen').classList.remove('hidden');
    document.getElementById('hud-container').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('stage-clear-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('high-scores-screen').classList.add('hidden');

    if (window.highScores) {
      this.highScore = window.highScores.getTopScore();
      document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
    }

    // Every time you go to main menu - music stops!
    if (window.sidSynth) {
      window.sidSynth.stopMusic();
    }
  }

  startNewGame() {
    // Start with Star Wars Intro Crawl on fresh play
    window.cutscenes.startIntroCrawl(() => {
      this.loadStage(0);
    });
  }

  loadStage(index) {
    this.currentStageIndex = index;
    this.currentStageData = STAGES_DATA[index];
    this.currentWaveIndex = 0;
    this.stageTimer = 99;
    this.stageTimerAccumulator = 0;
    this.enemiesDefeatedInStage = 0;

    // Reset Camera
    window.camera.setStageBounds(this.currentStageData.length);

    // Reset Player
    if (this.currentStageIndex === 0) {
      this.player.score = 0;
      this.player.lives = 3;
    }
    this.player.reset(120, 420);

    // Clear and load stage props
    this.props = [];
    this.pickups = [];
    this.projectiles = [];
    if (this.currentStageData.props) {
      for (const p of this.currentStageData.props) {
        this.props.push(new StreetProp(p.x, p.y, p.type));
      }
    }

    // Reset enemies & boss
    this.enemies = [];
    this.boss = null;

    // Switch UI
    document.getElementById('main-menu-screen').classList.add('hidden');
    document.getElementById('stage-clear-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('high-scores-screen').classList.add('hidden');
    document.getElementById('hud-container').classList.remove('hidden');
    document.getElementById('hud-stage-name').textContent = this.currentStageData.name;

    // Play Stage Music
    if (window.sidSynth) {
      window.sidSynth.playTrack(this.currentStageData.music);
    }

    if (window.alienVoice) {
      setTimeout(() => window.alienVoice.speakBopEm(), 600);
    }

    this.gameState = 'playing';
  }

  addScore(pts) {
    this.player.score += pts;
    if (this.player.score > this.highScore) {
      this.highScore = this.player.score;
      document.getElementById('menu-high-score').textContent = this.formatScore(this.highScore);
    }
  }

  formatScore(score) {
    return score.toString().padStart(6, '0');
  }

  spawnPickup(x, y, type) {
    this.pickups.push(new PickupItem(x, y, type));
  }

  // The trench-coat dwarf from Bop'n Rumble (1987): wanders on, lobs you
  // something, wanders off. Early stages he brings a heart; from stage 3 on
  // it is increasingly a bomb instead — which is the original's gamble.
  updateDwarfSpawner(dt = 1) {
    if (window.cutscenes && window.cutscenes.inPracticeMode) return;
    if (!this.player || !this.player.isAlive) return;
    if (this.hazards.some(h => h instanceof TrenchDwarf)) return;

    this.dwarfTimer -= dt;
    if (this.dwarfTimer > 0) return;
    this.dwarfTimer = 900 + Math.floor(Math.random() * 600);

    const stage = this.currentStageIndex || 0;
    const bombChance = stage < 2 ? 0 : Math.min(0.65, 0.2 + (stage - 2) * 0.15);
    const givesBomb = Math.random() < bombChance;

    const fromLeft = Math.random() < 0.5;
    const cam = window.camera;
    const camX = cam ? cam.x : 0;
    // The VISIBLE world width, not the backing-canvas width: at 2X zoom the
    // camera shows viewportWidth/scale world px, so using 960 raw would drop
    // him ~520px off the right edge and he'd throw the heart off-screen.
    const viewW = cam ? cam.viewportWidth / (cam.scale || 1) : 960;
    const x = fromLeft ? camX - 40 : camX + viewW + 40;
    const y = this.player.y + (Math.random() * 40 - 20);

    this.hazards.push(new TrenchDwarf(x, y, fromLeft, givesBomb));
  }

  onEnemyDefeated(enemy) {
    this.enemiesDefeatedInStage++;
  }

  onBossDefeated(boss) {
    if (boss && boss.isTrainingDummy) return;
    if (window.cutscenes && window.cutscenes.inPracticeMode) return;

    setTimeout(() => {
      this.gameState = 'victory';
      const formattedScore = this.formatScore(this.player.score);
      window.cutscenes.showVictoryEnding(formattedScore);

      // Check if Victory Score qualifies for Top 100 Leaderboard
      if (window.highScores && window.highScores.isHighScore(this.player.score)) {
        const victoryEntry = document.getElementById('victory-highscore-entry');
        if (victoryEntry) {
          victoryEntry.classList.remove('hidden');
          const input = document.getElementById('input-victory-name');
          if (input) setTimeout(() => input.focus(), 500);
        }
      }
    }, 7200);   // was 2200. Duke's send-off runs ~4.6s (last words -> poof) and the
                //  victory card used to cover him before the punchline; the extra
                //  ~2.2s after he vanishes is deliberate breathing room — the rooftop
                //  is yours, and [T] Alien Taunt still works.
  }

  onPlayerDeath() {
    if (this.player.lives > 0) {
      // Respawn with invulnerability
      setTimeout(() => {
        if (this.gameState === 'playing') {
          this.player.reset(window.camera.x + 100, 420);
        }
      }, 1800);
    } else {
      // Straight to Game Over when all lives are lost!
      setTimeout(() => {
        this.triggerGameOver();
      }, 1500);
    }
  }

  triggerGameOver() {
    this.gameState = 'gameover';
    document.getElementById('hud-container').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');

    const formattedScore = this.formatScore(this.player.score);
    const stageReached = `STAGE ${this.currentStageIndex + 1}`;

    document.getElementById('gameover-final-score').textContent = formattedScore;
    document.getElementById('gameover-stage-reached').textContent = stageReached;

    // Check if player's score qualifies for the Top 100 High Scores
    const entryBox = document.getElementById('game-over-highscore-entry');
    if (window.highScores && window.highScores.isHighScore(this.player.score)) {
      if (entryBox) {
        entryBox.classList.remove('hidden');
        const inputName = document.getElementById('input-player-name');
        if (inputName) setTimeout(() => inputName.focus(), 300);
      }
    } else {
      if (entryBox) entryBox.classList.add('hidden');
    }
  }

  triggerSuperAttack(player) {
    // Abduct / Zap all active enemies
    window.particles.spawnUfoBeam(player.x, player.y);

    for (const enemy of this.enemies) {
      if (enemy.isAlive) {
        window.particles.spawnUfoBeam(enemy.x, enemy.y);
        enemy.takeDamage(60, 10, true);
      }
    }

    if (this.boss && this.boss.isAlive) {
      window.particles.spawnUfoBeam(this.boss.x, this.boss.y);
      this.boss.takeDamage(75, 8, true);
    }
  }

  updateWaves() {
    const stage = this.currentStageData;
    if (!stage.waves || this.currentWaveIndex >= stage.waves.length) {
      // Check stage clear if reached end of street
      if (this.enemies.filter(e => e.isAlive).length === 0 && (!this.boss || !this.boss.isAlive)) {
        if (this.player.x >= stage.length - 150) {
          this.triggerStageClear();
        } else {
          // Show GO prompt
          document.getElementById('hud-go-arrow').classList.remove('hidden');
        }
      }
      return;
    }

    const currentWave = stage.waves[this.currentWaveIndex];

    // Trigger wave spawn
    if (this.player.x >= currentWave.triggerX && this.enemies.filter(e => e.isAlive).length === 0) {
      document.getElementById('hud-go-arrow').classList.add('hidden');
      window.camera.lockCurrentArea();

      if (currentWave.isBossWave) {
        // Spawn Boss: Duke Davis
        this.boss = new DukeBoss(currentWave.boss.x, currentWave.boss.y);
        document.getElementById('hud-boss-box').classList.remove('hidden');
        document.getElementById('hud-boss-name').textContent = this.boss.name;
      } else {
        // Spawn Enemies
        for (const e of currentWave.enemies) {
          this.enemies.push(new Enemy(e.x, e.y, e.type));
        }
      }

      this.currentWaveIndex++;
    }

    // Check if active wave is cleared
    if (this.enemies.filter(e => e.isAlive).length === 0 && (!this.boss || !this.boss.isAlive)) {
      window.camera.unlockArea();
      document.getElementById('hud-go-arrow').classList.remove('hidden');
    } else {
      document.getElementById('hud-go-arrow').classList.add('hidden');
    }
  }

  triggerStageClear() {
    this.gameState = 'clear';
    const comboBonus = this.player.comboCount * 500;
    this.addScore(5000 + comboBonus);

    window.cutscenes.showStageClear(
      this.currentStageIndex + 1,
      this.enemiesDefeatedInStage,
      comboBonus,
      () => {
        if (this.currentStageIndex + 1 < STAGES_DATA.length) {
          this.loadStage(this.currentStageIndex + 1);
        } else {
          this.gameState = 'victory';
          window.cutscenes.showVictoryEnding(this.formatScore(this.player.score));
        }
      }
    );
  }

  updateHUD() {
    // Score
    document.getElementById('hud-score').textContent = this.formatScore(this.player.score);

    // HP Bar
    const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    document.getElementById('hud-hp-bar').style.width = `${hpPct}%`;

    // Lives
    let hearts = '';
    for (let i = 0; i < this.player.lives; i++) hearts += '♥';
    document.getElementById('hud-lives').textContent = hearts || '💀';

    // Rage / UFO Bar
    document.getElementById('hud-rage-bar').style.width = `${this.player.rageMeter}%`;
    const superReady = document.getElementById('hud-rage-ready');
    if (this.player.rageMeter >= 100) {
      superReady.classList.remove('hidden');
    } else {
      superReady.classList.add('hidden');
    }

    // Timer
    document.getElementById('hud-timer').textContent = this.stageTimer.toString().padStart(2, '0');

    // Combo Counter
    const comboBox = document.getElementById('hud-combo-box');
    if (this.player.comboCount >= 2) {
      comboBox.classList.remove('hidden');
      document.getElementById('hud-combo-count').textContent = this.player.comboCount;
    } else {
      comboBox.classList.add('hidden');
    }

    // Boss Bar
    if (this.boss && this.boss.isAlive) {
      const bossHpPct = Math.max(0, (this.boss.hp / this.boss.maxHp) * 100);
      document.getElementById('hud-boss-hp-bar').style.width = `${bossHpPct}%`;
    } else {
      document.getElementById('hud-boss-box').classList.add('hidden');
    }
  }

  updateCombatCollisions() {
    // 1. Player attack hits on enemies
    if (this.player.isAttacking && this.player.activeHitbox && !this.player.hasHitThisAttack) {
      const box = this.player.activeHitbox;

      // Check standard enemies
      for (const enemy of this.enemies) {
        if (enemy.isAlive && window.physics.checkHit(this.player, box, enemy)) {
          this.player.onHitEnemy(enemy, box);
          enemy.takeDamage(box.damage, box.knockback, box.knockAir, box.knockTrip);
          if (box.stun) window.particles.spawnStunStars(enemy, box.stun);
        }
      }

      // Check boss
      if (this.boss && this.boss.isAlive && window.physics.checkHit(this.player, box, this.boss)) {
        this.player.onHitEnemy(this.boss, box);
        this.boss.takeDamage(box.damage, box.knockback, box.knockAir);
      }

      // Check breakable props
      for (const prop of this.props) {
        if (!prop.isBroken && Math.abs(this.player.x - prop.x) < 40 && Math.abs(this.player.y - prop.y) < 25) {
          prop.takeDamage(1);
        }
      }

      // Check practice dummy in Dojo
      if (window.cutscenes.inPracticeMode && window.cutscenes.practiceDummy) {
        const dummy = window.cutscenes.practiceDummy;
        if (Math.abs(this.player.x - dummy.x) < 45 && Math.abs(this.player.y - dummy.y) < 25) {
          this.player.hasHitThisAttack = true;
          dummy.takeDamage(box.damage, box.knockback);
          document.getElementById('practice-current-move').textContent = `MOVE: ${this.player.state.toUpperCase()}`;
        }
      }
    }

    // 2. Player item pickup collection
    for (const item of this.pickups) {
      if (item.isAlive && Math.abs(this.player.x - item.x) < 30 && Math.abs(this.player.y - item.y) < 22) {
        item.collect(this.player);
      }
    }

    // 2b. Bomb defusal — duck over it (Low Shin Grab), as in the 1987 original
    for (const h of this.hazards) {
      if (h.tryDefuse && this.player.isAlive) h.tryDefuse(this.player);
    }

    // 3. Enemy Projectiles hits on Player (Basketballs & Handbags)
    for (const proj of this.projectiles) {
      if (!proj.isAlive || !this.player.isAlive) continue;

      const dx = Math.abs(proj.x - this.player.x);
      const dy = Math.abs(proj.y - this.player.y);
      const dz = Math.abs(proj.z - this.player.z);

      if (dx < 26 && dy < 20) {
        if (proj.type === 'handbag') {
          // Handbag Dodge: Player ducks (low_trip / shin grab) or jumps high
          const isDucking = this.player.state === 'low_trip';
          const isHighJump = this.player.z > 32;
          if (isDucking || isHighJump) {
            if (window.particles && Math.random() < 0.3) {
              window.particles.spawnComicText(this.player.x, this.player.y, this.player.z + 35, isDucking ? "DUCKED!" : "LEAPED OVER!", "#39ff14");
            }
            continue;
          }
        } else if (proj.type === 'basketball') {
          // Basketball Dodge: Player jumps over bouncing ball
          if (this.player.z > 24 && proj.z < 18) {
            if (window.particles && Math.random() < 0.3) {
              window.particles.spawnComicText(this.player.x, this.player.y, this.player.z + 35, "JUMPED OVER!", "#39ff14");
            }
            continue;
          }
        }

        if (dz < 28) {
          proj.isAlive = false;
          if (!proj.isTrainingDummy) {
            this.player.takeDamage(proj.damage, 3);
          } else {
            if (window.particles) {
              window.particles.spawnComicText(this.player.x, this.player.y, this.player.z + 35, "PRACTICE!", "#aaffee");
            }
          }

          if (proj.type === 'handbag' && window.sfx) window.sfx.playHandbag();
          else if (proj.type === 'basketball' && window.sfx) window.sfx.playBasketballBounce();
        }
      }
    }
  }

  update(dt = 1) {
    window.input.update();

    if (this.gameState === 'playing') {
      // Stage Timer countdown
      this.stageTimerAccumulator += dt;
      if (this.stageTimerAccumulator >= 60) {
        this.stageTimerAccumulator = 0;
        this.stageTimer--;
        if (this.stageTimer <= 0) {
          this.player.takeDamage(999);
        }
      }

      // Update Player
      this.player.handleInput(window.input);
      this.player.update(dt);

      // Update Camera tracking
      window.camera.update(this.player);

      // Update Enemies
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        enemy.update(this.player, dt);
      }
      this.enemies = this.enemies.filter(e => !e.isDespawned);

      // Update Boss
      if (this.boss) {
        this.boss.update(this.player, dt);
        if (this.boss.isDespawned) this.boss = null;
      }

      // Update Pickups & Props & Projectiles
      for (const item of this.pickups) item.update(dt);
      this.pickups = this.pickups.filter(p => p.isAlive);

      for (const proj of this.projectiles) proj.update(dt);
      this.projectiles = this.projectiles.filter(p => p.isAlive);

      for (const h of this.hazards) h.update(dt);
      this.hazards = this.hazards.filter(h => h.isAlive);
      this.updateDwarfSpawner(dt);

      // Update Waves & Hit Collisions
      this.updateWaves();
      this.updateCombatCollisions();
      this.updateHUD();
    } else if (window.cutscenes.inPracticeMode) {
      // Handle Digit Keys 1..0 & H for Dojo spawner & guide
      const digitKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'KeyH'];
      for (const k of digitKeys) {
        if (window.input.isJustPressed(k)) {
          window.cutscenes.handlePracticeKey(k);
        }
      }

      this.player.handleInput(window.input);
      this.player.update(dt);
      window.camera.update(this.player);

      // Update spawned training enemies & boss
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        enemy.update(this.player, dt);
      }
      this.enemies = this.enemies.filter(e => !e.isDespawned);

      if (this.boss) {
        this.boss.update(this.player, dt);
        if (this.boss.isDespawned) this.boss = null;
      }
      for (const item of this.pickups) item.update(dt);
      this.pickups = this.pickups.filter(p => p.isAlive);

      for (const proj of this.projectiles) proj.update(dt);
      this.projectiles = this.projectiles.filter(p => p.isAlive);

      this.updateCombatCollisions();
      this.updateHUD();

      // Display current move in Dojo badge
      if (this.player.isAttacking) {
        const moveBadge = document.getElementById('practice-current-move');
        if (moveBadge) moveBadge.textContent = `LAST MOVE: ${this.player.state.toUpperCase()}`;
      }
    }

    // Update Particles
    window.particles.update();
    window.input.postUpdate();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === 'playing' || window.cutscenes.inPracticeMode) {
      // 1. Parallax Stage Background
      window.stageRenderer.renderBackground(this.ctx, window.camera, this.currentStageData);

      // 2. 2.5D Entities (Y-sorted for proper depth layering)
      const renderList = [];

      // Add props
      for (const prop of this.props) renderList.push(prop);
      // Add pickups
      for (const item of this.pickups) renderList.push(item);
      // Add projectiles (Basketballs, Handbags)
      for (const proj of this.projectiles) renderList.push(proj);
      // Add the trench dwarf and any live bombs
      for (const h of this.hazards) renderList.push(h);
      // Add enemies
      for (const enemy of this.enemies) renderList.push(enemy);
      // Add boss
      if (this.boss) renderList.push(this.boss);
      // Add player
      renderList.push(this.player);
      // Add practice dummy
      if (window.cutscenes.inPracticeMode && window.cutscenes.practiceDummy) {
        renderList.push(window.cutscenes.practiceDummy);
      }

      // Sort by ground depth Y
      renderList.sort((a, b) => a.y - b.y);

      // Render in order
      for (const entity of renderList) {
        entity.render(this.ctx, window.camera);
      }

      // 3. Render Particles & Comic FX (Transformed by Camera)
      window.camera.applyTransform(this.ctx);
      window.particles.render(this.ctx);
      window.camera.restoreTransform(this.ctx);
    }
  }

  initLoop() {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / (1000 / 60), 2.0); // Clamped delta time
      lastTime = time;

      this.update(dt);
      this.render();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Launch Game on Window Load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});
