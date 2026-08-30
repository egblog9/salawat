import React, { useState } from "react";
import { ArrowRight, Shield, Search, Copy, Check, Share2, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { HISN_MUSLIM_DATA, HISN_CATEGORIES, HisnItem } from "../data/hisnMuslimData";

interface HisnMuslimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HisnMuslimModal: React.FC<HisnMuslimModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  if (!isOpen) return null;

  const filtered = HISN_MUSLIM_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.includes(searchQuery) ||
      item.arabicText.includes(searchQuery) ||
      item.categoryName.includes(searchQuery) ||
      (item.virtue && item.virtue.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleIncrement = (id: string, target: number) => {
    const current = counts[id] || 0;
    if (current < target) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(25);
      }
      setCounts((prev) => ({ ...prev, [id]: current + 1 }));
    }
  };

  const handleReset = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (item: HisnItem) => {
    const textToCopy = `${item.title}\n\n${item.arabicText}\n\n${item.virtue ? `الفضل: ${item.virtue}\n` : ""}المصدر: ${item.source} (حصن المسلم)\n\nتطبيق الصلاة والقرآن: https://www.facebook.com/share/1Bm2aq9mKm/`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (item: HisnItem) => {
    const shareData = {
      title: item.title,
      text: `${item.title}\n\n${item.arabicText}\n\nالمصدر: ${item.source} (حصن المسلم)`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopy(item);
    }
  };

  return (
    <div
      id="hisn-muslim-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Standard Full-Page Header */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-3.5 py-3 sm:px-6 sticky top-0 z-30 shadow-md border-b border-emerald-800/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            title="رجوع للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-tajawal text-white truncate">
                حصن المسلم من أذكار الكتاب والسنة
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40 whitespace-nowrap flex-shrink-0">
                {HISN_MUSLIM_DATA.length} دعاء وذكر
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-amiri truncate">
              أدعية وأذكار اليوم والليلة محققة وموثقة من صحيح السنة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* Search & Category Filter Bar */}
      <div className="bg-white border-b border-stone-200 p-3 sm:p-4 space-y-2.5 shadow-sm">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن دعاء بالاسم أو النص أو المناسبة أو الفضل..."
            className="w-full py-2.5 pr-10 pl-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-tajawal text-stone-800 placeholder:text-stone-400 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {HISN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#2F5241] text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full Page Content List */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-16">
          {filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
              <Shield className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-stone-600 font-bold font-tajawal text-sm">
                لم يتم العثور على أذكار مطابقة لبحثك
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold font-tajawal"
              >
                عرض جميع الأذكار
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const current = counts[item.id] || 0;
              const isCompleted = current >= item.count;

              return (
                <div
                  key={item.id}
                  onClick={() => handleIncrement(item.id, item.count)}
                  className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer select-none relative overflow-hidden shadow-sm ${
                    isCompleted
                      ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400"
                      : "border-stone-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full font-tajawal">
                      {item.categoryName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold font-tajawal bg-emerald-100/80 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اكتمل التكرار</span>
                        </span>
                      )}

                      {item.count > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset(item.id);
                          }}
                          className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                          title="إعادة ضبط العداد"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item);
                        }}
                        className="text-stone-400 hover:text-emerald-700 p-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                        title="نسخ الدعاء"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(item);
                        }}
                        className="text-stone-400 hover:text-emerald-700 p-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                        title="مشاركة"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-tajawal text-stone-900 mt-1">
                    {item.title}
                  </h3>

                  <p className="text-base sm:text-lg font-amiri font-bold text-stone-800 leading-relaxed text-right my-3 p-4 bg-[#FDFBF7] rounded-2xl border border-stone-100 shadow-inner">
                    {item.arabicText}
                  </p>

                  {item.virtue && (
                    <div className="bg-emerald-50/70 border border-emerald-100/80 p-2.5 rounded-xl text-xs text-emerald-950 font-amiri leading-relaxed mb-2.5 flex items-start gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold font-tajawal text-emerald-900 ml-1">
                          الفضل والبركة:
                        </span>
                        <span>{item.virtue}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 text-xs">
                    <span className="text-[11.5px] text-stone-400 font-amiri">
                      المصدر: {item.source}
                    </span>

                    {/* Interactive Count Button */}
                    <div
                      className={`px-3.5 py-1.5 rounded-2xl font-bold text-xs font-tajawal shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 ${
                        isCompleted
                          ? "bg-emerald-700 text-white"
                          : "bg-[#2F5241] text-white"
                      }`}
                    >
                      <span>التكرار:</span>
                      <span className="font-mono">
                        {current} / {item.count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
