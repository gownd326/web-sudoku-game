export interface SudokuBoardProps {
  userBoard: number[][];
  initialBoard: boolean[][];
  notes: Set<number>[][];
  errors: boolean[][];
  selectedCell: [number, number] | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  isPaused: boolean;
}

export default function SudokuBoard({
  userBoard,
  initialBoard,
  notes,
  errors,
  selectedCell,
  setSelectedCell,
  isPaused,
}: SudokuBoardProps) {
  return (
    <div className="relative bg-white border-2 border-[#0F172A] rounded-lg shadow-md overflow-hidden w-full max-w-[450px] aspect-square">
      {/* 일시정지 오버레이 */}
      {isPaused && (
        <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white">
          <p className="text-2xl font-bold mb-2">게임 일시정지됨</p>
          <p className="text-sm text-slate-300">상단의 일시정지 버튼을 다시 누르면 게임이 재개됩니다.</p>
        </div>
      )}

      {/* 9x9 그리드 */}
      <div className="grid grid-cols-9 h-full w-full">
        {userBoard.map((row, rIdx) =>
          row.map((cellVal, cIdx) => {
            const isInitial = initialBoard[rIdx][cIdx];
            const isSelected =
              selectedCell !== null && selectedCell[0] === rIdx && selectedCell[1] === cIdx;
            const isSameNumber =
              selectedCell !== null &&
              userBoard[selectedCell[0]][selectedCell[1]] !== 0 &&
              userBoard[selectedCell[0]][selectedCell[1]] === cellVal;
            const isSameRowOrCol =
              selectedCell !== null && (selectedCell[0] === rIdx || selectedCell[1] === cIdx);
            const isSameBox =
              selectedCell !== null &&
              Math.floor(selectedCell[0] / 3) === Math.floor(rIdx / 3) &&
              Math.floor(selectedCell[1] / 3) === Math.floor(cIdx / 3);

            const isError = errors[rIdx][cIdx];

            // 3x3 박스 테두리 계산 (Tailwind 클래스 조건부 적용)
            const borderTop = rIdx % 3 === 0 && rIdx !== 0 ? 'border-t-2 border-t-[#0F172A]' : 'border-t border-t-slate-200';
            const borderLeft = cIdx % 3 === 0 && cIdx !== 0 ? 'border-l-2 border-l-[#0F172A]' : 'border-l border-l-slate-200';
            const borderBottom = rIdx === 8 ? 'border-b-2 border-b-[#0F172A]' : '';
            const borderRight = cIdx === 8 ? 'border-r-2 border-r-[#0F172A]' : '';

            // 배경색 결정
            let bgColor = 'bg-white';
            if (isSelected) {
              bgColor = 'bg-blue-200';
            } else if (isSameNumber && cellVal !== 0) {
              bgColor = 'bg-blue-100';
            } else if (isSameRowOrCol || isSameBox) {
              bgColor = 'bg-slate-100';
            }

            // 글자색 결정
            let textColor = 'text-[#0F172A]';
            if (isInitial) {
              textColor = 'text-[#0F172A] font-bold';
            } else if (isError) {
              textColor = 'text-red-500 font-bold';
            } else {
              textColor = 'text-[#2563EB] font-medium';
            }

            const cellNotes = notes[rIdx][cIdx];

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                type="button"
                aria-label={`행 ${rIdx + 1}, 열 ${cIdx + 1}, 값 ${cellVal === 0 ? '빈칸' : cellVal}`}
                onClick={() => setSelectedCell([rIdx, cIdx])}
                className={`relative flex items-center justify-center text-lg sm:text-2xl select-none transition-colors focus:outline-none ${bgColor} ${borderTop} ${borderLeft} ${borderBottom} ${borderRight}`}
              >
                {cellVal !== 0 ? (
                  <span className={textColor}>{cellVal}</span>
                ) : (
                  <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <span
                        key={n}
                        className="flex items-center justify-center text-[9px] sm:text-[11px] text-slate-500 font-normal leading-none"
                      >
                        {cellNotes.has(n) ? n : ''}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
