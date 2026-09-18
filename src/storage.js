const STORAGE_KEY = '3d_runner_highscore';

export function getHighScore() {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEY, score.toString());
      return score;
    }
    return current;
  } catch (e) {
    return score;
  }
}
