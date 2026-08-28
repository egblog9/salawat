import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { VIRTUES_LIST } from "../data/salawatData";

interface ProphetHadithBannerProps {
  onOpenAllHadiths?: () => void;
}

export const ProphetHadithBanner: React.FC<ProphetHadithBannerProps> = ({
  onOpenAllHadiths,
}) => {
  const [hadithIndex, setHadithIndex] = useState(0);

  const hadiths = [
    {
      text: "”من صلى عليّ واحدة صلى الله عليه بها عشراً“",
      narrator: "رواه مسلم",
    },
    {
      text: "”أولى الناس بي يوم القيامة أكثرهم عليّ صلاة“",
      narrator: "رواه الترمذي",
    },
    {
      text: "”إذا صليتم عليّ فسلوا لي الوسيلة فإنها منزلة في الجنة“",
      narrator: "صحيح مسلم",
    },
    {
      text: "”البخيل من ذُكرت عنده فلم يُصلِّ عليّ“",
      narrator: "رواه الترمذي",
    },
    {
      text: "”أكثروا عليّ من الصلاة يوم الجمعة وليلة الجمعة“",
      narrator: "رواه البيهقي",
    },
  ];

  const currentHadith = hadiths[hadithIndex];

  const handleNextHadith = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHadithIndex((prev) => (prev + 1) % hadiths.length);
  };

  return (
    <div
      onClick={onOpenAllHadiths}
      className="w-full bg-[#F3F6F3] rounded-[26px] p-4 border border-[#E3ECE3] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#EEF3EE] transition-all select-none group"
    >
      {/* Left: Narrator and Chevron */}
      <button
        onClick={handleNextHadith}
        className="flex items-center gap-1 text-[11px] font-bold font-tajawal text-emerald-900 group-hover:text-emerald-950 flex-shrink-0 transition-colors cursor-pointer py-1"
        title="عرض حديث آخر"
      >
        <ChevronLeft className="w-4 h-4 text-emerald-800 transition-transform group-hover:-translate-x-0.5" />
        <span>{currentHadith.narrator}</span>
      </button>

      {/* Center: Title & Hadith Quotation */}
      <div className="flex-1 text-right">
        <span className="text-[11px] font-bold text-stone-500 font-tajawal block mb-0.5">
          حديث نبوي
        </span>
        <p className="text-xs sm:text-sm font-amiri font-bold text-stone-800 leading-relaxed">
          {currentHadith.text}
        </p>
      </div>

      {/* Right: Circular Forest Green Calligraphy Emblem "محمد ﷺ" */}
      <div className="w-13 h-13 rounded-full bg-[#2F5241] text-white flex items-center justify-center font-amiri font-bold text-base shadow-sm flex-shrink-0 border-2 border-white/60">
        <div className="text-center leading-none">
          <span className="text-sm">محمد</span>
          <span className="text-[9px] block text-emerald-200">ﷺ</span>
        </div>
      </div>

    </div>
  );
};
