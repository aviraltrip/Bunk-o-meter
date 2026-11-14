import React, { useState, useEffect } from 'react';
import { Subject } from '../types/attendance';
import { X, AlertCircle } from 'lucide-react';

interface AddEditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectData: Omit<Subject, 'id'> & { id?: string }) => void;
  initialSubject?: Subject | null;
}

export const AddEditSubjectModal: React.FC<AddEditSubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [attended, setAttended] = useState('0');
  const [total, setTotal] = useState('0');
  const [targetPercentage, setTargetPercentage] = useState('75');

  const [errors, setErrors] = useState<{
    name?: string;
    attended?: string;
    total?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name);
      setCode(initialSubject.code || '');
      setAttended(initialSubject.attended.toString());
      setTotal(initialSubject.total.toString());
      setTargetPercentage((initialSubject.targetPercentage || 75).toString());
    } else {
      setName('');
      setCode('');
      setAttended('0');
      setTotal('0');
      setTargetPercentage('75');
    }
    setErrors({});
  }, [initialSubject, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {
      name?: string;
      attended?: string;
      total?: string;
      general?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Subject name is mandatory.';
    }

    const attNum = parseInt(attended, 10);
    const totNum = parseInt(total, 10);

    if (isNaN(attNum) || attNum < 0) {
      newErrors.attended = 'Attended classes cannot be negative.';
    }

    if (isNaN(totNum) || totNum < 0) {
      newErrors.total = 'Total classes held cannot be negative.';
    }

    if (!newErrors.attended && !newErrors.total) {
      if (attNum > totNum) {
        newErrors.general = "Attended classes cannot be more than total classes held!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialSubject?.id,
      name: name.trim(),
      code: code.trim().toUpperCase() || undefined,
      attended: parseInt(attended, 10) || 0,
      total: parseInt(total, 10) || 0,
      targetPercentage: parseInt(targetPercentage, 10) || 75,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3142]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8D93A5] hover:text-[#2D3142] p-1.5 rounded-full hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#2D3142] mb-1">
          {initialSubject ? 'Edit Subject' : 'Add Subject'}
        </h2>
        <p className="text-xs text-[#8D93A5] mb-5">
          Enter course details to calculate your attendance.
        </p>

        {errors.general && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#2D3142] uppercase tracking-wider mb-1">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Operating Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm font-medium bg-[#F4F6FA] focus:bg-white focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-transparent focus:border-[#7A82E8] focus:ring-[#7A82E8]/20'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3142] uppercase tracking-wider mb-1">
              Subject Code <span className="text-[#8D93A5] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CS204"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-transparent bg-[#F4F6FA] focus:bg-white focus:border-[#7A82E8] focus:ring-2 focus:ring-[#7A82E8]/20 text-sm font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#2D3142] uppercase tracking-wider mb-1">
                Attended
              </label>
              <input
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm font-bold bg-[#F4F6FA] focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.attended
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-transparent focus:border-[#7A82E8] focus:ring-[#7A82E8]/20'
                }`}
              />
              {errors.attended && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.attended}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2D3142] uppercase tracking-wider mb-1">
                Total Held
              </label>
              <input
                type="number"
                min="0"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm font-bold bg-[#F4F6FA] focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.total
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-transparent focus:border-[#7A82E8] focus:ring-[#7A82E8]/20'
                }`}
              />
              {errors.total && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.total}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3142] uppercase tracking-wider mb-1">
              Target Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-transparent bg-[#F4F6FA] focus:bg-white focus:border-[#7A82E8] focus:ring-2 focus:ring-[#7A82E8]/20 text-sm font-semibold focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-bold bg-[#7A82E8] hover:bg-[#6870d8] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {initialSubject ? 'Save Changes' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
