import React, { useState } from "react";
import {
  AlarmClock,
  Volume2,
  Brain,
  Play,
  Check,
  ShieldAlert,
  Flame,
  Clock,
  VolumeX,
  Zap,
  Info,
} from "lucide-react";
import { loudAlarmAudioService } from "../utils/alarmAudio";
import { backgroundTimerService } from "../utils/backgroundTimer";

interface FajrAlarmCardProps {
  alarmEnabled: boolean;
  alarmTime: string; // HH:MM (24h)
  challengeType: "math" | "tasbeeh" | "order";
  difficulty: "easy" | "medium" | "hard";
  soundType: "adhan" | "intense_alarm" | "adhan_and_siren";
  onToggleEnabled: (enabled: boolean) => void;
  onChangeTime: (time: string) => void;
  onChangeChallengeType: (type: "math" | "tasbeeh" | "order") => void;
  onChangeDifficulty: (diff: "easy" | "medium" | "hard") => void;
  onChangeSoundType: (sound: "adhan" | "intense_alarm" | "adhan_and_siren") => void;
  onTriggerTestAlarm: () => void;
}

export const FajrAlarmCard: React.FC<FajrAlarmCardProps> = ({
  alarmEnabled,
  alarmTime,
  challengeType,
  difficulty,
  soundType,
  onToggleEnabled,
  onChangeTime,
  onChangeChallengeType,
  onChangeDifficulty,
  onChangeSoundType,
  onTriggerTestAlarm,
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const quickTimes = [
    { label: "الفجر المبكر", time: "04:15" },
    { label: "أذان الفجر", time: "04:45" },
    { label: "صلاة الفجر", time: "05:15" },
    { label: "الشروق", time: "06:00" },
  ];

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/30 border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Top Header & Alarm Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              alarmEnabled
                ? "bg-gradient-to-br from-amber-500 to-red-600 text-stone-950 shadow-lg ring-2 ring-amber-400/40 animate-pulse"
                : "bg-stone-800 text-stone-400 border border-stone-700"
            }`}
          >
            <AlarmClock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-tajawal text-amber-200">
                منبه الفجر الذكي الخارق (صعب الإغلاق)
              </h3>
              {alarmEnabled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>مفعّل ومضبوط على {alarmTime}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              صوت مرتفع مستمر + رفع تلقائي للصوت + لا يغلق إلا بعد حل المسألة الحسابية
            </p>
          </div>
        </div>

        {/* Master Alarm Switch */}
        <button
          id="toggle-fajr-alarm-btn"
          onClick={() => {
            const next = !alarmEnabled;
            onToggleEnabled(next);
            if (next) {
              backgroundTimerService.startAudioKeepAlive();
            }
          }}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-md active:scale-95 flex-shrink-0 ${
            alarmEnabled
              ? "bg-gradient-to-r from-amber-500 to-red-600 text-stone-950 hover:from-amber-400 hover:to-red-500 shadow-amber-900/50"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{alarmEnabled ? "المنبه مفعّل الآن ✓" : "تفعيل منبه الفجر"}</span>
        </button>
      </div>

      {/* Auto-Volume Booster & Anti-Sleep Guarantee Banner */}
      <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-red-300">
            ميزة الحماية ضد إغلاق المنبه أثناء النوم:
          </p>
          <p className="text-stone-300 leading-relaxed">
            عند رنين المنبه، يمنع التطبيق الإغلاق العشوائي، وإذا حاول المستخدم خفض الصوت يقوم النظام برفعه تلقائياً إلى 100% فورياً، ويجبرك على حل التحدي الذهني للتأكد من زوال النعاس تماماً.
          </p>
        </div>
      </div>

      {/* Alarm Time Configuration */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>وقت رنين منبه الفجر:</span>
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => onChangeTime(e.target.value)}
            className="w-full sm:w-48 text-center text-2xl font-bold font-mono py-2.5 px-4 rounded-2xl bg-stone-950 border-2 border-amber-500/50 text-amber-200 focus:outline-none focus:border-amber-400"
          />

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {quickTimes.map((item) => (
              <button
                key={item.time}
                onClick={() => onChangeTime(item.time)}
                className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  alarmTime === item.time
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                    : "bg-stone-800/80 text-stone-400 hover:text-stone-200"
                }`}
              >
                {item.label} ({item.time})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Selection */}
      <div className="space-y-3 pt-2 border-t border-stone-800">
        <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>نوع تحدي الاستيقاظ لإيقاف المنبه:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onChangeChallengeType("math")}
            className={`p-3 rounded-2xl border text-right cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
              challengeType === "math"
                ? "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md"
                : "bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-200">🧮 مسائل حسابية</span>
              {challengeType === "math" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <span className="text-[11px] text-stone-400 leading-relaxed">
              حل 3 مسائل حسابية سريعة لتنشيط العقل وإيقاظ الذهن
            </span>
          </button>

          <button
            onClick={() => onChangeChallengeType("tasbeeh")}
            className={`p-3 rounded-2xl border text-right cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
              challengeType === "tasbeeh"
                ? "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md"
                : "bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-200">📿 ٣٣ تسبيحة سريعة</span>
              {challengeType === "tasbeeh" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <span className="text-[11px] text-stone-400 leading-relaxed">
              الضغط 33 مرة على المسبحة مع الاستغفار لاستحضار النية
            </span>
          </button>

          <button
            onClick={() => onChangeChallengeType("order")}
            className={`p-3 rounded-2xl border text-right cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
              challengeType === "order"
                ? "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md"
                : "bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-200">🧩 ترتيب كلمات الأذان</span>
              {challengeType === "order" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <span className="text-[11px] text-stone-400 leading-relaxed">
              ترتيب «الصلاة خير من النوم» بالضغط على الكلمات الصحيحة
            </span>
          </button>
        </div>

        {/* Math Difficulty Selector */}
        {challengeType === "math" && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-stone-400">مستوى صعوبة المسائل:</span>
            {(["easy", "medium", "hard"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChangeDifficulty(lvl)}
                className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  difficulty === lvl
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : "bg-stone-800 text-stone-400 hover:text-stone-200"
                }`}
              >
                {lvl === "easy" ? "سهل (جمع وطرح بسيط)" : lvl === "medium" ? "متوسط (ضرب وجمع)" : "عبقري (أرقام كبيرة)"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sound Type Selection */}
      <div className="space-y-3 pt-2 border-t border-stone-800">
        <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>نغمة وصوت المنبه المزعج:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => onChangeSoundType("adhan_and_siren")}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer text-right flex items-center justify-between ${
              soundType === "adhan_and_siren"
                ? "bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold"
                : "bg-stone-950/40 border-stone-800 text-stone-400"
            }`}
          >
            <span>🚨 مزيج الأذان وصفارة الاستيقاظ الحادة</span>
            {soundType === "adhan_and_siren" && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => onChangeSoundType("adhan")}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer text-right flex items-center justify-between ${
              soundType === "adhan"
                ? "bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold"
                : "bg-stone-950/40 border-stone-800 text-stone-400"
            }`}
          >
            <span>🕋 أذان الفجر بصوت ندي مرتفع</span>
            {soundType === "adhan" && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => onChangeSoundType("intense_alarm")}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer text-right flex items-center justify-between ${
              soundType === "intense_alarm"
                ? "bg-amber-500/20 border-amber-500/60 text-amber-200 font-bold"
                : "bg-stone-950/40 border-stone-800 text-stone-400"
            }`}
          >
            <span>⚡ صفارات تنبيه متعددة الترددات</span>
            {soundType === "intense_alarm" && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Action Buttons: Instant Test */}
      <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          id="test-fajr-alarm-now-btn"
          onClick={() => {
            loudAlarmAudioService.startLoudAlarm(soundType);
            onTriggerTestAlarm();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-xl shadow-red-950/60 cursor-pointer active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-stone-950" />
          <span>🔊 تجربة المنبه الذكي الآن (اختبار الإيقاظ)</span>
        </button>

        <p className="text-[11px] text-stone-400 text-center sm:text-left">
          جرب حل المسألة والتأكد من قوة الصوت وصعوبة الإغلاق
        </p>
      </div>

    </div>
  );
};
