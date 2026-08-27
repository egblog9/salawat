import React, { useState } from "react";
import { SHARING_PRESETS, SHEIKH_AUDIO_TRACKS } from "../data/salawatData";
import { ReminderCard, SheikhAudioTrack } from "../types";
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Clock,
  Heart,
  Volume2,
  ExternalLink,
  Facebook,
  BookOpen,
} from "lucide-react";

interface ShareReminderProps {
  onPlaySheikhTrack: (track: SheikhAudioTrack) => void;
}

export const ShareReminder: React.FC<ShareReminderProps> = ({ onPlaySheikhTrack }) => {
  const [topic, setTopic] = useState<string>("salawat");
  const [customCard, setCustomCard] = useState<ReminderCard | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoReminderInterval, setAutoReminderInterval] = useState<number>(0);
  const [reminderTimerActive, setReminderTimerActive] = useState<boolean>(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (text: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShareTelegram = (text: string) => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      "https://www.facebook.com/share/1Bm2aq9mKm/"
    )}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShareFacebook = (text: string) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      "https://www.facebook.com/share/1Bm2aq9mKm/"
    )}&quote=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleGenerateCard = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data && data.title) {
        setCustomCard(data);
      }
    } catch (e) {
      console.error("Failed to generate custom card:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAutoReminder = (minutes: number) => {
    setAutoReminderInterval(minutes);
    if (minutes > 0) {
      setReminderTimerActive(true);
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } else {
      setReminderTimerActive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200">
                «وَتُفَكِّرُ غَيْرَكَ» — انشر الأجر وذكّر أحبابك
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              قال النبي ﷺ: «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ». شارك هذه البطاقات والنصوص المصممة مع أهلك وأصدقائك عبر الواتساب وفيسبوك وتيليجرام، لتكون لك صدقة جارية ونوراً في صحيفتك.
            </p>
          </div>

          <a
            href="https://www.facebook.com/share/1Bm2aq9mKm/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/60 transition-all flex-shrink-0 active:scale-95"
          >
            <span className="text-base font-bold">f</span>
            <span>صفحة المطور على فيسبوك</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Official Facebook Profile Feature Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-stone-900 to-emerald-950/60 border border-blue-600/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            f
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white font-amiri">
              الحساب الرسمي على فيسبوك
            </h3>
            <p className="text-xs text-stone-300">
              تابعنا لنشر التذكيرات الإسلامية اليومية ومشاركة الأجر:{" "}
              <a
                href="https://www.facebook.com/share/1Bm2aq9mKm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-mono"
              >
                facebook.com/share/1Bm2aq9mKm/
              </a>
            </p>
          </div>
        </div>

        <a
          href="https://www.facebook.com/share/1Bm2aq9mKm/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-2 flex-shrink-0"
        >
          <span>زيارة الصفحة ومتابعتها</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Ready-to-Share Presets Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base sm:text-lg text-amber-200 font-amiri flex items-center gap-2">
          <span>📬</span>
          <span>بطاقات ورسائل جاهزة للنشر السريع</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHARING_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-stone-900/80 border border-stone-800 hover:border-emerald-700/50 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-amber-200">{preset.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    #{preset.tag}
                  </span>
                </div>

                <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-3.5 my-2">
                  <p className="text-xs text-stone-200 font-amiri leading-relaxed whitespace-pre-line">
                    {preset.text}
                  </p>
                </div>
              </div>

              {/* Share actions */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => handleCopy(preset.text, preset.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  {copiedId === preset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShareWhatsApp(preset.text)}
                    className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs cursor-pointer"
                    title="مشاركة عبر واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleShareFacebook(preset.text)}
                    className="p-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs cursor-pointer"
                    title="مشاركة عبر فيسبوك"
                  >
                    <span className="font-bold text-xs">f</span>
                  </button>

                  <button
                    onClick={() => handleShareTelegram(preset.text)}
                    className="p-2 rounded-xl bg-sky-800/80 hover:bg-sky-700 text-sky-200 text-xs cursor-pointer"
                    title="مشاركة عبر تيليجرام"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Card Generator */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-amber-200 font-amiri flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>توليد بطاقة تذكير مباركة مخصصة</span>
            </h3>
            <p className="text-xs text-stone-300">
              اختر موضوع البطاقة لتوليد نص ديني متقن وحديث نبوي شريف مع صياغة مؤثرة للمشاركة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 cursor-pointer"
            >
              <option value="salawat">فضل الصلاة على النبي ﷺ</option>
              <option value="friday">بركة وفضل يوم الجمعة</option>
              <option value="relief">تفريج الهموم والكروب</option>
              <option value="healing">الشفاء والعافية بالصلاة على النبي</option>
              <option value="forgiveness">مغفرة الذنوب وتكفير السيئات</option>
            </select>

            <button
              id="generate-card-btn"
              onClick={handleGenerateCard}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isGenerating ? <span>جاري التأليف...</span> : <span>توليد بطاقة جديدة</span>}
            </button>
          </div>
        </div>

        {/* Custom Generated Card Display */}
        {customCard && (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-stone-950/90 border border-emerald-600/40 shadow-inner space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-300 text-base sm:text-lg font-amiri">
                {customCard.title}
              </h4>
              <div className="flex gap-1">
                {customCard.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800">
              <p className="font-amiri text-lg font-bold text-amber-100 leading-loose text-center">
                {customCard.salawatText}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-amiri">
              🌿 <span className="text-emerald-400 font-semibold">الفضل والأثر: </span>
              {customCard.virtue}
            </p>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(customCard.shareText, "custom-gen")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                {copiedId === "custom-gen" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "custom-gen" ? "تم نسخ النص!" : "نسخ النص للمشاركة"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsApp(customCard.shareText)}
                  className="px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-medium cursor-pointer flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </button>
                <button
                  onClick={() => handleShareFacebook(customCard.shareText)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer flex items-center gap-1"
                >
                  <span className="font-bold text-xs">f</span>
                  <span>فيسبوك</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
