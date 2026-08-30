// Fasting Reminder Manager for Mondays, Thursdays & White Days using Integrated Hijri Calendar
import { getFullDateInfo, FullDateInfo } from "./hijri";
import { systemNotificationManager } from "./systemNotifications";

export interface FastingReminderConfig {
  mondayThursdayEnabled: boolean;
  whiteDaysEnabled: boolean;
  reminderTiming: "eve" | "fajr" | "morning"; // eve: 8:00 PM previous day, fajr: 4:00 AM, morning: 7:30 AM
  soundEnabled: boolean;
}

export const DEFAULT_FASTING_CONFIG: FastingReminderConfig = {
  mondayThursdayEnabled: true,
  whiteDaysEnabled: true,
  reminderTiming: "eve",
  soundEnabled: true,
};

export interface FastingDayMatch {
  isFastingDay: boolean;
  type: "monday" | "thursday" | "white_day" | null;
  targetDayName: string;
  hijriDateStr: string;
  title: string;
  body: string;
  hadith: string;
}

export class FastingReminderManager {
  private configKey = "fasting_reminder_config";
  private lastTriggeredKey = "fasting_reminder_last_triggered";

  public getConfig(): FastingReminderConfig {
    try {
      const saved = localStorage.getItem(this.configKey);
      if (!saved) return DEFAULT_FASTING_CONFIG;
      const parsed = JSON.parse(saved);
      return {
        mondayThursdayEnabled: parsed.mondayThursdayEnabled ?? true,
        whiteDaysEnabled: parsed.whiteDaysEnabled ?? true,
        reminderTiming: parsed.reminderTiming || "eve",
        soundEnabled: parsed.soundEnabled ?? true,
      };
    } catch {
      return DEFAULT_FASTING_CONFIG;
    }
  }

  public saveConfig(config: FastingReminderConfig): void {
    try {
      localStorage.setItem(this.configKey, JSON.stringify(config));
    } catch {}
  }

