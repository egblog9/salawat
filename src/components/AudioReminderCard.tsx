import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Bell,
  Clock,
  Play,
  Check,
  Info,
  ShieldCheck,
  Smartphone,
  Share2,
  Send,
  BellRing,
  Music,
  Radio,
  Heart,
} from "lucide-react";
import { REMINDER_VOICE_FORMULAS } from "../data/salawatData";
import { ReminderVoiceFormula } from "../types";

interface AudioReminderCardProps {
  enabled: boolean;
  intervalMinutes: number;
  isMuted: boolean;
  selectedFormulaId: "salli_ala_muhammad" | "allahumma_salli_wasallim";
  onSelectFormula: (formulaId: "salli_ala_muhammad" | "allahumma_salli_wasallim") => void;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeInterval: (minutes: number) => void;
  onToggleMute: (muted: boolean) => void;
  onTestSound: (formulaId?: "salli_ala_muhammad" | "allahumma_salli_wasallim") => void;
  isTestingSound: boolean;
  remainingSeconds: number;
  systemNotificationsEnabled?: boolean;
  systemNotificationInterval?: number;
  onToggleSystemNotifications?: (enabled: boolean) => void;
  onChangeSystemNotificationInterval?: (mins: number) => void;
  onSendTestSystemNotification?: () => void;
  isTestingNotification?: boolean;
  onOpenShareModal?: () => void;
}

