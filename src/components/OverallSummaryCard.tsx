import React from 'react';
import { OverallSummary } from '../types/attendance';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OverallSummaryCardProps {
  summary: OverallSummary;
}

export const OverallSummaryCard: React.FC<OverallSummaryCardProps> = ({ summary }) => {
  const isSafe = summary.overallStatus === 'SAFE';
  const isBorderline = summary.overallStatus === 'BORDERLINE';

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#7A82E8', '#99D5EE', '#4B50C6', '#10B981'],
    });
  };

  const statusConfig = isSafe
    ? {
        badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        bar: 'bg-emerald-500',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
        label: 'Safe Attendance',
      }
    : isBorderline
    ? {
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        bar: 'bg-amber-500',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        label: 'Close to Limit',
      }
    : {
        badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200',
        bar: 'bg-rose-500',
        icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
        label: 'Low Attendance',
      };

  return (
    <div className="bg-[#F4F6FA] rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#8D93A5] uppercase tracking-wider block mb-0.5">
            Semester Standing
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2D3142] tracking-tight">
              {summary.overallPercentage}%
            </span>
            <span className="text-xs text-[#8D93A5] font-medium">
              ({summary.totalAttended}/{summary.totalHeld} classes)
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${statusConfig.badgeBg}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          {isSafe && (
            <button
              onClick={triggerConfetti}
              className="text-[10px] font-bold text-[#7A82E8] hover:text-[#4B50C6] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Celebrate
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold text-[#8D93A5]">
          <span>Overall Progress</span>
          <span>Target: 75%</span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden relative shadow-inner">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#4B50C6] z-10 opacity-70"
            style={{ left: '75%' }}
            title="75% Requirement"
          />
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isSafe ? 'bg-[#7A82E8]' : statusConfig.bar
            }`}
            style={{ width: `${Math.min(100, Math.max(0, summary.overallPercentage))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#99D5EE] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-[#2D3142]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8D93A5] uppercase tracking-wider block">
              Subjects
            </span>
            <span className="text-sm font-bold text-[#2D3142]">
              {summary.subjectsCount} enrolled
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#4B50C6] flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8D93A5] uppercase tracking-wider block">
              Critical
            </span>
            <span className={`text-sm font-bold ${summary.criticalSubjectsCount > 0 ? 'text-rose-600' : 'text-[#2D3142]'}`}>
              {summary.criticalSubjectsCount} {summary.criticalSubjectsCount === 1 ? 'subject' : 'subjects'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
