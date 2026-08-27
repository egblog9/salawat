import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, X, Heart, CheckCircle2 } from "lucide-react";

interface ReminderToastProps {
  isVisible: boolean;
  onClose: () => void;
  isMuted: boolean;
  onQuickTasbeeh?: () => void;
  arabicText?: string;
}

export const ReminderToast: React.FC<ReminderToastProps> = ({
  isVisible,
  onClose,
  isMuted,
  onQuickTasbeeh,
  arabicText = "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا وَحَبِيبِنَا مُحَمَّدٍ ﷺ",
}) => {
  const [progress, setProgress] = useState(100);
  const DURATION_MS = 7000;

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(remainingPct);

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="salawat-reminder-toast"
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -25, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950/90 border-2 border-amber-500/60 rounded-2xl shadow-2xl p-4 sm:p-5 backdrop-blur-xl text-stone-100 ring-4 ring-emerald-500/20">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-start gap-3.5">
              
              {/* Animated Icon Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-stone-950 shadow-lg animate-pulse">
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-stone-950" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-stone-950" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-stone-900 border border-amber-400 flex items-center justify-center text-[10px]">
                  🌿
                </div>
              </div>

              {/* Toast Text Content */}
              <div className="flex-1 text-right min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                    <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>تذكير الصلاة على النبي</span>
                  </span>
                  
                  <button
                    onClick={onClose}
                    aria-label="إغلاق الإشعار"
                    className="text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-amber-200 font-tajawal flex items-center gap-1.5 flex-wrap">
                  <span>🔊 حان وقت الصلاة على النبي ﷺ</span>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline flex-shrink-0 animate-ping" />
                </h3>

                <p className="text-xs sm:text-sm font-amiri text-stone-200 mt-1 font-semibold leading-relaxed">
                  {arabicText}
                </p>

                {/* Action button */}
                {onQuickTasbeeh && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onQuickTasbeeh();
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>صلِّ عليه الآن (+1 تسبيحة)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800/80">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
