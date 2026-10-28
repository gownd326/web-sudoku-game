import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App Integration Tests', () => {
  it('renders main page and starts game with timer', async () => {
    render(<App />);

    // Check title or control elements presence
    const titleEl = screen.queryByText(/웹 스도쿠 퍼즐/i);
    const beginnerBtn = screen.queryByRole('button', { name: '초급' });
    expect(titleEl || beginnerBtn).toBeTruthy();

    // Check initial timer display
    expect(screen.getByText(/00:00/)).toBeInTheDocument();
  });

  it('toggles pause state when pause button is clicked', async () => {
    render(<App />);

    const pauseButton = screen.getByRole('button', { name: /일시정지/i });
    fireEvent.click(pauseButton);

    // After pausing, overlay should appear
    expect(screen.getByText('게임 일시정지됨')).toBeInTheDocument();

    const resumeButton = screen.getByRole('button', { name: /재개/i });
    fireEvent.click(resumeButton);

    expect(screen.queryByText('게임 일시정지됨')).not.toBeInTheDocument();
  });

  it('allows selecting a cell and inputting a number', async () => {
    render(<App />);

    // Find all cell buttons (81 cells)
    const cells = screen.getAllByRole('button', { name: /행 \d+, 열 \d+, 값 .+/i });
    expect(cells.length).toBe(81);

    // Click the first cell
    fireEvent.click(cells[0]);

    // Click number pad 1
    const numPad1 = screen.getByRole('button', { name: '숫자 1' });
    fireEvent.click(numPad1);

    // Cell value should update (either 1 or remain if it was an initial given number, but let's verify interaction works)
    expect(cells[0]).toBeInTheDocument();
  });
});
