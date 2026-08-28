import React, { useState } from "react";
import { Heart } from "lucide-react";
import mosqueBannerImg from "../assets/images/green_dome_banner_1787914843915.jpg";

interface SalawatHeroCardProps {
  count?: number;
  counter?: number;
  onIncrement: () => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
  onOpenSettings?: () => void;
}

export const SalawatHeroCard: React.FC<SalawatHeroCardProps> = ({
  count,
  counter,
  onIncrement,
  isLiked = false,
  onToggleLike,
  onOpenSettings,
}) => {
  const currentCount = typeof count === "number" ? count : typeof counter === "number" ? counter : 0;
  const [isPressing, setIsPressing] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const handlePress = () => {
    setIsPressing(true);
    setShowBurst(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(30);
    }
    onIncrement();
    setTimeout(() => setIsPressing(false), 150);
    setTimeout(() => setShowBurst(false), 500);
  };

  return (
    <div className="relative w-full rounded-[30px] overflow-hidden shadow-[0_8px_30px_rgba(27,67,49,0.15)] bg-gradient-to-bl from-[#355B48] via-[#2A4D3C] to-[#1C382B] text-white p-5 sm:p-6 min-h-[230px] flex flex-col justify-between select-none">
      
      {/* Mosque Background Artwork with Smooth Fade */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
        <img
          src={mosqueBannerImg}
          alt="المسجد النبوي الشريف"
          className="w-full h-full object-cover object-left-bottom"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Subtle Islamic Geometric Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Top Banner Text */}
      <div className="relative z-10 w-full text-center">
        <h2 className="text-xl sm:text-2xl font-bold font-amiri tracking-wide text-stone-100 drop-shadow-sm">
          اللهم صلّ وسلم على نبينا محمد ﷺ
        </h2>
      </div>

      {/* Center Interactive Counter Pill & Heart Button */}
      <div className="relative z-10 w-full flex items-center justify-center gap-3 my-auto py-2">
        
        {/* Floating White Counter Pill (Clickable Tap Target) */}
        <button
          id="hero-salawat-counter-btn"
          onClick={handlePress}
          className={`group bg-white rounded-[26px] px-8 py-3.5 shadow-xl shadow-stone-950/20 text-center flex flex-col items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 border border-stone-100 ${
            isPressing ? "scale-95 ring-4 ring-emerald-400/40" : "hover:scale-102"
          }`}
          title="اضغط للصلاة على النبي ﷺ"
        >
          {/* Animated Big Number */}
          <span className="text-4xl sm:text-5xl font-black font-tajawal text-[#213D2F] tracking-tight leading-none drop-shadow-sm transition-transform group-hover:scale-105">
            {(currentCount ?? 0).toLocaleString()}
          </span>

          {/* Subtext */}
          <div className="flex items-center gap-1.5 mt-1 text-[#3B6350] font-bold text-xs sm:text-sm font-tajawal">
            <span>صلّ الآن</span>
          </div>
        </button>

        {/* Floating Heart / Streak Action Button */}
        <button
          id="hero-heart-btn"
          onClick={onToggleLike}
          className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 border shadow-md ${
            isLiked
              ? "bg-rose-500/90 text-white border-rose-400/50 shadow-rose-900/30"
              : "bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
          }`}
          title={isLiked ? "تم حفظ الورد اليومي" : "إضافة إلى وردك اليومي"}
        >
          <Heart className={`w-6 h-6 ${isLiked ? "fill-white text-white scale-110" : "text-white"}`} />
        </button>

      </div>

      {/* Bottom Subtle Corner Badge */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-300 font-amiri px-1">
        <span className="opacity-90">«أَقْرَبُكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَكْثَرُكُمْ عَلَيَّ صَلَاةً»</span>
      </div>

    </div>
  );
};
