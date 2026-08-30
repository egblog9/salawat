import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  Bell,
  X,
  Sparkles,
  Volume2,
  CalendarCheck,
} from "lucide-react";
import { getCityPrayerList, ISLAMIC_CITIES_DATABASE } from "../data/prayerTimesData";
import { sheikhAudioManager } from "../utils/audio";
import { systemNotificationManager } from "../utils/systemNotifications";

interface PrayerPromptNotificationProps {
  selectedCity: string;
  onPrayerConfirmed?: (prayerKey: string) => void;
}

export const PrayerPromptNotification: React.FC<PrayerPromptNotificationProps> = ({
  selectedCity,
  onPrayerConfirmed,
}) => {
  const [activePromptPrayer, setActivePromptPrayer] = useState<{
    key: string;
    name: string;
    displayTime: string;
  } | null>(null);

  const [snoozeOpen, setSnoozeOpen] = useState<boolean>(false);
  const [dismissedUntil, setDismissedUntil] = useState<number>(0);

  // Check whether a prayer has entered and prompt is due
  useEffect(() => {
    const checkPrayerStatus = () => {
      // If snoozed until a future time, don't show yet
      if (Date.now() < dismissedUntil) {
        return;
      }

      const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const prayerList = getCityPrayerList(selectedCity);
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // Prayers to check (exclude Sunrise/الشروق as it's not a fard prayer)
      const fardPrayers = prayerList.filter((p) => p.id !== "sunrise");

      // Find the current active prayer window (e.g. from current prayer time until next prayer time)
      // Prayers in chronological order: Fajr -> Dhuhr -> Asr -> Maghrib -> Isha
      let activePrayerForNow: typeof fardPrayers[0] | null = null;

      for (let i = fardPrayers.length - 1; i >= 0; i--) {
        const prayer = fardPrayers[i];
        const prayerMinutes = prayer.hours24 * 60 + prayer.minutes;

        if (nowMinutes >= prayerMinutes) {
          activePrayerForNow = prayer;
          break;
        }
      }

      // If before Fajr today, the current window is Isha from previous night or none yet
      if (!activePrayerForNow) {
        setActivePromptPrayer(null);
        return;
      }

      const prayer = activePrayerForNow;
      const prayerPromptKey = `prayer_prompt_completed_${todayStr}_${prayer.id}`;
      const prayerConfirmedKey = `prayer_confirmed_${prayer.id}_${todayStr}`;
      
      // Also check standard prayer_tracker_logs
      let trackerLogged = false;
      try {
        const logs = JSON.parse(localStorage.getItem("prayer_tracker_logs") || "{}");
        const todayLogs = logs[todayStr]?.prayers;
        if (todayLogs && (todayLogs[prayer.id] === "mosque" || todayLogs[prayer.id] === "on_time" || todayLogs[prayer.id] === "late")) {
          trackerLogged = true;
        }
      } catch {}

      const isCompleted =
        localStorage.getItem(prayerPromptKey) === "true" ||
        localStorage.getItem(prayerConfirmedKey) === "true" ||
        trackerLogged;

      // If not confirmed completed yet, show the prompt for this specific prayer
      if (!isCompleted) {
        setActivePromptPrayer({
          key: prayer.id,
          name: prayer.name,
          displayTime: prayer.displayTime,
        });
      } else {
        setActivePromptPrayer(null);
      }
    };

    checkPrayerStatus();
    const interval = setInterval(checkPrayerStatus, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [selectedCity, dismissedUntil]);

  if (!activePromptPrayer) return null;

  const handlePrayedYes = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const prayerLogKey = `prayer_prompt_completed_${todayStr}_${activePromptPrayer.key}`;
    const confirmedKey = `prayer_confirmed_${activePromptPrayer.key}_${todayStr}`;
    localStorage.setItem(prayerLogKey, "true");
    localStorage.setItem(confirmedKey, "true");

    // Also update prayer tracker logs if available
    try {
      const logsKey = "prayer_tracker_logs";
      const rawSaved = localStorage.getItem(logsKey);
      const existing = rawSaved ? JSON.parse(rawSaved) : {};
      const currentDayLog = existing && existing[todayStr] && typeof existing[todayStr] === "object"
        ? existing[todayStr]
        : {
            date: todayStr,
            prayers: { fajr: "none", dhuhr: "none", asr: "none", maghrib: "none", isha: "none" },
            sunnah: {
              fajrSunnah: false,
              dhuhrSunnahBefore: false,
              dhuhrSunnahAfter: false,
              maghribSunnah: false,
              ishaSunnah: false,
              duha: false,
              qiyamWitr: false,
            },
          };

      if (!currentDayLog.prayers || typeof currentDayLog.prayers !== "object") {
        currentDayLog.prayers = { fajr: "none", dhuhr: "none", asr: "none", maghrib: "none", isha: "none" };
      }
      if (!currentDayLog.sunnah || typeof currentDayLog.sunnah !== "object") {
        currentDayLog.sunnah = {
          fajrSunnah: false,
          dhuhrSunnahBefore: false,
          dhuhrSunnahAfter: false,
          maghribSunnah: false,
          ishaSunnah: false,
          duha: false,
          qiyamWitr: false,
        };
      }

      currentDayLog.prayers[activePromptPrayer.key] = "on_time";
      existing[todayStr] = currentDayLog;
      localStorage.setItem(logsKey, JSON.stringify(existing));
    } catch {}

    // Dispatch global sync event for PrayerTrackerModal
    try {
      window.dispatchEvent(new CustomEvent("prayer_status_updated", {
        detail: { prayerKey: activePromptPrayer.key, date: todayStr, status: "on_time" }
      }));
    } catch {}

    try {
      sheikhAudioManager.playCompletionChime();
    } catch {}

    if (onPrayerConfirmed) {
      onPrayerConfirmed(activePromptPrayer.key);
    }

    setActivePromptPrayer(null);
  };

  const handleSnooze = (minutes: number) => {
    const nextTime = Date.now() + minutes * 60 * 1000;
    setDismissedUntil(nextTime);
    setSnoozeOpen(false);

    // Schedule background notification
    if (systemNotificationManager.isSupported()) {
      setTimeout(() => {
        const todayStr = new Date().toISOString().split("T")[0];
        const prayerLogKey = `prayer_prompt_completed_${todayStr}_${activePromptPrayer.key}`;
        if (localStorage.getItem(prayerLogKey) !== "true") {
          systemNotificationManager.sendCustomNotification(
            `🕌 هل صليت صلاة ${activePromptPrayer.name}؟`,
            `تذكير بأداء صلاة ${activePromptPrayer.name} في وقتها المبارك.`
          );
        }
      }, minutes * 60 * 1000);
    }

    setActivePromptPrayer(null);
  };

  return (
    <div
      id="prayer-prompt-banner"
      className="w-full max-w-md mx-auto mb-3 bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-4 shadow-xl border border-emerald-500/40 relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-800/80 border border-emerald-500/50 flex items-center justify-center text-emerald-200 flex-shrink-0 shadow">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full font-tajawal">
                تذكير الصلاة
              </span>
              <span className="text-xs text-stone-300 font-mono">
                {activePromptPrayer.displayTime}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold font-tajawal text-white mt-1">
              هل صليت صلاة {activePromptPrayer.name}؟
            </h4>
          </div>
        </div>

        <button
          onClick={() => handleSnooze(10)}
          className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          title="تأجيل التذكير"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-emerald-200/90 font-amiri mt-2 leading-relaxed">
        «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا» • احرص على أدائها في وقتها.
      </p>

      {/* Buttons Row */}
      {!snoozeOpen ? (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-800/40">
          <button
            onClick={handlePrayedYes}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm font-tajawal flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>الحمد لله صليت</span>
          </button>

          <button
            onClick={() => setSnoozeOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm font-tajawal flex items-center justify-center gap-1.5 border border-stone-700 active:scale-95 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>لسه (ذكرني لاحقاً)</span>
          </button>
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-emerald-800/40 space-y-2">
          <span className="text-[11px] text-stone-300 font-tajawal block font-bold">
            اختر وقت إعادة التذكير:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSnooze(5)}
              className="py-2 rounded-xl bg-white/10 hover:bg-emerald-700 text-white text-xs font-bold font-tajawal border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              بعد 5 دقائق
            </button>
            <button
              onClick={() => handleSnooze(10)}
              className="py-2 rounded-xl bg-white/10 hover:bg-emerald-700 text-white text-xs font-bold font-tajawal border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              بعد 10 دقائق
            </button>
            <button
              onClick={() => handleSnooze(15)}
              className="py-2 rounded-xl bg-white/10 hover:bg-emerald-700 text-white text-xs font-bold font-tajawal border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              بعد 15 دقيقة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
