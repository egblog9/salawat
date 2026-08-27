import React, { useState } from "react";
import confetti from "canvas-confetti";
import { SalawatItem, SheikhAudioTrack } from "../types";
import { sheikhAudioManager } from "../utils/audio";
import { SHEIKH_AUDIO_TRACKS } from "../data/salawatData";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Play,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
} from "lucide-react";

interface TasbeehCounterProps {
  collection: SalawatItem[];
  selectedItem: SalawatItem;
  onSelectItem: (item: SalawatItem) => void;
  onPlaySheikhTrack: (track: SheikhAudioTrack) => void;
  activePlayingId: string | null;
  isPlaying: boolean;
  totalLifetimeCount: number;
  onIncrementTotal: () => void;
  onNavigateToShare: () => void;
  collectiveTotal: number;
}

export const TasbeehCounter: React.FC<TasbeehCounterProps> = ({
  collection,
  selectedItem,
  onSelectItem,
  onPlaySheikhTrack,
  activePlayingId,
  isPlaying,
  totalLifetimeCount,
  onIncrementTotal,
  onNavigateToShare,
  collectiveTotal,
}) => {
  // Load and persist active counter in localStorage so page reload preserves the count
  const [count, setCount] = useState<number>(() => {
    try {
      const savedItemCount = localStorage.getItem(`tasbeeh_count_${selectedItem.id}`);
      if (savedItemCount !== null) {
        return parseInt(savedItemCount, 10) || 0;
      }
      const genericSaved = localStorage.getItem("current_tasbeeh_count");
      return genericSaved ? parseInt(genericSaved, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const [target, setTarget] = useState<number>(selectedItem.recommendedCount || 100);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [showFinishedNotice, setShowFinishedNotice] = useState<boolean>(false);

  const targets = [33, 100, 500, 1000, 0]; // 0 for infinite

  // Whenever formula changes, load its saved count
  React.useEffect(() => {
    try {
      const savedItemCount = localStorage.getItem(`tasbeeh_count_${selectedItem.id}`);
      if (savedItemCount !== null) {
        setCount(parseInt(savedItemCount, 10) || 0);
      }
    } catch (e) {
      // ignore
    }
    setTarget(selectedItem.recommendedCount || 100);
  }, [selectedItem.id]);

  // Persist count changes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(`tasbeeh_count_${selectedItem.id}`, count.toString());
      localStorage.setItem("current_tasbeeh_count", count.toString());
    } catch (e) {
      // ignore
    }
  }, [count, selectedItem.id]);

  const handleIncrement = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);

    // Play click sound if enabled
    if (soundEnabled) {
      sheikhAudioManager.playBeadClick();
    }

    // Gentle haptic feedback on supported mobile devices
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(25);
      } catch (e) {
        // ignore
      }
    }

    const nextCount = count + 1;
    setCount(nextCount);
    onIncrementTotal();

    // Check target completion
    if (target > 0 && nextCount === target) {
      sheikhAudioManager.playCompletionChime();
      triggerConfetti();
      setShowFinishedNotice(true);
      setTimeout(() => setShowFinishedNotice(false), 4000);
    }
  };

  const handleReset = () => {
    setCount(0);
    setShowFinishedNotice(false);
    try {
      localStorage.setItem(`tasbeeh_count_${selectedItem.id}`, "0");
      localStorage.setItem("current_tasbeeh_count", "0");
    } catch (e) {
      // ignore
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#34d399", "#fbbf24"],
      });
    } catch (e) {
      // ignore
    }
  };

  const currentIndex = collection.findIndex((item) => item.id === selectedItem.id);
  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + collection.length) % collection.length;
    onSelectItem(collection[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % collection.length;
    onSelectItem(collection[nextIdx]);
  };

  const matchedTrack = SHEIKH_AUDIO_TRACKS.find(
    (t) => t.id === selectedItem.sheikhTrackId || t.arabicText.includes(selectedItem.arabicText.substring(0, 20))
  ) || SHEIKH_AUDIO_TRACKS[0];

  const progressPercentage = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner / Formula Viewer */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        
        {/* Navigation between formulas */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-600/30 font-semibold">
              {selectedItem.categoryLabel}
            </span>
            {selectedItem.hadithSource && (
              <span className="text-[11px] text-stone-400">
                المصدر: {selectedItem.hadithSource}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="prev-salawat-btn"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-all cursor-pointer"
              title="الصيغة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-stone-400 font-mono px-1">
              {currentIndex + 1} / {collection.length}
            </span>
            <button
              id="next-salawat-btn"
              onClick={handleNext}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-all cursor-pointer"
              title="الصيغة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Arabic Text */}
        <div className="text-center py-2 px-2 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-amiri font-bold text-amber-100 leading-loose tracking-wide select-none drop-shadow-sm">
            {selectedItem.arabicText}
          </h2>
        </div>

        {/* Meaning & Virtue details */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-300 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/60 rounded-2xl p-3.5 border border-stone-800/60">
            <span className="text-emerald-400 font-bold block mb-1">📖 المعنى والدلالة:</span>
            <p className="leading-relaxed font-amiri">{selectedItem.meaning}</p>
          </div>
          <div className="bg-stone-950/60 rounded-2xl p-3.5 border border-stone-800/60">
            <span className="text-amber-300 font-bold block mb-1">🌿 الفضل والبركة:</span>
            <p className="leading-relaxed font-amiri">{selectedItem.virtue}</p>
          </div>
        </div>

        {/* Audio Quick Play Bar with Real Sheikh */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/60">
          <button
            id={`play-sheikh-quick-${selectedItem.id}`}
            onClick={() => onPlaySheikhTrack(matchedTrack)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              isPlaying && activePlayingId === matchedTrack.id
                ? "bg-amber-600 text-stone-950 shadow-lg"
                : "bg-emerald-800 hover:bg-emerald-700 text-emerald-100 shadow"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {isPlaying && activePlayingId === matchedTrack.id
                ? `جاري الاستماع بصوت ${matchedTrack.sheikhName}...`
                : `استمع بصوت ${matchedTrack.sheikhName}`}
            </span>
          </button>

          <button
            onClick={onNavigateToShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شارك هذه الصيغة</span>
          </button>
        </div>
      </div>

      {/* Interactive Tasbeeh Counter Circle Card */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Counter Header Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          
          {/* Target selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">الهدف:</span>
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
              {targets.map((tgt) => (
                <button
                  key={tgt}
                  onClick={() => setTarget(tgt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    target === tgt
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {tgt === 0 ? "∞ مفتوح" : tgt}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                soundEnabled
                  ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                  : "bg-stone-800 border-stone-700 text-stone-400"
              }`}
              title={soundEnabled ? "صوت نقر المسبحة مفعّل" : "كتم صوت النقر"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? "الصوت مفعل" : "الصوت مكتوم"}</span>
            </button>
          </div>
        </div>

        {/* Huge Interactive Click Button */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative">
            {/* Outer Decorative Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-600/30 via-amber-500/20 to-emerald-400/30 blur-md transform scale-105 pointer-events-none"></div>

            {/* SVG Circular Progress Track */}
            <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-stone-800"
                strokeWidth="8"
                fill="transparent"
              />
              {target > 0 && (
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-emerald-500 transition-all duration-300 ease-out"
                  strokeWidth="8"
                  strokeDasharray="283%"
                  strokeDashoffset={`${283 - (283 * progressPercentage) / 100}%`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              )}
            </svg>

            {/* Inner Circular Push Button */}
            <button
              id="tasbeeh-main-click-btn"
              onClick={handleIncrement}
              className={`absolute inset-4 rounded-full bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-4 border-stone-800/80 shadow-2xl flex flex-col items-center justify-center transition-all transform cursor-pointer select-none ${
                isPressed ? "scale-95 border-emerald-500 shadow-emerald-950/80" : "hover:border-emerald-600/60"
              }`}
            >
              <span className="text-[11px] sm:text-xs text-stone-400 font-medium mb-1">اضغط للتسبيح</span>
              <span className="text-5xl sm:text-6xl font-extrabold font-tajawal text-amber-300 tracking-tight drop-shadow-md">
                {count.toLocaleString()}
              </span>
              {target > 0 && (
                <span className="text-xs text-stone-400 mt-2 bg-stone-950 px-3 py-0.5 rounded-full border border-stone-800">
                  من أصل {target.toLocaleString()}
                </span>
              )}
            </button>
          </div>

          {/* Reset Button Directly Under the Counter */}
          <div className="mt-5 flex items-center justify-center">
            <button
              id="tasbeeh-reset-btn"
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-amber-200 text-xs sm:text-sm font-semibold border border-stone-700/80 shadow-md transition-all active:scale-95 cursor-pointer"
              title="تصفير عداد الجلسة الحالية"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>تصفير العداد</span>
            </button>
          </div>

          {/* Completion Celebration Message */}
          {showFinishedNotice && (
            <div className="mt-4 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>هنيئاً لك! أتممت الورد بنجاح، تقبل الله صالح أعمالك وزادك قرباً وبركة.</span>
            </div>
          )}
        </div>

        {/* Live Counters Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-center">
          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">صلواتك في هذه الجلسة</span>
            <span className="text-lg sm:text-xl font-bold text-amber-300 font-tajawal">
              {count.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">إجمالي صلواتك الشخصية</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-300 font-tajawal">
              {totalLifetimeCount.toLocaleString()}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">إجمالي التسبيحات على الموقع</span>
            <span className="text-lg sm:text-xl font-bold text-amber-200 font-tajawal">
              {collectiveTotal.toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
