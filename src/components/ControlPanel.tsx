import { Pause, Play, Lightbulb, RefreshCw, Trophy, Clock } from 'lucide-react';
import { Difficulty } from '../utils/storage';

export interface ControlPanelProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  seconds: number;
  bestTime: number | null;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  onHint: () => void;
  onNewGame: () => void;
}

export default function ControlPanel({
  difficulty,
  setDifficulty,
  seconds,
  bestTime,
  isPaused,
  setIsPaused,
  onHint,
  onNewGame,
}: ControlPanelProps) {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[450px]">
      {/* 상단: 타이머 및 최고 기록 */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-slate-300 shadow-sm text-sm font-medium text-[#0F172A]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2563EB]" />
          <span>타이머: <strong className="font-mono">{formatTime(seconds)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>최고 기록: <strong className="font-mono">{bestTime !== null ? formatTime(bestTime) : '-'}</strong></span>
        </div>
      </div>

      {/* 난이도 선택 및 메인 버튼들 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
          {(['초급', '중급', '고급'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              type="button"
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                difficulty === diff
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#0F172A] hover:bg-slate-300'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused(prev => !prev)}
            aria-label={isPaused ? '게임 재개' : '일시정지'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-[#0F172A] transition-colors shadow-sm"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-[#2563EB]" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? '재개' : '일시정지'}</span>
          </button>

          <button
            type="button"
            onClick={onHint}
            aria-label="힌트 보기"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-[#0F172A] transition-colors shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>힌트</span>
          </button>

          <button
            type="button"
            onClick={onNewGame}
            aria-label="새 게임 시작"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 rounded-lg text-xs font-medium text-white transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>새 게임</span>
          </button>
        </div>
      </div>
    </div>
  );
}
