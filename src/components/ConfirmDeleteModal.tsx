import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  subjectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  subjectName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3142]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-slate-100 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#2D3142] mb-1">
          Delete Subject?
        </h3>
        <p className="text-xs text-[#8D93A5] mb-5">
          Remove <span className="font-bold text-[#2D3142]">"{subjectName}"</span> from your tracker?
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCancel}
            className="py-2.5 px-4 rounded-full text-xs font-bold text-[#8D93A5] bg-[#F4F6FA] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 px-4 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
