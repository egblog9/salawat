import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TasbeehCounter } from "./components/TasbeehCounter";
import { SheikhAudioStudio } from "./components/SheikhAudioStudio";
import { ShareReminder } from "./components/ShareReminder";
import { VirtuesSection } from "./components/VirtuesSection";
import { AudioFloatingBar } from "./components/AudioFloatingBar";
import { SALAWAT_COLLECTION, SHEIKH_AUDIO_TRACKS } from "./data/salawatData";
import { SalawatItem, SheikhAudioTrack, SiteStats } from "./types";
import { sheikhAudioManager } from "./utils/audio";
import {
  Heart,
  Users,
  ExternalLink,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("tasbeeh");

  // Local user's personal lifetime tasbeeh counter
  const [personalSalawat, setPersonalSalawat] = useState<number>(() => {
    const saved = localStorage.getItem("personal_salawat_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Collective Live Website Stats (Real Genuine Counts)
  const [siteStats, setSiteStats] = useState<SiteStats>({
    visitorsCount: 1,
    totalTasbeehat: 0,
  });

  const [selectedSalawat, setSelectedSalawat] = useState<SalawatItem>(SALAWAT_COLLECTION[0]);
  const [currentTrack, setCurrentTrack] = useState<SheikhAudioTrack | null>(SHEIKH_AUDIO_TRACKS[0]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [totalRepeats, setTotalRepeats] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Initial visit registration & live real stats fetching + periodic polling
  useEffect(() => {
    const fetchLiveStats = () => {
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.visitorsCount === "number" && typeof data.totalTasbeehat === "number") {
            setSiteStats(data);
          }
        })
        .catch((e) => console.warn("Failed to fetch live stats:", e));
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
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.visitorsCount === "number") {
            setSiteStats((prev) => ({
              ...prev,
              visitorsCount: data.visitorsCount,
              totalTasbeehat: data.totalTasbeehat ?? prev.totalTasbeehat,
            }));
            sessionStorage.setItem("has_registered_visit", "true");
          }
        })
        .catch((e) => console.warn("Failed to register visit:", e));
    }

    // 3. Periodic polling every 10 seconds to keep live collective count synced across users
    const pollInterval = setInterval(fetchLiveStats, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  // Save personal salawat count to localStorage
  useEffect(() => {
    localStorage.setItem("personal_salawat_count", personalSalawat.toString());
  }, [personalSalawat]);

  // Handle Increment (both personal and sync collective tasbeeh to server)
  const handleIncrementTasbeeh = () => {
    setPersonalSalawat((prev) => prev + 1);
    setSiteStats((prev) => ({
      ...prev,
      totalTasbeehat: prev.totalTasbeehat + 1,
    }));

    // Debounced or direct call to backend
    fetch("/api/stats/tasbeeh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalTasbeehat === "number") {
          setSiteStats((prev) => ({
            ...prev,
            totalTasbeehat: data.totalTasbeehat,
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSalawat={personalSalawat}
        siteStats={siteStats}
        isPlaying={isPlaying}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6">
        
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
            onNavigateToShare={() => setActiveTab("share")}
            collectiveTotal={siteStats.totalTasbeehat}
          />
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

        {/* Tab 3: Remind Others & Sharing Hub ("وتفكر غيرك") */}
        {activeTab === "share" && (
          <ShareReminder onPlaySheikhTrack={handlePlaySheikhTrack} />
        )}

        {/* Tab 4: Virtues and Authentic Hadiths */}
        {activeTab === "virtues" && (
          <VirtuesSection
            onPlaySheikhTrack={handlePlaySheikhTrack}
            activePlayingId={currentTrack?.id || null}
            isPlaying={isPlaying}
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
      <footer className="mt-14 border-t border-stone-900 bg-stone-950 py-10 text-xs text-stone-300">
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

          {/* Facebook Official Contact Badge */}
          <div className="bg-stone-900/80 border border-blue-600/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                f
              </div>
              <div>
                <p className="font-bold text-stone-100 text-sm">صفحة المطور وحساب التواصل على فيسبوك</p>
                <p className="text-xs text-stone-300">شاركونا مقترحاتكم وساهموا في نشر الصدقة الجارية</p>
              </div>
            </div>

            <a
              id="footer-facebook-link"
              href="https://www.facebook.com/share/1Bm2aq9mKm/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow active:scale-95"
            >
              <span>زيارة الحساب على فيسبوك</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
    </div>
  );
}
