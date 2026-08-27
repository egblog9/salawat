// System Notifications Manager for Salawat PWA
export interface IslamicNotificationMessage {
  title: string;
  body: string;
  category: "salawat" | "share" | "virtue" | "tasbeeh";
}

export const ISLAMIC_NOTIFICATIONS: IslamicNotificationMessage[] = [
  {
    title: "🌿 لا تنسَ الصلاة على النبي ﷺ",
    body: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا وَحَبِيبِنَا مُحَمَّدٍ ﷺ",
    category: "salawat",
  },
  {
    title: "🤍 شارك التطبيق واجعله صدقة جارية",
    body: "الدال على الخير كفاعله، شارك تطبيق صلوات مع أحبابك لتنال أجر كل من صلى على النبي ﷺ",
    category: "share",
  },
  {
    title: "🤲 عطر لسانك بالصلاة على الحبيب",
    body: "قال رسول الله ﷺ: «مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»",
    category: "virtue",
  },
  {
    title: "📿 رطّب لسانك بذكر الله والصلاة على نبيه",
    body: "الصلاة على النبي تكفيك همّك، وتغفر ذنبك، وتفتح لك أبواب الفرج والبركة",
    category: "salawat",
  },
  {
    title: "🌿 صدقة جارية لك ولوالديك",
    body: "انشر تطبيق «صلوات» لمن تحب وكن سبباً في إحياء سنة الصلاة على النبي ﷺ",
    category: "share",
  },
  {
    title: "🕌 غنائم الذكر والتسبيح",
    body: "قال ﷺ: «أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً»",
    category: "virtue",
  },
];

class SystemNotificationManager {
  private lastIndex = 0;

  public isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (e) {
      console.warn("Notification request permission error:", e);
      return false;
    }
  }

  public getNextMessage(): IslamicNotificationMessage {
    const msg = ISLAMIC_NOTIFICATIONS[this.lastIndex % ISLAMIC_NOTIFICATIONS.length];
    this.lastIndex = (this.lastIndex + 1) % ISLAMIC_NOTIFICATIONS.length;
    return msg;
  }

  public getRandomMessage(): IslamicNotificationMessage {
    const idx = Math.floor(Math.random() * ISLAMIC_NOTIFICATIONS.length);
    return ISLAMIC_NOTIFICATIONS[idx];
  }

  public async sendCustomNotification(title: string, body: string): Promise<boolean> {
    return this.sendNotification({ title, body, category: "salawat" });
  }

  public async sendNotification(customMessage?: Partial<IslamicNotificationMessage>): Promise<boolean> {
    if (!this.isSupported()) return false;

    // If permission not granted, request it first
    let currentPerm = Notification.permission;
    if (currentPerm === "default") {
      const granted = await this.requestPermission();
      currentPerm = granted ? "granted" : "denied";
    }

    if (currentPerm !== "granted") {
      return false;
    }

    const message = customMessage?.title
      ? { title: customMessage.title, body: customMessage.body || "", category: customMessage.category || "salawat" }
      : this.getNextMessage();

    const notificationOptions: Record<string, unknown> = {
      body: message.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      dir: "rtl",
      lang: "ar",
      tag: "salawat-reminder-tag",
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: "/?source=notification",
        dateOfArrival: Date.now(),
      },
    };

    try {
      // 1. Try Service Worker showNotification (Best for Android & PWAs in background/shade)
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && "showNotification" in registration) {
          await registration.showNotification(message.title, notificationOptions as NotificationOptions);
          return true;
        }
      }

      // 2. Fallback to standard Notification API
      new Notification(message.title, notificationOptions as NotificationOptions);
      return true;
    } catch (err) {
      console.warn("Failed to send system notification:", err);
      try {
        new Notification(message.title, notificationOptions as NotificationOptions);
        return true;
      } catch (e2) {
        console.warn("Standard notification fallback also failed:", e2);
        return false;
      }
    }
  }
}

export const systemNotificationManager = new SystemNotificationManager();

