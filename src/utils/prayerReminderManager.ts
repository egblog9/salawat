// Prayer Follow-up & Snooze Reminder Engine
import { systemNotificationManager } from "./systemNotifications";

export interface PrayerScheduleItem {
  id: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  displayTime: string;
  hours24: number;
  minutes: number;
  icon: string;
}

export const DAILY_PRAYERS_SCHEDULE: PrayerScheduleItem[] = [
  { id: "fajr", name: "الفجر", displayTime: "04:20", hours24: 4, minutes: 20, icon: "🌅" },
  { id: "dhuhr", name: "الظهر", displayTime: "12:45", hours24: 12, minutes: 45, icon: "☀️" },
  { id: "asr", name: "العصر", displayTime: "16:15", hours24: 16, minutes: 15, icon: "⛅" },
  { id: "maghrib", name: "المغرب", displayTime: "19:35", hours24: 19, minutes: 35, icon: "🌇" },
  { id: "isha", name: "العشاء", displayTime: "20:55", hours24: 20, minutes: 55, icon: "🌙" },
];

export function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getLatestEnteredPrayer(): PrayerScheduleItem {
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  // Check in reverse from Isha to Fajr
  for (let i = DAILY_PRAYERS_SCHEDULE.length - 1; i >= 0; i--) {
    const p = DAILY_PRAYERS_SCHEDULE[i];
    const prayerMinutes = p.hours24 * 60 + p.minutes;
    if (currentTotalMinutes >= prayerMinutes) {
      return p;
    }
  }

  // If before Fajr (e.g. 2:00 AM), the latest passed prayer was Isha from yesterday/night
  return DAILY_PRAYERS_SCHEDULE[DAILY_PRAYERS_SCHEDULE.length - 1]; // Isha
}

export function isPrayerConfirmedToday(prayerId: string): boolean {
  try {
    const today = getTodayDateKey();
    const confirmedKey = `prayer_confirmed_${prayerId}_${today}`;
    if (localStorage.getItem(confirmedKey) === "true") {
      return true;
    }

    // Also check prayer_tracker_logs
    const savedLogs = localStorage.getItem("prayer_tracker_logs");
    if (savedLogs) {
      const logs = JSON.parse(savedLogs);
      const todayLog = logs[today];
      if (todayLog && todayLog.prayers) {
        const st = todayLog.prayers[prayerId];
        if (st === "mosque" || st === "on_time" || st === "late") {
          return true;
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function confirmPrayerToday(
  prayerId: string,
  status: "on_time" | "mosque" = "on_time"
): void {
  try {
    const today = getTodayDateKey();
    const confirmedKey = `prayer_confirmed_${prayerId}_${today}`;
    localStorage.setItem(confirmedKey, "true");

    // Clear any snooze
    localStorage.removeItem(`prayer_snooze_until_${prayerId}_${today}`);

    // Update prayer_tracker_logs
    const savedLogs = localStorage.getItem("prayer_tracker_logs");
    const logs = savedLogs ? JSON.parse(savedLogs) : {};
    const currentDay = logs[today] || {
      date: today,
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

    currentDay.prayers[prayerId] = status;
    logs[today] = currentDay;
    localStorage.setItem("prayer_tracker_logs", JSON.stringify(logs));

    // Notify other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("prayer_status_updated", { detail: { prayerId, status } }));
    }
  } catch (e) {
    console.error("Error confirming prayer:", e);
  }
}

export function snoozePrayerReminder(prayerId: string, snoozeMinutes: number = 5): void {
  try {
    const today = getTodayDateKey();
    const until = Date.now() + snoozeMinutes * 60 * 1000;
    localStorage.setItem(`prayer_snooze_until_${prayerId}_${today}`, until.toString());
    localStorage.setItem("prayer_last_snooze_interval", snoozeMinutes.toString());

    // Schedule system notification if user leaves or background
    const pObj = DAILY_PRAYERS_SCHEDULE.find((p) => p.id === prayerId);
    const pName = pObj?.name || "الصلاة";

    setTimeout(() => {
      // Check if still not confirmed
      if (!isPrayerConfirmedToday(prayerId)) {
        systemNotificationManager.sendCustomNotification(
          `🕌 تذكير: هل صليت صلاة ${pName}؟`,
          `الصلاة عماد الدين، لا تنسَ أداء صلاة ${pName} في وقتها لتنال الأجر والبركة.`
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("prayer_snooze_expired", { detail: { prayerId } }));
        }
      }
    }, snoozeMinutes * 60 * 1000);
  } catch (e) {
    console.error("Error setting prayer snooze:", e);
  }
}

export function isPrayerCurrentlySnoozed(prayerId: string): boolean {
  try {
    const today = getTodayDateKey();
    const untilStr = localStorage.getItem(`prayer_snooze_until_${prayerId}_${today}`);
    if (!untilStr) return false;
    const until = parseInt(untilStr, 10);
    return Date.now() < until;
  } catch {
    return false;
  }
}

export function getPreferredSnoozeInterval(): number {
  try {
    const saved = localStorage.getItem("prayer_last_snooze_interval");
    return saved ? parseInt(saved, 10) || 5 : 5;
  } catch {
    return 5;
  }
}

/**
 * Checks whether we should show the prompt for the latest entered prayer right now
 */
export function checkShouldPromptLatestPrayer(): {
  shouldPrompt: boolean;
  prayer: PrayerScheduleItem | null;
} {
  const latestPrayer = getLatestEnteredPrayer();
  if (isPrayerConfirmedToday(latestPrayer.id)) {
    return { shouldPrompt: false, prayer: null };
  }
  if (isPrayerCurrentlySnoozed(latestPrayer.id)) {
    return { shouldPrompt: false, prayer: latestPrayer };
  }
  return { shouldPrompt: true, prayer: latestPrayer };
}
