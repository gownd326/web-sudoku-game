import { Eraser, Pencil } from 'lucide-react';

export interface NumberPadProps {
  onNumberInput: (num: number) => void;
  onClear: () => void;
  isNoteMode: boolean;
  setIsNoteMode: React.Dispatch<React.SetStateAction<boolean>>;
  onNewGame: () => void;
  onHint: () => void;
  numberCounts?: Record<number, number>;
}

export default function NumberPad({
  onNumberInput,
  onClear,
  isNoteMode,
  setIsNoteMode,
  numberCounts = {},
}: NumberPadProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[450px]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsNoteMode(prev => !prev)}
          aria-label="메모 모드 토글"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors border ${
            isNoteMode
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'bg-white text-[#0F172A] border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Pencil className="w-4 h-4" />
          <span>메모 {isNoteMode ? '켜짐' : '꺼짐'}</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          aria-label="지우기"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm bg-white text-[#0F172A] border border-slate-300 hover:bg-slate-100 transition-colors"
        >
          <Eraser className="w-4 h-4" />
          <span>지우기</span>
        </button>
      </div>

      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = numberCounts[num] || 0;
          const isCompleted = count >= 9;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onNumberInput(num)}
              disabled={isCompleted}
              aria-label={`숫자 ${num}`}
              className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl transition-colors ${
                isCompleted
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border border-slate-300 text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-300 shadow-sm'
              }`}
            >
              <span>{num}</span>
              <span className="text-[10px] sm:text-xs font-normal text-slate-500">
                {9 - count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
