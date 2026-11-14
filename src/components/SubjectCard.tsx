import React from 'react';
import { Subject } from '../types/attendance';
import { calculateAttendance } from '../utils/attendance';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onIncrementAttended: (id: string) => void;
  onIncrementMissed: (id: string) => void;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onGenerateExcuse: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onIncrementAttended,
  onIncrementMissed,
  onEdit,
  onDelete,
  onGenerateExcuse,
}) => {
  const result = calculateAttendance(
    subject.attended,
    subject.total,
    subject.targetPercentage || 75
  );

  const isSafe = result.status === 'SAFE';
  const isBorderline = result.status === 'BORDERLINE';
  const isCritical = result.status === 'CRITICAL';
  const isNoClasses = result.status === 'NO_CLASSES';

  const statusStyle = isSafe
    ? {
        badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        progressBar: 'bg-emerald-500',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
        badgeText: 'Safe Attendance',
        alertBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
      }
    : isBorderline
    ? {
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        progressBar: 'bg-amber-500',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        badgeText: 'Close to Limit',
        alertBg: 'bg-amber-50/70 border-amber-200 text-amber-800',
      }
    : isCritical
    ? {
        badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200',
        progressBar: 'bg-rose-500',
        icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
        badgeText: 'Low Attendance',
        alertBg: 'bg-rose-50/70 border-rose-200 text-rose-800',
      }
    : {
        badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
        progressBar: 'bg-slate-400',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />,
        badgeText: 'No Classes Yet',
        alertBg: 'bg-slate-50 border-slate-200 text-slate-700',
      };

  return (
    <div className="bg-[#F4F6FA] rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-[#2D3142] text-base truncate">
                {subject.name}
              </h3>
              {subject.code && (
                <span className="text-[10px] font-bold bg-[#A8DCE7]/50 text-[#2D3142] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {subject.code}
                </span>
              )}
            </div>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusStyle.badgeBg}`}
              >
                {statusStyle.icon}
                {statusStyle.badgeText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#8D93A5]">
            <button
              onClick={() => onEdit(subject)}
              title="Edit Subject"
              className="p-1.5 hover:text-[#4B50C6] hover:bg-white rounded-full transition-all cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(subject.id)}
              title="Delete Subject"
              className="p-1.5 hover:text-rose-600 hover:bg-white rounded-full transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-3 mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#2D3142] tracking-tight">
              {result.percentage}%
            </span>
            <span className="text-xs text-[#8D93A5] font-medium">
              ({subject.attended}/{subject.total} held)
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#8D93A5]">
            Target: {subject.targetPercentage}%
          </span>
        </div>

        <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-3 relative shadow-inner">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#4B50C6] z-10 opacity-70"
            style={{ left: `${subject.targetPercentage || 75}%` }}
          />
          <div
            className={`h-full rounded-full transition-all duration-300 ${statusStyle.progressBar}`}
            style={{ width: `${Math.min(100, Math.max(0, result.percentage))}%` }}
          />
        </div>

        <div
          className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between mb-2.5 ${statusStyle.alertBg}`}
        >
          <span>{result.message}</span>
        </div>

        {!isNoClasses && (
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#8D93A5] mb-2.5 bg-white p-2 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Attend next: {result.nextClassImpact.ifAttend}%</span>
            </div>
            <div className="flex items-center gap-1 text-[#8D93A5]">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
              <span>Skip next: {result.nextClassImpact.ifBunk}%</span>
            </div>
          </div>
        )}

        <button
          onClick={() => onGenerateExcuse(subject)}
          className="w-full mb-3 py-1.5 px-3 rounded-full text-xs font-bold text-[#7A82E8] bg-white hover:bg-[#7A82E8]/10 border border-[#7A82E8]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7A82E8]" />
          <span>AI Bunk Excuse</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
        <button
          onClick={() => onIncrementAttended(subject.id)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold text-white bg-[#7A82E8] hover:bg-[#6870d8] active:scale-95 shadow-xs transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>+1 Attended</span>
        </button>

        <button
          onClick={() => onIncrementMissed(subject.id)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold text-[#2D3142] bg-[#99D5EE] hover:bg-[#87ceeb] active:scale-95 shadow-xs transition-all cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5 text-[#2D3142]" />
          <span>+1 Missed</span>
        </button>
      </div>
    </div>
  );
};
