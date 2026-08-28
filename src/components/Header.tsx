import React from "react";
import { Heart, Users, Share2, Menu } from "lucide-react";
import { SiteStats } from "../types";
import { APP_SECTIONS } from "../config/navigation";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalSalawat: number;
  siteStats: SiteStats;
  isPlaying: boolean;
  onOpenShareModal?: () => void;
  onOpenInstallModal?: () => void;
  canInstall?: boolean;
  isStandalone?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  siteStats,
  isPlaying,
  onOpenShareModal,
  isStandalone = false,
}) => {
  return (
    <header className="relative border-b border-emerald-900/40 bg-stone-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Subtle decorative top Islamic bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600"></div>

      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand & Main Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-stone-900 border border-amber-500/40 shadow-lg shadow-amber-950/40 p-1 flex-shrink-0 overflow-hidden group">
              <img
                src="/icons/icon-192.png"
                alt="شعار تطبيق صلوات"
                className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
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
                <span className="hidden sm:inline-flex text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 font-medium">
                  أصوات كبار الشيوخ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 font-amiri line-clamp-1">
                «مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»
              </p>
            </div>
          </div>

          {/* Quick Action Badges & Live Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Stats Capsule */}
            <div className="hidden sm:flex items-center gap-3 bg-stone-900/80 border border-emerald-800/40 px-3.5 py-1.5 rounded-2xl shadow-inner text-xs">
              <div className="flex items-center gap-1.5 text-stone-300">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-tajawal font-bold text-amber-300">
                  {(siteStats?.visitorsCount ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400">زائر</span>
              </div>
              
              <div className="w-px h-3.5 bg-stone-700"></div>

              <div className="flex items-center gap-1.5 text-stone-300">
                <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="font-tajawal font-bold text-emerald-300">
                  {(siteStats?.totalTasbeehat ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400">صلاة</span>
              </div>
            </div>

            {/* Share App Action (Desktop & Mobile) */}
            <button
              id="header-share-app-btn"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
              title="مشاركة التطبيق كصدقة جارية"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">مشاركة التطبيق</span>
              <span className="sm:hidden text-[11px]">مشاركة</span>
            </button>

            {/* Facebook Link */}
            <a
              id="header-facebook-btn"
              href="https://www.facebook.com/share/1Bm2aq9mKm/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
              title="صفحة المطور على فيسبوك"
            >
              <span>f</span>
            </a>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Horizontal Pill Bar) */}
        <nav
          aria-label="أقسام التطبيق الرئيسية"
          className="hidden md:flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-800/60 overflow-x-auto pb-0.5 scrollbar-none"
        >
          {APP_SECTIONS.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                id={`desktop-nav-${section.id}`}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? "bg-emerald-800/90 text-emerald-50 border border-emerald-500/50 shadow-md font-bold"
                    : "text-stone-300 hover:text-stone-100 hover:bg-stone-900/80 border border-transparent"
                }`}
              >
                <span className="text-base select-none flex items-center justify-center">
                  {section.icon === "menu" ? (
                    <Menu className="w-4 h-4 stroke-[2.2]" />
                  ) : (
                    section.icon
                  )}
                </span>
                <span>{section.label}</span>
                {section.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-amber-400 text-stone-950"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {section.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

