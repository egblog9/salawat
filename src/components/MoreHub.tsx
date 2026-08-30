import React, { useState } from "react";
import { ShareReminder } from "./ShareReminder";
import { FajrAlarmCard } from "./FajrAlarmCard";
import { BackgroundModeCard } from "./BackgroundModeCard";
import { SheikhAudioTrack } from "../types";
import {
  AlarmClock,
  Radio,
  Share2,
  Download,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  MessageCircleQuestion,
  Zap,
  CheckCircle2,
  BookmarkCheck,
  Smartphone,
} from "lucide-react";

interface MoreHubProps {
  onPlaySheikhTrack: (track: SheikhAudioTrack) => void;
  onOpenShareModal?: () => void;
  isStandalone?: boolean;
  
  // Fajr Alarm Props
  fajrAlarmEnabled: boolean;
  fajrAlarmTime: string;
  fajrChallengeType: "math" | "tasbeeh" | "order";
  fajrDifficulty: "easy" | "medium" | "hard";
  fajrSoundType: "adhan" | "intense_alarm" | "adhan_and_siren";
  onToggleFajrAlarm: (enabled: boolean) => void;
  onChangeFajrTime: (time: string) => void;
  onChangeFajrChallengeType: (type: "math" | "tasbeeh" | "order") => void;
  onChangeFajrDifficulty: (diff: "easy" | "medium" | "hard") => void;
  onChangeFajrSoundType: (sound: "adhan" | "intense_alarm" | "adhan_and_siren") => void;
  onTriggerTestAlarm: () => void;

  // Background Audio Mode Props
  isBackgroundEnabled: boolean;
  onToggleBackground: (enabled: boolean) => void;
}

