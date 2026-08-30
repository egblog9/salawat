import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Share2,
  Sparkles,
  CircleDot,
  Plus,
  Flame,
  Award,
  Zap,
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
  const [customDhikr, setCustomDhikr] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("modal_tasbeeh_count");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [todaySessionCount, setTodaySessionCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("modal_tasbeeh_today_session");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [target, setTarget] = useState<number>(33);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  const currentFormula =
    REMINDER_VOICE_FORMULAS.find((f) => f.id === selectedFormulaId) ||
    REMINDER_VOICE_FORMULAS[0];

  useEffect(() => {
    try {
      localStorage.setItem("modal_tasbeeh_count", count.toString());
      localStorage.setItem("modal_tasbeeh_today_session", todaySessionCount.toString());
    } catch {
      // ignore
    }
  }, [count, todaySessionCount]);

  if (!isOpen) return null;

  const handleBeadClick = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = count + 1;
    setCount(nextCount);
    setTodaySessionCount((prev) => prev + 1);
    onIncrementGlobal();

    if (soundEnabled) {
      sheikhAudioManager.playBeadClick();
    }

    if (hapticEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
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
          origin: { y: 0.6 },
          colors: ["#2F5241", "#D4AF37", "#10b981", "#ffffff"],
        });
      } catch {}
    }
  };

  const handleReset = () => {
    if (window.confirm("هل تريد تصفير عداد هذه الجلسة الحالية؟")) {
      setCount(0);
    }
  };

  const progress = target > 0 ? Math.min(100, ((count % target) / target) * 100) : 100;

  const displayDhikrText = isCustomMode && customDhikr.trim()
    ? customDhikr
    : currentFormula.arabicText;

  return (
    <div
      id="tasbeeh-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Standard Full-Page Header */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-3.5 py-3 sm:px-6 sticky top-0 z-30 shadow-md border-b border-emerald-800/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            title="رجوع للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-tajawal text-white truncate">
                السبحة والمسبحة الإلكترونية الذكية
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40 whitespace-nowrap flex-shrink-0">
                ورد الذكر والاستغفار
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-amiri truncate">
              عداد تفاعلي مع الصوت والاهتزاز وحفظ الإنجاز التلقائي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-9 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              soundEnabled ? "bg-emerald-800 text-emerald-200" : "bg-white/10 text-stone-400"
            }`}
            title={soundEnabled ? "كتم صوت النقر" : "تشغيل صوت النقر"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
        <div className="max-w-xl mx-auto w-full space-y-4 pb-8">
          
          {/* Quick Dhikr Formulas Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-tajawal text-stone-700">
                اختر صيغة الذكر أو التسبيح:
              </label>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 font-tajawal underline cursor-pointer"
              >
                {isCustomMode ? "الرجوع للأذكار المأثورة" : "+ كتابة ذكر مخصص"}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {REMINDER_VOICE_FORMULAS.filter((f) => f.id !== "all_dhikr").map((f) => {
                  const isSelected = f.id === selectedFormulaId;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFormulaId(f.id);
                        setIsCustomMode(false);
                      }}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            ) : (
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <input
                  type="text"
                  value={customDhikr}
                  onChange={(e) => setCustomDhikr(e.target.value)}
                  placeholder="اكتب الذكر أو الدعاء المخصص هنا..."
                  className="w-full py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-amiri font-bold text-stone-900 outline-none focus:border-emerald-500 text-right"
                />
              </div>
            )}
          </div>

          {/* Active Dhikr Showcase Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-emerald-600/30 text-center relative overflow-hidden">
            <span className="text-[11px] text-emerald-300 font-tajawal font-bold block mb-1">
              الذكر القلبي الحالي
            </span>
            <p className="font-amiri text-lg sm:text-xl font-bold leading-relaxed text-amber-200 my-1">
              {displayDhikrText}
            </p>
            {!isCustomMode && currentFormula.sheikhName && (
              <span className="text-[11px] text-emerald-200/80 font-tajawal mt-1 block">
                {currentFormula.description || currentFormula.sheikhName}
              </span>
            )}
          </div>

          {/* Electronic Rosary Interactive Section */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            
            {/* Target Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-tajawal text-stone-500 font-bold px-1">
                <span>التقدم نحو الهدف</span>
                <span className="font-mono">
                  {target > 0 ? `${count % target || (count > 0 && count % target === 0 ? target : 0)} / ${target}` : "مفتوح"}
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Giant Circular Rosary Bead Button */}
            <div className="relative pt-2">
              <button
                id="big-tasbeeh-click-btn"
                onClick={handleBeadClick}
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#244635] via-[#1c382b] to-[#12241b] text-white shadow-[0_20px_50px_rgba(20,40,30,0.4)] border-8 border-stone-100 flex flex-col items-center justify-center transition-all duration-100 cursor-pointer active:scale-95 select-none relative group ${
                  isPressing ? "scale-95 ring-8 ring-emerald-400/40" : "hover:scale-102"
                }`}
              >
                <div className="absolute inset-2 rounded-full border border-emerald-500/20 pointer-events-none" />
                <span className="text-xs font-bold font-tajawal text-emerald-300 tracking-wider">
                  انقر للتسبيح
                </span>
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white my-1">
                  {(count ?? 0).toLocaleString()}
                </span>
                <span className="text-xs font-bold font-tajawal text-amber-300">
                  {target > 0 ? `الهدف: ${target} تسبيحة` : "تسبيح حر"}
                </span>
              </button>
            </div>

            {/* Target Presets and Reset */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-2">
              {[33, 100, 300, 1000, 0].map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
                    target === t
                      ? "bg-[#2F5241] text-white shadow-md scale-105"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {t === 0 ? "حر" : t}
                </button>
              ))}

              <button
                onClick={handleReset}
                className="p-2 rounded-2xl bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer active:scale-95 transition-transform"
                title="تصفير العداد للجلسة الحالية"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Stats and Sharing Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-3xl border border-stone-200 shadow-sm text-center">
              <span className="text-xs text-stone-500 block font-tajawal font-bold">تسبيحات اليوم</span>
              <span className="text-xl font-black font-mono text-emerald-900">
                {(todaySessionCount ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-3xl border border-stone-200 shadow-sm text-center">
              <span className="text-xs text-stone-500 block font-tajawal font-bold">المجموع الكلي التاريخي</span>
              <span className="text-xl font-black font-mono text-emerald-900">
                {(totalLifetimeCount ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Share Box */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs font-tajawal">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>انشر تسبيحك وشارك الأجر مع أحبابك</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenShareModal();
              }}
              className="px-3.5 py-1.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-tajawal flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};
