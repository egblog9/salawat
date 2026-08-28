import React from "react";
import {
  Home,
  CircleDot,
  Heart,
  BarChart3,
  User,
} from "lucide-react";

interface SalawatBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onCenterPrayClick: () => void;
}

export const SalawatBottomNav: React.FC<SalawatBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onCenterPrayClick,
}) => {
  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-40 select-none">
      <nav
        aria-label="شريط التنقل السفلي"
        className="w-full bg-white/95 backdrop-blur-lg rounded-[34px] px-3 py-2 shadow-[0_10px_35px_rgba(30,55,42,0.12)] border border-stone-100 flex items-center justify-between"
      >
        {/* Tab 1: الرئيسية (Home) */}
        <button
          id="bottom-nav-home"
          onClick={() => onSelectTab("home")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "home" ? "text-[#2F5241] font-bold" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] font-tajawal mt-1">الرئيسية</span>
        </button>

        {/* Tab 2: التسبيح (Tasbeeh) */}
        <button
          id="bottom-nav-tasbeeh"
          onClick={() => onSelectTab("tasbeeh")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "tasbeeh" ? "text-[#2F5241] font-bold" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <CircleDot className={`w-5 h-5 ${activeTab === "tasbeeh" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] font-tajawal mt-1">التسبيح</span>
        </button>

        {/* Tab 3 (Center Elevated Button): صلّ الآن */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-4">
          <button
            id="bottom-nav-center-pray"
            onClick={onCenterPrayClick}
            className="w-14 h-14 rounded-full bg-[#2F5241] hover:bg-[#254234] text-white shadow-lg shadow-[#2F5241]/35 border-4 border-[#F8F8F5] flex items-center justify-center active:scale-90 transition-all cursor-pointer group"
            title="صلّ على النبي ﷺ الآن"
          >
            <Heart className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-[10px] font-bold font-tajawal text-[#2F5241] mt-0.5">
            صلّ الآن
          </span>
        </div>

        {/* Tab 4: إحصائيات (Stats) */}
        <button
          id="bottom-nav-stats"
          onClick={() => onSelectTab("stats")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "stats" ? "text-[#2F5241] font-bold" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${activeTab === "stats" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] font-tajawal mt-1">إحصائيات</span>
        </button>

        {/* Tab 5: الملف الشخصي (Profile / Settings) */}
        <button
          id="bottom-nav-profile"
          onClick={() => onSelectTab("profile")}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "profile" ? "text-[#2F5241] font-bold" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === "profile" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] font-tajawal mt-1">الملف الشخصي</span>
        </button>
      </nav>
    </div>
  );
};
