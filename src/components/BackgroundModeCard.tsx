import React, { useState, useEffect } from "react";
import {
  Smartphone,
  ShieldCheck,
  Zap,
  BatteryCharging,
  BellRing,
  Info,
  CheckCircle2,
  Lock,
  Radio,
} from "lucide-react";
import { backgroundTimerService } from "../utils/backgroundTimer";

interface BackgroundModeCardProps {
  isBackgroundEnabled: boolean;
  onToggleBackground: (enabled: boolean) => void;
}

export const BackgroundModeCard: React.FC<BackgroundModeCardProps> = ({
  isBackgroundEnabled,
  onToggleBackground,
}) => {
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);

  useEffect(() => {
    setWakeLockActive(backgroundTimerService.isBackgroundActive());
  }, [isBackgroundEnabled]);

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-emerald-950/30 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* Top Header & Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isBackgroundEnabled
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-stone-950 shadow-lg ring-2 ring-emerald-400/40"
                : "bg-stone-800 text-stone-400 border border-stone-700"
            }`}
          >
            <Radio className={`w-6 h-6 ${isBackgroundEnabled ? "animate-pulse" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-tajawal text-emerald-200">
                وضع العمل في الخلفية وقفل الشاشة
              </h3>
              {isBackgroundEnabled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>نشط في الخلفية</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              يحافظ على استمرار التذكير الصوتي ومنبه الفجر حتى عند الخروج من التطبيق أو إغلاق الشاشة
            </p>
          </div>
        </div>

        {/* Master Switch */}
        <button
          onClick={() => {
            const next = !isBackgroundEnabled;
            onToggleBackground(next);
            if (next) {
              backgroundTimerService.startAudioKeepAlive();
            } else {
              backgroundTimerService.stopAudioKeepAlive();
            }
          }}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-md active:scale-95 flex-shrink-0 ${
            isBackgroundEnabled
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-950/60"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isBackgroundEnabled ? "وضع الخلفية مفعّل ✓" : "تفعيل العمل بالخلفية"}</span>
        </button>
      </div>

      {/* How it works breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>حفظ الصوت عند قفل الشاشة</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            يستخدم مسار صوتي صامت مستمر (Audio Pipeline Keep-Alive) لمنع نظام التشغيل من تجميد التطبيق.
          </p>
        </div>

        <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <BatteryCharging className="w-4 h-4" />
            <span>مؤقت غير متأثر بالتوفير</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            يعتمد على Web Worker لتشغيل الثواني بدقة حتى وإن كان المتصفح في الخلفية بدون تأخير.
          </p>
        </div>

        <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
            <BellRing className="w-4 h-4" />
            <span>إشعارات شريط الهاتف</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            تصل التذكيرات لشريط الإشعارات مباشرة حتى لو كان الهاتف في جيبك.
          </p>
        </div>

      </div>

      {/* Important Tips for Mobile */}
      <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>نصائح لضمان أفضل أداء في الخلفية بدون انقطاع:</span>
        </h4>
        <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>تثبيت التطبيق (PWA):</strong> ثبّت التطبيق على شاشتك الرئيسية ليعمل كتطبيق مستقل بنظام كامل.
          </li>
          <li>
            <strong>استثناء تحسين البطارية (أندرويد):</strong> في إعدادات الهاتف، اختر «غير مقيّد / Unrestricted» للتطبيق لضمان عدم إيقافه بعد ساعات من قفل الشاشة.
          </li>
          <li>
            <strong>ترك التطبيق في الذاكرة:</strong> لا تقم بمسح التطبيق من قائمة التطبيقات المفتوحة (Recent Apps) ليظل نشطاً دائماً.
          </li>
        </ul>
      </div>

    </div>
  );
};
