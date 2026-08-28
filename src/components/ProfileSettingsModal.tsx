import React, { useState } from "react";
import { X, Volume2, ShieldCheck, Moon, Bell, Radio, ExternalLink, Play, Check } from "lucide-react";
import { REMINDER_VOICE_FORMULAS } from "../data/salawatData";
import { ReminderVoiceFormula } from "../types";
import { reminderAudioManager } from "../utils/audio";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: ReminderVoiceFormula;
  onSelectVoice: (voice: ReminderVoiceFormula) => void;
  reminderInterval: number;
  onChangeInterval: (interval: number) => void;
  fajrChallengeType: "math" | "tasbeeh" | "sentence";
  onChangeFajrChallenge: (type: "math" | "tasbeeh" | "sentence") => void;
  fajrSoundType: "adhan" | "intense_alarm" | "adhan_and_siren";
  onChangeFajrSound: (sound: "adhan" | "intense_alarm" | "adhan_and_siren") => void;
  systemNotificationsEnabled: boolean;
  onToggleSystemNotifications: () => void;
  backgroundKeepAlive: boolean;
  onToggleBackgroundKeepAlive: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
  reminderInterval,
  onChangeInterval,
  fajrChallengeType,
  onChangeFajrChallenge,
  fajrSoundType,
  onChangeFajrSound,
  systemNotificationsEnabled,
  onToggleSystemNotifications,
  backgroundKeepAlive,
  onToggleBackgroundKeepAlive,
}) => {
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);

  const handleTestVoice = (e: React.MouseEvent, formula: ReminderVoiceFormula) => {
    e.stopPropagation();
    setTestingVoiceId(formula.id);
    reminderAudioManager.playReminder({
      formulaId: formula.id,
      audioUrl: formula.audioPath,
      fallbackUrl: formula.fallbackAyahUrl,
      onEnded: () => setTestingVoiceId(null),
    });
    setTimeout(() => {
      setTestingVoiceId(null);
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[34px] sm:rounded-[34px] max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold font-tajawal text-stone-800">
              الإعدادات والملف الشخصي
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              تخصيص التذكيرات الصوتية ومنبه الفجر
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Voice Formula */}
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-800" />
                <span>صوت الشيخ في التذكير الصوتي الدوري</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                <span>أصوات مشايخ حقيقية ١٠٠٪</span>
              </span>
            </div>

            <p className="text-[11px] text-stone-500 font-tajawal">
              تذكير صوتي دوري بالصلاة على النبي وسائر الأذكار بأصوات نقية لكبار المشايخ (بدون ذكاء اصطناعي):
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {REMINDER_VOICE_FORMULAS.map((formula) => {
                const isSelected = selectedVoice.id === formula.id;
                const isTesting = testingVoiceId === formula.id;

                return (
                  <div
                    key={formula.id}
                    onClick={() => onSelectVoice(formula)}
                    className={`w-full p-3 rounded-2xl text-right flex items-center justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#2F5241] text-white border-[#2F5241] shadow-md ring-2 ring-emerald-600/30"
                        : "bg-stone-50 text-stone-700 hover:bg-stone-100/90 border-stone-200/70"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pl-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold font-tajawal truncate">
                          {formula.shortName}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className={`text-[10.5px] block truncate font-amiri ${isSelected ? "text-amber-200" : "text-emerald-800 font-bold"}`}>
                        {formula.sheikhName}
                      </span>
                      <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                        {formula.arabicText}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleTestVoice(e, formula)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                          isTesting
                            ? "bg-amber-400 text-stone-950 animate-pulse"
                            : isSelected
                            ? "bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700"
                            : "bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 shadow-sm"
                        }`}
                        title="استماع لصوت الشيخ"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isTesting ? "جاري التشغيل..." : "استماع"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fajr Alarm Sound & Challenge Settings */}
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>إعدادات منبه الفجر الذكي</span>
            </h4>

            {/* Sound Choice */}
            <div>
              <label className="text-[11px] text-stone-500 font-tajawal block mb-1">
                نغمة المنبه
              </label>
              <select
                value={fajrSoundType}
                onChange={(e) => onChangeFajrSound(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-tajawal text-stone-800 outline-none"
              >
                <option value="adhan">أذان الفجر بصوت ندي</option>
                <option value="intense_alarm">إنذار عالي الشدة مع اهتزاز</option>
                <option value="adhan_and_siren">أذان الفجر + صفارة خارقة (أعلى صوت)</option>
              </select>
            </div>

            {/* Challenge Choice */}
            <div>
              <label className="text-[11px] text-stone-500 font-tajawal block mb-1">
                لغز إيقاف المنبه (للتأكد من استيقاظك)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "math", label: "مسائل حسابية" },
                  { id: "tasbeeh", label: "ورد تسبيح" },
                  { id: "sentence", label: "ترتيب كلمات" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChangeFajrChallenge(item.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
                      fajrChallengeType === item.id
                        ? "bg-[#2F5241] text-white shadow"
                        : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Background Keep Alive Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
            <div className="text-right">
              <span className="text-xs font-bold font-tajawal text-stone-800 block">
                استمرار التذكير في الخلفية وقفل الشاشة
              </span>
              <span className="text-[10px] text-stone-400 font-tajawal">
                تفعيل قناة الصوت لمنع توقف الأذكار عند الخروج من التطبيق
              </span>
            </div>

            <button
              onClick={onToggleBackgroundKeepAlive}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                backgroundKeepAlive ? "bg-[#2F5241]" : "bg-stone-200"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  backgroundKeepAlive ? "-translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Facebook Official Page */}
          <a
            href="https://www.facebook.com/share/1Bm2aq9mKm/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold font-tajawal">
                صفحة التطبيق الرسمية على فيسبوك
              </span>
            </div>
            <span className="text-[11px] font-tajawal text-blue-600">زيارة الصفحة</span>
          </a>

        </div>

      </div>
    </div>
  );
};
