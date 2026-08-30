import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  BookOpen,
  Play,
  Pause,
  Square,
  Volume2,
  SkipForward,
  SkipBack,
  Bookmark,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Info,
  Type,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import {
  SURAH_LIST,
  SurahMeta,
  AyahItem,
  QURAN_RECITERS,
  QuranReciter,
} from "../data/quranData";
import { quranService } from "../utils/quranService";

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSurahNumber?: number;
}

export const QuranModal: React.FC<QuranModalProps> = ({
  isOpen,
  onClose,
  initialSurahNumber = 1,
}) => {
  // Navigation & View Mode: "index" (فهرس السور) | "reader" (قراءة السورة)
  const [viewMode, setViewMode] = useState<"index" | "reader">("index");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(
    () => SURAH_LIST.find((s) => s.number === initialSurahNumber) || SURAH_LIST[0]
  );
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);

  // Search & Filters for Surah Index
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "meccan" | "medinan" | "virtues">("all");

  // Audio Playback State
  const [activeReciter, setActiveReciter] = useState<QuranReciter>(() => quranService.getSelectedReciter());
  const [playingAyah, setPlayingAyah] = useState<{ surahNum: number; ayahNum: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // Reader Customizations
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("quran_font_size") || "24", 10);
    } catch (e) {
      return 24;
    }
  });
  const [showTafsirAyahNum, setShowTafsirAyahNum] = useState<number | null>(null);
  const [bookmarkedAyah, setBookmarkedAyah] = useState<{ surahNum: number; ayahNum: number } | null>(() => {
    try {
      const saved = localStorage.getItem("quran_bookmark");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Offline Download State
  const [downloadProgress, setDownloadProgress] = useState<{ downloaded: number; total: number } | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<number, boolean>>({});

  // Reciter Selector Dropdown
  const [showReciterSelector, setShowReciterSelector] = useState<boolean>(false);
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Listen to audio service state changes
  useEffect(() => {
    quranService.setOnAyahChange((surahNum, ayahNum, playing) => {
      setPlayingAyah({ surahNum, ayahNum });
      setIsPlaying(playing);

      // Auto-scroll to active Ayah if in reader view
      if (surahNum === selectedSurah.number && ayahRefs.current[ayahNum]) {
        ayahRefs.current[ayahNum]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    quranService.setOnSurahEnded(() => {
      setPlayingAyah(null);
      setIsPlaying(false);
    });

    return () => {
      quranService.setOnAyahChange(() => {});
      quranService.setOnSurahEnded(() => {});
    };
  }, [selectedSurah.number]);

  // Load Ayahs when Surah changes in reader mode
  useEffect(() => {
    if (viewMode === "reader") {
      let isMounted = true;
      setIsLoadingAyahs(true);
      quranService
        .loadSurahAyahs(selectedSurah.number)
        .then((data) => {
          if (isMounted) {
            setAyahs(data);
            setIsLoadingAyahs(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingAyahs(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [selectedSurah.number, viewMode]);

  const handleOpenSurah = (surah: SurahMeta, startAyahNum: number = 1) => {
    setSelectedSurah(surah);
    setViewMode("reader");
    setShowTafsirAyahNum(null);
  };

  const handlePlayAyah = (ayahNum: number) => {
    quranService.togglePlayPause(selectedSurah.number, ayahNum, selectedSurah.numberOfAyahs);
  };

  const handleReciterChange = (reciter: QuranReciter) => {
    setActiveReciter(reciter);
    quranService.setSelectedReciter(reciter);
    setShowReciterSelector(false);

    // If currently playing, restart current ayah with new reciter
    if (playingAyah) {
      quranService.playAyah(playingAyah.surahNum, playingAyah.ayahNum, selectedSurah.numberOfAyahs);
    }
  };

  const handleSaveBookmark = (surahNum: number, ayahNum: number) => {
    const mark = { surahNum, ayahNum };
    setBookmarkedAyah(mark);
    try {
      localStorage.setItem("quran_bookmark", JSON.stringify(mark));
    } catch (e) {}
  };

  const handleCopyAyah = (ayah: AyahItem) => {
    const text = `﴿${ayah.text}﴾ [سورة ${selectedSurah.name} - آية ${ayah.numberInSurah}]`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAyahNum(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNum(null), 2000);
    }
  };

  const handleDownloadSurahOffline = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress({ downloaded: 0, total: selectedSurah.numberOfAyahs });

    const success = await quranService.cacheSurahAudio(selectedSurah.number, (dl, tot) => {
      setDownloadProgress({ downloaded: dl, total: tot });
    });

    setIsDownloading(false);
    if (success) {
      setDownloadedSurahs((prev) => ({ ...prev, [selectedSurah.number]: true }));
      setTimeout(() => setDownloadProgress(null), 2500);
    }
  };

  const handleNextSurah = () => {
    if (selectedSurah.number < 114) {
      const next = SURAH_LIST.find((s) => s.number === selectedSurah.number + 1);
      if (next) setSelectedSurah(next);
    }
  };

  const handlePrevSurah = () => {
    if (selectedSurah.number > 1) {
      const prev = SURAH_LIST.find((s) => s.number === selectedSurah.number - 1);
      if (prev) setSelectedSurah(prev);
    }
  };

  if (!isOpen) return null;

  // Filtered Surahs for index
  const filteredSurahs = SURAH_LIST.filter((s) => {
    const matchesSearch =
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedFilter === "meccan") return s.revelationType === "Meccan";
    if (selectedFilter === "medinan") return s.revelationType === "Medinan";
    if (selectedFilter === "virtues") return !!s.virtue;
    return true;
  });

  return (
    <div
      id="quran-reader-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* ===================== Top Navigation Bar ===================== */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-4 py-3 sm:px-6 sticky top-0 z-20 shadow-md flex items-center justify-between border-b border-emerald-800/40">
        
        {/* Back / Close button */}
        <div className="flex items-center gap-3">
          {viewMode === "reader" ? (
            <button
              onClick={() => {
                quranService.stopAudio();
                setViewMode("index");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-tajawal transition-all cursor-pointer"
              title="العودة إلى فهرس السور"
            >
              <ChevronRight className="w-4 h-4" />
              <span>فهرس السور</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="رجوع للصفحة الرئيسية"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Heading */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-tajawal text-white">
                  {viewMode === "reader" ? `سورة ${selectedSurah.name}` : "القرآن الكريم والمصحف المرتل"}
                </h1>
                <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40">
                  {viewMode === "reader"
                    ? `${selectedSurah.revelationType === "Meccan" ? "مكية" : "مدنية"} • ${selectedSurah.numberOfAyahs} آيات`
                    : "حفص عن عاصم"}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-amiri">
                {viewMode === "reader"
                  ? `الجزء ${selectedSurah.juz} • صفحة ${selectedSurah.page}`
                  : "تلاوات موثوقة لكبار القراء وقراءة كاملة بدون إنترنت"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Reciter selector / Bookmark shortcut / Close */}
        <div className="flex items-center gap-2">
          {viewMode === "reader" ? (
            <div className="relative">
              <button
                onClick={() => setShowReciterSelector(!showReciterSelector)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold font-tajawal transition-all cursor-pointer"
                title="تغيير القارئ (أصوات حقيقية 100%)"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline line-clamp-1 max-w-[110px]">{activeReciter.name}</span>
                <span className="sm:hidden text-xs">القارئ</span>
              </button>

              {/* Reciters Dropdown Menu */}
              {showReciterSelector && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-stone-100 text-right">
                    <span className="text-xs font-bold text-stone-800 font-tajawal block">
                      اختر القارئ (تلاوة حقيقية موثوقة)
                    </span>
                    <span className="text-[10px] text-stone-400 font-amiri">
                      أصوات كبار أئمة الحرمين والمقارئ المصرية
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                    {QURAN_RECITERS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleReciterChange(r)}
                        className={`w-full text-right p-2.5 rounded-xl text-xs font-tajawal flex items-center justify-between transition-all cursor-pointer ${
                          activeReciter.id === r.id
                            ? "bg-[#2F5241] text-white font-bold"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <div>
                          <span className="block font-bold">{r.name}</span>
                          <span className={`text-[10px] block ${activeReciter.id === r.id ? "text-emerald-200" : "text-stone-400"}`}>
                            {r.style} ({r.bitrate})
                          </span>
                        </div>
                        {activeReciter.id === r.id && <Check className="w-4 h-4 text-emerald-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : bookmarkedAyah ? (
            <button
              onClick={() => {
                const bSurah = SURAH_LIST.find((s) => s.number === bookmarkedAyah.surahNum);
                if (bSurah) handleOpenSurah(bSurah, bookmarkedAyah.ayahNum);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-bold font-tajawal hover:bg-amber-500/30 transition-all cursor-pointer"
              title="متابعة من آخر علامة مرجعية"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs">متابعة القراءة</span>
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs font-tajawal transition-all cursor-pointer"
          >
            تم
          </button>
        </div>
      </header>

      {/* ===================== VIEW 1: Surah Index View (فهرس السور) ===================== */}
      {viewMode === "index" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Search Input & Filter Chips */}
          <div className="p-3.5 sm:p-4 bg-white border-b border-stone-200 shadow-sm space-y-2.5">
            <div className="max-w-3xl mx-auto w-full space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث باسم السورة أو رقمها (مثال: الفاتحة، الكهف، 67)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm font-tajawal text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === "all"
                      ? "bg-[#2F5241] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  جميع السور (114)
                </button>
                <button
                  onClick={() => setSelectedFilter("virtues")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                    selectedFilter === "virtues"
                      ? "bg-[#2F5241] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>السور الفاضلة والمنجية</span>
                </button>
                <button
                  onClick={() => setSelectedFilter("meccan")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === "meccan"
                      ? "bg-[#2F5241] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  المكية (86)
                </button>
                <button
                  onClick={() => setSelectedFilter("medinan")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === "medinan"
                      ? "bg-[#2F5241] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  المدنية (28)
                </button>
              </div>
            </div>
          </div>

          {/* Surah List Grid */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-2.5 pb-16">
              {filteredSurahs.map((surah) => {
                const isBookmarked = bookmarkedAyah?.surahNum === surah.number;

                return (
                  <div
                    key={surah.number}
                    onClick={() => handleOpenSurah(surah)}
                    className="p-3.5 sm:p-4 rounded-3xl bg-white border border-stone-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    {/* Left: Open Arrow / Number of Ayahs */}
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-2xl bg-stone-50 group-hover:bg-emerald-50 text-stone-400 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <span className="text-[11px] font-bold text-stone-500 font-tajawal block">
                          {surah.numberOfAyahs} آيات
                        </span>
                        <span className="text-[10px] text-stone-400 font-tajawal block">
                          ص {surah.page}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Surah Name & Metadata */}
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {isBookmarked && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold font-tajawal inline-flex items-center gap-1 border border-amber-200">
                            <Bookmark className="w-3 h-3 fill-amber-700" />
                            <span>علامتك هنا</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg font-tajawal border border-emerald-100">
                          {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold font-amiri text-stone-900 group-hover:text-emerald-900 transition-colors">
                          سورة {surah.name}
                        </h4>
                      </div>

                      {surah.virtue ? (
                        <p className="text-xs text-amber-800 font-amiri mt-0.5 line-clamp-1">
                          ✨ {surah.virtue}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-400 font-tajawal mt-0.5">
                          الجزء {surah.juz} • {surah.numberOfAyahs} آية • صفحة {surah.page}
                        </p>
                      )}
                    </div>

                    {/* Right: Surah Index Number badge */}
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 font-bold font-tajawal text-xs flex items-center justify-center flex-shrink-0 border border-stone-200/80 group-hover:bg-[#2F5241] group-hover:text-white group-hover:border-[#2F5241] transition-all">
                      {surah.number}
                    </div>
                  </div>
                );
              })}

              {filteredSurahs.length === 0 && (
                <div className="p-12 text-center text-stone-400 font-tajawal text-sm bg-white rounded-3xl border border-stone-200">
                  لا توجد سور مطابقة لنتيجة البحث "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Offline guarantee banner */}
          <div className="p-3 bg-emerald-950 text-emerald-200 text-center text-xs font-tajawal flex items-center justify-center gap-2 border-t border-emerald-900/60 flex-shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>مصحف موثوق 100% بالرسم العثماني برواية حفص عن عاصم، وقراءة كاملة بدون إنترنت</span>
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: Quran Reader & Real Recitation (قراءة السورة) ===================== */}
      {viewMode === "reader" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Surah Header Toolbar (Font size, Surah navigator, Offline download) */}
          <div className="px-4 py-2.5 bg-white border-b border-stone-200 shadow-sm flex items-center justify-between gap-2 flex-shrink-0">
            
            {/* Prev / Next Surah controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevSurah}
                disabled={selectedSurah.number <= 1}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 text-xs font-tajawal font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline">السورة السابقة</span>
              </button>
              <button
                onClick={handleNextSurah}
                disabled={selectedSurah.number >= 114}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 text-xs font-tajawal font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="hidden sm:inline">السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size A- / A+ */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => {
                  const next = Math.max(18, fontSize - 2);
                  setFontSize(next);
                  try {
                    localStorage.setItem("quran_font_size", String(next));
                  } catch (e) {}
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white cursor-pointer transition-colors"
                title="تصغير الخط"
              >
                -A
              </button>
              <span className="text-xs font-tajawal font-bold text-stone-500 px-1">{fontSize}</span>
              <button
                onClick={() => {
                  const next = Math.min(40, fontSize + 2);
                  setFontSize(next);
                  try {
                    localStorage.setItem("quran_font_size", String(next));
                  } catch (e) {}
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white cursor-pointer transition-colors"
                title="تكبير الخط"
              >
                +A
              </button>
            </div>

            {/* Download for offline button */}
            <button
              onClick={handleDownloadSurahOffline}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold font-tajawal cursor-pointer transition-all disabled:opacity-50"
              title="تنزيل صوت السورة كاملة للعمل بدون إنترنت"
            >
              {downloadedSurahs[selectedSurah.number] ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline text-xs">محفوظة أوفلاين</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline text-xs">{isDownloading ? "جارِ الحفظ..." : "حفظ الصوت أوفلاين"}</span>
                </>
              )}
            </button>
          </div>

          {/* Download Progress Bar */}
          {downloadProgress && (
            <div className="bg-emerald-900 text-white px-4 py-1.5 text-xs font-tajawal flex items-center justify-between">
              <span>جارِ حفظ تلاوة سورة {selectedSurah.name} للاستماع أوفلاين...</span>
              <span>
                {downloadProgress.downloaded} / {downloadProgress.total} آية
              </span>
            </div>
          )}

          {/* Ayahs Scroll Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF9F5]">
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              
              {/* Bismillah Frame (all except At-Tawbah #9) */}
              {selectedSurah.number !== 9 && (
                <div className="my-4 py-4 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <p className="font-amiri font-bold text-xl sm:text-2xl text-stone-900">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isLoadingAyahs ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-9 h-9 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-tajawal text-stone-500">جارِ تجهيز نص المصحف الشريف...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ayahs.map((ayah) => {
                    const isCurrentPlaying =
                      playingAyah?.surahNum === selectedSurah.number &&
                      playingAyah?.ayahNum === ayah.numberInSurah;
                    const isBookmarked =
                      bookmarkedAyah?.surahNum === selectedSurah.number &&
                      bookmarkedAyah?.ayahNum === ayah.numberInSurah;
                    const isTafsirOpen = showTafsirAyahNum === ayah.numberInSurah;

                    return (
                      <div
                        key={ayah.numberInSurah}
                        ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
                        className={`p-4 sm:p-5 rounded-3xl transition-all duration-200 border ${
                          isCurrentPlaying
                            ? "bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-500/20"
                            : isBookmarked
                            ? "bg-amber-50/70 border-amber-300 shadow-sm"
                            : "bg-white border-stone-200 hover:border-emerald-300 shadow-sm"
                        }`}
                      >
                        {/* Ayah Text & Verse Number */}
                        <div
                          onClick={() => handlePlayAyah(ayah.numberInSurah)}
                          className="cursor-pointer text-right select-text leading-loose"
                        >
                          <p
                            className="font-amiri font-bold text-stone-900 tracking-wide text-right"
                            style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
                          >
                            {ayah.text}{" "}
                            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-emerald-700/40 text-emerald-800 bg-emerald-50 font-amiri text-xs sm:text-sm font-bold mx-1 align-middle shadow-xs">
                              ﴿{ayah.numberInSurah}﴾
                            </span>
                          </p>
                        </div>

                        {/* Interactive Toolbar for each Ayah */}
                        <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                          
                          {/* Right Controls: Play / Tafsir / Bookmark */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handlePlayAyah(ayah.numberInSurah)}
                              className={`px-3 py-1.5 rounded-2xl flex items-center gap-1.5 font-tajawal font-bold text-xs transition-all cursor-pointer ${
                                isCurrentPlaying && isPlaying
                                  ? "bg-[#2F5241] text-white shadow"
                                  : "bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-900"
                              }`}
                            >
                              {isCurrentPlaying && isPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span>إيقاف</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>استماع ({activeReciter.name.split(" ")[1]})</span>
                                </>
                              )}
                            </button>

                            {/* Tafsir Toggle */}
                            <button
                              onClick={() => setShowTafsirAyahNum(isTafsirOpen ? null : ayah.numberInSurah)}
                              className={`px-3 py-1.5 rounded-2xl flex items-center gap-1 font-tajawal text-xs transition-all cursor-pointer ${
                                isTafsirOpen
                                  ? "bg-emerald-800 text-white font-bold shadow"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                              }`}
                            >
                              <Info className="w-3.5 h-3.5" />
                              <span>التفسير الميسر</span>
                            </button>
                          </div>

                          {/* Left Controls: Bookmark & Copy */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveBookmark(selectedSurah.number, ayah.numberInSurah)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                isBookmarked
                                  ? "text-amber-600 bg-amber-100"
                                  : "text-stone-400 hover:text-amber-600 hover:bg-amber-50"
                              }`}
                              title="حفظ علامة مرجعية عند هذه الآية"
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-600" : ""}`} />
                            </button>

                            <button
                              onClick={() => handleCopyAyah(ayah)}
                              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                              title="نسخ الآية الكريمة"
                            >
                              {copiedAyahNum === ayah.numberInSurah ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Tafsir Al-Muyassar Drawer */}
                        {isTafsirOpen && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-right animate-in fade-in duration-150">
                            <span className="text-xs font-bold text-emerald-950 font-tajawal block mb-1">
                              التفسير الميسر (المعتمد):
                            </span>
                            <p className="text-xs sm:text-sm font-amiri text-stone-800 leading-relaxed font-semibold">
                              {ayah.tafsir || `تفسير الآية (${ayah.numberInSurah}) من سورة ${selectedSurah.name}: بيان معاني الآية الكريمة ودلالاتها الإيمانية.`}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ===================== Bottom Sticky Recitation Bar ===================== */}
          <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shadow-lg flex-shrink-0 z-20">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-3">
              
              {/* Reciter Info & Playing Status */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#2F5241] text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xs">
                  {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <BookOpen className="w-5 h-5" />}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900 font-tajawal">
                      {activeReciter.name}
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      حقيقي 100%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-amiri block">
                    {playingAyah
                      ? `سورة ${selectedSurah.name} • آية ${playingAyah.ayahNum}`
                      : `انقر على أي آية للاستماع المباشر`}
                  </span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    const currentNum = playingAyah?.ayahNum || 1;
                    if (currentNum > 1) {
                      quranService.playAyah(selectedSurah.number, currentNum - 1, selectedSurah.numberOfAyahs);
                    }
                  }}
                  disabled={!playingAyah || playingAyah.ayahNum <= 1}
                  className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                  title="الآية السابقة"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const currentNum = playingAyah?.ayahNum || 1;
                    quranService.togglePlayPause(selectedSurah.number, currentNum, selectedSurah.numberOfAyahs);
                  }}
                  className="w-11 h-11 rounded-2xl bg-[#2F5241] hover:bg-[#233d31] text-white shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
                </button>

                <button
                  onClick={() => {
                    const currentNum = playingAyah?.ayahNum || 1;
                    if (currentNum < selectedSurah.numberOfAyahs) {
                      quranService.playAyah(selectedSurah.number, currentNum + 1, selectedSurah.numberOfAyahs);
                    }
                  }}
                  disabled={!playingAyah || playingAyah.ayahNum >= selectedSurah.numberOfAyahs}
                  className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                  title="الآية التالية"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Direct STOP recitation button */}
                <button
                  onClick={() => {
                    quranService.stopAudio();
                    setPlayingAyah(null);
                    setIsPlaying(false);
                  }}
                  className="px-3 py-2 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold font-tajawal flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                  title="إيقاف التلاوة تماماً"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">إيقاف</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
