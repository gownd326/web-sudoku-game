export type Difficulty = '초급' | '중급' | '고급';

// 9x9 빈 보드 생성
export function createEmptyBoard(): number[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

// 특정 위치에 숫자를 놓을 수 있는지 검사 (스도쿠 규칙)
export function isValid(board: number[][], row: number, col: number, num: number): boolean {
  if (!board || !board[row]) return false;
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i] && board[i][col] === num && i !== row) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currR = startRow + r;
      const currC = startCol + c;
      if (board[currR] && board[currR][currC] === num && (currR !== row || currC !== col)) {
        return false;
      }
    }
  }

  return true;
}

// 백트래킹을 이용한 스도쿠 솔버 (완성된 보드 생성)
export function solveSudoku(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// 배열 섞기 유틸
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 전체 스도쿠 퍼즐 생성 및 난이도별 빈칸 뚫기
export function generateSudoku(difficulty: Difficulty): { puzzle: number[][]; solution: number[][] } {
  const solution = createEmptyBoard();
  solveSudoku(solution);

  const puzzle = solution.map(row => [...row]);

  // 난이도별 제거할 칸 수 설정
  let cellsToRemove = 30;
  if (difficulty === '중급') cellsToRemove = 40;
  if (difficulty === '고급') cellsToRemove = 50;

  let removed = 0;
  while (removed < cellsToRemove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }

  return { puzzle, solution };
}

// 현재 보드에서 오답인 셀 위치 찾기 (스도쿠 규칙 위반)
export function checkSudoku(board: number[][]): boolean[][] {
  const errors = Array.from({ length: 9 }, () => Array(9).fill(false));
  if (!board || board.length < 9) return errors;

  for (let r = 0; r < 9; r++) {
    if (!board[r]) continue;
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        // 임시로 해당 칸을 0으로 만들고 isValid 검사
        board[r][c] = 0;
        if (!isValid(board, r, c, val)) {
          errors[r][c] = true;
        }
        board[r][c] = val;
      }
    }
  }

  return errors;
}
