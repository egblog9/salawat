import React, { useState, useEffect, useCallback } from "react";
import { SalawatHeader } from "./components/SalawatHeader";
import { SalawatHeroCard } from "./components/SalawatHeroCard";
import { PrayerTimesCard } from "./components/PrayerTimesCard";
import { FajrAlarmHeroCard } from "./components/FajrAlarmHeroCard";
import { AppFeaturesGrid } from "./components/AppFeaturesGrid";
import { ProphetHadithBanner } from "./components/ProphetHadithBanner";
import { SalawatBottomNav } from "./components/SalawatBottomNav";
import { AudioFloatingBar } from "./components/AudioFloatingBar";
import { ReminderToast } from "./components/ReminderToast";
import { InstallPwaPrompt } from "./components/InstallPwaPrompt";
import { ShareAppModal } from "./components/ShareAppModal";
import { FajrAlarmChallengeModal } from "./components/FajrAlarmChallengeModal";
import { AzkarModal } from "./components/AzkarModal";
import { HisnMuslimModal } from "./components/HisnMuslimModal";
import { IslamicLibraryModal } from "./components/IslamicLibraryModal";
import { CitySelectorModal } from "./components/CitySelectorModal";
import { StatsHistoryModal } from "./components/StatsHistoryModal";
import { ProfileSettingsModal } from "./components/ProfileSettingsModal";
import { TasbeehModal } from "./components/TasbeehModal";
import { OverlayAndVolumeModal } from "./components/OverlayAndVolumeModal";
import { QuranModal } from "./components/QuranModal";
import { HijriCalendarModal } from "./components/HijriCalendarModal";
import { PrayerTrackerModal } from "./components/PrayerTrackerModal";
import { ZakatCalculatorModal } from "./components/ZakatCalculatorModal";
import { HadithModal } from "./components/HadithModal";
import { QuranMemorizeModal } from "./components/QuranMemorizeModal";
import { PrayerPromptNotification } from "./components/PrayerPromptNotification";
import {
  FloatingGlassDhikr,
  FloatingDhikrConfig,
  DEFAULT_FLOATING_DHIKR_CONFIG,
} from "./components/FloatingGlassDhikr";
import { FloatingDhikrSettingsModal } from "./components/FloatingDhikrSettingsModal";
import { SALAWAT_COLLECTION, SHEIKH_AUDIO_TRACKS, REMINDER_VOICE_FORMULAS } from "./data/salawatData";
import { SalawatItem, SheikhAudioTrack, SiteStats, ReminderVoiceFormula } from "./types";
import { sheikhAudioManager, reminderAudioManager, SEQUENTIAL_AZKAR_LIST, stopAllAppAudio } from "./utils/audio";
import { systemNotificationManager } from "./utils/systemNotifications";
import { loudAlarmAudioService } from "./utils/alarmAudio";
import { backgroundTimerService } from "./utils/backgroundTimer";
import { quranService } from "./utils/quranService";
import { SURAH_LIST } from "./data/quranData";

