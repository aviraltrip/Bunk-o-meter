import React, { useState } from 'react';
import { Subject } from '../types/attendance';
import {
  generateBunkExcuse,
  ExcusePersona,
  ExcuseResult
} from '../services/aiExcuseService';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Clock,
  Home,
  Code2,
  HelpCircle,
  Key,
  Languages
} from 'lucide-react';

interface AIExcuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

const PERSONAS: { id: ExcusePersona; label: string; subLabel: string; icon: React.ReactNode }[] = [
  { id: 'ALARM', label: 'अलार्म धोखा', subLabel: 'Alarm Glitch', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'HOSTEL', label: 'हॉस्टल ड्रामा', subLabel: 'Warden & Geyser', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'TECH', label: 'टेक लोचा', subLabel: 'Git & Bug Loop', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'PHILOSOPHICAL', label: 'गंभीर दर्शन', subLabel: 'Quantum Theory', icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

export const AIExcuseModal: React.FC<AIExcuseModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<ExcusePersona>('ALARM');
  const [isLoading, setIsLoading] = useState(false);
  const [excuseResult, setExcuseResult] = useState<ExcuseResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  if (!isOpen || !subject) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setCopied(false);

    try {
      const result = await generateBunkExcuse({
        subjectName: subject.name,
        persona: selectedPersona,
        apiKey: customKey.trim() || undefined,
      });
      setExcuseResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!excuseResult?.text) return;
    navigator.clipboard.writeText(excuseResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3142]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8D93A5] hover:text-[#2D3142] p-1.5 rounded-full hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#7A82E8]/15 text-[#7A82E8] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#7A82E8]" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#2D3142]">
              AI बंक बहाना
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#99D5EE]/40 text-[#2D3142] px-2 py-0.5 rounded-full">
              <Languages className="w-2.5 h-2.5" />
              हिन्दी
            </span>
          </div>
        </div>

        <p className="text-xs text-[#8D93A5] mb-4">
          <strong className="text-[#2D3142]">{subject.name}</strong> की क्लास मिस करने का मजेदार बहाना:
        </p>

        <div className="mb-4">
          <span className="text-[11px] font-bold text-[#8D93A5] uppercase tracking-wider block mb-2">
            बहाने का प्रकार (Theme)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((p) => {
              const isActive = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#7A82E8] bg-[#7A82E8]/10 text-[#7A82E8] font-bold shadow-2xs'
                      : 'border-slate-100 bg-[#F4F6FA] text-[#8D93A5] hover:text-[#2D3142]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    {p.icon}
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] block opacity-75 mt-0.5 font-normal">{p.subLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-2.5 rounded-full text-xs font-bold bg-[#7A82E8] hover:bg-[#6870d8] disabled:opacity-60 text-white shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer mb-4"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'बहाना तैयार हो रहा है...' : excuseResult ? 'नया बहाना बनाएं (Regenerate)' : 'हिन्दी बहाना बनाएं'}</span>
        </button>

        {excuseResult && (
          <div className="bg-[#F4F6FA] rounded-2xl p-4 border border-slate-200/80 mb-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#7A82E8] mb-1.5">
              <span>{excuseResult.isAiGenerated ? '✨ जेमिनी AI (HINDI)' : '💡 बिल्ट-इन बहाना'}</span>
              <span className="text-[#8D93A5]">अधिकतम 2 वाक्य</span>
            </div>
            <p className="text-xs font-medium text-[#2D3142] leading-relaxed mb-3">
              "{excuseResult.text}"
            </p>

            <button
              onClick={handleCopy}
              className={`w-full py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-slate-50 text-[#2D3142] border border-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>कॉपी हो गया! (Copied)</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8D93A5]" />
                  <span>बहाना कॉपी करें (Copy Excuse)</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#8D93A5]">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1 hover:text-[#2D3142] cursor-pointer"
          >
            <Key className="w-3 h-3" />
            <span>{showKeyInput ? 'Hide API Key' : 'कस्टम API Key'}</span>
          </button>
          <span className="text-[10px]">बीमारी/इमरजेंसी के बिना</span>
        </div>

        {showKeyInput && (
          <div className="mt-2 pt-2 animate-in fade-in">
            <input
              type="password"
              placeholder="Paste custom Gemini API key..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F6FA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A82E8]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
