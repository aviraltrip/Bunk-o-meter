import React from 'react';
import { Plus, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
  return (
    <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-[#F4F6FA]">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#99D5EE] flex items-center justify-center text-white shadow-xs">
          <GraduationCap className="w-6 h-6 text-[#2D3142]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2D3142] leading-tight">
            Bunk-o-Meter
          </h1>
          <p className="text-[12px] font-medium text-[#8D93A5]">
            College Attendance Tracker
          </p>
        </div>
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-1.5 bg-[#7A82E8] hover:bg-[#6870d8] active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-full shadow-sm transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Add Subject</span>
      </button>
    </header>
  );
};
