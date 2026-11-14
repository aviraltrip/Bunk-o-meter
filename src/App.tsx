import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Subject } from './types/attendance';
import { calculateOverallSummary } from './utils/attendance';
import { STORAGE_KEY, DEFAULT_SUBJECTS } from './utils/constants';

import { Header } from './components/Header';
import { OverallSummaryCard } from './components/OverallSummaryCard';
import { SubjectCard } from './components/SubjectCard';
import { AddEditSubjectModal } from './components/AddEditSubjectModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AIExcuseModal } from './components/AIExcuseModal';
import { EmptyState } from './components/EmptyState';
import { RefreshCw, Search, Home, LayoutGrid, Sparkles } from 'lucide-react';

export default function App() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(
    STORAGE_KEY,
    DEFAULT_SUBJECTS
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);
  const [excuseSubject, setExcuseSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'SAFE'>('ALL');

  const summary = calculateOverallSummary(subjects);

  const handleIncrementAttended = (id: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            attended: sub.attended + 1,
            total: sub.total + 1,
          };
        }
        return sub;
      })
    );
  };

  const handleIncrementMissed = (id: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            total: sub.total + 1,
          };
        }
        return sub;
      })
    );
  };

  const handleSaveSubject = (data: Omit<Subject, 'id'> & { id?: string }) => {
    if (data.id) {
      setSubjects((prev) =>
        prev.map((sub) => (sub.id === data.id ? { ...(data as Subject) } : sub))
      );
    } else {
      const newSubject: Subject = {
        ...data,
        id: `sub-${Date.now()}`,
      };
      setSubjects((prev) => [newSubject, ...prev]);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingSubjectId) return;
    setSubjects((prev) => prev.filter((sub) => sub.id !== deletingSubjectId));
    setDeletingSubjectId(null);
  };

  const subjectToDelete = subjects.find((s) => s.id === deletingSubjectId);

  const filteredSubjects = subjects.filter((sub) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.name.toLowerCase().includes(q);
      const matchCode = sub.code?.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }

    if (activeTab === 'ALL') return true;
    const pct = sub.total === 0 ? 100 : (sub.attended / sub.total) * 100;
    const target = sub.targetPercentage || 75;
    if (activeTab === 'CRITICAL') return pct < target;
    if (activeTab === 'SAFE') return pct >= target;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#4543B5] flex items-center justify-center py-0 sm:py-8 px-0 sm:px-4">
      <div className="w-full sm:max-w-[400px] min-h-screen sm:min-h-[820px] bg-[#FFFFFF] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border-0 sm:border sm:border-white/10">
        
        <div>
          <Header
            onAddClick={() => {
              setEditingSubject(null);
              setIsModalOpen(true);
            }}
          />

          <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-140px)] sm:max-h-[690px] overflow-y-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-white/80 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#7A82E8] text-white placeholder-white/70 text-xs font-medium pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#99D5EE] transition-all shadow-xs"
              />
            </div>

            {subjects.length > 0 && <OverallSummaryCard summary={summary} />}

            {subjects.length > 0 && (
              <div className="flex items-center justify-between gap-1 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  <button
                    onClick={() => setActiveTab('ALL')}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === 'ALL'
                        ? 'bg-[#7A82E8] text-white shadow-xs'
                        : 'bg-[#F4F6FA] text-[#8D93A5] hover:text-[#2D3142]'
                    }`}
                  >
                    All ({subjects.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('CRITICAL')}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === 'CRITICAL'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-[#F4F6FA] text-[#8D93A5] hover:text-[#2D3142]'
                    }`}
                  >
                    Shortage ({summary.criticalSubjectsCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('SAFE')}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === 'SAFE'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#F4F6FA] text-[#8D93A5] hover:text-[#2D3142]'
                    }`}
                  >
                    Safe ({subjects.length - summary.criticalSubjectsCount})
                  </button>
                </div>

                <button
                  onClick={() => setSubjects(DEFAULT_SUBJECTS)}
                  title="Reset Demo Data"
                  className="p-1.5 text-[#8D93A5] hover:text-[#2D3142] hover:bg-[#F4F6FA] rounded-full transition-colors cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {subjects.length === 0 ? (
              <EmptyState
                onAddClick={() => {
                  setEditingSubject(null);
                  setIsModalOpen(true);
                }}
                onRestoreDefaults={() => setSubjects(DEFAULT_SUBJECTS)}
              />
            ) : filteredSubjects.length === 0 ? (
              <div className="bg-[#F4F6FA] rounded-2xl p-6 text-center text-[#8D93A5] text-xs font-medium">
                No subjects found matching your search.
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {filteredSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onIncrementAttended={handleIncrementAttended}
                    onIncrementMissed={handleIncrementMissed}
                    onEdit={(sub) => {
                      setEditingSubject(sub);
                      setIsModalOpen(true);
                    }}
                    onDelete={(id) => setDeletingSubjectId(id)}
                    onGenerateExcuse={(sub) => setExcuseSubject(sub)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#7A82E8] px-8 py-3.5 flex items-center justify-between text-white sm:rounded-b-3xl">
          <button
            onClick={() => {
              setActiveTab('ALL');
              setSearchQuery('');
            }}
            className="flex flex-col items-center gap-0.5 text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => {
              if (subjects.length > 0) {
                setExcuseSubject(subjects[0]);
              }
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 cursor-pointer hover:text-white transition-colors"
          >
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold">AI Excuse</span>
          </button>

          <button
            onClick={() => {
              setEditingSubject(null);
              setIsModalOpen(true);
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 cursor-pointer hover:text-white transition-colors"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-semibold">Add Course</span>
          </button>
        </div>

        <AddEditSubjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubject(null);
          }}
          onSave={handleSaveSubject}
          initialSubject={editingSubject}
        />

        <ConfirmDeleteModal
          isOpen={!!deletingSubjectId}
          subjectName={subjectToDelete?.name || ''}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingSubjectId(null)}
        />

        <AIExcuseModal
          isOpen={!!excuseSubject}
          onClose={() => setExcuseSubject(null)}
          subject={excuseSubject}
        />
      </div>
    </div>
  );
}
