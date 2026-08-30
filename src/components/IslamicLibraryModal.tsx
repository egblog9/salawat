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
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-white border-b border-stone-200 shadow-sm p-2 sm:p-3">
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setCurrentTab("audio")}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
              currentTab === "audio"
                ? "bg-[#2F5241] text-white shadow-sm"
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
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">كبار القراء</span>
          </button>
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white border-b border-stone-200 p-3 sm:p-4 space-y-2.5">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المكتبة بالاسم، القارئ، العنوان، أو النص..."
            className="w-full py-2.5 pr-10 pl-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-tajawal text-stone-800 placeholder:text-stone-400 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
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
                    className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm select-none ${
                      isCurrent
                        ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-stone-200 hover:border-emerald-300"
                    }`}
                  >
                    <button
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95 ${
                        isCurrent && isPlaying
                          ? "bg-emerald-700 text-white animate-pulse"
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
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-full font-tajawal flex-shrink-0">
                          {track.categoryLabel}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-tajawal truncate">
                          {track.sheikhName}
                        </h4>
                      </div>

                      <p className="text-xs text-stone-700 font-tajawal font-medium mt-1 truncate">
                        {track.title}
                      </p>

                      <p className="text-[11px] font-amiri text-stone-500 mt-1 line-clamp-1">
                        {track.arabicText}
                      </p>

                      {track.details && (
                        <p className="text-[10px] text-emerald-800 font-tajawal mt-1 truncate">
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
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl space-y-2">
                <h3 className="text-xs font-bold font-tajawal text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>فضائل الصلاة على النبي ﷺ من صحيح السنة:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {VIRTUES_LIST.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-2xl border border-emerald-100 text-right space-y-1 shadow-sm"
                    >
                      <span className="text-xs font-bold text-emerald-900 font-tajawal block">
                        {v.title}
                      </span>
                      <p className="text-[11px] text-stone-700 font-amiri leading-relaxed">
                        {v.hadith}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {filteredFormulas.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full font-tajawal">
                      {item.categoryLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500">
                      مستحب: {item.recommendedCount} مرات
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold font-tajawal text-stone-900">
                    {item.title}
                  </h4>

                  <p className="text-base sm:text-lg font-amiri font-bold text-stone-800 leading-relaxed text-right bg-[#FDFBF7] p-4 rounded-2xl border border-stone-100 shadow-inner">
                    {item.arabicText}
                  </p>

                  <div className="text-xs text-stone-600 font-amiri space-y-1.5 bg-stone-50/60 p-3 rounded-2xl">
                    <p>
                      <strong className="font-tajawal text-stone-900">المعنى:</strong> {item.meaning}
                    </p>
                    <p>
                      <strong className="font-tajawal text-stone-900">الفضل:</strong> {item.virtue}
                    </p>
                    <p className="text-[11px] text-stone-400">
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
              <div className="bg-stone-100 p-4 rounded-3xl border border-stone-200 text-right">
                <h3 className="text-sm font-bold font-tajawal text-stone-900">
                  متن الأربعين النووية للإمام النووي رحمه الله
                </h3>
                <p className="text-xs text-stone-600 font-amiri mt-1">
                  أحاديث جامعة لقواعد الدين وأصول الإسلام
                </p>
              </div>

              {filteredNawawi.map((n) => (
                <div
                  key={n.number}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 bg-amber-100 px-3 py-1 rounded-full font-tajawal">
                      الحديث رقم {n.number}
                    </span>
                    <span className="text-xs text-stone-500 font-amiri">
                      {n.narrator}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold font-tajawal text-stone-900">
                    {n.title}
                  </h4>

                  <p className="text-base sm:text-lg font-amiri font-bold text-stone-800 leading-relaxed text-right bg-[#FDFBF7] p-4 rounded-2xl border border-stone-100 shadow-inner">
                    {n.arabicText}
                  </p>

                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-xs text-emerald-950 font-amiri">
                    <strong className="font-tajawal text-emerald-900">الفوائد والدروس: </strong>
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
                  className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-2 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-tajawal font-bold">
                      {s.country}
                    </span>
                    <h4 className="text-sm font-bold font-tajawal text-stone-900">
                      {s.name}
                    </h4>
                  </div>
                  <span className="text-xs text-emerald-800 font-tajawal font-medium block">
                    {s.title}
                  </span>
                  <p className="text-xs text-stone-500 font-amiri leading-relaxed">
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
