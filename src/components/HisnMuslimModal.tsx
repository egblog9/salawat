import React, { useState } from "react";
import { X, Shield, Search, Copy, Check, Share2 } from "lucide-react";

interface HisnMuslimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HisnMuslimModal: React.FC<HisnMuslimModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const duas = [
    {
      id: "h1",
      category: "الاستيقاظ والنوم",
      title: "دعاء الاستيقاظ من النوم",
      text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
      source: "صحيح البخاري",
    },
    {
      id: "h2",
      category: "تفريج الهم والكرب",
      title: "دعاء الكرب والشدائد",
      text: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.",
      source: "متفق عليه",
    },
    {
      id: "h3",
      category: "دخول وخروج المسجد",
      title: "دعاء دخول المسجد",
      text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ.",
      source: "صحيح مسلم",
    },
    {
      id: "h4",
      category: "السفر والمواصلات",
      title: "دعاء ركوب الدابة والسفر",
      text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.",
      source: "صحيح مسلم",
    },
    {
      id: "h5",
      category: "قضاء الدين والرزق",
      title: "دعاء قضاء الدين وتفريج الفقر",
      text: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.",
      source: "سنن الترمذي",
    },
    {
      id: "h6",
      category: "الاستخارة والحيرة",
      title: "دعاء صلاة الاستخارة",
      text: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ.",
      source: "صحيح البخاري",
    },
  ];

  const filtered = duas.filter(
    (d) =>
      d.title.includes(searchQuery) ||
      d.text.includes(searchQuery) ||
      d.category.includes(searchQuery)
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[34px] sm:rounded-[34px] max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold font-tajawal text-stone-800 flex items-center justify-center gap-1.5">
              <span>حصن المسلم</span>
              <Shield className="w-4 h-4 text-emerald-800" />
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              أدعية وأذكار اليوم والليلة من السنة الصحيحة
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b border-stone-100">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن دعاء (كرب، سفر، رزق، نوم...)"
              className="w-full py-2.5 pr-10 pl-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-tajawal text-stone-800 placeholder:text-stone-400 outline-none focus:border-emerald-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
          </div>
        </div>

        {/* Duas List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {d.category}
                </span>

                <button
                  onClick={() => handleCopy(d.id, `${d.title}\n${d.text}\n(${d.source})`)}
                  className="flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-emerald-800 p-1 cursor-pointer"
                >
                  {copiedId === d.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الدعاء</span>
                    </>
                  )}
                </button>
              </div>

              <h4 className="text-sm font-bold font-tajawal text-stone-900">
                {d.title}
              </h4>

              <p className="text-sm sm:text-base font-amiri font-bold text-stone-800 leading-relaxed text-right bg-stone-50/60 p-3 rounded-xl border border-stone-100">
                {d.text}
              </p>

              <span className="text-[10.5px] text-stone-400 font-amiri text-left">
                {d.source}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