export default function App() {
  // Navigation & Modal States
  const [activeBottomNav, setActiveBottomNav] = useState<string>("home");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAzkarModalOpen, setIsAzkarModalOpen] = useState<boolean>(false);
  const [isHisnModalOpen, setIsHisnModalOpen] = useState<boolean>(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isTasbeehModalOpen, setIsTasbeehModalOpen] = useState<boolean>(false);
  const [isOverlayModalOpen, setIsOverlayModalOpen] = useState<boolean>(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState<boolean>(false);
  const [isHijriModalOpen, setIsHijriModalOpen] = useState<boolean>(false);
  const [isPrayerTrackerModalOpen, setIsPrayerTrackerModalOpen] = useState<boolean>(false);
  const [isZakatModalOpen, setIsZakatModalOpen] = useState<boolean>(false);
  const [isHadithModalOpen, setIsHadithModalOpen] = useState<boolean>(false);
  const [isMemorizeModalOpen, setIsMemorizeModalOpen] = useState<boolean>(false);
  const [isFloatingDhikrSettingsOpen, setIsFloatingDhikrSettingsOpen] = useState<boolean>(false);

  // Floating Glass Dhikr Config & Manual Trigger State
  const [floatingDhikrConfig, setFloatingDhikrConfig] = useState<FloatingDhikrConfig>(() => {
    try {
      const saved = localStorage.getItem("floating_dhikr_config");
      return saved ? JSON.parse(saved) : DEFAULT_FLOATING_DHIKR_CONFIG;
    } catch (e) {
      return DEFAULT_FLOATING_DHIKR_CONFIG;
    }
  });
  const [forceDhikrTrigger, setForceDhikrTrigger] = useState<number>(0);

  // Quran Audio Recitation Global State
  const [quranPlayingInfo, setQuranPlayingInfo] = useState<{
    isPlaying: boolean;
    surahNum: number;
    ayahNum: number;
    reciterName: string;
    surahName: string;
  } | null>(null);

  const [isReminderAudioPlaying, setIsReminderAudioPlaying] = useState<boolean>(false);

  // Synchronize Quran player events
  useEffect(() => {
    quranService.setOnAyahChange((surahNum, ayahNum, playing) => {
      const sMeta = SURAH_LIST.find((s) => s.number === surahNum);
      const reciter = quranService.getSelectedReciter();
      setQuranPlayingInfo({
        isPlaying: playing,
        surahNum,
        ayahNum,
        reciterName: reciter?.name || "الشيخ",
        surahName: sMeta?.name || `سورة ${surahNum}`,
      });
    });

    quranService.setOnSurahEnded(() => {
      setQuranPlayingInfo(null);
    });
  }, []);

  // Selected City for Prayer Times
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem("selectedPrayerCity") || "القاهرة";
  });

  // Standalone installed PWA mode detection
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error navigator standalone for iOS safari
      window.navigator.standalone === true
    );
  });

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error navigator standalone for iOS safari
        window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    window.addEventListener("appinstalled", checkStandalone);
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    return () => {
      window.removeEventListener("appinstalled", checkStandalone);
      mediaQuery.removeEventListener("change", checkStandalone);
    };
  }, []);

  // Local user's personal lifetime tasbeeh counter
  const [personalSalawat, setPersonalSalawat] = useState<number>(() => {
    const saved = localStorage.getItem("personal_salawat_count");
    return saved ? parseInt(saved, 10) : 1245;
  });

  // Collective Live Website Stats (Real Genuine Counts with local cache fallback)
  const [siteStats, setSiteStats] = useState<SiteStats>(() => {
    try {
      const cachedVisitors = localStorage.getItem("site_cached_visitors");
      const cachedTasbeehat = localStorage.getItem("site_cached_tasbeehat");
      return {
        visitorsCount: cachedVisitors ? Math.max(1, parseInt(cachedVisitors, 10)) : 1,
        totalTasbeehat: cachedTasbeehat ? parseInt(cachedTasbeehat, 10) : 1245,
      };
    } catch (e) {
      return {
        visitorsCount: 1,
        totalTasbeehat: 1245,
      };
    }
  });

  const [currentTrack, setCurrentTrack] = useState<SheikhAudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [totalRepeats, setTotalRepeats] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1.0);

  // Volume Boost State (200% Hardware Sound Booster)
  const [volumeBoostEnabled, setVolumeBoostEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("volumeBoostEnabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  // Active Dhikr Display Text & Category for floating toast
  const [activeDhikrText, setActiveDhikrText] = useState<string>("« سُبْحَانَ اللَّهِ »");
  const [activeDhikrTitle, setActiveDhikrTitle] = useState<string>("تذكير الأذكار المتتابعة");

  // Voice Reminder Selected Formula State
  const [selectedVoice, setSelectedVoice] = useState<ReminderVoiceFormula>(() => {
    const savedId = localStorage.getItem("reminderVoiceFormulaId");
    return (
      REMINDER_VOICE_FORMULAS.find((f) => f.id === savedId) ||
      REMINDER_VOICE_FORMULAS[0]
    );
  });

  // Voice Reminder State
  const [soundReminderEnabled, setSoundReminderEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("soundReminderEnabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  const [soundReminderInterval, setSoundReminderInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("soundReminderInterval");
      return saved ? parseInt(saved, 10) || 10 : 10;
    } catch (e) {
      return 10;
    }
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [showReminderToast, setShowReminderToast] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => soundReminderInterval * 60);

  // System Push Notifications State
  const [systemNotificationsEnabled, setSystemNotificationsEnabled] = useState<boolean>(() => {
    try {
      return (
        systemNotificationManager.isSupported() &&
        localStorage.getItem("systemNotificationsEnabled") === "true" &&
        systemNotificationManager.getPermissionStatus() === "granted"
      );
    } catch (e) {
      return false;
    }
  });

  // Fajr Loud Smart Alarm State
  const [fajrAlarmEnabled, setFajrAlarmEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("fajrAlarmEnabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  const [fajrAlarmTime, setFajrAlarmTime] = useState<string>(() => {
    try {
      return localStorage.getItem("fajrAlarmTime") || "03:50";
    } catch (e) {
      return "03:50";
    }
  });

  const [fajrChallengeType, setFajrChallengeType] = useState<"math" | "tasbeeh" | "sentence">("math");
  const [fajrDifficulty, setFajrDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [fajrSoundType, setFajrSoundType] = useState<"adhan" | "intense_alarm" | "adhan_and_siren">("adhan");
  const [isAlarmRinging, setIsAlarmRinging] = useState<boolean>(false);
  const [lastTriggeredDate, setLastTriggeredDate] = useState<string>("");

  // Background Keep-Alive Audio Mode State
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isBackgroundEnabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  // Save selected city
  useEffect(() => {
    localStorage.setItem("selectedPrayerCity", selectedCity);
  }, [selectedCity]);

  // Sync Fajr Alarm Preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fajrAlarmEnabled", fajrAlarmEnabled.toString());
      localStorage.setItem("fajrAlarmTime", fajrAlarmTime);
      localStorage.setItem("fajrSoundType", fajrSoundType);
      localStorage.setItem("fajrChallengeType", fajrChallengeType);
    } catch (e) {
      // ignore
    }
  }, [fajrAlarmEnabled, fajrAlarmTime, fajrSoundType, fajrChallengeType]);

  // Sync Background Mode State to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("isBackgroundEnabled", isBackgroundEnabled.toString());
      if (isBackgroundEnabled && (soundReminderEnabled || fajrAlarmEnabled)) {
        backgroundTimerService.startAudioKeepAlive();
      }
    } catch (e) {
      // ignore
    }
  }, [isBackgroundEnabled, soundReminderEnabled, fajrAlarmEnabled]);

  // Save selected voice formula to localStorage and audio manager
  useEffect(() => {
    try {
      localStorage.setItem("reminderVoiceFormulaId", selectedVoice.id);
      reminderAudioManager.setFormula(
        selectedVoice.id,
        selectedVoice.audioPath,
        selectedVoice.fallbackAyahUrl
      );
    } catch (e) {
      // ignore
    }
  }, [selectedVoice]);

  // Trigger Fajr Loud Alarm
  const triggerFajrAlarm = useCallback((soundTypeOverride?: "adhan" | "intense_alarm" | "adhan_and_siren") => {
    const chosenSound = soundTypeOverride || fajrSoundType;
    setIsAlarmRinging(true);
    loudAlarmAudioService.startLoudAlarm(chosenSound);

    // Send urgent high-priority notification with action buttons and vibration
    systemNotificationManager.sendFajrAlarmUrgentNotification();
  }, [fajrSoundType]);

  // Listen for Service Worker messages (e.g. notification clicked while app was in background)
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const handleSwMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === "ALARM_NOTIFICATION_CLICKED") {
          setIsAlarmRinging(true);
          loudAlarmAudioService.enforceMaxVolume();
        }
      };
      navigator.serviceWorker.addEventListener("message", handleSwMessage);
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleSwMessage);
      };
    }
  }, []);

  // Dismiss Alarm Handler
  const handleDismissAlarm = () => {
    loudAlarmAudioService.stopLoudAlarm();
    setIsAlarmRinging(false);
  };

  // Background Web Worker Ticker Loop (handles voice reminder & Fajr alarm checks synchronously)
  useEffect(() => {
    if (isBackgroundEnabled && (soundReminderEnabled || fajrAlarmEnabled)) {
      backgroundTimerService.startAudioKeepAlive();
    } else {
      backgroundTimerService.stopAudioKeepAlive();
    }

    let nextReminderTimestamp = Date.now() + soundReminderInterval * 60 * 1000;
    setRemainingSeconds(soundReminderInterval * 60);

    const unsubscribe = backgroundTimerService.subscribe(() => {
      const now = new Date();
      const currentHoursMinutes = now.toTimeString().slice(0, 5); // "03:50"
      const todayDateStr = now.toDateString();

      // Check Fajr Alarm
      if (
        fajrAlarmEnabled &&
        !isAlarmRinging &&
        currentHoursMinutes === fajrAlarmTime &&
        lastTriggeredDate !== todayDateStr
      ) {
        setLastTriggeredDate(todayDateStr);
        triggerFajrAlarm();
      }

      // Check Voice Reminder
      if (soundReminderEnabled) {
        const nowMs = Date.now();
        const diff = Math.max(0, Math.ceil((nextReminderTimestamp - nowMs) / 1000));
        setRemainingSeconds(diff);

        if (nowMs >= nextReminderTimestamp) {
          if (selectedVoice.id === "sequential_rotating_dhikr") {
            const nextDhikr = reminderAudioManager.advanceSequentialDhikr();
            setActiveDhikrText(nextDhikr.arabicText);
            setActiveDhikrTitle(`تذكير الأذكار المتتابعة (${nextDhikr.categoryName})`);
            setShowReminderToast(true);

            reminderAudioManager.playReminder({
              isMuted: soundMuted,
              formulaId: "sequential_rotating_dhikr",
              currentDhikrText: nextDhikr.ttsText,
              onStart: () => {},
              onEnded: () => {},
            });

            if (systemNotificationsEnabled) {
              systemNotificationManager.sendCustomNotification(
                `🕊️ حان وقت الذكر: ${nextDhikr.ttsText}`,
                `${nextDhikr.arabicText} - ${nextDhikr.meaning}`
              );
            }
          } else {
            setActiveDhikrText(selectedVoice.arabicText);
            setActiveDhikrTitle(`تذكير: ${selectedVoice.shortName}`);
            setShowReminderToast(true);

            reminderAudioManager.playReminder({
              isMuted: soundMuted,
              formulaId: selectedVoice.id as any,
              currentDhikrText: selectedVoice.ttsText,
              onStart: () => {},
              onEnded: () => {},
            });

            if (systemNotificationsEnabled) {
              systemNotificationManager.sendCustomNotification(
                `🕊️ تذكير: ${selectedVoice.shortName}`,
                `${selectedVoice.arabicText} (${selectedVoice.sheikhName})`
              );
            }
          }

          nextReminderTimestamp = Date.now() + soundReminderInterval * 60 * 1000;
          setRemainingSeconds(soundReminderInterval * 60);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    isBackgroundEnabled,
    soundReminderEnabled,
    soundReminderInterval,
    soundMuted,
    selectedVoice,
    systemNotificationsEnabled,
    fajrAlarmEnabled,
    fajrAlarmTime,
    isAlarmRinging,
    lastTriggeredDate,
    triggerFajrAlarm,
  ]);

  // Initial visit registration & live real stats fetching
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.visitorsCount === "number" && typeof data.totalTasbeehat === "number") {
            setSiteStats((prev) => ({
              visitorsCount: Math.max(prev.visitorsCount, data.visitorsCount),
              totalTasbeehat: Math.max(prev.totalTasbeehat, data.totalTasbeehat),
            }));
          }
        }
      } catch (e) {
        // quiet fallback
      }
    };

    fetchLiveStats();

    let visitorId = localStorage.getItem("site_visitor_id");
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("site_visitor_id", visitorId);
    }

    const hasVisitedInSession = sessionStorage.getItem("has_registered_visit");
    if (!hasVisitedInSession) {
      fetch("/api/stats/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.visitorsCount === "number") {
            setSiteStats((prev) => ({
              visitorsCount: Math.max(prev.visitorsCount, data.visitorsCount),
              totalTasbeehat: typeof data.totalTasbeehat === "number" ? Math.max(prev.totalTasbeehat, data.totalTasbeehat) : prev.totalTasbeehat,
            }));
            sessionStorage.setItem("has_registered_visit", "true");
          }
        })
        .catch(() => {});
    }

    const pollInterval = setInterval(fetchLiveStats, 8000);
    return () => clearInterval(pollInterval);
  }, []);

  // Save personal salawat count to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("personal_salawat_count", personalSalawat.toString());
    } catch (e) {
      // ignore
    }
  }, [personalSalawat]);

  // Handle Tasbeeh Increment
  const handleIncrementTasbeeh = () => {
    setPersonalSalawat((prev) => prev + 1);
    setSiteStats((prev) => ({
      ...prev,
      totalTasbeehat: prev.totalTasbeehat + 1,
    }));

    fetch("/api/stats/tasbeeh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1 }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.totalTasbeehat === "number") {
          setSiteStats((prev) => ({
            ...prev,
            totalTasbeehat: Math.max(prev.totalTasbeehat, data.totalTasbeehat),
            visitorsCount: typeof data.visitorsCount === "number" ? Math.max(prev.visitorsCount, data.visitorsCount) : prev.visitorsCount,
          }));
        }
      })
      .catch(() => {});
  };

  // Play Sheikh audio track
  const handlePlaySheikhTrack = (track: SheikhAudioTrack, repeats: number = 1) => {
    setCurrentTrack(track);
    setTotalRepeats(repeats);
    setCurrentRepeat(1);
    setIsPlaying(true);

    sheikhAudioManager.playTrack(track.id, track.audioUrl, repeats, {
      onProgress: (prog) => {
        setAudioProgress(prog);
      },
      onRepeatChange: (curr, tot) => {
        setCurrentRepeat(curr);
        setTotalRepeats(tot);
      },
      onEnded: () => {
        setIsPlaying(false);
        setAudioProgress(0);
        setCurrentTrack(null);
      },
      onError: () => {},
    });
  };

  const isAnyAudioActive =
    isPlaying ||
    (quranPlayingInfo?.isPlaying ?? false) ||
    isReminderAudioPlaying ||
    isAlarmRinging;

  const handlePause = () => {
    if (quranPlayingInfo?.isPlaying) {
      quranService.pauseAudio();
    } else {
      sheikhAudioManager.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (quranPlayingInfo && !quranPlayingInfo.isPlaying) {
      quranService.resumeAudio();
    } else {
      sheikhAudioManager.resume();
      setIsPlaying(true);
    }
  };

  const handleStopAllAudio = () => {
    stopAllAppAudio();
    try {
      quranService.stopAudio();
    } catch (e) {}
    try {
      loudAlarmAudioService.stopAlarm();
    } catch (e) {}
    setIsPlaying(false);
    setQuranPlayingInfo(null);
    setIsReminderAudioPlaying(false);
    setIsAlarmRinging(false);
    setShowReminderToast(false);
    setAudioProgress(0);
    setCurrentTrack(null);
  };

  // Handle Feature selection from squircle grid
  const handleSelectFeature = (featureId: string) => {
    switch (featureId) {
      case "quran":
        setIsQuranModalOpen(true);
        break;
      case "memorize":
        setIsMemorizeModalOpen(true);
        break;
      case "hadith":
        setIsHadithModalOpen(true);
        break;
      case "floating_dhikr":
        setIsFloatingDhikrSettingsOpen(true);
        break;
      case "hijri":
        setIsHijriModalOpen(true);
        break;
      case "prayer_tracker":
        setIsPrayerTrackerModalOpen(true);
        break;
      case "zakat":
        setIsZakatModalOpen(true);
        break;
      case "azkar":
        setIsAzkarModalOpen(true);
        break;
      case "tasbeeh":
        setIsTasbeehModalOpen(true);
        break;
      case "hisn":
        setIsHisnModalOpen(true);
        break;
      case "library":
        setIsLibraryModalOpen(true);
        break;
      case "shares":
        setIsShareModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Bottom Nav Bar handler
  const handleSelectBottomNav = (tabId: string) => {
    setActiveBottomNav(tabId);
    if (tabId === "tasbeeh") {
      setIsTasbeehModalOpen(true);
    } else if (tabId === "history" || tabId === "stats") {
      setIsStatsModalOpen(true);
    } else if (tabId === "profile") {
      setIsProfileModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-stone-900 flex flex-col font-tajawal selection:bg-emerald-700 selection:text-white relative pb-28">
      
      {/* PWA Mobile Install Floating Prompt */}
      <InstallPwaPrompt />

      {/* Floating Glass Dhikr Notification & Tap-to-Count System */}
      <FloatingGlassDhikr
        config={floatingDhikrConfig}
        onIncrementTasbeeh={handleIncrementTasbeeh}
        onOpenSettings={() => setIsFloatingDhikrSettingsOpen(true)}
        forceTrigger={forceDhikrTrigger}
      />

      {/* Floating Dhikr Customization & Timing Settings Modal */}
      <FloatingDhikrSettingsModal
        isOpen={isFloatingDhikrSettingsOpen}
        onClose={() => setIsFloatingDhikrSettingsOpen(false)}
        config={floatingDhikrConfig}
        onChangeConfig={(cfg) => {
          setFloatingDhikrConfig(cfg);
          try {
            localStorage.setItem("floating_dhikr_config", JSON.stringify(cfg));
          } catch (e) {}
        }}
        onTestTrigger={() => setForceDhikrTrigger(Date.now())}
      />

      {/* Hijri Calendar & Converter Modal */}
      <HijriCalendarModal
        isOpen={isHijriModalOpen}
        onClose={() => setIsHijriModalOpen(false)}
      />

      {/* Prayer & Sunnah & Qada Tracker Modal */}
      <PrayerTrackerModal
        isOpen={isPrayerTrackerModalOpen}
        onClose={() => setIsPrayerTrackerModalOpen(false)}
      />

      {/* Comprehensive Sharia Zakat Calculator Modal */}
      <ZakatCalculatorModal
        isOpen={isZakatModalOpen}
        onClose={() => setIsZakatModalOpen(false)}
      />

      {/* Voice Reminder Global Floating Toast Notification */}
      <ReminderToast
        isVisible={showReminderToast}
        onClose={() => {
          setShowReminderToast(false);
          setIsReminderAudioPlaying(false);
        }}
        onStopAudio={handleStopAllAudio}
        isMuted={soundMuted}
        onQuickTasbeeh={handleIncrementTasbeeh}
        arabicText={activeDhikrText}
        categoryTitle={activeDhikrTitle}
      />

      {/* Overlay & Hardware Volume Boost Modal */}
      <OverlayAndVolumeModal
        isOpen={isOverlayModalOpen}
        onClose={() => setIsOverlayModalOpen(false)}
        volumeBoostEnabled={volumeBoostEnabled}
        onToggleVolumeBoost={(enabled) => setVolumeBoostEnabled(enabled)}
        overlayNotificationEnabled={systemNotificationsEnabled}
        onToggleOverlayNotification={(enabled) => setSystemNotificationsEnabled(enabled)}
        onTestReminderSound={() => {
          if (selectedVoice.id === "sequential_rotating_dhikr") {
            const sample = reminderAudioManager.getNextSequentialDhikr();
            reminderAudioManager.playReminder({
              formulaId: "sequential_rotating_dhikr",
              currentDhikrText: sample.ttsText,
            });
          } else {
            reminderAudioManager.playReminder({
              formulaId: selectedVoice.id as any,
              audioUrl: selectedVoice.audioPath,
              fallbackUrl: selectedVoice.fallbackAyahUrl,
            });
          }
        }}
      />

      {/* Share App Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Holy Quran Modal (114 Surahs, authentic Uthmani text, real sheikh reciters, offline capable) */}
      <QuranModal
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
      />

      {/* Fajr Loud Alarm Modal (with wake-up challenge puzzle) */}
      <FajrAlarmChallengeModal
        isOpen={isAlarmRinging}
        onDismiss={handleDismissAlarm}
        challengeType={fajrChallengeType}
        difficulty={fajrDifficulty}
      />

      {/* Azkar Modal (Morning/Evening) */}
      <AzkarModal
        isOpen={isAzkarModalOpen}
        onClose={() => setIsAzkarModalOpen(false)}
      />

      {/* Hisn Muslim Modal */}
      <HisnMuslimModal
        isOpen={isHisnModalOpen}
        onClose={() => setIsHisnModalOpen(false)}
      />

      {/* Islamic Audio Library Modal */}
      <IslamicLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        activeTrackId={currentTrack?.id || null}
        isPlaying={isPlaying}
        onPlayTrack={handlePlaySheikhTrack}
        onTogglePlayPause={() => {
          if (isPlaying) handlePause();
          else handleResume();
        }}
      />

      {/* City Selector Modal for Prayer Times */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        onClose={() => setIsCityModalOpen(false)}
      />

      {/* Stats and History Modal */}
      <StatsHistoryModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        userCount={personalSalawat}
        siteStats={siteStats}
        onOpenShareModal={() => {
          setIsStatsModalOpen(false);
          setIsShareModalOpen(true);
        }}
      />

      {/* Dedicated Electronic Tasbeeh Modal */}
      <TasbeehModal
        isOpen={isTasbeehModalOpen}
        onClose={() => setIsTasbeehModalOpen(false)}
        onIncrementGlobal={handleIncrementTasbeeh}
        totalLifetimeCount={personalSalawat}
        onOpenShareModal={() => {
          setIsTasbeehModalOpen(false);
          setIsShareModalOpen(true);
        }}
      />

      {/* Hadith Sharif Modal (Authentic collection with search, audio, categories) */}
      <HadithModal
        isOpen={isHadithModalOpen}
        onClose={() => setIsHadithModalOpen(false)}
      />

      {/* Quran Memorization & Voice Verification (Tahfeez) Modal */}
      <QuranMemorizeModal
        isOpen={isMemorizeModalOpen}
        onClose={() => setIsMemorizeModalOpen(false)}
      />

      {/* Profile & Voice Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        selectedVoice={selectedVoice}
        onSelectVoice={(voice) => setSelectedVoice(voice)}
        reminderInterval={soundReminderInterval}
        onChangeInterval={(mins) => setSoundReminderInterval(mins)}
        fajrChallengeType={fajrChallengeType}
        onChangeFajrChallenge={(type) => setFajrChallengeType(type)}
        fajrSoundType={fajrSoundType}
        onChangeFajrSound={(sound) => setFajrSoundType(sound)}
        systemNotificationsEnabled={systemNotificationsEnabled}
        onToggleSystemNotifications={async () => {
          if (!systemNotificationsEnabled) {
            const granted = await systemNotificationManager.requestPermission();
            setSystemNotificationsEnabled(granted);
          } else {
            setSystemNotificationsEnabled(false);
          }
        }}
        backgroundKeepAlive={isBackgroundEnabled}
        onToggleBackgroundKeepAlive={() => setIsBackgroundEnabled(!isBackgroundEnabled)}
        onOpenOverlayModal={() => {
          setIsProfileModalOpen(false);
          setIsOverlayModalOpen(true);
        }}
        volumeBoostEnabled={volumeBoostEnabled}
        onToggleVolumeBoost={(enabled) => setVolumeBoostEnabled(enabled)}
      />

      {/* Top Application Header (Bell, Title + Mosque Dome, Date, Stop Audio button) */}
      <SalawatHeader
        notificationsEnabled={soundReminderEnabled || systemNotificationsEnabled}
        isPlaying={isAnyAudioActive}
        onStopAllAudio={handleStopAllAudio}
        onToggleNotifications={() => setIsProfileModalOpen(true)}
        onOpenNotifications={() => setIsOverlayModalOpen(true)}
      />

      {/* Main Single-Screen Streamlined Container strictly matching mockup */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-8 space-y-4">
        
        {/* 0. Prayer Completion Live Prompt (Did you pray Dhuhr/Asr?) */}
        <PrayerPromptNotification
          selectedCity={selectedCity}
        />

        {/* 1. Green Dome Hero Card with Interactive Salawat Counter */}
        <SalawatHeroCard
          count={personalSalawat}
          counter={personalSalawat}
          onIncrement={handleIncrementTasbeeh}
          onOpenSettings={() => setIsProfileModalOpen(true)}
        />

        {/* 2. Prayer Times Card with Active Fajr Countdown & City Picker */}
        <PrayerTimesCard
          city={selectedCity}
          onOpenCitySelector={() => setIsCityModalOpen(true)}
        />

        {/* 3. Fajr Alarm Hero Card (3D green clock, time switch, sound) */}
        <FajrAlarmHeroCard
          alarmEnabled={fajrAlarmEnabled}
          alarmTime={fajrAlarmTime}
          soundType={fajrSoundType}
          onToggleEnabled={(enabled) => setFajrAlarmEnabled(enabled)}
          onChangeTime={(time) => setFajrAlarmTime(time)}
          onOpenSettings={() => setIsProfileModalOpen(true)}
          onTriggerTestAlarm={() => triggerFajrAlarm()}
        />

        {/* 4. App Features Grid (5 squircle buttons) */}
        <AppFeaturesGrid
          onSelectFeature={handleSelectFeature}
        />

        {/* 5. Prophet Hadith Banner (Calligraphy Emblem, quotation, narrator) */}
        <ProphetHadithBanner
          onOpenAllHadiths={() => setIsHadithModalOpen(true)}
        />

      </main>

      {/* Floating Audio Bar (Active when recitation / audio is playing) */}
      <AudioFloatingBar
        isPlaying={isPlaying || (quranPlayingInfo?.isPlaying ?? false)}
        currentTrack={currentTrack}
        customTitle={
          quranPlayingInfo
            ? `سورة ${quranPlayingInfo.surahName} • آية ${quranPlayingInfo.ayahNum}`
            : isReminderAudioPlaying
            ? activeDhikrTitle
            : null
        }
        customSubtitle={
          quranPlayingInfo
            ? `بصوت: ${quranPlayingInfo.reciterName}`
            : isReminderAudioPlaying
            ? activeDhikrText
            : null
        }
        progress={audioProgress}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStopAllAudio}
        currentRepeat={currentRepeat}
        totalRepeats={totalRepeats}
        volume={volume}
        onChangeVolume={(vol) => {
          setVolume(vol);
          sheikhAudioManager.setVolume(vol);
        }}
      />

      {/* Fixed Bottom Navigation Dock */}
      <SalawatBottomNav
        activeTab={activeBottomNav}
        onSelectTab={handleSelectBottomNav}
        onCenterPrayClick={handleIncrementTasbeeh}
      />

    </div>
  );
}
