import React, { useState } from "react";
import {
  X,
  CircleDot,
  Sliders,
  Bell,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  Layout,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Smartphone,
  Eye,
} from "lucide-react";
import {
  FloatingDhikrConfig,
  BUILTIN_FLOATING_DHIKR_LIST,
} from "./FloatingGlassDhikr";

interface FloatingDhikrSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FloatingDhikrConfig;
  onChangeConfig: (newConfig: FloatingDhikrConfig) => void;
  onTestTrigger: () => void;
}

export const FloatingDhikrSettingsModal: React.FC<FloatingDhikrSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onTestTrigger,
}) => {
  const [newCustomDhikr, setNewCustomDhikr] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleEnabled = () => {
    onChangeConfig({ ...config, enabled: !config.enabled });
  };

  const handleIntervalChange = (mins: number) => {
    onChangeConfig({ ...config, intervalMinutes: mins });
  };

  const handleSizeChange = (size: "sm" | "md" | "lg") => {
    onChangeConfig({ ...config, frameSize: size });
  };

  const handlePositionChange = (pos: "top" | "center" | "bottom") => {
    onChangeConfig({ ...config, position: pos });
  };

  const handleToggleSound = () => {
    onChangeConfig({ ...config, playSound: !config.playSound });
  };

  const handleAddCustomDhikr = () => {
    if (!newCustomDhikr.trim()) return;
    const currentList = config.customDhikrs || [];
    onChangeConfig({
      ...config,
      customDhikrs: [...currentList, newCustomDhikr.trim()],
    });
    setNewCustomDhikr("");
    setIsAdding(false);
  };

  const handleRemoveCustomDhikr = (idx: number) => {
    const currentList = config.customDhikrs || [];
    const updated = currentList.filter((_, i) => i !== idx);
    onChangeConfig({ ...config, customDhikrs: updated });
  };

  const intervals = [
    { label: "كل 30 ثانية (سريع)", value: 0.5 },
    { label: "كل دقيقة", value: 1 },
    { label: "كل 2 دقيقة", value: 2 },
    { label: "كل 3 دقائق", value: 3 },
    { label: "كل 5 دقائق (مستحسن)", value: 5 },
    { label: "كل 10 دقائق", value: 10 },
    { label: "كل 15 دقيقة", value: 15 },
    { label: "كل 30 دقيقة", value: 30 },
  ];

  return (
    <div
      id="floating-dhikr-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
    >
      <div className="bg-[#FAF9F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-teal-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-tajawal text-white flex items-center gap-2">
                <span>الإشعار العائم الزجاجي للأذكار</span>
                <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                  جديد
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90 font-amiri">
                يظهر ذكراً مباركاً 5 ثوانٍ، وبلمسه يُحتسب لك كتسبيحة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Main Activation Card */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold font-tajawal text-stone-900 block">
                تفعيل الإشعار العائم الزجاجي
              </span>
              <p className="text-xs text-stone-500 font-amiri">
                ظهور دوري للأذكار مع خلفية زجاجية شفافة أنيقة
              </p>
            </div>

            <button
              onClick={handleToggleEnabled}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-200 cursor-pointer ${
                config.enabled ? "bg-emerald-600 shadow-inner" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-200 ${
                  config.enabled ? "translate-x-0" : "-translate-x-6"
                }`}
              />
            </button>
          </div>

          {/* Quick Test Trigger Button */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-700" />
              <div>
                <h4 className="text-xs font-bold font-tajawal text-emerald-950">
                  معاينة الإشعار فوراً
                </h4>
                <p className="text-[11px] text-emerald-800 font-tajawal">
                  اختبر ظهور الإطار واللمس واحتساب التسبيحة
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onTestTrigger();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-tajawal transition-all active:scale-95 shadow cursor-pointer"
            >
              تجربة الآن
            </button>
          </div>

          {/* 1. Glass Frame Size Selector */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-emerald-700" />
              <span>حجم الإطار الزجاجي (Frame Size):</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sm", label: "صغير (مدمج)", desc: "عرض خفيف" },
                { id: "md", label: "متوسط (مثالي)", desc: "متوازن" },
                { id: "lg", label: "كبير (بارز)", desc: "نص عريض" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSizeChange(s.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    config.frameSize === s.id
                      ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/20 font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xs font-tajawal block">{s.label}</span>
                  <span className="text-[10px] text-stone-400 font-tajawal mt-0.5 block">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Repetition Interval */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>معدل الظهور والتكرار:</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {intervals.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleIntervalChange(item.value)}
                  className={`p-2 rounded-xl border text-xs font-tajawal transition-all cursor-pointer ${
                    config.intervalMinutes === item.value
                      ? "bg-amber-50 border-amber-600 text-amber-950 ring-2 ring-amber-500/20 font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Screen Position */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-teal-600" />
              <span>موضع الظهور على الشاشة:</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "top", label: "أعلى الشاشة" },
                { id: "center", label: "منتصف الشاشة" },
                { id: "bottom", label: "أسفل الشاشة" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePositionChange(p.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-tajawal transition-all cursor-pointer ${
                    config.position === p.id
                      ? "bg-teal-50 border-teal-600 text-teal-950 ring-2 ring-teal-500/20 font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Audio Feedback Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {config.playSound ? (
                <Volume2 className="w-5 h-5 text-emerald-700" />
              ) : (
                <VolumeX className="w-5 h-5 text-stone-400" />
              )}
              <div>
                <span className="text-xs font-bold font-tajawal text-stone-800 block">
                  نغمة تسبيح رقيقة عند اللمس
                </span>
                <p className="text-[11px] text-stone-500 font-tajawal">
                  تأكيد صوتي وارتجاج هادئ عند تسجيل التسبيحة
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={config.playSound}
              onChange={handleToggleSound}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* 5. Custom Dhikr Bank */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
                <CircleDot className="w-4 h-4 text-emerald-700" />
                <span>أذكار مخصصة ترغب بإضافتها:</span>
              </h4>

              <button
                onClick={() => setIsAdding(!isAdding)}
                className="text-xs text-emerald-700 font-bold font-tajawal flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة ذكر جديد</span>
              </button>
            </div>

            {isAdding && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <input
                  type="text"
                  placeholder="اكتب الذكر (مثلاً: ربي اغفر لي ولوالدي)..."
                  value={newCustomDhikr}
                  onChange={(e) => setNewCustomDhikr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-amiri text-stone-900"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 rounded-lg text-stone-500 text-xs hover:bg-stone-200"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddCustomDhikr}
                    className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold"
                  >
                    حفظ الذكر
                  </button>
                </div>
              </div>
            )}

            {/* Custom List */}
            {config.customDhikrs && config.customDhikrs.length > 0 ? (
              <div className="space-y-1.5">
                {config.customDhikrs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-amiri"
                  >
                    <span className="text-stone-800">{item}</span>
                    <button
                      onClick={() => handleRemoveCustomDhikr(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 font-tajawal">
                يحتوي التطبيق على أكثر من 13 ذكراً صحيحاً مأثوراً تظهر تلقائياً.
              </p>
            )}
          </div>

          {/* Background Running Notice */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 text-xs font-tajawal text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-900">
              <Smartphone className="w-4 h-4" />
              <span>ملاحظة الظهور حتى خارج التطبيق:</span>
            </span>
            <p className="text-[11px] text-stone-600 font-amiri leading-relaxed">
              عند السماح بإشعارات النظام (Web Notifications)، ستصلك الأذكار كإشعارات نظام عائمة على الشاشة حتى لو كان التطبيق مغلقاً في الخلفية، وبمجرد لمسها ستسجل لك حسنة في ميزانك.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onTestTrigger();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold font-tajawal cursor-pointer"
          >
            معاينة 5 ثوانٍ
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-tajawal cursor-pointer transition-all active:scale-95 shadow"
          >
            تم والحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
