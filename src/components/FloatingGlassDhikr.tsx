import React, { useState, useEffect, useRef } from "react";
import {
  CircleDot,
  Check,
  X,
  Volume2,
  Settings,
  Heart,
  ExternalLink,
} from "lucide-react";

export interface FloatingDhikrConfig {
  enabled: boolean;
  intervalMinutes: number; // e.g. 1, 2, 3, 5, 10, 15, 30
  frameSize: "sm" | "md" | "lg";
  position: "top" | "center" | "bottom";
  playSound: boolean;
  customDhikrs?: string[];
}

export const DEFAULT_FLOATING_DHIKR_CONFIG: FloatingDhikrConfig = {
  enabled: true,
  intervalMinutes: 3,
  frameSize: "md",
  position: "top",
  playSound: true,
};

export const BUILTIN_FLOATING_DHIKR_LIST = [
  { text: "سُبْحَانَ اللَّهِ", virtue: "تُغرس لك شجرة في الجنة" },
  { text: "الْحَمْدُ لِلَّهِ", virtue: "تملأ الميزان بالخير والبركة" },
  { text: "لَا إِلَهَ إِلَّا اللَّهُ", virtue: "أفضل ما قاله النبيون" },
  { text: "اللَّهُ أَكْبَرُ", virtue: "أحب الكلام إلى الله" },
  { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ", virtue: "كلمتان خفيفتان على اللسان ثقيلتان في الميزان" },
  { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ", virtue: "ممحاة للذنوب ومجلبة للرزق" },
  { text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ", virtue: "كنزٌ من كنوز الجنة" },
  { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", virtue: "من صلى عليّ صلاة صلى الله عليه بها عشراً" },
  { text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", virtue: "دعوة ذي النون ما دعا بها مكروب إلا فرج الله عنه" },
  { text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", virtue: "أمان الخائفين وكفاية للمتوكلين" },
  { text: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا", virtue: "كان حقاً على الله أن يرضيه يوم القيامة" },
  { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", virtue: "دعاء كشف الكرب والفرج" },
  { text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", virtue: "دعاء ليلة القدر المستجاب" },
];

interface FloatingGlassDhikrProps {
  config: FloatingDhikrConfig;
  onIncrementTasbeeh: () => void;
  onOpenSettings: () => void;
  forceTrigger?: number; // timestamp to manually trigger preview
}

export const FloatingGlassDhikr: React.FC<FloatingGlassDhikrProps> = ({
  config,
  onIncrementTasbeeh,
  onOpenSettings,
  forceTrigger,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentDhikr, setCurrentDhikr] = useState<{ text: string; virtue?: string } | null>(null);
  const [progress, setProgress] = useState<number>(100);
  const [justClicked, setJustClicked] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const autoHideTimeoutRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Play subtle chime when dhikr appears or is counted
  const playClickFeedback = () => {
    try {
      if (config.playSound && typeof window !== "undefined" && window.AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {}

    // Haptic feedback for mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([25, 30, 35]);
      } catch (e) {}
    }
  };

  // Show dhikr helper function
  const triggerDhikr = (customText?: string) => {
    // Select random dhikr from built-in or custom
    const list = [...BUILTIN_FLOATING_DHIKR_LIST];
    if (config.customDhikrs && config.customDhikrs.length > 0) {
      config.customDhikrs.forEach((cd) => list.push({ text: cd, virtue: "ذكر مخصص" }));
    }
    const picked = customText
      ? { text: customText, virtue: "تذكير مبارك" }
      : list[Math.floor(Math.random() * list.length)];

    setCurrentDhikr(picked);
    setJustClicked(false);
    setProgress(100);
    setIsVisible(true);

    // Also trigger System Web Notification if permitted and tab is backgrounded
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        if (document.hidden) {
          const notif = new Notification("تذكير بذكر الله", {
            body: `${picked.text}\nانقر لحسابها كتسبيحة لك في الميزان`,
            icon: "/icon-192.png",
            tag: "dhikr-float",
          });
          notif.onclick = () => {
            window.focus();
            onIncrementTasbeeh();
            notif.close();
          };
        }
      } catch (e) {}
    }

    // Clear existing timeouts
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // 5 seconds countdown progress
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);

      if (elapsed >= duration) {
        clearInterval(progressIntervalRef.current);
      }
    }, 40);

    // Auto dismiss after 5 seconds
    autoHideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  // Manual force trigger (for test preview)
  useEffect(() => {
    if (forceTrigger && forceTrigger > 0) {
      triggerDhikr();
    }
  }, [forceTrigger]);

  // Periodic interval scheduler
  useEffect(() => {
    if (!config.enabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(0.5, config.intervalMinutes) * 60 * 1000;

    // Set recurring timer
    timerRef.current = setInterval(() => {
      triggerDhikr();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [config.enabled, config.intervalMinutes, config.customDhikrs]);

  // Handle user touch/click on the floating glass dhikr
  const handleDhikrClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (justClicked) return;

    setJustClicked(true);
    playClickFeedback();

    // Increment tasbeeh count in the main app!
    onIncrementTasbeeh();

    // Rapid clean exit animation
    setTimeout(() => {
      setIsVisible(false);
      setJustClicked(false);
    }, 400);
  };

  if (!isVisible || !currentDhikr) return null;

  // Size styling classes
  const sizeClasses = {
    sm: "max-w-xs py-2 px-3 text-xs",
    md: "max-w-sm py-3 px-4 text-sm",
    lg: "max-w-md py-4 px-5 text-base",
  }[config.frameSize || "md"];

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
  }[config.frameSize || "md"];

  // Position classes
  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-24 left-1/2 -translate-x-1/2",
  }[config.position || "top"];

  return (
    <div
      id="floating-glass-dhikr"
      className={`fixed ${positionClasses} z-50 w-[92%] ${sizeClasses} animate-bounceIn select-none`}
    >
      {/* Ultra Glassmorphic Container */}
      <div
        onClick={handleDhikrClick}
        className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 transform active:scale-95 ${
          justClicked
            ? "scale-105 bg-emerald-600/90 text-white shadow-[0_15px_40px_rgba(5,150,105,0.45)] ring-4 ring-emerald-300"
            : "bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-white/60 dark:border-stone-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/20"
        }`}
      >
        {/* Subtle Ambient Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 pointer-events-none" />

        {/* 5-Second Progress Bar at Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-200/40 dark:bg-stone-800/40 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              justClicked ? "bg-white" : "bg-gradient-to-r from-amber-400 to-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Section */}
        <div className="relative p-1 text-center flex flex-col items-center justify-center">
          
          {/* Header Badge */}
          <div className="flex items-center justify-between w-full mb-1.5 px-1">
            <div className="flex items-center gap-1 text-[10px] font-bold font-tajawal text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-400/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CircleDot className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>إشعار ذكر عائم • المس لتسجيل تسبيحة</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="w-5 h-5 rounded-full bg-stone-200/50 dark:bg-stone-700/50 hover:bg-stone-300 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
              title="إخفاء"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Main Dhikr Text (Rich Arabic Typography) */}
          <div className="py-1">
            <h3
              className={`${textSizeClasses} font-black font-amiri text-stone-900 dark:text-white leading-relaxed tracking-wide drop-shadow-sm`}
            >
              {currentDhikr.text}
            </h3>

            {currentDhikr.virtue && !justClicked && (
              <p className="text-[11px] font-tajawal text-emerald-700 dark:text-emerald-300 mt-0.5 font-medium">
                {currentDhikr.virtue}
              </p>
            )}
          </div>

          {/* Just Clicked +1 Reward Animation */}
          {justClicked ? (
            <div className="mt-1 flex items-center gap-1 text-xs font-bold font-tajawal text-white animate-pulse">
              <Check className="w-4 h-4 text-white" />
              <span>+1 تم احتساب التسبيحة وكُتبت لك حسنة!</span>
            </div>
          ) : (
            <div className="mt-1 flex items-center justify-between w-full pt-1.5 border-t border-stone-200/60 dark:border-stone-700/60 text-[10px] text-stone-500 dark:text-stone-400 font-tajawal px-1">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600 animate-pulse" />
                <span>المسني الآن</span>
              </span>

              <span className="text-stone-400 font-mono">
                {Math.ceil((progress / 100) * 5)} ثوانٍ
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
