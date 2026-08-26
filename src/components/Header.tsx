import React from "react";
import { Heart, BellRing, Users } from "lucide-react";
import { SiteStats } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalSalawat: number;
  siteStats: SiteStats;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalSalawat,
  siteStats,
  isPlaying,
}) => {
  return (
    <header className="relative border-b border-emerald-900/40 bg-gradient-to-b from-stone-900/95 via-stone-900/80 to-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Subtle decorative top Islamic pattern bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600"></div>

      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Brand & Main Reminder */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 border border-emerald-500/30 shadow-lg shadow-emerald-950/50 flex-shrink-0">
                <span className="text-xl sm:text-2xl select-none">🕌</span>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold font-amiri text-amber-200 tracking-wide">
                    صَلِّ عَلَى النَّبِيِّ ﷺ
                  </h1>
                  <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 font-medium">
                    أصوات كبار الشيوخ
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-300 font-amiri line-clamp-1">
                  «مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»
                </p>
              </div>
            </div>

            {/* Facebook icon on mobile top bar */}
            <a
              href="https://www.facebook.com/share/1Bm2aq9mKm/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all flex-shrink-0"
              title="صفحة الفيسبوك"
            >
              <span className="font-bold">f</span>
              <span className="text-[11px]">فيسبوك</span>
            </a>
          </div>

          {/* Live Collective Stats & Action Buttons */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2">
            
            {/* Visitors Count Badge */}
            <div className="flex-1 md:flex-initial flex items-center gap-2 bg-stone-900/90 border border-emerald-800/40 px-3 py-1.5 rounded-2xl shadow-inner justify-center md:justify-start">
              <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-right">
                <span className="text-stone-400 block text-[10px] leading-tight">زوار الموقع</span>
                <span className="font-bold text-amber-300 font-tajawal text-xs sm:text-sm">
                  {siteStats.visitorsCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Global Tasbeehat Badge */}
            <div className="flex-1 md:flex-initial flex items-center gap-2 bg-stone-900/90 border border-emerald-800/40 px-3 py-1.5 rounded-2xl shadow-inner justify-center md:justify-start">
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20 flex-shrink-0" />
              <div className="text-right">
                <span className="text-stone-400 block text-[10px] leading-tight">تسبيحات الموقع</span>
                <span className="font-bold text-emerald-300 font-tajawal text-xs sm:text-sm">
                  {siteStats.totalTasbeehat.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Facebook Link (Desktop) */}
            <a
              id="header-facebook-btn"
              href="https://www.facebook.com/share/1Bm2aq9mKm/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <span className="font-bold text-sm">f</span>
              <span>فيسبوك</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 pt-2 border-t border-stone-800/60 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="nav-tab-tasbeeh"
            onClick={() => setActiveTab("tasbeeh")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "tasbeeh"
                ? "bg-emerald-800/80 text-emerald-100 border border-emerald-500/50 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <span>📿</span>
            <span>المسبحة والصيغ النبوية</span>
          </button>

          <button
            id="nav-tab-sheikhs"
            onClick={() => setActiveTab("sheikhs")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "sheikhs"
                ? "bg-emerald-800/80 text-emerald-100 border border-emerald-500/50 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <span>🎙️</span>
            <span>تلاوات الشيوخ والقراء</span>
          </button>

          <button
            id="nav-tab-share"
            onClick={() => setActiveTab("share")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "share"
                ? "bg-emerald-800/80 text-emerald-100 border border-emerald-500/50 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-amber-300" />
            <span>وتفكر غيرك (شارك الأجر)</span>
          </button>

          <button
            id="nav-tab-virtues"
            onClick={() => setActiveTab("virtues")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "virtues"
                ? "bg-emerald-800/80 text-emerald-100 border border-emerald-500/50 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <span>📜</span>
            <span>فضائل وأحاديث صحيحة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
