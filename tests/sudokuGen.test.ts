import { describe, it, expect } from 'vitest';
import { createEmptyBoard, isValid, generateSudoku, checkSudoku } from '../src/utils/sudokuGen';

describe('sudokuGen utils', () => {
  it('creates an empty 9x9 board correctly', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(9);
    expect(board[0].length).toBe(9);
    expect(board.flat().every(cell => cell === 0)).toBe(true);
  });

  it('validates sudoku row, col, and box rules correctly', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    // Same row violation
    expect(isValid(board, 0, 5, 5)).toBe(false);
    // Same col violation
    expect(isValid(board, 5, 0, 5)).toBe(false);
    // Same 3x3 box violation
    expect(isValid(board, 1, 1, 5)).toBe(false);
    // Valid placement
    expect(isValid(board, 1, 1, 3)).toBe(true);
  });

  it('generates puzzle and solution for different difficulties', () => {
    const { puzzle, solution } = generateSudoku('초급');
    expect(puzzle.length).toBe(9);
    expect(solution.length).toBe(9);

    // Ensure solution has no empty cells
    expect(solution.flat().every(cell => cell >= 1 && cell <= 9)).toBe(true);

    // Ensure puzzle has some empty cells (0)
    expect(puzzle.flat().some(cell => cell === 0)).toBe(true);
  });

  it('detects errors correctly with checkSudoku', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[0][1] = 5; // Duplicate in same row

    const errors = checkSudoku(board);
    expect(errors[0][0]).toBe(true);
    expect(errors[0][1]).toBe(true);
  });
});
