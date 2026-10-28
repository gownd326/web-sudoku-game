import { useState, useEffect, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import WinModal from './components/WinModal';
import { generateSudoku, checkSudoku } from './utils/sudokuGen';
import { loadBestTime, saveBestTime, loadSavedGame, saveSavedGame, clearSavedGame, Difficulty } from './utils/storage';

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('초급');
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<boolean[][]>([]);
  const [userBoard, setUserBoard] = useState<number[][]>([]);
  const [notes, setNotes] = useState<Set<number>[][]>([]);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    초급: null,
    중급: null,
    고급: null,
  });

  const [isWon, setIsWon] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // 초기 최고 기록 로드
  useEffect(() => {
    setBestTimes({
      초급: loadBestTime('초급'),
      중급: loadBestTime('중급'),
      고급: loadBestTime('고급'),
    });
  }, []);

  // 새 게임 시작 함수
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    setDifficulty(diff);
    const { puzzle, solution: sol } = generateSudoku(diff);
    const initFlags = puzzle.map(row => row.map(cell => cell !== 0));
    const initialNotes: Set<number>[][] = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set<number>())
    );

    setBoard(puzzle);
    setSolution(sol);
    setInitialBoard(initFlags);
    setUserBoard(puzzle.map(row => [...row]));
    setNotes(initialNotes);
    setSelectedCell(null);
    setIsPaused(false);
    setSeconds(0);
    setIsWon(false);
    setIsNewRecord(false);

    clearSavedGame();
  }, [difficulty]);

  // 마운트 시 저장된 게임 로드 또는 새 게임
  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) {
      setDifficulty(saved.difficulty);
      setBoard(saved.board);
      setSolution(saved.solution);
      setInitialBoard(saved.initialBoard);
      setUserBoard(saved.userBoard);
      setNotes(saved.notes.map(row => row.map(arr => new Set(arr))));
      setSeconds(saved.seconds);
      setIsPaused(saved.isPaused);
      setIsWon(saved.isWon);
    } else {
      startNewGame('초급');
    }
  }, [startNewGame]);

  // 상태 변경 시 LocalStorage에 게임 진행 상태 저장
  useEffect(() => {
    if (board.length > 0 && !isWon) {
      saveSavedGame({
        difficulty,
        board,
        solution,
        initialBoard,
        userBoard,
        notes: notes.map(row => row.map(set => Array.from(set))),
        seconds,
        isPaused,
        isWon,
      });
    }
  }, [difficulty, board, solution, initialBoard, userBoard, notes, seconds, isPaused, isWon]);

  // 타이머 작동
  useEffect(() => {
    if (isPaused || isWon || board.length === 0) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isWon, board.length]);

  // 게임 클리어 체크
  const checkWinCondition = useCallback((currentBoard: number[][]) => {
    if (currentBoard.length === 0) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0 || currentBoard[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  }, [solution]);

  // 숫자 입력 처리
  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || isPaused || isWon) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c]) return; // 기본 주어진 숫자는 수정 불가

    if (isNoteMode) {
      // 메모 모드
      setUserBoard(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = 0; // 숫자를 지우고 메모로
        return next;
      });
      setNotes(prev => {
        const next = prev.map(row => row.map(s => new Set(s)));
        if (next[r][c].has(num)) {
          next[r][c].delete(num);
        } else {
          next[r][c].add(num);
        }
        return next;
      });
    } else {
      // 일반 숫자 입력 모드
      setUserBoard(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = num;

        // 입력과 동시에 클리어 체크
        if (checkWinCondition(next)) {
          setIsWon(true);
          clearSavedGame();
          const currentBest = loadBestTime(difficulty);
          if (currentBest === null || seconds < currentBest) {
            saveBestTime(difficulty, seconds);
            setIsNewRecord(true);
            setBestTimes(b => ({ ...b, [difficulty]: seconds }));
          }
        }
        return next;
      });

      // 숫자가 들어가면 해당 셀의 메모는 지우기
      setNotes(prev => {
        const next = prev.map(row => row.map(s => new Set(s)));
        next[r][c].clear();
        return next;
      });
    }
  }, [selectedCell, isPaused, isWon, initialBoard, isNoteMode, checkWinCondition, difficulty, seconds]);

  // 지우기 기능
  const handleClearCell = useCallback(() => {
    if (!selectedCell || isPaused || isWon) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c]) return;

    setUserBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = 0;
      return next;
    });
    setNotes(prev => {
      const next = prev.map(row => row.map(s => new Set(s)));
      next[r][c].clear();
      return next;
    });
  }, [selectedCell, isPaused, isWon, initialBoard]);

  // 힌트 보기 기능 (정답 중 1개 오픈)
  const handleHint = useCallback(() => {
    if (isPaused || isWon || solution.length === 0) return;

    // 빈칸이거나 오답인 셀 찾기
    const emptyOrWrongCells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!initialBoard[r][c] && (userBoard[r][c] === 0 || userBoard[r][c] !== solution[r][c])) {
          emptyOrWrongCells.push([r, c]);
        }
      }
    }

    if (emptyOrWrongCells.length === 0) return;

    // 현재 선택된 셀이 빈칸/오답이면 거기를 우선 힌트로, 아니면 랜덤 또는 첫 번째 빈칸 선택
    let targetCell = selectedCell;
    if (!targetCell || initialBoard[targetCell[0]][targetCell[1]] || userBoard[targetCell[0]][targetCell[1]] === solution[targetCell[0]][targetCell[1]]) {
      const randomIndex = Math.floor(Math.random() * emptyOrWrongCells.length);
      targetCell = emptyOrWrongCells[randomIndex];
    }

    const [r, c] = targetCell;
    const correctVal = solution[r][c];

    setUserBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = correctVal;

      if (checkWinCondition(next)) {
        setIsWon(true);
        clearSavedGame();
        const currentBest = loadBestTime(difficulty);
        if (currentBest === null || seconds < currentBest) {
          saveBestTime(difficulty, seconds);
          setIsNewRecord(true);
          setBestTimes(b => ({ ...b, [difficulty]: seconds }));
        }
      }
      return next;
    });

    setNotes(prev => {
      const next = prev.map(row => row.map(s => new Set(s)));
      next[r][c].clear();
      return next;
    });

    setSelectedCell([r, c]);
  }, [isPaused, isWon, solution, initialBoard, userBoard, selectedCell, checkWinCondition, difficulty, seconds]);

  // 키보드 입력 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isWon) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleClearCell();
      } else if (e.key.toLowerCase() === 'n') {
        setIsNoteMode(prev => !prev);
      } else if (selectedCell) {
        const [r, c] = selectedCell;
        if (e.key === 'ArrowUp' && r > 0) setSelectedCell([r - 1, c]);
        if (e.key === 'ArrowDown' && r < 8) setSelectedCell([r + 1, c]);
        if (e.key === 'ArrowLeft' && c > 0) setSelectedCell([r, c - 1]);
        if (e.key === 'ArrowRight' && c < 8) setSelectedCell([r, c + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isWon, selectedCell, handleNumberInput, handleClearCell]);

  // 오답 검증 함수
  const errors = checkSudoku(userBoard);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        {/* 상단 컨트롤 및 정보 */}
        <ControlPanel
          difficulty={difficulty}
          setDifficulty={startNewGame}
          seconds={seconds}
          bestTime={bestTimes[difficulty]}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onNewGame={() => startNewGame(difficulty)}
          onHint={handleHint}
        />

        {/* 9x9 스도쿠 그리드 */}
        <SudokuBoard
          userBoard={userBoard}
          initialBoard={initialBoard}
          notes={notes}
          errors={errors}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          isPaused={isPaused}
        />

        {/* 하단 숫자 패드 및 기능 */}
        <NumberPad
          isNoteMode={isNoteMode}
          setIsNoteMode={setIsNoteMode}
          onNumberInput={handleNumberInput}
          onClear={handleClearCell}
          onNewGame={() => startNewGame(difficulty)}
          onHint={handleHint}
        />
      </div>

      {/* 게임 클리어 모달 */}
      {isWon && (
        <WinModal
          difficulty={difficulty}
          seconds={seconds}
          bestTime={bestTimes[difficulty]}
          isNewRecord={isNewRecord}
          onNewGame={() => startNewGame(difficulty)}
        />
      )}
    </div>
  );
}
