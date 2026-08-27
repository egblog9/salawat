import React, { useState, useEffect } from "react";
import { Download, X, CheckCircle, Apple, Chrome, Share, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          onInstalled?.();
          onClose();
        }
      } catch (e) {
        console.warn("Installation prompt error:", e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-stone-100 overflow-hidden"
        >
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
              <h3 className="text-xl font-bold font-tajawal text-stone-100">
                تثبيت تطبيق صَلَوَات
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                تطبيق ويب تقدمي (PWA) سريع وخفيف
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-stone-950/60 rounded-2xl p-3.5 border border-stone-800/80 mb-5 space-y-2 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>يعمل كأيقونة تطبيق مباشر على شاشة هاتفك.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>يفتح بملء الشاشة وبدون شريط المتصفح (Standalone).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>تسبيح سريع ووصول للتذكير الصوتي حتى بدون إنترنت.</span>
            </div>
          </div>

          {/* Platform Specific Instructions or Direct Button */}
          {deferredPrompt ? (
            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-600 hover:from-emerald-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>تثبيت التطبيق على جهازك الآن</span>
            </button>
          ) : isIOS ? (
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-right space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Apple className="w-4 h-4" />
                <span>خطوات التثبيت على آيفون / آيباد (iOS):</span>
              </div>
              <ol className="text-xs text-stone-300 space-y-2 list-decimal list-inside pr-1 leading-relaxed">
                <li>
                  اضغط على زر المشاركة <Share className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> في أسفل المتصفح (Safari).
                </li>
                <li>
                  اختر <strong className="text-stone-100">«إضافة إلى الشاشة الرئيسية»</strong> (Add to Home Screen) <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-amber-400" />.
                </li>
                <li>اضغط على <strong className="text-emerald-400">«إضافة» (Add)</strong> في الزاوية العلوية.</li>
              </ol>
            </div>
          ) : (
            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 text-right space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Chrome className="w-4 h-4" />
                <span>طريقة التثبيت من المتصفح:</span>
              </div>
              <p>
                اضغط على قائمة خيارات المتصفح (⋮) في الأعلى أو شريط العنوان، ثم اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
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
