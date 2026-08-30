import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  BookOpen,
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Bookmark,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Heart,
  Type,
} from "lucide-react";
import {
  AUTHENTIC_HADITHS_DATA,
  AUTHENTIC_HADITHS_CATEGORIES,
  AuthenticHadith,
} from "../data/authenticHadithsData";

interface HadithModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HadithModal: React.FC<HadithModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  
  // Font Size setting
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("hadith_font_size") || "20", 10);
    } catch (e) {
      return 20;
    }
  });

  // Favorites in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("hadith_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hadith_favorites", JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Hadiths
  const filteredHadiths = useMemo(() => {
    return AUTHENTIC_HADITHS_DATA.filter((item) => {
      if (onlyFavorites && !favorites.includes(item.id)) {
        return false;
      }

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.arabicText.toLowerCase().includes(q) ||
        item.rawi.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.benefit.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery, onlyFavorites, favorites]);

  if (!isOpen) return null;

  const handleCopy = (hadith: AuthenticHadith) => {
    const textToCopy = `${hadith.title}\n\nقال رسول الله ﷺ: ${hadith.arabicText}\n\n(${hadith.rawi} - ${hadith.source} ${hadith.hadithNumber})\n\nالفائدة: ${hadith.benefit}\n\nتطبيق صلوات`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (hadith: AuthenticHadith) => {
    const shareData = {
      title: hadith.title,
      text: `${hadith.title}\n\nقال رسول الله ﷺ: ${hadith.arabicText}\n\n(${hadith.rawi} - ${hadith.source})`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      handleCopy(hadith);
    }
  };

  const handleSpeak = (hadith: AuthenticHadith) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === hadith.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = hadith.arabicText.replace(/[«»]/g, "");
    const utterance = new SpeechSynthesisUtterance(`قال رسول الله صلى الله عليه وسلم: ${cleanText}`);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(hadith.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleRandomHadith = () => {
    const randomIdx = Math.floor(Math.random() * AUTHENTIC_HADITHS_DATA.length);
    const item = AUTHENTIC_HADITHS_DATA[randomIdx];
    setSelectedCategory("all");
    setOnlyFavorites(false);
    setSearchQuery(item.title);
  };

  return (
    <div
      id="hadith-encyclopedia-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden font-tajawal animate-in fade-in duration-200 select-none text-stone-900"
    >
      {/* 1. Standard Full-Page Top Bar Navigation */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-3.5 py-3 sm:px-6 sticky top-0 z-30 shadow-md border-b border-emerald-800/40 flex items-center justify-between gap-2">
        
        {/* Back / Close button & Heading */}
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
                صحيح الحديث النبوي الشريف
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40 whitespace-nowrap flex-shrink-0">
                100% صحيح ومحقق
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-amiri truncate">
              مرويات البخاري ومسلم والسنن الصحيحة المعتمدة
            </p>
          </div>
        </div>

        {/* Top Right Action Icons: Random, Favorites, Done */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl border text-xs font-bold font-tajawal transition-all cursor-pointer ${
              onlyFavorites
                ? "bg-rose-500/30 text-rose-200 border-rose-400/60"
                : "bg-white/10 hover:bg-white/20 text-white border-white/10"
            }`}
            title="الأحاديث المحفوظة"
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-rose-400 text-rose-400" : "text-stone-300"}`} />
            <span className="hidden md:inline">المفضلة ({favorites.length})</span>
          </button>

          {/* Random Hadith */}
          <button
            onClick={handleRandomHadith}
            title="حديث عشوائي مبارك"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* 2. Search Bar and Filter Toolbar */}
      <div className="p-3.5 sm:p-4 bg-white border-b border-stone-200 shadow-sm space-y-3">
        <div className="max-w-3xl mx-auto w-full space-y-2.5">
          
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالكلمة، اسم الصحابي، الفائدة، أو الموضوع (مثال: النية، الصلاة، التوكل)..."
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-stone-50 text-xs sm:text-sm font-tajawal text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 border border-stone-200 focus:border-emerald-600 transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-2xl border border-stone-200 flex-shrink-0">
              <button
                onClick={() => {
                  const next = Math.max(16, fontSize - 2);
                  setFontSize(next);
                  try {
                    localStorage.setItem("hadith_font_size", String(next));
                  } catch (e) {}
                }}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white rounded cursor-pointer transition-colors"
                title="تصغير الخط"
              >
                -A
              </button>
              <span className="text-xs font-tajawal font-bold text-stone-500 px-0.5">{fontSize}</span>
              <button
                onClick={() => {
                  const next = Math.min(32, fontSize + 2);
                  setFontSize(next);
                  try {
                    localStorage.setItem("hadith_font_size", String(next));
                  } catch (e) {}
                }}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white rounded cursor-pointer transition-colors"
                title="تكبير الخط"
              >
                +A
              </button>
            </div>
          </div>

          {/* Categories Scrollable Pills */}
          <div className="overflow-x-auto scrollbar-none flex items-center gap-1.5 flex-nowrap pb-0.5">
            {AUTHENTIC_HADITHS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOnlyFavorites(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id && !onlyFavorites
                    ? "bg-[#2F5241] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. Hadiths List Content Area */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto bg-[#FAF9F5]">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          
          {filteredHadiths.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-3 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
              <p className="text-base font-tajawal font-bold text-stone-700">
                لا توجد أحاديث مطابقة للبحث المطلوب
              </p>
              <p className="text-xs text-stone-500">
                جرّب كتابة كلمة أخرى أو إلغاء تصفية المفضلة أو اختيار قسم مختلف.
              </p>
            </div>
          ) : (
            filteredHadiths.map((hadith) => {
              const isExpanded = expandedId === hadith.id;
              const isSpeaking = speakingId === hadith.id;
              const isCopied = copiedId === hadith.id;
              const isFav = favorites.includes(hadith.id);

              return (
                <div
                  key={hadith.id}
                  className="p-4 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 transition-all space-y-4"
                >
                  {/* Top Bar: Title & Verified Grade Badge */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 flex-shrink-0">
                        <Bookmark className="w-4 h-4 fill-emerald-100" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-tajawal text-stone-900">
                        {hadith.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{hadith.grade}</span>
                      </span>

                      <button
                        onClick={() => toggleFavorite(hadith.id)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          isFav
                            ? "bg-rose-50 border-rose-200 text-rose-600"
                            : "bg-stone-50 border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Narrator (الراوي) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/80 font-tajawal">
                      {hadith.rawi}
                    </span>
                  </div>

                  {/* Hadith Matn (نص الحديث الشريف) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF5] border border-stone-200/80 text-right shadow-xs">
                    <p
                      className="font-amiri font-bold text-stone-900 leading-loose text-right select-text"
                      style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
                    >
                      {hadith.arabicText}
                    </p>
                  </div>

                  {/* Source Reference & Category */}
                  <div className="flex items-center justify-between text-xs text-stone-500 font-tajawal pt-1 border-t border-stone-100">
                    <span className="font-semibold text-stone-700">
                      المصدر: {hadith.source} ({hadith.hadithNumber})
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {hadith.categoryName}
                    </span>
                  </div>

                  {/* Accordion: Benefit / Explanation */}
                  <div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : hadith.id)}
                      className="w-full py-2 px-3 rounded-2xl bg-stone-50 hover:bg-stone-100 text-xs font-bold font-tajawal text-stone-700 flex items-center justify-between transition-colors cursor-pointer border border-stone-200/60"
                    >
                      <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>الفائدة المستنبطة وشرح الحديث</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs sm:text-sm text-stone-800 font-amiri leading-relaxed animate-in fade-in duration-150 shadow-xs">
                        <p className="font-semibold">{hadith.benefit}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons (Voice Read, Copy, Share) */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => handleSpeak(hadith)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-bold font-tajawal flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSpeaking
                          ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-sm"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                      }`}
                      title="استمع للحديث بصوت واضح"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                          <span>إيقاف القراءة</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>استماع</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(hadith)}
                      className="px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold font-tajawal flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="نسخ نص الحديث مع التخريج"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(hadith)}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#2F5241] hover:bg-[#254234] text-white text-xs font-bold font-tajawal flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      title="مشاركة الحديث الشريف"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>
      </div>

      {/* 4. Bottom Authenticity Guarantee Banner */}
      <footer className="p-3 bg-emerald-950 text-emerald-200 text-center text-xs font-tajawal flex items-center justify-center gap-2 border-t border-emerald-900/60 flex-shrink-0">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>جميع الأحاديث صحيحة ومحققة من أمهات كتب السنة المعتمدة • ({AUTHENTIC_HADITHS_DATA.length}) حديث شريف</span>
      </footer>

    </div>
  );
};
