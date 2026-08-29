import React, { useState, useEffect } from "react";
import {
  X,
  Layers,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Radio,
  ExternalLink,
  ChevronLeft,
  Bell,
  Sparkles,
  Zap,
} from "lucide-react";
import { systemNotificationManager } from "../utils/systemNotifications";
import { reminderAudioManager } from "../utils/audio";

interface OverlayAndVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  volumeBoostEnabled: boolean;
  onToggleVolumeBoost: (enabled: boolean) => void;
  overlayNotificationEnabled: boolean;
  onToggleOverlayNotification: (enabled: boolean) => void;
  onTestReminderSound: () => void;
}

export const OverlayAndVolumeModal: React.FC<OverlayAndVolumeModalProps> = ({
  isOpen,
  onClose,
  volumeBoostEnabled,
  onToggleVolumeBoost,
  overlayNotificationEnabled,
  onToggleOverlayNotification,
  onTestReminderSound,
}) => {
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>("default");
  const [isRequestingPerm, setIsRequestingPerm] = useState<boolean>(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setNotificationPerm(systemNotificationManager.getPermissionStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestSystemPermission = async () => {
    setIsRequestingPerm(true);
    const granted = await systemNotificationManager.requestPermission();
    setNotificationPerm(systemNotificationManager.getPermissionStatus());
    if (granted) {
      onToggleOverlayNotification(true);
      await systemNotificationManager.sendCustomNotification(
        "🌿 تم تفعيل التذكير والظهور التلقائي بنجاح",
        "سيظهر لك التذكير الصوتي والمرئي بانتظام حتى أثناء استخدام التطبيقات الأخرى بإذن الله"
      );
    }
    setIsRequestingPerm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-stone-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-stone-100 animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-tajawal text-white">
                إذن الظهور فوق التطبيقات ورفع الصوت
              </h3>
              <p className="text-xs text-stone-400">
                إعدادات التذكير التلقائي والصوت العالي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 font-tajawal">
          
          {/* Section 1: Overlay & Background Notification Permission */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                    <span>إذن الظهور التلقائي وشريط الإشعارات</span>
                    {notificationPerm === "granted" ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        ممنوح ✓
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        يتطلب الإذن
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    يسمح للتطبيق بإظهار لافتة التذكير والتنبيه الصوتي على الشاشة الرئيسية وفوق التطبيقات الأخرى عند موعد الذكر المحدد.
                  </p>
                </div>
              </div>
            </div>

            {notificationPerm !== "granted" ? (
              <button
                type="button"
                onClick={handleRequestSystemPermission}
                disabled={isRequestingPerm}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-stone-950" />
                <span>{isRequestingPerm ? "جاري طلب الإذن..." : "منح إذن الظهور والإشعارات الآن"}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الإذن نشط ويعمل في الخلفية</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAndroidGuide(!showAndroidGuide)}
                  className="text-[11px] text-amber-300 hover:underline cursor-pointer"
                >
                  {showAndroidGuide ? "إخفاء الخطوات" : "خطوات تفعيل تثبيت PWA للأندرويد"}
                </button>
              </div>
            )}

            {showAndroidGuide && (
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300 space-y-1.5 leading-relaxed">
                <div className="font-bold text-amber-300">للهواتف والأندرويد (الظهور الكامل):</div>
                <p>1. افتح خيارات المتصفح (⋮) واختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> أو <strong>«تثبيت التطبيق»</strong>.</p>
                <p>2. من إعدادات الهاتف ← التطبيقات ← صلوات ← اختر <strong>«الظهور فوق التطبيقات الأخرى»</strong> ثم فعّلها.</p>
                <p>3. عيّن إدارة البطارية على <strong>«غير مقيّد (Unrestricted)»</strong> لضمان عمل التذكير التلقائي بدقة.</p>
              </div>
            )}
          </div>

          {/* Section 2: Hardware Volume Boost Mode */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${volumeBoostEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-stone-800 text-stone-400"}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-100">
                      مضخم الصوت العالي (Volume Boost 200%)
                    </h4>
                    {volumeBoostEnabled && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        أقصى صوت
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    مضاعفة شدة الصوت عبر معالج Web Audio API ليكون صوت الشيخ واضحاً ونقياً وعالياً حتى في الأماكن ذات الضوضاء.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={volumeBoostEnabled}
                onClick={() => onToggleVolumeBoost(!volumeBoostEnabled)}
                className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  volumeBoostEnabled ? "bg-emerald-500" : "bg-stone-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    volumeBoostEnabled ? "-translate-x-6 bg-amber-100" : "translate-x-0 bg-stone-300"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-400">
                مستوى التضخيم: <strong className="text-amber-300">{volumeBoostEnabled ? "مضاعف 2.0x (أعلى درجة)" : "طبيعي 1.0x"}</strong>
              </span>
              <button
                type="button"
                onClick={onTestReminderSound}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>تجربة الصوت الآن</span>
              </button>
            </div>
          </div>

          {/* Section 3: Automatic Keep-Alive guarantee */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-stone-300">
            <Radio className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">
                ضمان التذكير التلقائي:
              </span>
              <span>
                يقوم التطبيق بتشغيل محرك التذكير التلقائي في الخلفية بدون انقطاع وفق الفاصل الزمني الذي تحدده (مثلاً كل 1 دقيقة أو 5 دقائق أو 10 دقائق).
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
