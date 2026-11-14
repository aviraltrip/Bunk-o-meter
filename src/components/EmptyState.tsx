import React from 'react';
import { BookOpen, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
  onRestoreDefaults: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddClick,
  onRestoreDefaults,
}) => {
  return (
    <div className="text-center py-10 px-5 bg-[#F4F6FA] rounded-3xl border border-slate-100 my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#99D5EE] text-[#2D3142] flex items-center justify-center mx-auto mb-3">
        <BookOpen className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#2D3142] mb-1">
        No Subjects Yet
      </h3>
      <p className="text-xs text-[#8D93A5] mb-5 max-w-xs mx-auto">
        Add your college courses to calculate your attendance and safe bunks.
      </p>

      <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
        <button
          onClick={onAddClick}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#7A82E8] hover:bg-[#6870d8] text-white font-bold text-xs py-3 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Subject</span>
        </button>

        <button
          onClick={onRestoreDefaults}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#8D93A5] hover:text-[#2D3142] font-semibold text-xs py-2.5 rounded-full border border-slate-200/60 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restore Demo Subjects</span>
        </button>
      </div>
    </div>
  );
};
