import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  ChevronDown,
  Compass,
  Volume2,
  Clock,
} from "lucide-react";
import { getCityPrayerList, ISLAMIC_CITIES_DATABASE } from "../data/prayerTimesData";

export interface PrayerItem {
  id: string;
  name: string;
  displayTime: string; // e.g. "4:20"
  hours24: number;
  minutes: number;
  icon: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
}

interface PrayerTimesCardProps {
  city?: string;
  onOpenCitySelector?: () => void;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({
  city = "القاهرة",
  onOpenCitySelector,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [activePrayerId, setActivePrayerId] = useState<string>("fajr");

  // Get accurate prayer times list based on selected city
  const prayerList: PrayerItem[] = useMemo(() => {
    return getCityPrayerList(city);
  }, [city]);

  const cityMeta = useMemo(() => {
    return ISLAMIC_CITIES_DATABASE.find((c) => c.name === city) || ISLAMIC_CITIES_DATABASE[0];
  }, [city]);

  // Dynamic next prayer & live countdown ticker
  useEffect(() => {
    const updateNextPrayerAndCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      // Find the next upcoming prayer today
      let nextPrayer: PrayerItem | null = null;
      let targetDate = new Date();

      for (const prayer of prayerList) {
        const prayerTotalSeconds = prayer.hours24 * 3600 + prayer.minutes * 60;
        if (prayerTotalSeconds > currentTotalSeconds) {
          nextPrayer = prayer;
          targetDate.setHours(prayer.hours24, prayer.minutes, 0, 0);
          break;
        }
      }

      // If all prayers today have passed (after Isha), next prayer is Fajr tomorrow morning
      if (!nextPrayer) {
        nextPrayer = prayerList[0]; // Fajr
        targetDate.setDate(targetDate.getDate() + 1);
        targetDate.setHours(prayerList[0].hours24, prayerList[0].minutes, 0, 0);
      }

      setActivePrayerId(nextPrayer.id);

      const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setCountdown(formatted);
    };

    updateNextPrayerAndCountdown();
    const interval = setInterval(updateNextPrayerAndCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerList]);

  const renderPrayerIcon = (type: string, isActive: boolean) => {
    const iconClass = `w-5 h-5 ${isActive ? "text-amber-300" : "text-amber-500/80"}`;
    switch (type) {
      case "fajr":
        return <Sun className={iconClass} />;
      case "sunrise":
        return <Sunrise className={iconClass} />;
      case "dhuhr":
      case "asr":
        return <Sun className={iconClass} />;
      case "maghrib":
        return <Sunset className={iconClass} />;
      case "isha":
        return <Moon className={`w-5 h-5 ${isActive ? "text-amber-200" : "text-stone-400"}`} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <div className="w-full bg-white rounded-[30px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col select-none transition-all">
      
      {/* Top Header: Location on Left, Title on Right */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
        
        {/* City Location Button */}
        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 text-xs font-bold font-tajawal transition-all border border-stone-100/80 active:scale-95 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>{city}</span>
        </button>

        {/* Section Title */}
        <h3 className="text-base font-bold font-tajawal text-stone-800">
          مواقيت الصلاة
        </h3>
      </div>

      {/* Horizontal Prayer Time Slots Row */}
      <div className="flex items-start justify-between gap-1 sm:gap-2 pt-3 pb-1 overflow-x-auto scrollbar-none">
        {prayerList.map((prayer) => {
          const isActive = prayer.id === activePrayerId;

          return (
            <div
              key={prayer.id}
              className="flex flex-col items-center flex-1 min-w-[50px]"
            >
              {/* Prayer Slot Card */}
              <div
                className={`w-full py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? "bg-[#2F5241] text-white shadow-md shadow-[#2F5241]/25 ring-2 ring-[#2F5241]/20 scale-102"
                    : "bg-stone-50/70 text-stone-700 hover:bg-stone-100/60"
                }`}
              >
                {renderPrayerIcon(prayer.icon, isActive)}
                
                <span className={`text-[11px] sm:text-xs font-bold font-tajawal ${isActive ? "text-stone-100" : "text-stone-600"}`}>
                  {prayer.name}
                </span>

                <span className={`text-xs sm:text-sm font-black font-tajawal ${isActive ? "text-white" : "text-stone-800"}`}>
                  {prayer.displayTime}
                </span>
              </div>

              {/* Active Prayer Countdown Tag Underneath */}
              {isActive && (
                <div className="flex flex-col items-center mt-2 animate-in fade-in duration-200">
                  <span className="text-[10px] text-stone-400 font-tajawal leading-none">
                    المتبقي
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900 font-tajawal tracking-wide mt-0.5 dir-ltr">
                    {countdown}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Chevron Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-7 h-7 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-transform active:scale-95 cursor-pointer"
          title="تفاصيل إضافية لمواقيت الصلاة"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs font-tajawal animate-in fade-in duration-200">
          <div className="bg-stone-50 rounded-2xl p-3 flex items-center gap-2.5 text-stone-700">
            <Compass className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-stone-400 block">اتجاه القبلة</span>
              <span className="font-bold text-stone-800">{cityMeta.qiblaAngle}° نحو الكعبة المشرفة</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-3 flex items-center gap-2.5 text-stone-700">
            <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-stone-400 block">طريقة الحساب</span>
              <span className="font-bold text-stone-800">{cityMeta.calculationMethod}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