export const MoreHub: React.FC<MoreHubProps> = ({
  onPlaySheikhTrack,
  onOpenShareModal,
  isStandalone,
  fajrAlarmEnabled,
  fajrAlarmTime,
  fajrChallengeType,
  fajrDifficulty,
  fajrSoundType,
  onToggleFajrAlarm,
  onChangeFajrTime,
  onChangeFajrChallengeType,
  onChangeFajrDifficulty,
  onChangeFajrSoundType,
  onTriggerTestAlarm,
  isBackgroundEnabled,
  onToggleBackground,
}) => {
  // Active expanded item in the vertical app menu ("fajr" | "background" | "share" | "install" | "roadmap" | "about")
  const [expandedSection, setExpandedSection] = useState<string | null>("fajr");

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const futureFeatures = [
    {
      title: "ختمات الصلاة على النبي التشاركية",
      desc: "عداد جماعي إسلامي يجمع المسلمين من كل مكان لتحقيق ختمة مليون صلاة على الحبيب ﷺ معاً.",
      icon: "ختمة",
      status: "قيد التطوير",
    },
    {
      title: "أذكار الصباح والمساء المسموعة",
      desc: "باقة صوتية مسندة لأذكار اليوم والليلة بأصوات ندية وهادئة لتشغيلها تلقائياً.",
      icon: "أذكار",
      status: "مخطط لها",
    },
    {
      title: "منبه قيام الليل والثلث الأخير",
      desc: "تنبيه لطيف قبل الفجر بالصلاة على النبي والاستغفار في وقت النزول الإلهي المبارك.",
      icon: "قيام",
      status: "مخطط لها",
    },
    {
      title: "سجل الأوراد والإحصائيات المتقدمة",
      desc: "متابعة أسبوعية وشهرية لعدد الصلوات على النبي ﷺ مع إحصائيات تحفيزية للاستمرار.",
      icon: "إحصائيات",
      status: "مخطط لها",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200">
                قائمة مميزات وأدوات التطبيق (المزيد)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              تحكم في منبه الفجر الذكي، وضع استمرار الصوت في الخلفية، بطاقات النشر والصدقة الجارية، ومميزات التطبيق المتقدمة مرتبة رأسياً لسهولة الوصول.
            </p>
          </div>

          <a
            href="https://www.facebook.com/share/1Bm2aq9mKm/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/60 transition-all flex-shrink-0 active:scale-95"
          >
            <span className="text-sm font-bold">f</span>
            <span>صفحة الفيسبوك</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Vertical Application Menu Items (تحت بعض كقائمة تطبيق جانبية) */}
      <div className="space-y-3.5">
        
        {/* ITEM 1: FAJR LOUD SMART ALARM */}
        <div className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection("fajr")}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer select-none transition-colors hover:bg-stone-800/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-stone-950 flex items-center justify-center shadow-md flex-shrink-0">
                <AlarmClock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-100">
                    منبه الفجر الذكي الخارق (صعب الإغلاق)
                  </h3>
                  {fajrAlarmEnabled ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40">
                      مفعّل على {fajrAlarmTime} ⏰
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      معطّل
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    جديد
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  صوت مرتفع جداً + رفع تلقائي للصوت + لا يتوقف إلا بعد حل مسألة حسابية أو لغز
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 hidden sm:inline-block font-medium">
                {expandedSection === "fajr" ? "إخفاء الإعدادات" : "فتح الإعدادات"}
              </span>
              <div className={`w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 transition-transform ${expandedSection === "fajr" ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Content for Fajr Alarm */}
          {expandedSection === "fajr" && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950/40 animate-in fade-in duration-200">
              <FajrAlarmCard
                alarmEnabled={fajrAlarmEnabled}
                alarmTime={fajrAlarmTime}
                challengeType={fajrChallengeType}
                difficulty={fajrDifficulty}
                soundType={fajrSoundType}
                onToggleEnabled={onToggleFajrAlarm}
                onChangeTime={onChangeFajrTime}
                onChangeChallengeType={onChangeFajrChallengeType}
                onChangeDifficulty={onChangeFajrDifficulty}
                onChangeSoundType={onChangeFajrSoundType}
                onTriggerTestAlarm={onTriggerTestAlarm}
              />
            </div>
          )}
        </div>

        {/* ITEM 2: BACKGROUND AUDIO & WAKELOCK MODE */}
        <div className="bg-stone-900/90 border border-stone-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection("background")}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer select-none transition-colors hover:bg-stone-800/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-stone-950 flex items-center justify-center shadow-md flex-shrink-0">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-100">
                    وضع العمل في الخلفية وقفل الشاشة
                  </h3>
                  {isBackgroundEnabled ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>نشط الآن</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      متوقف
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  حفظ استمرار التذكير الصوتي والأذكار عند مغادرة التطبيق أو إطفاء الشاشة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 hidden sm:inline-block font-medium">
                {expandedSection === "background" ? "إخفاء التفاصيل" : "عرض وإعداد"}
              </span>
              <div className={`w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 transition-transform ${expandedSection === "background" ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Content for Background Audio */}
          {expandedSection === "background" && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950/40 animate-in fade-in duration-200">
              <BackgroundModeCard
                isBackgroundEnabled={isBackgroundEnabled}
                onToggleBackground={onToggleBackground}
              />
            </div>
          )}
        </div>

        {/* ITEM 3: SHARE & POSTERS HUB (انشر تؤجر) */}
        <div className="bg-stone-900/90 border border-stone-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection("share")}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer select-none transition-colors hover:bg-stone-800/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 text-stone-950 flex items-center justify-center shadow-md flex-shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-100">
                    انشر تؤجر (بطاقات ومشاركة الصدقة الجارية)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    صدقة جارية
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  توليد بطاقات دعوية مخصصة ومشاركة رسائل الصلاة على النبي عبر واتساب وفيسبوك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 hidden sm:inline-block font-medium">
                {expandedSection === "share" ? "إخفاء البطاقات" : "فتح البطاقات"}
              </span>
              <div className={`w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 transition-transform ${expandedSection === "share" ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Content for Sharing */}
          {expandedSection === "share" && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950/40 animate-in fade-in duration-200">
              <ShareReminder onPlaySheikhTrack={onPlaySheikhTrack} />
            </div>
          )}
        </div>

        {/* ITEM 4: ROADMAP & FEATURE SUGGESTIONS */}
        <div className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection("roadmap")}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer select-none transition-colors hover:bg-stone-800/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-md flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-100">
                    المميزات القادمة والمقترحات
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                    قيد التطوير
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  خريطة تطوير التطبيق (الختمات التشاركية، أذكار الصباح والمساء، منبه الثلث الأخير)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 hidden sm:inline-block font-medium">
                {expandedSection === "roadmap" ? "إخفاء الخطة" : "عرض الخريطة"}
              </span>
              <div className={`w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 transition-transform ${expandedSection === "roadmap" ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Content for Roadmap */}
          {expandedSection === "roadmap" && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950/40 animate-in fade-in duration-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {futureFeatures.map((item, index) => (
                  <div
                    key={index}
                    className="bg-stone-950/80 border border-stone-800 hover:border-emerald-700/40 rounded-2xl p-4.5 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <h4 className="font-bold text-sm text-stone-100 font-tajawal">
                            {item.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-300">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed font-tajawal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestion CTA Box */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-stone-950 to-stone-900 border border-emerald-600/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <MessageCircleQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-200">
                      هل لديك فكرة أو ميزة ترغب بإضافتها؟
                    </h4>
                    <p className="text-xs text-stone-400">
                      تواصل معنا مباشرة عبر صفحة الفيسبوك واقترح ما ترغب به لتطوير التطبيق وخدمة المسلمين.
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.facebook.com/share/1Bm2aq9mKm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <span>إرسال اقتراحك</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ITEM 5: ABOUT APP & CHARITY */}
        <div className="bg-stone-900/90 border border-stone-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection("about")}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right cursor-pointer select-none transition-colors hover:bg-stone-800/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-100">
                    عن التطبيق والصدقة الجارية
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40">
                    وقف خالص لوجه الله
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  تطبيق مجاني 100% بدون إعلانات، صدقة جارية لكل من صلى وشارك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-teal-300 hidden sm:inline-block font-medium">
                {expandedSection === "about" ? "إخفاء التفاصيل" : "عرض النبذة"}
              </span>
              <div className={`w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 transition-transform ${expandedSection === "about" ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Content for About */}
          {expandedSection === "about" && (
            <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-950/40 animate-in fade-in duration-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>صدقة جارية وخالصة</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    هذا الموقع والتطبيق صدقة جارية لكل من ساهم في برمجته، ونشره، واستخدامه للصلاة على النبي ﷺ.
                  </p>
                </div>

                <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>بدون إعلانات ومجاني 100%</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    التطبيق لا يحتوي على أي إعلانات تجارية ولا يطلب أي بيانات خاصة، ليكون خالصاً لوجه الله تعالى.
                  </p>
                </div>

                <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 font-bold">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>أصوات وأحاديث موثوقة</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    التسجيلات بأصوات كبار قراء الحرم المكي الشريف ومشاهير الشيوخ، مع تخريج الأحاديث بدقة.
                  </p>
                </div>
              </div>

              {/* Prophet's Hadith Highlight */}
              <div className="bg-stone-950/90 border border-amber-500/30 rounded-2xl p-5 text-center">
                <p className="font-amiri text-base sm:text-lg text-amber-100 leading-loose">
                  «أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً»
                </p>
                <span className="text-[11px] text-stone-400 block mt-1">
                  رواه الترمذي وحسنه
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
