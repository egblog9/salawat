import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { TasbeehCounter } from "./components/TasbeehCounter";
import { SheikhAudioStudio } from "./components/SheikhAudioStudio";
import { ShareReminder } from "./components/ShareReminder";
import { MoreHub } from "./components/MoreHub";
import { VirtuesSection } from "./components/VirtuesSection";
import { AudioFloatingBar } from "./components/AudioFloatingBar";
import { AudioReminderCard } from "./components/AudioReminderCard";
import { ReminderToast } from "./components/ReminderToast";
import { InstallPwaPrompt } from "./components/InstallPwaPrompt";
import { ShareAppModal } from "./components/ShareAppModal";
import { FajrAlarmChallengeModal } from "./components/FajrAlarmChallengeModal";
import { SALAWAT_COLLECTION, SHEIKH_AUDIO_TRACKS, REMINDER_VOICE_FORMULAS } from "./data/salawatData";
import { SalawatItem, SheikhAudioTrack, SiteStats } from "./types";
import { sheikhAudioManager, reminderAudioManager } from "./utils/audio";
import { systemNotificationManager } from "./utils/systemNotifications";
import { loudAlarmAudioService } from "./utils/alarmAudio";
import { backgroundTimerService } from "./utils/backgroundTimer";
import {
  Heart,
  Users,
  ExternalLink,
  Share2,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("tasbeeh");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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
    return saved ? parseInt(saved, 10) : 0;
  });

  // Collective Live Website Stats (Real Genuine Counts with local cache fallback)
  const [siteStats, setSiteStats] = useState<SiteStats>(() => {
    try {
      const cachedVisitors = localStorage.getItem("site_cached_visitors");
      const cachedTasbeehat = localStorage.getItem("site_cached_tasbeehat");
      return {
        visitorsCount: cachedVisitors ? Math.max(1, parseInt(cachedVisitors, 10)) : 1,
        totalTasbeehat: cachedTasbeehat ? parseInt(cachedTasbeehat, 10) : 0,
      };
    } catch (e) {
      return {
        visitorsCount: 1,
        totalTasbeehat: 0,
      };
    }
  });

  const [selectedSalawat, setSelectedSalawat] = useState<SalawatItem>(SALAWAT_COLLECTION[0]);
  const [currentTrack, setCurrentTrack] = useState<SheikhAudioTrack | null>(SHEIKH_AUDIO_TRACKS[0]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [totalRepeats, setTotalRepeats] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Voice Reminder Selected Formula State (صيغة الصوت: "صلي على محمد" أو "اللهم صلي وسلم على نبينا محمد")
  const [selectedFormulaId, setSelectedFormulaId] = useState<"salli_ala_muhammad" | "allahumma_salli_wasallim">(() => {
    try {
      const saved = localStorage.getItem("reminderVoiceFormulaId");
      if (saved === "salli_ala_muhammad" || saved === "allahumma_salli_wasallim") {
        return saved;
      }
      return "salli_ala_muhammad";
    } catch (e) {
      return "salli_ala_muhammad";
    }
  });

  // Voice Reminder (التذكير الصوتي) State
  const [soundReminderEnabled, setSoundReminderEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("soundReminderEnabled") === "true";
    } catch (e) {
      return false;
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

  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("soundMuted") === "true";
    } catch (e) {
      return false;
    }
  });

  const [showReminderToast, setShowReminderToast] = useState<boolean>(false);
  const [isTestingSound, setIsTestingSound] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => soundReminderInterval * 60);

  // System Push Notifications (إشعارات شريط الهاتف والنظام) State
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

  const [systemNotificationInterval, setSystemNotificationInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("systemNotificationInterval");
      return saved ? parseInt(saved, 10) || 30 : 30;
    } catch (e) {
      return 30;
    }
  });

  const [isTestingNotification, setIsTestingNotification] = useState<boolean>(false);

  // Fajr Loud Smart Alarm State
  const [fajrAlarmEnabled, setFajrAlarmEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("fajrAlarmEnabled") === "true";
    } catch (e) {
      return false;
    }
  });

  const [fajrAlarmTime, setFajrAlarmTime] = useState<string>(() => {
    try {
      return localStorage.getItem("fajrAlarmTime") || "04:30";
    } catch (e) {
      return "04:30";
    }
  });

  const [fajrChallengeType, setFajrChallengeType] = useState<"math" | "tasbeeh" | "order">(() => {
    try {
      const saved = localStorage.getItem("fajrChallengeType");
      if (saved === "math" || saved === "tasbeeh" || saved === "order") return saved;
      return "math";
    } catch (e) {
      return "math";
    }
  });

  const [fajrDifficulty, setFajrDifficulty] = useState<"easy" | "medium" | "hard">(() => {
    try {
      const saved = localStorage.getItem("fajrDifficulty");
      if (saved === "easy" || saved === "medium" || saved === "hard") return saved;
      return "medium";
    } catch (e) {
      return "medium";
    }
  });

  const [fajrSoundType, setFajrSoundType] = useState<"adhan" | "intense_alarm" | "adhan_and_siren">(() => {
    try {
      const saved = localStorage.getItem("fajrSoundType");
      if (saved === "adhan" || saved === "intense_alarm" || saved === "adhan_and_siren") return saved;
      return "adhan_and_siren";
    } catch (e) {
      return "adhan_and_siren";
    }
  });

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

  // Sync Fajr Alarm Preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("fajrAlarmEnabled", fajrAlarmEnabled.toString());
      localStorage.setItem("fajrAlarmTime", fajrAlarmTime);
      localStorage.setItem("fajrChallengeType", fajrChallengeType);
      localStorage.setItem("fajrDifficulty", fajrDifficulty);
      localStorage.setItem("fajrSoundType", fajrSoundType);
    } catch (e) {
      // ignore
    }
  }, [fajrAlarmEnabled, fajrAlarmTime, fajrChallengeType, fajrDifficulty, fajrSoundType]);

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

  // Save selected formula to localStorage and audio manager
  useEffect(() => {
    try {
      localStorage.setItem("reminderVoiceFormulaId", selectedFormulaId);
      reminderAudioManager.setFormula(selectedFormulaId);
    } catch (e) {
      // ignore
    }
  }, [selectedFormulaId]);

  // Sync Voice Reminder Preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("soundReminderEnabled", soundReminderEnabled.toString());
      localStorage.setItem("soundReminderInterval", soundReminderInterval.toString());
      localStorage.setItem("soundMuted", soundMuted.toString());
    } catch (e) {
      // ignore
    }
  }, [soundReminderEnabled, soundReminderInterval, soundMuted]);

  // Sync System Notification Preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("systemNotificationsEnabled", systemNotificationsEnabled.toString());
      localStorage.setItem("systemNotificationInterval", systemNotificationInterval.toString());
    } catch (e) {
      // ignore
    }
  }, [systemNotificationsEnabled, systemNotificationInterval]);

  // Periodic System Notification Loop (Runs when user enables phone shade notifications)
  useEffect(() => {
    if (!systemNotificationsEnabled || !systemNotificationManager.isSupported()) {
      return;
    }

    const intervalMs = systemNotificationInterval * 60 * 1000;
    const intervalId = setInterval(async () => {
      await systemNotificationManager.sendNotification();
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [systemNotificationsEnabled, systemNotificationInterval]);

  // Handle System Notifications Toggle
  const handleToggleSystemNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await systemNotificationManager.requestPermission();
      if (granted) {
        setSystemNotificationsEnabled(true);
        // Send a welcoming confirmation notification to device shade
        await systemNotificationManager.sendCustomNotification(
          "🌿 تم تفعيل إشعارات صلوات",
          "ستصلك تذكيرات بالصلاة على النبي ﷺ والصدقة الجارية على فترات بإذن الله 📲"
        );
      } else {
        setSystemNotificationsEnabled(false);
      }
    } else {
      setSystemNotificationsEnabled(false);
    }
  };

  const handleChangeSystemNotificationInterval = (mins: number) => {
    setSystemNotificationInterval(mins);
  };

  const handleSendTestSystemNotification = async () => {
    setIsTestingNotification(true);
    await systemNotificationManager.sendNotification();
    setTimeout(() => {
      setIsTestingNotification(false);
    }, 1500);
  };

  // Trigger Fajr Loud Alarm
  const triggerFajrAlarm = useCallback((soundTypeOverride?: "adhan" | "intense_alarm" | "adhan_and_siren") => {
    const chosenSound = soundTypeOverride || fajrSoundType;
    setIsAlarmRinging(true);
    loudAlarmAudioService.startLoudAlarm(chosenSound);

    if (systemNotificationsEnabled) {
      systemNotificationManager.sendCustomNotification(
        "⏰ حان الآن وقت صلاة الفجر!",
        "الصلاة خير من النوم - اضغط لحل التحدي وإيقاف المنبه الآن 📿"
      );
    }
  }, [fajrSoundType, systemNotificationsEnabled]);

  // Dismiss Alarm Handler
  const handleDismissAlarm = () => {
    loudAlarmAudioService.stopLoudAlarm();
    setIsAlarmRinging(false);
  };

  // Background Web Worker Ticker Loop (handles voice reminder & Fajr alarm checks synchronously even when screen is locked)
  useEffect(() => {
    // If background mode is enabled, start silent keep-alive audio loop
    if (isBackgroundEnabled && (soundReminderEnabled || fajrAlarmEnabled)) {
      backgroundTimerService.startAudioKeepAlive();
    } else {
      backgroundTimerService.stopAudioKeepAlive();
    }

    let nextReminderTimestamp = Date.now() + soundReminderInterval * 60 * 1000;
    setRemainingSeconds(soundReminderInterval * 60);

    const unsubscribe = backgroundTimerService.subscribe(() => {
      const now = new Date();
      const currentHoursMinutes = now.toTimeString().slice(0, 5); // "04:30"
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
          setShowReminderToast(true);
          reminderAudioManager.playReminder({
            isMuted: soundMuted,
            formulaId: selectedFormulaId,
            onStart: () => {},
            onEnded: () => {},
          });

          if (systemNotificationsEnabled) {
            systemNotificationManager.sendNotification();
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
    selectedFormulaId,
    systemNotificationsEnabled,
    fajrAlarmEnabled,
    fajrAlarmTime,
    isAlarmRinging,
    lastTriggeredDate,
    triggerFajrAlarm,
  ]);

  // Robust Voice Reminder Timer System (Handles interval & plays chosen voice formula)
  useEffect(() => {
    if (!soundReminderEnabled) {
      reminderAudioManager.stopReminder();
      setRemainingSeconds(soundReminderInterval * 60);
      return;
    }

    let nextTriggerTimestamp = Date.now() + soundReminderInterval * 60 * 1000;
    setRemainingSeconds(soundReminderInterval * 60);

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((nextTriggerTimestamp - now) / 1000));
      setRemainingSeconds(diff);

      if (now >= nextTriggerTimestamp) {
        // Trigger reminder event
        setShowReminderToast(true);
        reminderAudioManager.playReminder({
          isMuted: soundMuted,
          formulaId: selectedFormulaId,
          onStart: () => {},
          onEnded: () => {},
        });

        // Also if system notifications are enabled, ping the notification shade
        if (systemNotificationsEnabled) {
          systemNotificationManager.sendNotification();
        }

        // Set next trigger cleanly
        nextTriggerTimestamp = Date.now() + soundReminderInterval * 60 * 1000;
        setRemainingSeconds(soundReminderInterval * 60);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [soundReminderEnabled, soundReminderInterval, soundMuted, selectedFormulaId, systemNotificationsEnabled]);

  // Toggle Reminder Activation
  const handleToggleReminder = (enabled: boolean) => {
    if (enabled) {
      reminderAudioManager.unlockAudio();
    } else {
      reminderAudioManager.stopReminder();
    }
    setSoundReminderEnabled(enabled);
  };

  // Change Interval
  const handleChangeReminderInterval = (minutes: number) => {
    setSoundReminderInterval(minutes);
    setRemainingSeconds(minutes * 60);
  };

  // Toggle Mute
  const handleToggleReminderMute = (muted: boolean) => {
    setSoundMuted(muted);
  };

  // Test Sound
  const handleTestReminderSound = (formulaIdToTest?: "salli_ala_muhammad" | "allahumma_salli_wasallim") => {
    const targetId = formulaIdToTest || selectedFormulaId;
    setIsTestingSound(true);
    setShowReminderToast(true);
    reminderAudioManager.playReminder({
      isMuted: false, // In test mode, always play audio so user can preview it
      formulaId: targetId,
      onStart: () => setIsTestingSound(true),
      onEnded: () => setIsTestingSound(false),
    });

    setTimeout(() => {
      setIsTestingSound(false);
    }, 4500);
  };



  // Cache siteStats in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("site_cached_visitors", siteStats.visitorsCount.toString());
      localStorage.setItem("site_cached_tasbeehat", siteStats.totalTasbeehat.toString());
    } catch (e) {
      // ignore
    }
  }, [siteStats]);

  // Initial visit registration & live real stats fetching + periodic polling
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
        console.warn("Failed to fetch live stats:", e);
      }
    };

    // 1. Fetch initial live stats immediately
    fetchLiveStats();

    // 2. Register real unique visitor (persisted identifier per browser)
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
        .catch((e) => console.warn("Failed to register visit:", e));
    }

    // 3. Periodic polling every 6 seconds to keep live collective count synced across users
    const pollInterval = setInterval(fetchLiveStats, 6000);

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

  // Handle Increment (both personal and sync collective tasbeeh to server)
  const handleIncrementTasbeeh = () => {
    setPersonalSalawat((prev) => prev + 1);
    setSiteStats((prev) => ({
      ...prev,
      totalTasbeehat: prev.totalTasbeehat + 1,
    }));

    // Send increment to backend
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
      .catch((e) => console.warn("Failed to sync tasbeeh count:", e));
  };

  // Play a real Sheikh audio track
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
      },
      onError: (err) => {
        console.warn("Track error:", err);
      },
    });
  };

  const handlePause = () => {
    sheikhAudioManager.pause();
    setIsPlaying(false);
  };

  const handleResume = () => {
    sheikhAudioManager.resume();
    setIsPlaying(true);
  };

  const handleStop = () => {
    sheikhAudioManager.stop();
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentRepeat(1);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    sheikhAudioManager.setVolume(vol);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    sheikhAudioManager.setPlaybackRate(rate);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-emerald-600 selection:text-white relative">
      
      {/* PWA Mobile Install Floating Prompt */}
      <InstallPwaPrompt />

      {/* Voice Reminder Global Floating Toast Notification */}
      <ReminderToast
        isVisible={showReminderToast}
        onClose={() => setShowReminderToast(false)}
        isMuted={soundMuted}
        onQuickTasbeeh={handleIncrementTasbeeh}
        arabicText={
          REMINDER_VOICE_FORMULAS.find((f) => f.id === selectedFormulaId)?.arabicText ||
          "«صَلِّ عَلَى مُحَمَّد ﷺ»"
        }
      />

      {/* Share App Modal (PWA & Web sharing) */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Fajr Loud Smart Alarm Challenge Modal (Intense Alarm & Math/Tasbeeh Puzzle) */}
      <FajrAlarmChallengeModal
        isOpen={isAlarmRinging}
        onDismiss={handleDismissAlarm}
        challengeType={fajrChallengeType}
        difficulty={fajrDifficulty}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSalawat={personalSalawat}
        siteStats={siteStats}
        isPlaying={isPlaying}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isStandalone={isStandalone}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        
        {/* Tab 1: Tasbeeh and Prophetic Formulas */}
        {activeTab === "tasbeeh" && (
          <TasbeehCounter
            collection={SALAWAT_COLLECTION}
            selectedItem={selectedSalawat}
            onSelectItem={(item) => setSelectedSalawat(item)}
            onPlaySheikhTrack={handlePlaySheikhTrack}
            activePlayingId={currentTrack?.id || null}
            isPlaying={isPlaying}
            totalLifetimeCount={personalSalawat}
            onIncrementTotal={handleIncrementTasbeeh}
            onNavigateToShare={() => setActiveTab("more")}
            collectiveTotal={siteStats.totalTasbeehat}
          />
        )}

        {/* Tab: Dedicated Voice & System Reminder Page (🔊 التذكير الصوتي والإشعارات) */}
        {activeTab === "reminder" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AudioReminderCard
              enabled={soundReminderEnabled}
              intervalMinutes={soundReminderInterval}
              isMuted={soundMuted}
              selectedFormulaId={selectedFormulaId}
              onSelectFormula={setSelectedFormulaId}
              onToggleEnabled={handleToggleReminder}
              onChangeInterval={handleChangeReminderInterval}
              onToggleMute={handleToggleReminderMute}
              onTestSound={handleTestReminderSound}
              isTestingSound={isTestingSound}
              remainingSeconds={remainingSeconds}
              systemNotificationsEnabled={systemNotificationsEnabled}
              systemNotificationInterval={systemNotificationInterval}
              onToggleSystemNotifications={handleToggleSystemNotifications}
              onChangeSystemNotificationInterval={handleChangeSystemNotificationInterval}
              onSendTestSystemNotification={handleSendTestSystemNotification}
              isTestingNotification={isTestingNotification}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Authentic Sheikh Recitations & Audio Studio */}
        {activeTab === "sheikhs" && (
          <SheikhAudioStudio
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlaySheikhTrack}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            audioProgress={audioProgress}
            currentRepeat={currentRepeat}
            totalRepeats={totalRepeats}
            volume={volume}
            onChangeVolume={handleVolumeChange}
            playbackRate={playbackRate}
            onChangePlaybackRate={handlePlaybackRateChange}
          />
        )}

        {/* Tab 3: Virtues and Authentic Hadiths */}
        {activeTab === "virtues" && (
          <VirtuesSection
            onPlaySheikhTrack={handlePlaySheikhTrack}
            activePlayingId={currentTrack?.id || null}
            isPlaying={isPlaying}
          />
        )}

        {/* Tab 4: More & Additional Tools Hub (المزيد: بطاقات، مشاركة، مميزات قادمة، عن التطبيق) */}
        {(activeTab === "more" || activeTab === "share") && (
          <MoreHub
            onPlaySheikhTrack={handlePlaySheikhTrack}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            isStandalone={isStandalone}
            fajrAlarmEnabled={fajrAlarmEnabled}
            fajrAlarmTime={fajrAlarmTime}
            fajrChallengeType={fajrChallengeType}
            fajrDifficulty={fajrDifficulty}
            fajrSoundType={fajrSoundType}
            onToggleFajrAlarm={(enabled) => setFajrAlarmEnabled(enabled)}
            onChangeFajrTime={(time) => setFajrAlarmTime(time)}
            onChangeFajrChallengeType={(type) => setFajrChallengeType(type)}
            onChangeFajrDifficulty={(diff) => setFajrDifficulty(diff)}
            onChangeFajrSoundType={(sound) => setFajrSoundType(sound)}
            onTriggerTestAlarm={() => triggerFajrAlarm()}
            isBackgroundEnabled={isBackgroundEnabled}
            onToggleBackground={(enabled) => setIsBackgroundEnabled(enabled)}
          />
        )}
      </main>

      {/* Floating Audio Bar when playing */}
      <AudioFloatingBar
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        progress={audioProgress}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        currentRepeat={currentRepeat}
        totalRepeats={totalRepeats}
        volume={volume}
        onChangeVolume={handleVolumeChange}
      />

      {/* Comprehensive Islamic Footer with Live Stats & Social Links */}
      <footer className="mt-14 border-t border-stone-900 bg-stone-950 py-10 pb-28 md:pb-10 text-xs text-stone-300">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          
          {/* Live Collective Stats Bar in Footer */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-900/90 to-emerald-950/40 border border-emerald-800/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            
            {/* Stat 1: Visitors */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block font-medium">عدد زوار ومستخدمي الموقع</span>
                <span className="text-2xl sm:text-3xl font-bold font-tajawal text-amber-300">
                  {siteStats.visitorsCount.toLocaleString()} زائر
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-stone-800"></div>

            {/* Stat 2: Collective Tasbeehat */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Heart className="w-6 h-6 fill-amber-400/20" />
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block font-medium">إجمالي التسبيحات والصلوات على الموقع</span>
                <span className="text-2xl sm:text-3xl font-bold font-tajawal text-emerald-300">
                  {siteStats.totalTasbeehat.toLocaleString()} صلاة
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action & Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Share App Sadaqah Jariyah */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-stone-900 border border-emerald-600/30 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-stone-950 font-bold shadow flex-shrink-0">
                  <Share2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="font-bold text-stone-100 text-sm">مشاركة التطبيق كصدقة جارية</p>
                  <p className="text-xs text-stone-300">انشر الخير ليثبت على أي هاتف</p>
                </div>
              </div>

              <button
                id="footer-share-app-btn"
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>
            </div>

            {/* Facebook Official Contact Badge */}
            <div className="bg-stone-900/80 border border-blue-600/30 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow flex-shrink-0">
                  f
                </div>
                <div>
                  <p className="font-bold text-stone-100 text-sm">صفحة المطور على فيسبوك</p>
                  <p className="text-xs text-stone-300">مقترحاتكم وتواصلكم معنا</p>
                </div>
              </div>

              <a
                id="footer-facebook-link"
                href="https://www.facebook.com/share/1Bm2aq9mKm/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow active:scale-95 flex-shrink-0"
              >
                <span>زيارة الحساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Dua and Prophet Blessing */}
          <div className="text-center space-y-2 pt-2">
            <p className="font-amiri text-lg text-amber-300 font-bold">
              اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا وَحَبِيبِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ 🌿
            </p>
            <p className="text-stone-300 max-w-2xl mx-auto">
              «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ» — وقف لوجه الله تعالى وصدقة جارية.
            </p>
            <p className="text-[11px] text-stone-400 pt-1">
              جميع التلاوات بأصوات كبار أئمة وقراء العالم الإسلامي المعتمدين 🎙️
            </p>
          </div>

        </div>
      </footer>

      {/* Modern Thumb-Accessible Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
