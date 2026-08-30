import React, { useState } from "react";
import { Share2, Copy, Check, X, Smartphone, MessageCircle, Send, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== "undefined" ? window.location.origin : "https://salawat-app.web.app";
  };

  const shareText = `تطبيق «صَلَوَات» - الصلاة على النبي ﷺ
تطبيق إسلامي للتسبيح والتذكير الصوتي بأصوات كبار المشايخ، قابل للتثبيت على أي هاتف مجاناً وبدون إعلانات.
اجعله صدقة جارية لك ولوالديك وشاركه الآن:
${getShareUrl()}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn("Copy failed:", e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "تطبيق صلوات - الصلاة على النبي ﷺ",
          text: `تطبيق «صَلَوَات» - مسبحة إلكترونية وتذكير صوتي دوري بالصلاة على النبي ﷺ بأصوات كبار القراء. اجعله صدقة جارية:`,
          url: getShareUrl(),
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent("تطبيق «صَلَوَات» صدقة جارية - الصلاة على النبي ﷺ والتذكير الصوتي")}`;
    window.open(url, "_blank");
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-stone-900 border border-emerald-500/50 rounded-3xl p-6 shadow-2xl text-stone-100 overflow-hidden ring-1 ring-emerald-500/20"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-stone-950 border border-amber-500/40 p-1 flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
              <img
                src="/icons/icon-192.png"
                alt="شعار صلوات"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold font-tajawal text-stone-100 flex items-center gap-1.5">
                <span>مشاركة التطبيق</span>
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                اجعله صدقة جارية لك ولكل من يصلي على الحبيب ﷺ
              </p>
            </div>
          </div>

          {/* Hadith encouragement */}
          <div className="bg-stone-950/70 border border-emerald-900/50 rounded-2xl p-3.5 mb-5 text-center">
            <p className="text-xs font-amiri text-amber-200 leading-relaxed">
              «الدَّالُّ عَلَى الخَيْرِ كَفَاعِلِهِ»
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              عند مشاركة الرابط، يمكن لأي شخص تثبيت التطبيق على هاتفه فوراً وبكل سهولة.
            </p>
          </div>

          {/* Native Share / Copy Button */}
          <div className="space-y-3 mb-5">
            <button
              id="native-share-btn"
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
              <span>مشاركة سريعة عبر تطبيقات الهاتف</span>
            </button>

            <button
              id="copy-share-link-btn"
              onClick={handleCopyLink}
              className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                  : "bg-stone-800/90 hover:bg-stone-700/90 border-stone-700 text-stone-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ الرسالة ورابط التطبيق بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>نسخ الرابط والرسالة لنشرها</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Social Buttons */}
          <div>
            <span className="block text-[11px] text-stone-400 text-right mb-2">
              أو شارك مباشرة عبر:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={shareViaWhatsApp}
                className="py-2.5 px-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب</span>
              </button>

              <button
                onClick={shareViaTelegram}
                className="py-2.5 px-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-600/40 text-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>تيليجرام</span>
              </button>

              <button
                onClick={shareViaFacebook}
                className="py-2.5 px-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-600/40 text-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="font-bold text-blue-400">f</span>
                <span>فيسبوك</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-stone-200 py-1 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
