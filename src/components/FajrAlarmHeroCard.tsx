import React, { useState } from "react";
import { AlarmClock, Music, Settings, Volume2 } from "lucide-react";
import greenClockImg from "../assets/images/green_alarm_clock_1787914857524.jpg";

interface FajrAlarmHeroCardProps {
  alarmEnabled: boolean;
  alarmTime: string; // e.g. "03:50" or "04:30"
  soundType: "adhan" | "intense_alarm" | "adhan_and_siren";
  onToggleEnabled: (enabled: boolean) => void;
  onChangeTime?: (time: string) => void;
  onOpenSettings?: () => void;
  onTriggerTestAlarm?: () => void;
}

export const FajrAlarmHeroCard: React.FC<FajrAlarmHeroCardProps> = ({
  alarmEnabled,
  alarmTime = "03:50",
  soundType = "adhan",
  onToggleEnabled,
  onChangeTime,
  onOpenSettings,
  onTriggerTestAlarm,
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);

  // Format time for AM/PM display
  const getFormattedTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(":");
      let hourNum = parseInt(h, 10);
      const isPm = hourNum >= 12;
      if (hourNum === 0) hourNum = 12;
      if (hourNum > 12) hourNum -= 12;
      const paddedHour = hourNum < 10 ? `0${hourNum}` : `${hourNum}`;
      return {
        time: `${paddedHour}:${m}`,
        period: isPm ? "PM" : "AM",
      };
    } catch (e) {
      return { time: timeStr, period: "AM" };
    }
  };

  const { time: displayTime, period } = getFormattedTime(alarmTime);

  const getSoundLabel = (type: string) => {
    switch (type) {
      case "adhan":
        return "أذان الفجر";
      case "intense_alarm":
        return "إنذار عالي الشدة";
      case "adhan_and_siren":
        return "أذان الفجر + صفارة خارقة";
      default:
        return "أذان الفجر";
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] rounded-[30px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-stone-100 relative overflow-hidden select-none flex items-center justify-between gap-3">
      
      {/* Left Side: 3D Alarm Clock Illustration */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center">
        {/* Subtle Background Mosque Silhouette & Stars Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/70 via-stone-50/50 to-transparent rounded-2xl -z-10" />
        
        <img
          src={greenClockImg}
          alt="منبه الفجر الأخضر"
          className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Small Test Alarm Badge */}
        {onTriggerTestAlarm && (
          <button
            onClick={onTriggerTestAlarm}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-950 text-white text-[9px] font-bold shadow hover:bg-emerald-900 transition-all flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
            title="تجربة المنبه الصوتي ولغز الاستيقاظ"
          >
            <span>تجربة المنبه</span>
            <Volume2 className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Right Side: Title, Time, Toggle, and Sound details */}
      <div className="flex-1 flex flex-col justify-between py-1 text-right">
        
        {/* Header row: Title + Alarm Icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-emerald-800">
            <AlarmClock className="w-4 h-4" />
          </div>

          <div className="text-right">
            <h3 className="text-base font-bold font-tajawal text-stone-900 leading-tight">
              منبه الفجر
            </h3>
            <p className="text-[11px] text-stone-500 font-tajawal">
              استيقظ على ذكر الله
            </p>
          </div>
        </div>

        {/* Center row: Time Display + Green Toggle Switch */}
        <div className="flex items-center justify-between gap-3 my-2">
          
          {/* Green Modern Toggle Switch */}
          <button
            id="fajr-alarm-toggle-btn"
            onClick={() => onToggleEnabled(!alarmEnabled)}
            className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center cursor-pointer ${
              alarmEnabled ? "bg-[#2F5241]" : "bg-stone-200"
            }`}
            title={alarmEnabled ? "تعطيل منبه الفجر" : "تفعيل منبه الفجر"}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                alarmEnabled ? "-translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          {/* Large Time Display (e.g. 03:50 AM) */}
          <div className="flex items-baseline gap-1.5 flex-row-reverse">
            <span className="text-xs font-bold text-stone-500 font-tajawal uppercase">
              {period}
            </span>

            {isEditingTime ? (
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => {
                  if (onChangeTime) onChangeTime(e.target.value);
                  setIsEditingTime(false);
                }}
                onBlur={() => setIsEditingTime(false)}
                autoFocus
                className="text-2xl font-black font-tajawal text-emerald-950 bg-stone-50 px-2 py-0.5 rounded-lg border border-emerald-300 outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditingTime(true)}
                className="text-2xl sm:text-3xl font-black font-tajawal text-stone-900 tracking-tight hover:text-emerald-800 transition-colors cursor-pointer"
                title="اضغط لتغيير وقت المنبه"
              >
                {displayTime}
              </button>
            )}
          </div>

        </div>

        {/* Bottom row: Sound Label with Music Note */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100/70 text-[11px] text-stone-600 font-tajawal">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>إعدادات اللغز</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="font-medium">صوت المنبه: {getSoundLabel(soundType)}</span>
            <Music className="w-3.5 h-3.5 text-emerald-700" />
          </div>
        </div>

      </div>

    </div>
  );
};
