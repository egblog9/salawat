import React, { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Share2,
  Heart,
  CircleDot,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sheikhAudioManager } from "../utils/audio";
import { REMINDER_VOICE_FORMULAS } from "../data/salawatData";

interface TasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncrementGlobal: () => void;
  totalLifetimeCount: number;
  onOpenShareModal: () => void;
}

export const TasbeehModal: React.FC<TasbeehModalProps> = ({
  isOpen,
  onClose,
  onIncrementGlobal,
  totalLifetimeCount,
  onOpenShareModal,
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>("allahumma_salli_wasallim");
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("modal_tasbeeh_count");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [target, setTarget] = useState<number>(33);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  const currentFormula =
    REMINDER_VOICE_FORMULAS.find((f) => f.id === selectedFormulaId) ||
    REMINDER_VOICE_FORMULAS[0];

  useEffect(() => {
    try {
      localStorage.setItem("modal_tasbeeh_count", count.toString());
    } catch (e) {
      // ignore
    }
  }, [count]);

  if (!isOpen) return null;

  const handleBeadClick = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = count + 1;
    setCount(nextCount);
    onIncrementGlobal();

    if (soundEnabled) {
      sheikhAudioManager.playBeadClick();
    }

    if (navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (e) {
        // ignore
      }
    }

    // Goal reached
    if (target > 0 && nextCount % target === 0) {
      if (soundEnabled) {
        sheikhAudioManager.playCompletionChime();
      }
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#2F5241", "#D4AF37", "#10b981", "#ffffff"],
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("هل تريد تصفير عداد هذه الجلسة؟")) {
      setCount(0);
    }
  };

  const progress = target > 0 ? Math.min(100, (count % target) / target * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[34px] sm:rounded-[34px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 select-none">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer active:scale-90 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold font-tajawal text-stone-800 flex items-center justify-center gap-1.5">
              <CircleDot className="w-5 h-5 text-emerald-700" />
              <span>المسبحة الإلكترونية الذكية</span>
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              ورد الأذكار والتسبيح اليومي
            </p>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              soundEnabled ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-400"
            }`}
            title={soundEnabled ? "كتم صوت الخرزة" : "تفعيل صوت الخرزة"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Formula Selector Horizontal Scroll */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-tajawal text-stone-700 block">
              اختر الذكر المبارك:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {REMINDER_VOICE_FORMULAS.filter((f) => f.id !== "all_dhikr").map((f) => {
                const isSelected = f.id === selectedFormulaId;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormulaId(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2F5241] text-white shadow-md"
                        : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {f.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Dhikr Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-[#2F5241] text-white rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[11px] text-emerald-200 font-tajawal block mb-1">
              الذكر الحالي
            </span>
            <p className="font-amiri text-lg sm:text-xl font-bold leading-relaxed text-amber-100 mb-2">
              {currentFormula.arabicText}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-stone-200">
              <span>فضيلة: {currentFormula.sheikhName}</span>
            </div>
          </div>

          {/* Electronic Rosary Big Button */}
          <div className="flex flex-col items-center justify-center py-2">
            
            {/* Target Progress Bar */}
            <div className="w-full max-w-xs bg-stone-200 rounded-full h-2 overflow-hidden mb-4">
              <div
                className="bg-emerald-600 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Big Circular Bead Button */}
            <div className="relative">
              <button
                id="big-tasbeeh-click-btn"
                onClick={handleBeadClick}
                className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#345d4a] via-[#2F5241] to-[#1e372a] text-white shadow-[0_15px_35px_rgba(47,82,65,0.35)] border-8 border-stone-100 flex flex-col items-center justify-center transition-all duration-100 cursor-pointer active:scale-95 select-none ${
                  isPressing ? "scale-95 shadow-inner ring-4 ring-amber-300" : "hover:scale-102"
                }`}
              >
                <span className="text-[11px] font-tajawal text-emerald-200 tracking-wider">
                  انقر للتسبيح
                </span>
                <span className="text-4xl sm:text-5xl font-black font-tajawal tracking-tight text-white my-1">
                  {(count ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] font-tajawal text-amber-300">
                  {target > 0 ? `الهدف: ${target}` : "تسبيح مفتوح"}
                </span>
              </button>
            </div>

            {/* Target Presets & Reset */}
            <div className="flex items-center gap-2 mt-4">
              {[33, 100, 1000, 0].map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
                    target === t
                      ? "bg-[#2F5241] text-white shadow"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {t === 0 ? "مفتوح" : t}
                </button>
              ))}

              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer active:scale-95 transition-transform"
                title="تصفير العداد"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 block font-tajawal">مجموع تسبيحاتك الكلية</span>
              <span className="text-sm font-bold font-tajawal text-stone-800">
                {(totalLifetimeCount ?? 0).toLocaleString()} تسبيحة
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenShareModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة الأجر</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