  /**
   * Check if today or tomorrow is a fasting day (Monday, Thursday, or White Days 13, 14, 15 Hijri)
   */
  public checkFastingDayStatus(now: Date = new Date(), config = this.getConfig()): FastingDayMatch {
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    const hours = now.getHours();

    // Timing check:
    // If timing is "eve" (previous evening), check if tomorrow is Monday (Sun eve) or Thursday (Wed eve)
    if (config.reminderTiming === "eve") {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowDayOfWeek = tomorrow.getDay();
      const tomorrowHijri = getFullDateInfo(tomorrow);

      // Check White Days for tomorrow (13, 14, 15 Hijri)
      if (config.whiteDaysEnabled && [13, 14, 15].includes(tomorrowHijri.hijriDay)) {
        return {
          isFastingDay: true,
          type: "white_day",
          targetDayName: tomorrowHijri.dayName,
          hijriDateStr: tomorrowHijri.hijriDateStr,
          title: `🌕 تذكير بصيام الأيام البيض (${tomorrowHijri.hijriDateStr})`,
          body: `غداً ${tomorrowHijri.dayName} يوافق ${tomorrowHijri.hijriDay} ${tomorrowHijri.hijriMonthName} من الأيام البيض المباركة. قال ﷺ: «صيام ثلاثة أيام من كل شهر صيام الدهر كله».`,
          hadith: "«صِيَامُ ثَلاَثَةِ أَيَّامٍ مِنْ كُلِّ شَهْرٍ صِيَامُ الدَّهْرِ كُلِّهِ»",
        };
      }

      // Check Monday (Tomorrow is Monday = today is Sunday)
      if (config.mondayThursdayEnabled && tomorrowDayOfWeek === 1) {
        return {
          isFastingDay: true,
          type: "monday",
          targetDayName: "الإثنين",
          hijriDateStr: tomorrowHijri.hijriDateStr,
          title: `🌙 تذكير بصيام يوم الإثنين (${tomorrowHijri.hijriDateStr})`,
          body: `غداً الإثنين يوافق ${tomorrowHijri.hijriDateStr} - صيام يوم الإثنين سنة نبوية مباركة ترفع فيها الأعمال إلى الله.`,
          hadith: "«تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»",
        };
      }

      // Check Thursday (Tomorrow is Thursday = today is Wednesday)
      if (config.mondayThursdayEnabled && tomorrowDayOfWeek === 4) {
        return {
          isFastingDay: true,
          type: "thursday",
          targetDayName: "الخميس",
          hijriDateStr: tomorrowHijri.hijriDateStr,
          title: `🌙 تذكير بصيام يوم الخميس (${tomorrowHijri.hijriDateStr})`,
          body: `غداً الخميس يوافق ${tomorrowHijri.hijriDateStr} - صيام يوم الخميس سنة مؤكدة تُغفر فيه الذنوب وتُعرض فيه الأعمال.`,
          hadith: "«تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»",
        };
      }
    } else {
      // Fajr or Morning mode: Check for TODAY
      const todayHijri = getFullDateInfo(now);

      // Check White Days for today
      if (config.whiteDaysEnabled && [13, 14, 15].includes(todayHijri.hijriDay)) {
        return {
          isFastingDay: true,
          type: "white_day",
          targetDayName: todayHijri.dayName,
          hijriDateStr: todayHijri.hijriDateStr,
          title: `🌕 اليوم صيام الأيام البيض (${todayHijri.hijriDateStr})`,
          body: `اليوم ${todayHijri.dayName} الموافق ${todayHijri.hijriDateStr} من الأيام البيض المباركة. هنيئاً لمن نوى الصيام.`,
          hadith: "«صِيَامُ ثَلاَثَةِ أَيَّامٍ مِنْ كُلِّ شَهْرٍ صِيَامُ الدَّهْرِ كُلِّهِ»",
        };
      }

      // Check Monday (Today is Monday)
      if (config.mondayThursdayEnabled && dayOfWeek === 1) {
        return {
          isFastingDay: true,
          type: "monday",
          targetDayName: "الإثنين",
          hijriDateStr: todayHijri.hijriDateStr,
          title: `🌙 صيام يوم الإثنين المبارك (${todayHijri.hijriDateStr})`,
          body: `اليوم الإثنين يوافق ${todayHijri.hijriDateStr} - قال النبي ﷺ: «ذاك يوم ولدت فيه وأنزل عليّ فيه» وسنة صيامه عظيمة.`,
          hadith: "«تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»",
        };
      }

      // Check Thursday (Today is Thursday)
      if (config.mondayThursdayEnabled && dayOfWeek === 4) {
        return {
          isFastingDay: true,
          type: "thursday",
          targetDayName: "الخميس",
          hijriDateStr: todayHijri.hijriDateStr,
          title: `🌙 صيام يوم الخميس المبارك (${todayHijri.hijriDateStr})`,
          body: `اليوم الخميس يوافق ${todayHijri.hijriDateStr} - يوم ترفع فيه الأعمال إلى رب العالمين فاحرص على صيامه ونيل ثوابه.`,
          hadith: "«تُعْرَضُ الأَعْمَالُ يَوْمَ الاِثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ»",
        };
      }
    }

    const currentHijri = getFullDateInfo(now);
    return {
      isFastingDay: false,
      type: null,
      targetDayName: currentHijri.dayName,
      hijriDateStr: currentHijri.hijriDateStr,
      title: "تذكير صيام التطوع",
      body: `التقويم الهجري اليوم: ${currentHijri.hijriDateStr}`,
      hadith: "«مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا»",
    };
  }

  /**
   * Check whether it is time to trigger the reminder automatically
   */
  public shouldTriggerNow(now: Date = new Date()): boolean {
    const config = this.getConfig();
    if (!config.mondayThursdayEnabled && !config.whiteDaysEnabled) {
      return false;
    }

    const todayStr = now.toISOString().split("T")[0];
    const lastTriggered = localStorage.getItem(this.lastTriggeredKey);

    if (lastTriggered === todayStr) {
      return false; // Already triggered today
    }

    const hours = now.getHours();

    // Matching timing window:
    // "eve" -> between 18:00 (6 PM) and 23:59 (11:59 PM)
    // "fajr" -> between 03:30 and 06:00
    // "morning" -> between 07:00 and 11:00
    let isInTimingWindow = false;
    if (config.reminderTiming === "eve" && hours >= 18) {
      isInTimingWindow = true;
    } else if (config.reminderTiming === "fajr" && hours >= 3 && hours <= 6) {
      isInTimingWindow = true;
    } else if (config.reminderTiming === "morning" && hours >= 7 && hours <= 11) {
      isInTimingWindow = true;
    }

    if (!isInTimingWindow) {
      return false;
    }

    const match = this.checkFastingDayStatus(now, config);
    return match.isFastingDay;
  }

  /**
   * Send the fasting notification
   */
  public async sendFastingNotification(customMatch?: FastingDayMatch): Promise<boolean> {
    const match = customMatch || this.checkFastingDayStatus();
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(this.lastTriggeredKey, todayStr);

    return systemNotificationManager.sendCustomNotification(
      match.title,
      `${match.body} • ${match.hadith}`
    );
  }
}

export const fastingReminderManager = new FastingReminderManager();
