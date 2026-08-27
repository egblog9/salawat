import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error navigator standalone for iOS safari
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const hasDismissed = localStorage.getItem("pwa_prompt_dismissed");
    if (hasDismissed) {
      const dismissedTime = parseInt(hasDismissed, 10);
      // Wait at least 12 hours before showing again if dismissed
      if (Date.now() - dismissedTime < 12 * 60 * 60 * 1000) {
        return;
      }
    }

    // Android / Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show prompt after brief delay on iOS if not installed
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert(
          "لتثبيت التطبيق على الآيفون: اضغط على زر المشاركة (Share) أسفل الشاشة في Safari ثم اختر 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen) 📲"
        );
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("PWA install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        id="pwa-install-banner"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-[70]"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-2 border-emerald-400/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-stone-100 ring-4 ring-emerald-500/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-stone-950 shadow-md flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-sm text-stone-100 flex items-center gap-1.5 font-tajawal">
                  <span>تثبيت تطبيق صَلَوَات 📲</span>
                </h4>
                <button
                  onClick={handleDismiss}
                  aria-label="إغلاق التنبيه"
                  className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                {isIOS
                  ? "أضف صلوات لشاشتك الرئيسية لتفتحه كتطبيق مستقل وفوري 📲"
                  : "ثبّت التطبيق على جهازك لتفتحه كتطبيق رسمي بملء الشاشة مع دعم العمل بدون إنترنت."}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  id="install-pwa-action-btn"
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isIOS ? "طريقة التثبيت" : "تثبيت الآن مجاناً"}</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs transition-colors cursor-pointer"
                >
                  لاحقاً
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
