import React from "react";
import { Bell, BellOff, Calendar, Square } from "lucide-react";

interface SalawatHeaderProps {
  notificationsEnabled?: boolean;
  isPlaying?: boolean;
  onStopAllAudio?: () => void;
  onToggleNotifications?: () => void;
  onOpenNotifications?: () => void;
  onOpenDateDetails?: () => void;
}

export const SalawatHeader: React.FC<SalawatHeaderProps> = ({
  notificationsEnabled = true,
  isPlaying = false,
  onStopAllAudio,
  onToggleNotifications,
  onOpenNotifications,
  onOpenDateDetails,
}) => {
  const handleNotificationsClick = onOpenNotifications || onToggleNotifications || (() => {});
  // Current Arabic date & day
  const today = new Date();
  const dayNames = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const currentDayName = dayNames[today.getDay()] || "الأربعاء";
  const currentDateStr = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <header className="w-full flex items-center justify-between gap-2 pt-2 pb-1 select-none">
      
      {/* Left: Notification Bell Button OR Active STOP AUDIO Button if sound is playing */}
      <div className="flex items-center gap-1.5">
        <button
          id="header-notification-btn"
          onClick={handleNotificationsClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-stone-100 flex items-center justify-center text-stone-700 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-95 cursor-pointer relative"
          title={notificationsEnabled ? "التذكيرات والإشعارات مفعّلة" : "تفعيل التذكيرات"}
        >
          {notificationsEnabled ? (
            <>
              <Bell className="w-5 h-5 text-emerald-800" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </>
          ) : (
            <BellOff className="w-5 h-5 text-stone-400" />
          )}
        </button>

        {/* Instant Stop Audio Button when any audio is active */}
        {isPlaying && onStopAllAudio && (
          <button
            id="salawat-header-stop-audio-btn"
            type="button"
            onClick={onStopAllAudio}
            className="px-2.5 sm:px-3 h-11 sm:h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer animate-pulse ring-2 ring-rose-300"
            title="إيقاف الصوت حالاً"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span className="font-tajawal font-bold text-[11px] sm:text-xs">إيقاف</span>
          </button>
        )}
      </div>

      {/* Center: Brand Typography with Mosque Dome Symbol */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Subtle Dome Icon */}
        <div className="flex items-center justify-center -mb-1 text-emerald-800 opacity-90">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2v2M12 4c-3.5 0-6 2.5-6 6v3h12v-3c0-3.5-2.5-6-6-6zM4 15h16v5H4v-5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 20v-3h6v3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="2" r="0.75" fill="currentColor" />
          </svg>
        </div>

        {/* Main Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-bold font-amiri text-emerald-900 tracking-normal leading-tight">
          صلوات
        </h1>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-xs text-stone-500 font-amiri -mt-0.5">
          الصلاة على النبي ﷺ نور لقلبك
        </p>
      </div>

      {/* Right: Date Pill Card */}
      <button
        onClick={onOpenDateDetails}
        className="h-11 sm:h-12 px-2.5 sm:px-3 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-stone-100 flex items-center gap-2 hover:border-emerald-200 transition-all active:scale-95 text-right cursor-pointer"
        title="التاريخ الهجري والميلادي"
      >
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-bold text-emerald-900 font-tajawal">
            {currentDayName}
          </span>
          <span className="text-[9.5px] text-stone-500 font-tajawal">
            {currentDateStr}
          </span>
        </div>
        <div className="w-7 h-7 rounded-xl bg-stone-50 flex items-center justify-center text-emerald-800">
          <Calendar className="w-4 h-4" />
        </div>
      </button>

    </header>
  );
};
