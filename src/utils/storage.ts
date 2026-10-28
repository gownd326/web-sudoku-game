export type Difficulty = '초급' | '중급' | '고급';

export interface SavedGame {
  difficulty: Difficulty;
  board: number[][];
  solution: number[][];
  initialBoard: boolean[][];
  userBoard: number[][];
  notes: number[][][];
  seconds: number;
  isPaused: boolean;
  isWon: boolean;
}

export function loadBestTime(difficulty: Difficulty): number | null {
  try {
    const val = localStorage.getItem(`sudoku_best_time_${difficulty}`);
    if (val === null) return null;
    const parsed = Number(val);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

export function saveBestTime(difficulty: Difficulty, seconds: number): void {
  try {
    localStorage.setItem(`sudoku_best_time_${difficulty}`, String(seconds));
  } catch (e) {
    console.error('Failed to save best time', e);
  }
}

export function loadSavedGame(): SavedGame | null {
  try {
    const val = localStorage.getItem('sudoku_saved_game');
    if (!val) return null;
    return JSON.parse(val) as SavedGame;
  } catch {
    return null;
  }
}

export function saveSavedGame(game: SavedGame): void {
  try {
    localStorage.setItem('sudoku_saved_game', JSON.stringify(game));
  } catch (e) {
    console.error('Failed to save game state', e);
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem('sudoku_saved_game');
  } catch (e) {
    console.error('Failed to clear saved game', e);
  }
}
