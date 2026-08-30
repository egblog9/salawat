import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BookOpen,
  Search,
  Sparkles,
  RotateCcw,
  Radio,
  Bookmark,
  Share2,
  Check,
  FastForward,
  Repeat,
  Moon,
  Sun,
} from "lucide-react";
import { SHEIKH_RECITERS, SALAWAT_COLLECTION, VIRTUES_LIST } from "../data/salawatData";
import { LIBRARY_EXPANDED_TRACKS, NAWAWI_FORTY_SELECTIONS, LibraryTrack } from "../data/islamicLibraryExpandedData";
import { SheikhAudioTrack } from "../types";

interface IslamicLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrackId: string | null;
  isPlaying: boolean;
  onPlayTrack: (track: SheikhAudioTrack) => void;
  onTogglePlayPause: () => void;
}

export const IslamicLibraryModal: React.FC<IslamicLibraryModalProps> = ({
  isOpen,
  onClose,
  activeTrackId,
  isPlaying,
  onPlayTrack,
  onTogglePlayPause,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<"audio" | "formulas" | "nawawi" | "sheikhs">("audio");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Islamic Text Eye-Comfort Night Reading Mode
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("islamic_reading_night_mode") === "true";
    } catch {
      return false;
    }
  });

  const toggleNightMode = () => {
    setIsNightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("islamic_reading_night_mode", String(next));
      } catch {}
      return next;
    });
  };

  // Audio player extra controls
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  if (!isOpen) return null;

  // Filter audio tracks
  const filteredTracks = LIBRARY_EXPANDED_TRACKS.filter((track) => {
    const matchesCat = activeCategory === "all" || track.category === activeCategory;
    const matchesSearch =
      track.title.includes(searchQuery) ||
      track.sheikhName.includes(searchQuery) ||
      track.arabicText.includes(searchQuery) ||
      (track.details && track.details.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  // Filter formulas
  const filteredFormulas = SALAWAT_COLLECTION.filter((item) => {
    return (
      item.title.includes(searchQuery) ||
      item.arabicText.includes(searchQuery) ||
      item.meaning.includes(searchQuery) ||
      item.virtue.includes(searchQuery)
    );
  });

  // Filter Nawawi
  const filteredNawawi = NAWAWI_FORTY_SELECTIONS.filter((item) => {
    return (
      item.title.includes(searchQuery) ||
      item.arabicText.includes(searchQuery) ||
      item.lesson.includes(searchQuery) ||
      item.narrator.includes(searchQuery)
    );
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="islamic-library-page"
      className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none transition-colors ${
        isNightMode ? "bg-[#121514] text-stone-200" : "bg-[#FAF9F5] text-stone-900"
      }`}
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
                المكتبة والتسجيلات الإسلامية
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40 whitespace-nowrap flex-shrink-0">
                مكتبة صوتية ونصية شاملة
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-amiri truncate">
              تلاوات خاشعة، أذان الحرمين، رقية شرعية، وصايا نبوية وأذكار
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Islamic Eye-Comfort Night Reading Mode Toggle Button */}
          <button
            id="library-night-mode-toggle"
            type="button"
            onClick={toggleNightMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer border ${
              isNightMode
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30 shadow-sm"
                : "bg-white/10 text-stone-200 border-white/10 hover:bg-white/20"
            }`}
            title={isNightMode ? "التبديل إلى الوضع النهاري" : "تفعيل وضع القراءة الليلي المخصص لراحة العين"}
          >
            {isNightMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-200" />
            )}
            <span className="hidden md:inline">
              {isNightMode ? "الوضع النهاري" : "القراءة الليلية"}
            </span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div
        className={`border-b shadow-sm p-2 sm:p-3 transition-colors ${
          isNightMode ? "bg-[#1A1F1D] border-stone-800" : "bg-white border-stone-200"
        }`}
      >
        <div
          className={`max-w-2xl mx-auto grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl transition-colors ${
            isNightMode ? "bg-[#141817]" : "bg-stone-100"
          }`}
        >
          <button
            onClick={() => setCurrentTab("audio")}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              currentTab === "audio"
                ? "bg-[#2F5241] text-white shadow-sm"
                : isNightMode
                ? "text-stone-400 hover:text-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Radio className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">التسجيلات</span>
          </button>

          <button
            onClick={() => setCurrentTab("formulas")}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              currentTab === "formulas"
                ? "bg-[#2F5241] text-white shadow-sm"
                : isNightMode
                ? "text-stone-400 hover:text-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">الصيغ والفضائل</span>
          </button>

          <button
            onClick={() => setCurrentTab("nawawi")}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              currentTab === "nawawi"
                ? "bg-[#2F5241] text-white shadow-sm"
                : isNightMode
                ? "text-stone-400 hover:text-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">الأربعين النووية</span>
          </button>

          <button
            onClick={() => setCurrentTab("sheikhs")}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              currentTab === "sheikhs"
                ? "bg-[#2F5241] text-white shadow-sm"
                : isNightMode
                ? "text-stone-400 hover:text-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">كبار القراء</span>
          </button>
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div
        className={`border-b p-3 sm:p-4 space-y-2.5 transition-colors ${
          isNightMode ? "bg-[#1A1F1D] border-stone-800" : "bg-white border-stone-200"
        }`}
      >
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المكتبة بالاسم، القارئ، العنوان، أو النص..."
            className={`w-full py-2.5 pr-10 pl-4 rounded-2xl border text-xs sm:text-sm font-tajawal outline-none transition-all shadow-inner ${
              isNightMode
                ? "bg-[#141817] border-stone-700/80 text-stone-100 placeholder:text-stone-500 focus:border-emerald-500 focus:bg-[#181E1B]"
                : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white"
            }`}
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
        </div>

        {currentTab === "audio" && (
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", name: "الكل" },
              { id: "quran", name: "تلاوات قرآنية" },
              { id: "adhan", name: "أذان الحرمين" },
              { id: "salawat", name: "الصلاة على النبي" },
              { id: "ruqyah", name: "الرقية والشفاء" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tajawal whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#2F5241] text-white shadow-sm"
                    : isNightMode
                    ? "bg-[#141817] text-stone-300 hover:bg-stone-800"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-24">
          
          {/* TAB 1: AUDIO TRACKS */}
          {currentTab === "audio" && (
            <div className="space-y-3">
              {filteredTracks.map((track) => {
                const isCurrent = activeTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      const trackObj: SheikhAudioTrack = {
                        id: track.id,
                        sheikhId: track.sheikhName,
                        sheikhName: track.sheikhName,
                        title: track.title,
                        arabicText: track.arabicText,
                        audioUrl: track.audioUrl,
                        duration: track.duration,
                        category: track.category,
                        categoryLabel: track.categoryLabel,
                      };
                      if (isCurrent) {
                        onTogglePlayPause();
                      } else {
                        onPlayTrack(trackObj);
                      }
                    }}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm select-none ${
                      isCurrent
                        ? isNightMode
                          ? "border-emerald-600 bg-emerald-950/40 ring-2 ring-emerald-500/20"
                          : "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : isNightMode
                        ? "bg-[#1A1F1D] border-stone-800/80 hover:border-emerald-600/60"
                        : "bg-white border-stone-200 hover:border-emerald-300"
                    }`}
                  >
                    <button
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95 ${
                        isCurrent && isPlaying
                          ? "bg-emerald-700 text-white animate-pulse"
                          : isNightMode
                          ? "bg-stone-800 text-emerald-300 hover:bg-stone-700"
                          : "bg-stone-100 text-emerald-900 hover:bg-emerald-100"
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current mr-0.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-tajawal flex-shrink-0 ${
                            isNightMode
                              ? "text-emerald-300 bg-emerald-950 border border-emerald-800/50"
                              : "text-emerald-900 bg-emerald-100/80"
                          }`}
                        >
                          {track.categoryLabel}
                        </span>
                        <h4
                          className={`text-xs sm:text-sm font-bold font-tajawal truncate ${
                            isNightMode ? "text-stone-100" : "text-stone-900"
                          }`}
                        >
                          {track.sheikhName}
                        </h4>
                      </div>

                      <p
                        className={`text-xs font-tajawal font-medium mt-1 truncate ${
                          isNightMode ? "text-stone-300" : "text-stone-700"
                        }`}
                      >
                        {track.title}
                      </p>

                      <p
                        className={`text-[11px] font-amiri mt-1 line-clamp-1 ${
                          isNightMode ? "text-emerald-400/90" : "text-stone-500"
                        }`}
                      >
                        {track.arabicText}
                      </p>

                      {track.details && (
                        <p
                          className={`text-[10px] font-tajawal mt-1 truncate ${
                            isNightMode ? "text-emerald-300/80" : "text-emerald-800"
                          }`}
                        >
                          {track.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: FORMULAS AND VIRTUES */}
          {currentTab === "formulas" && (
            <div className="space-y-4">
              <div
                className={`border p-4 rounded-3xl space-y-2 transition-colors ${
                  isNightMode
                    ? "bg-emerald-950/30 border-emerald-900/50"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <h3
                  className={`text-xs font-bold font-tajawal flex items-center gap-1.5 ${
                    isNightMode ? "text-emerald-300" : "text-emerald-950"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>فضائل الصلاة على النبي ﷺ من صحيح السنة:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {VIRTUES_LIST.map((v, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border text-right space-y-1 shadow-sm transition-colors ${
                        isNightMode
                          ? "bg-[#1A1F1D] border-emerald-950/60"
                          : "bg-white border-emerald-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold font-tajawal block ${
                          isNightMode ? "text-emerald-300" : "text-emerald-900"
                        }`}
                      >
                        {v.title}
                      </span>
                      <p
                        className={`text-[11px] font-amiri leading-relaxed ${
                          isNightMode ? "text-stone-300" : "text-stone-700"
                        }`}
                      >
                        {v.hadith}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {filteredFormulas.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border shadow-sm space-y-3 transition-colors ${
                    isNightMode
                      ? "bg-[#1A1F1D] border-stone-800/80"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full font-tajawal ${
                        isNightMode
                          ? "text-emerald-300 bg-emerald-950 border border-emerald-800/50"
                          : "text-emerald-900 bg-emerald-100/70"
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isNightMode ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      مستحب: {item.recommendedCount} مرات
                    </span>
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold font-tajawal ${
                      isNightMode ? "text-stone-100" : "text-stone-900"
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p
                    className={`text-base sm:text-lg font-amiri font-bold leading-relaxed text-right p-4 rounded-2xl border shadow-inner transition-colors ${
                      isNightMode
                        ? "bg-[#141817] border-stone-800 text-amber-200/95"
                        : "bg-[#FDFBF7] border-stone-100 text-stone-800"
                    }`}
                  >
                    {item.arabicText}
                  </p>

                  <div
                    className={`text-xs font-amiri space-y-1.5 p-3 rounded-2xl transition-colors ${
                      isNightMode
                        ? "bg-[#161B19] text-stone-300"
                        : "bg-stone-50/60 text-stone-600"
                    }`}
                  >
                    <p>
                      <strong
                        className={`font-tajawal ${
                          isNightMode ? "text-stone-100" : "text-stone-900"
                        }`}
                      >
                        المعنى:
                      </strong>{" "}
                      {item.meaning}
                    </p>
                    <p>
                      <strong
                        className={`font-tajawal ${
                          isNightMode ? "text-stone-100" : "text-stone-900"
                        }`}
                      >
                        الفضل:
                      </strong>{" "}
                      {item.virtue}
                    </p>
                    <p className={isNightMode ? "text-[11px] text-stone-500" : "text-[11px] text-stone-400"}>
                      المصدر: {item.hadithSource}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: NAWAWI FORTY */}
          {currentTab === "nawawi" && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-3xl border text-right transition-colors ${
                  isNightMode
                    ? "bg-[#1A1F1D] border-stone-800"
                    : "bg-stone-100 border-stone-200"
                }`}
              >
                <h3
                  className={`text-sm font-bold font-tajawal ${
                    isNightMode ? "text-stone-100" : "text-stone-900"
                  }`}
                >
                  متن الأربعين النووية للإمام النووي رحمه الله
                </h3>
                <p
                  className={`text-xs font-amiri mt-1 ${
                    isNightMode ? "text-stone-400" : "text-stone-600"
                  }`}
                >
                  أحاديث جامعة لقواعد الدين وأصول الإسلام
                </p>
              </div>

              {filteredNawawi.map((n) => (
                <div
                  key={n.number}
                  className={`p-5 rounded-3xl border shadow-sm space-y-3 transition-colors ${
                    isNightMode
                      ? "bg-[#1A1F1D] border-stone-800/80"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full font-tajawal ${
                        isNightMode
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                          : "bg-amber-100 text-stone-900"
                      }`}
                    >
                      الحديث رقم {n.number}
                    </span>
                    <span
                      className={`text-xs font-amiri ${
                        isNightMode ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      {n.narrator}
                    </span>
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold font-tajawal ${
                      isNightMode ? "text-stone-100" : "text-stone-900"
                    }`}
                  >
                    {n.title}
                  </h4>

                  <p
                    className={`text-base sm:text-lg font-amiri font-bold leading-relaxed text-right p-4 rounded-2xl border shadow-inner transition-colors ${
                      isNightMode
                        ? "bg-[#141817] border-stone-800 text-amber-200/95"
                        : "bg-[#FDFBF7] border-stone-100 text-stone-800"
                    }`}
                  >
                    {n.arabicText}
                  </p>

                  <div
                    className={`p-3 rounded-2xl border text-xs font-amiri transition-colors ${
                      isNightMode
                        ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-200"
                        : "bg-emerald-50/70 border-emerald-100 text-emerald-950"
                    }`}
                  >
                    <strong
                      className={`font-tajawal ${
                        isNightMode ? "text-emerald-300" : "text-emerald-900"
                      }`}
                    >
                      الفوائد والدروس:{" "}
                    </strong>
                    {n.lesson}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SHEIKHS */}
          {currentTab === "sheikhs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHEIKH_RECITERS.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-3xl border shadow-sm space-y-2 text-right transition-colors ${
                    isNightMode
                      ? "bg-[#1A1F1D] border-stone-800/80"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-tajawal font-bold ${
                        isNightMode
                          ? "bg-stone-800 text-stone-300"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {s.country}
                    </span>
                    <h4
                      className={`text-sm font-bold font-tajawal ${
                        isNightMode ? "text-stone-100" : "text-stone-900"
                      }`}
                    >
                      {s.name}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-tajawal font-medium block ${
                      isNightMode ? "text-emerald-400" : "text-emerald-800"
                    }`}
                  >
                    {s.title}
                  </span>
                  <p
                    className={`text-xs font-amiri leading-relaxed ${
                      isNightMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
