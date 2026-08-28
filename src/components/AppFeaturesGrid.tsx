import React from "react";
import {
  BookOpen,
  Library,
  Shield,
  CircleDot,
  Share2,
} from "lucide-react";

interface AppFeaturesGridProps {
  onSelectFeature: (featureId: string) => void;
}

export const AppFeaturesGrid: React.FC<AppFeaturesGridProps> = ({
  onSelectFeature,
}) => {
  const features = [
    {
      id: "azkar",
      title: "أذكار الصباح والمساء",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center text-emerald-800">
          <BookOpen className="w-5 h-5 stroke-[2]" />
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
          <Shield className="w-5 h-5 stroke-[2]" />
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
      title: "مشاركة",
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
          مميزات التطبيق
        </h3>
      </div>

      {/* 5 Squircle Feature Buttons Row */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {features.map((item) => (
          <button
            key={item.id}
            id={`feature-btn-${item.id}`}
            onClick={() => onSelectFeature(item.id)}
            className="group flex flex-col items-center justify-start gap-2 cursor-pointer transition-all duration-150 active:scale-95 text-center"
          >
            {/* White Squircle Card with Soft Shadow */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-stone-100/90 flex items-center justify-center transition-all group-hover:border-emerald-200 group-hover:shadow-md group-hover:bg-emerald-50/40">
              {item.icon}
            </div>

            {/* Label */}
            <span className="text-[10.5px] sm:text-[11px] font-bold font-tajawal text-stone-700 leading-tight line-clamp-2 px-0.5 group-hover:text-emerald-900 transition-colors">
              {item.title}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};
