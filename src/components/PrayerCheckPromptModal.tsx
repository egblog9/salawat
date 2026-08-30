import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  Award,
  Volume2,
  Flame,
} from "lucide-react";
import {
  PrayerScheduleItem,
  confirmPrayerToday,
  snoozePrayerReminder,
  getPreferredSnoozeInterval,
} from "../utils/prayerReminderManager";

interface PrayerCheckPromptModalProps {
  prayer: PrayerScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: (prayerId: string) => void;
  onSnoozed: (prayerId: string, minutes: number) => void;
}

export const PrayerCheckPromptModal: React.FC<PrayerCheckPromptModalProps> = ({
  prayer,
  isOpen,
  onClose,
  onConfirmed,
  onSnoozed,
}) => {
  const [selectedInterval, setSelectedInterval] = useState<number>(() =>
    getPreferredSnoozeInterval()
  );
  const [isMosqueSelected, setIsMosqueSelected] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShowCelebration(false);
    }
  }, [isOpen]);

  if (!isOpen || !prayer) return null;

  const handleConfirmYes = (asMosque: boolean = false) => {
    confirmPrayerToday(prayer.id, asMosque ? "mosque" : "on_time");
    setShowCelebration(true);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      onConfirmed(prayer.id);
      onClose();
    }, 1200);
  };

  const handleSnooze = (minutes: number) => {
    snoozePrayerReminder(prayer.id, minutes);
    onSnoozed(prayer.id, minutes);
    onClose();
  };

  return (
    <div
      id="prayer-check-prompt-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div className="bg-[#FAF9F5] w-full max-w-md rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Celebration State Overlay */}
        {showCelebration ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-emerald-900 text-white min-h-[300px]">
            <div className="w-16 h-16 rounded-3xl bg-emerald-700/80 border border-emerald-400 flex items-center justify-center text-emerald-200 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold font-tajawal text-white">
              تقبّل الله طاعتكم وصالح أعمالكم!
            </h3>
            <p className="text-sm font-amiri text-emerald-100">
              تم تسجيل صلاة {prayer.name} بنجاح، ولن يظهر هذا التذكير مجدداً اليوم ✨
            </p>
          </div>
        ) : (
          <>
            {/* Top Pattern Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-800/40 relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-2xl shadow">
                  {prayer.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-400 font-tajawal block">
                    تذكير الصلوات الخمس المفروضة
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-tajawal text-white">
                    هل صليت صلاة {prayer.name}؟
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق مؤقت"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* Question & Time Notice */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm text-center space-y-2">
                <p className="text-base font-bold font-tajawal text-stone-900">
                  حان وقت صلاة <span className="text-emerald-800 font-black">{prayer.name}</span> ({prayer.displayTime})
                </p>
                <p className="text-xs text-stone-500 font-amiri leading-relaxed">
                  قال رسول الله ﷺ: «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ: الصَّلاةُ عَلَى وَقْتِهَا».
                </p>
              </div>

              {/* PRIMARY ACTION 1: YES I PRAYED */}
              <div className="space-y-2">
                <button
                  id="prayer-confirm-yes-btn"
                  type="button"
                  onClick={() => handleConfirmYes(isMosqueSelected)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-base font-tajawal shadow-lg shadow-emerald-900/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 border border-emerald-600/40"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>نعم، الحمد لله صليت</span>
                </button>

                {/* Quick Toggle: Was it in Mosque */}
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleConfirmYes(true)}
                    className="text-[11.5px] font-tajawal text-emerald-800 hover:text-emerald-900 underline font-bold cursor-pointer"
                  >
                    🕌 صليت في المسجد جماعة (27 ضعفاً)
                  </button>
                </div>
              </div>

              {/* SECONDARY ACTION 2: NOT YET (SNOOZE) */}
              <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-tajawal text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>لم أصلِ بعد (تذكير لاحقاً):</span>
                  </span>
                  <span className="text-[10.5px] text-stone-500 font-tajawal">
                    اختر وقت التنبيه القادم
                  </span>
                </div>

                {/* Snooze Interval Pills: 5m, 10m, 15m */}
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setSelectedInterval(mins);
                        handleSnooze(mins);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-tajawal transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        selectedInterval === mins
                          ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                          : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                      }`}
                    >
                      <span>كل {mins} دقائق</span>
                      <span className="text-[9.5px] opacity-80">تذكير</span>
                    </button>
                  ))}
                </div>

                <p className="text-[10.5px] text-stone-500 font-amiri text-center">
                  سيتم تنبيهك داخل وخارج التطبيق حتى تؤدي صلاتك وتطمئن نفسك.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-stone-50 px-4 py-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400 font-tajawal">
              <span>عند الضغط على نعم لن يظهر هذا الإشعار ثانية اليوم</span>
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-700 font-bold"
              >
                إغلاق
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
