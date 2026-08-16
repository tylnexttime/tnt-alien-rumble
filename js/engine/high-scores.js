/**
 * TNT ALIEN RUMBLE - HIGH SCORE LEADERBOARD MANAGER
 * Top 100 persistent high scores with stage cleared tracking,
 * 6-character names, and 50,000-to-500 default seed.
 */

class HighScoreManager {
  constructor() {
    this.storageKey = 'tnt_high_scores_top100_v1';
    this.maxEntries = 100;
    this.scores = this.loadScores();
    this.lastAddedIndex = -1;
  }

  // Generate authentic default 100 scores: Rank 1 = 50,000, each next is -500
  getDefaultScores() {
    const defaultNames = [
      'GLEEP!', 'DUKEDV', 'AGNES!', 'HOOPS!', 'BRUTUS',
      'MELBRN', 'BEAMSF', 'C64BOB', 'ALIEN1', 'RETROX',
      'ZAPPER', 'CYBORG', 'COMMOD', 'SIDMOS', 'VIC20!',
      'NEO87!', 'SPCKID', 'FLYBOY', 'GGLORP', 'UFOBOB',
      'LASER!', 'KICKER', 'HEADBT', 'RAMMER', 'SHINGR',
      'POODLE', 'BOPPER', 'RUMBLR', 'ARCADE', 'HI-SCR',
      'SECT07', 'COSMIC', 'STREET', 'BRAWLR', 'PIZZAA',
      'CRYS88', 'MAXBOP', 'VORTEX', 'PULSEW', 'NOISE8'
    ];

    const list = [];
    for (let i = 1; i <= this.maxEntries; i++) {
      const score = 50000 - (i - 1) * 500; // Rank 1 = 50000, Rank 100 = 500
      const name = defaultNames[(i - 1) % defaultNames.length];
      
      let stage = 'STAGE 1';
      if (score >= 35000) stage = 'VICTORY';
      else if (score >= 25000) stage = 'STAGE 3';
      else if (score >= 12000) stage = 'STAGE 2';

      list.push({
        rank: i,
        name: name.slice(0, 6).toUpperCase(),
        score: Math.max(score, 500),
        stage: stage,
        date: '1987-08'
      });
    }

    return list;
  }

  loadScores() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize ranks & sort
          return parsed.slice(0, this.maxEntries).map((item, idx) => ({
            rank: idx + 1,
            name: (item.name || 'ANON').slice(0, 6).toUpperCase(),
            score: parseInt(item.score, 10) || 0,
            stage: item.stage || 'STAGE 1',
            date: item.date || 'RECENT'
          }));
        }
      } catch (e) {
        console.warn('Could not parse high scores from localStorage:', e);
      }
    }

    const initial = this.getDefaultScores();
    this.saveScores(initial);
    return initial;
  }

  saveScores(list = this.scores) {
    this.scores = list.slice(0, this.maxEntries).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      name: item.name.slice(0, 6).toUpperCase()
    }));
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
      // Also update top 1 in classic key
      if (this.scores.length > 0) {
        localStorage.setItem('tnt_high_score', this.scores[0].score.toString());
      }
    } catch (e) {
      console.warn('Could not save high scores:', e);
    }
  }

  getTopScore() {
    return this.scores.length > 0 ? this.scores[0].score : 50000;
  }

  isHighScore(score) {
    if (score <= 0) return false;
    if (this.scores.length < this.maxEntries) return true;
    return score > this.scores[this.scores.length - 1].score;
  }

  addScore(name, score, stage = 'STAGE 1') {
    const cleanName = (name || 'GLEEP!').trim().slice(0, 6).toUpperCase() || 'GLEEP!';
    const entry = {
      name: cleanName,
      score: parseInt(score, 10) || 0,
      stage: stage,
      date: new Date().toISOString().split('T')[0]
    };

    this.scores.push(entry);
    // Sort descending by score
    this.scores.sort((a, b) => b.score - a.score);
    this.scores = this.scores.slice(0, this.maxEntries);

    // Re-index ranks and find last added index
    this.lastAddedIndex = this.scores.findIndex(s => s === entry || (s.name === entry.name && s.score === entry.score && s.stage === entry.stage));

    this.saveScores();
    return this.lastAddedIndex + 1; // 1-indexed rank
  }

  resetToDefaults() {
    const initial = this.getDefaultScores();
    this.lastAddedIndex = -1;
    this.saveScores(initial);
    return initial;
  }
}

window.highScores = new HighScoreManager();
