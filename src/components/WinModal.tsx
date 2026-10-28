import { Trophy, Clock, RefreshCw } from 'lucide-react';
import { Difficulty } from '../utils/storage';

export interface WinModalProps {
  difficulty: Difficulty;
  seconds: number;
  bestTime: number | null;
  isNewRecord: boolean;
  onNewGame: () => void;
}

export default function WinModal({
  difficulty,
  seconds,
  isNewRecord,
  onNewGame,
}: WinModalProps) {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md flex flex-col items-center text-center animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="w-16 h-16 bg-blue-100 text-[#2563EB] rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
          축하합니다!
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          <strong className="text-[#2563EB]">{difficulty}</strong> 난이도 스도쿠 퍼즐을 성공적으로 해결했습니다!
        </p>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              소요 시간
            </span>
            <strong className="font-mono text-base text-[#0F172A]">{formatTime(seconds)}</strong>
          </div>

          {isNewRecord && (
            <div className="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 py-2 px-3 rounded-md text-xs font-bold tracking-wide uppercase">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>새로운 최고 기록 달성!</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onNewGame}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>새 게임 시작하기</span>
        </button>
      </div>
    </div>
  );
}
