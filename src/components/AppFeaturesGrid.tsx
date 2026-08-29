import React from "react";
import {
  BookOpen,
  Library,
  Shield,
  CircleDot,
  Share2,
  Calendar,
  CheckCircle2,
  Coins,
} from "lucide-react";

interface AppFeaturesGridProps {
  onSelectFeature: (featureId: string) => void;
}

export const AppFeaturesGrid: React.FC<AppFeaturesGridProps> = ({
  onSelectFeature,
}) => {
  const features = [
    {
      id: "quran",
      title: "القرآن الكريم",
      highlight: true,
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <BookOpen className="w-5 h-5 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: "hijri",
      title: "التقويم الهجري",
      highlight: false,
      badge: "جديد",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <Calendar className="w-5 h-5 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: "prayer_tracker",
      title: "متتبع الصلوات",
      highlight: false,
      badge: "جديد",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: "zakat",
      title: "حاسبة الزكاة",
      highlight: false,
      badge: "جديد",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-amber-700">
          <Coins className="w-5 h-5 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: "azkar",
      title: "أذكار الصباح والمساء",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <Shield className="w-5 h-5 stroke-[2]" />
        </div>
      ),
    },
    {
      id: "tasbeeh",
      title: "تسبيح إلكتروني",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <CircleDot className="w-5 h-5 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: "hisn",
      title: "حصن المسلم",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <BookOpen className="w-5 h-5 stroke-[2]" />
        </div>
      ),
    },
    {
      id: "library",
      title: "مكتبة إسلامية",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <Library className="w-5 h-5 stroke-[2]" />
        </div>
      ),
    },
    {
      id: "shares",
      title: "مشاركة التطبيق",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <Share2 className="w-5 h-5 stroke-[2]" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      
      {/* Section Title */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold font-tajawal text-stone-800">
          مميزات وخدمات التطبيق
        </h3>
      </div>

      {/* Feature Buttons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5">
        {features.map((item) => (
          <button
            key={item.id}
            id={`feature-btn-${item.id}`}
            onClick={() => onSelectFeature(item.id)}
            className="group flex flex-col items-center justify-start gap-1.5 cursor-pointer transition-all duration-150 active:scale-95 text-center relative"
          >
            {/* White Squircle Card with Soft Shadow */}
            <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border flex items-center justify-center transition-all relative ${
              item.highlight
                ? "bg-emerald-50/80 border-emerald-300 shadow-emerald-900/10 ring-2 ring-emerald-600/20 group-hover:bg-emerald-100"
                : "bg-white border-stone-100/90 group-hover:border-emerald-200 group-hover:shadow-md group-hover:bg-emerald-50/40"
            }`}>
              {item.icon}

              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-bold text-[8px] font-tajawal px-1 py-0.2 rounded-full shadow leading-none ring-1 ring-white">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={`text-[10.5px] sm:text-[11px] font-bold font-tajawal leading-tight line-clamp-2 px-0.5 transition-colors ${
              item.highlight ? "text-emerald-900 font-black" : "text-stone-700 group-hover:text-emerald-900"
            }`}>
              {item.title}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};