export const AudioReminderCard: React.FC<AudioReminderCardProps> = ({
  enabled,
  intervalMinutes,
  isMuted,
  selectedFormulaId,
  onSelectFormula,
  onToggleEnabled,
  onChangeInterval,
  onToggleMute,
  onTestSound,
  isTestingSound,
  remainingSeconds,
  systemNotificationsEnabled = false,
  systemNotificationInterval = 30,
  onToggleSystemNotifications,
  onChangeSystemNotificationInterval,
  onSendTestSystemNotification,
  isTestingNotification = false,
  onOpenShareModal,
}) => {
  const [showPermissionHint, setShowPermissionHint] = useState<boolean>(false);

  const intervals = [
    { value: 1, label: "دقيقة واحدة", shortLabel: "1 دقيقة" },
    { value: 5, label: "5 دقائق", shortLabel: "5 دقائق" },
    { value: 10, label: "10 دقائق", shortLabel: "10 دقائق" },
    { value: 15, label: "15 دقيقة", shortLabel: "15 دقيقة" },
    { value: 30, label: "30 دقيقة", shortLabel: "30 دقيقة" },
    { value: 60, label: "60 دقيقة", shortLabel: "60 دقيقة" },
  ];

  const systemIntervals = [
    { value: 15, label: "15 دقيقة" },
    { value: 30, label: "30 دقيقة" },
    { value: 60, label: "ساعة واحدة" },
    { value: 120, label: "ساعتان" },
    { value: 240, label: "4 ساعات" },
  ];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggle = () => {
    if (!enabled) {
      onToggleEnabled(true);
      setShowPermissionHint(false);
    } else {
      onToggleEnabled(false);
    }
  };

  const currentFormula = REMINDER_VOICE_FORMULAS.find((f) => f.id === selectedFormulaId) || REMINDER_VOICE_FORMULAS[0];

  return (
    <div className="space-y-6">
      {/* 1. Voice Audio Reminder Box */}
      <div
        id="audio-reminder-section"
        className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-emerald-950/30 border border-emerald-800/40 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md transition-all"
      >
        {/* Decorative ambient background */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Main Header & Toggle Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80">
          
          {/* Title & Icon */}
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                enabled
                  ? "bg-gradient-to-br from-emerald-500 to-amber-500 text-stone-950 shadow-lg ring-2 ring-emerald-400/30 animate-pulse"
                  : "bg-stone-800 text-stone-400 border border-stone-700"
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold font-tajawal text-stone-100 flex items-center gap-2">
                  <span>🔊 التذكير الصوتي الفوري</span>
                </h2>
                {enabled && (
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>مفعّل الآن</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                تذكير صوتي دوري بالصيغة التي تختارها مع استمرار إشعارات الخلفية
              </p>
            </div>
          </div>

          {/* Big Switch Toggle: "تشغيل التذكير الصوتي" */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="text-xs sm:text-sm font-semibold text-stone-300 select-none">
              {enabled ? "تشغيل التذكير الصوتي" : "تشغيل التذكير الصوتي"}
            </span>

            <button
              id="sound-reminder-toggle-btn"
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="تشغيل التذكير الصوتي"
              onClick={handleToggle}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-900 ${
                enabled ? "bg-emerald-500" : "bg-stone-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold text-stone-800 ${
                  enabled ? "-translate-x-7 bg-amber-100" : "translate-x-0 bg-stone-300"
                }`}
              >
                {enabled ? <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" /> : ""}
              </span>
            </button>
          </div>
        </div>

        {/* 2 Voice Formula Selection Section (NEW: User chooses between "صلي على محمد" and "اللهم صلي وسلم على نبينا محمد") */}
        <div className="mt-5 pt-1">
          <label className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-3">
            <Music className="w-4 h-4 text-amber-400" />
            <span>اختر صيغة الصوت للتذكير:</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REMINDER_VOICE_FORMULAS.map((formula) => {
              const isSelected = formula.id === selectedFormulaId;
              return (
                <div
                  key={formula.id}
                  id={`formula-card-${formula.id}`}
                  onClick={() => onSelectFormula(formula.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-stone-950/60 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? "bg-emerald-500 border-emerald-400 text-stone-950"
                              : "border-stone-600 bg-stone-900"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="font-bold text-stone-100 text-sm">{formula.shortName}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTestSound(formula.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors border border-amber-600/30 active:scale-95"
                        title="استماع لهذه الصيغة"
                      >
                        <Play className="w-3 h-3" />
                        <span>استماع</span>
                      </button>
                    </div>

                    <p className="font-amiri text-base text-amber-200 leading-relaxed my-1">
                      {formula.arabicText}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {formula.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded Controls when Enabled */}
        {enabled ? (
          <div className="mt-5 space-y-5 animate-in fade-in duration-200">
            
            {/* Interval Selector: "ذكّرني كل:" */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <label className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>ذكّرني كل:</span>
                </label>

                {/* Live Countdown Badge */}
                <div className="text-[11px] sm:text-xs font-mono font-bold px-3 py-1 rounded-xl bg-stone-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>التذكير القادم بعد:</span>
                  <span className="text-amber-300 font-bold">{formatTime(remainingSeconds)}</span>
                </div>
              </div>

              {/* Segmented Interval Choices */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {intervals.map((item) => {
                  const isSelected = intervalMinutes === item.value;
                  return (
                    <button
                      key={item.value}
                      id={`interval-btn-${item.value}`}
                      type="button"
                      onClick={() => onChangeInterval(item.value)}
                      aria-label={`تذكير كل ${item.label}`}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-400 text-stone-950 shadow-md font-extrabold ring-2 ring-emerald-500/20"
                          : "bg-stone-950/80 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:text-stone-100 hover:border-stone-700"
                      }`}
                    >
                      <span>{item.shortLabel}</span>
                      {item.value === 10 && (
                        <span className="block text-[9px] font-normal opacity-80 mt-0.5">
                          (الافتراضي)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio & Sound Options Control Bar */}
            <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
              
              {/* Audio Mute / Unmute Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-medium">حالة الصوت:</span>
                <button
                  id="reminder-mute-toggle-btn"
                  type="button"
                  onClick={() => onToggleMute(!isMuted)}
                  aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                    !isMuted
                      ? "bg-emerald-950 border-emerald-600/60 text-emerald-300"
                      : "bg-stone-900 border-stone-700 text-stone-400"
                  }`}
                >
                  {!isMuted ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🔊 تشغيل الصوت</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>🔇 كتم الصوت (إشعار مرئي فقط)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Sound Button */}
              <div className="flex items-center gap-2">
                <button
                  id="test-reminder-audio-btn"
                  type="button"
                  onClick={() => onTestSound()}
                  disabled={isTestingSound}
                  aria-label="اختبار الصوت المختار"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow active:scale-95 cursor-pointer ${
                    isTestingSound
                      ? "bg-amber-600 text-stone-950 animate-pulse"
                      : "bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/30"
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isTestingSound ? "animate-spin" : ""}`} />
                  <span>{isTestingSound ? "جاري الاستماع..." : "اختبار الصوت المختار 🎧"}</span>
                </button>
              </div>

            </div>

            {/* Background reminder mode tip */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2.5 text-xs text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300 block mb-0.5">
                  التذكير في الخلفية:
                </span>
                <span>
                  لضمان تذكيرك حتى عند إغلاق الشاشة أو استخدام تطبيقات أخرى، نوصي بتفعيل <strong>إشعارات شريط الهاتف</strong> بالأسفل مع تثبيت التطبيق.
                </span>
              </div>
            </div>

          </div>
        ) : (
          /* Hint when disabled */
          <div className="mt-4 pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
              <span>فعّل التذكير الصوتي لتذكيرك بالصلاة على الحبيب ﷺ بانتظام كل 10 دقائق بالصوت الذي تفضله.</span>
            </div>
            <button
              onClick={() => onTestSound()}
              className="text-[11px] text-amber-400/90 hover:text-amber-300 hover:underline flex-shrink-0 cursor-pointer font-bold"
            >
              تجربة الصيغة المختارة
            </button>
          </div>
        )}

        {/* Autoplay Security Notice if clicked */}
        {showPermissionHint && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>تم تفعيل تصريح الصوت بنجاح مع المتصفح.</span>
          </div>
        )}
      </div>

      {/* 2. System Push / Shade Notifications Box */}
      <div
        id="system-notification-section"
        className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/30 border border-amber-600/40 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800/80">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                systemNotificationsEnabled
                  ? "bg-gradient-to-br from-amber-500 to-emerald-500 text-stone-950 shadow-lg ring-2 ring-amber-400/30 animate-pulse"
                  : "bg-stone-800 text-stone-400 border border-stone-700"
              }`}
            >
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold font-tajawal text-stone-100 flex items-center gap-2">
                  <span>🔔 إشعارات شريط الهاتف والنظام (في الخلفية)</span>
                </h2>
                {systemNotificationsEnabled && (
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-900/90 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>مفعّلة على جهازك</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                تصلك تنبيهات في شريط الإشعارات العلوي لهاتفك حتى عند قفل الشاشة أو في الخلفية.
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="text-xs sm:text-sm font-semibold text-stone-300 select-none">
              {systemNotificationsEnabled ? "إشعارات الهاتف مفعّلة" : "تفعيل إشعارات الهاتف"}
            </span>

            <button
              id="system-notification-toggle-btn"
              type="button"
              role="switch"
              aria-checked={systemNotificationsEnabled}
              aria-label="تفعيل إشعارات شريط الهاتف"
              onClick={() => onToggleSystemNotifications?.(!systemNotificationsEnabled)}
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900 ${
                systemNotificationsEnabled ? "bg-amber-500" : "bg-stone-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold text-stone-800 ${
                  systemNotificationsEnabled ? "-translate-x-7 bg-stone-950 text-amber-400" : "translate-x-0 bg-stone-300"
                }`}
              >
                {systemNotificationsEnabled ? <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" /> : ""}
              </span>
            </button>
          </div>
        </div>

        {/* Extended System Notification Options */}
        {systemNotificationsEnabled ? (
          <div className="mt-5 space-y-5 animate-in fade-in">
            {/* Interval Selector */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>إرسال إشعار في شريط الهاتف كل:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {systemIntervals.map((item) => {
                  const isSelected = systemNotificationInterval === item.value;
                  return (
                    <button
                      key={item.value}
                      id={`sys-interval-btn-${item.value}`}
                      type="button"
                      onClick={() => onChangeSystemNotificationInterval?.(item.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-amber-500 border-amber-300 text-stone-950 shadow-md font-extrabold ring-2 ring-amber-400/20"
                          : "bg-stone-950/80 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-stone-100"
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Notification Action */}
            <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>تجربة إشعار فوري في شريط الهاتف الآن:</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  اضغط للتحقق من ظهور الإشعار في أعلى هاتفك مع الصوت والاهتزاز.
                </p>
              </div>

              <button
                id="test-system-notification-btn"
                type="button"
                onClick={onSendTestSystemNotification}
                disabled={isTestingNotification}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTestingNotification ? "جاري الإرسال..." : "إرسال إشعار تجريبي لشريط الهاتف 📲"}</span>
              </button>
            </div>

            {/* Notification Messages Samples */}
            <div className="bg-stone-950/50 rounded-2xl p-4 border border-stone-800/60">
              <span className="text-xs font-bold text-amber-300 block mb-2">
                نماذج من الرسائل التي ستصلك في شريط الإشعارات:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-300">
                  <div className="font-bold text-amber-300 mb-0.5">🌿 لا تنسَ الصلاة على النبي ﷺ</div>
                  <div className="text-[11px] text-stone-400">{currentFormula.arabicText}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-300">
                  <div className="font-bold text-emerald-400 mb-0.5">🤍 شارك التطبيق صدقة جارية</div>
                  <div className="text-[11px] text-stone-400">الدال على الخير كفاعله، انشر التطبيق واكسب الأجر</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-300">
                  <div className="font-bold text-amber-200 mb-0.5">🤲 عطر لسانك بالصلاة على الحبيب</div>
                  <div className="text-[11px] text-stone-400">من صلى عليّ صلاة صلى الله عليه بها عشراً</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500/70 flex-shrink-0" />
              <span>عند تفعيلها، سيرسل هاتفك تنبيهات دورية خفيفة للتذكير بالصلاة ونشر الخير والصدقة الجارية.</span>
            </div>
            <button
              onClick={onSendTestSystemNotification}
              className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex-shrink-0 cursor-pointer font-bold"
            >
              تجربة إشعار تجريبي الآن
            </button>
          </div>
        )}
      </div>

      {/* 3. Share App & Sadaqah Jariyah Section */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-stone-900 to-stone-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-right">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-stone-950 shadow-md flex-shrink-0">
            <Share2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-100 font-tajawal flex items-center gap-1.5">
              <span>انشر التطبيق ليكون صدقة جارية لك 📲</span>
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              عند مشاركة التطبيق، يتثبت كبرنامج مستقل على هاتف أي شخص مجاناً وبدون إعلانات.
            </p>
          </div>
        </div>

        <button
          id="reminder-share-app-action-btn"
          onClick={onOpenShareModal}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all flex-shrink-0 cursor-pointer"
        >
          <Share2 className="w-4 h-4 stroke-[2.5]" />
          <span>مشاركة التطبيق الآن</span>
        </button>
      </div>
    </div>
  );
};


