import React, { useState } from "react";
import { SheikhReciter, SheikhAudioTrack } from "../types";
import { SHEIKH_RECITERS, SHEIKH_AUDIO_TRACKS } from "../data/salawatData";
import {
  Volume2,
  Square,
  Play,
  Pause,
  Repeat,
  Heart,
  Share2,
  Bookmark,
  Sliders,
  Upload,
  User,
  Music,
  Check,
  FastForward,
  RotateCcw,
  VolumeX,
} from "lucide-react";

interface SheikhAudioStudioProps {
  currentTrack: SheikhAudioTrack | null;
  isPlaying: boolean;
  onPlayTrack: (track: SheikhAudioTrack, repeats?: number) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  audioProgress: number;
  currentRepeat: number;
  totalRepeats: number;
  volume: number;
  onChangeVolume: (vol: number) => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
}

export const SheikhAudioStudio: React.FC<SheikhAudioStudioProps> = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPause,
  onResume,
  onStop,
  audioProgress,
  currentRepeat,
  totalRepeats,
  volume,
  onChangeVolume,
  playbackRate,
  onChangePlaybackRate,
}) => {
  const [selectedSheikhId, setSelectedSheikhId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [repeatOption, setRepeatOption] = useState<number>(3);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "جميع التلاوات" },
    { id: "ibrahimiyyah", label: "الصلاة الإبراهيمية" },
    { id: "prophetic", label: "الصيغ الجامعة" },
    { id: "friday", label: "يوم الجمعة" },
    { id: "dua", label: "أدعية وقنوت" },
    { id: "healing", label: "الشفاء وتفريج الهموم" },
  ];

  const filteredTracks = SHEIKH_AUDIO_TRACKS.filter((track) => {
    const matchSheikh = selectedSheikhId === "all" || track.sheikhId === selectedSheikhId;
    const matchCategory = selectedCategory === "all" || track.category === selectedCategory;
    return matchSheikh && matchCategory;
  });

  const handleShareTrack = (track: SheikhAudioTrack) => {
    const text = `🎧 تلاوة خاشعة بالصلاة على النبي ﷺ\nبصوت: ${track.sheikhName}\n\n«${track.arabicText}»\n\nاللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ 🤍\nتواصل معنا: https://www.facebook.com/share/1Bm2aq9mKm/`;
    navigator.clipboard.writeText(text);
    setCopiedId(track.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeTrack = currentTrack || SHEIKH_AUDIO_TRACKS[0];

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎙️</span>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-200 font-amiri">
                مكتبة تلاوات الشيوخ للصلوات والأذكار النبوية
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300">
              تسجيلات وتلاوات حقيقية بصوت كبار أئمة الحرمين الشريفين والقراء المعتمدين، بخشوع وسكينة تامة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 font-medium">
              أصوات شيوخ حقيقية 100%
            </span>
          </div>
        </div>

        {/* Currently Active / Featured Sheikh Track Player Card */}
        <div className="mt-6 bg-stone-950/80 border border-emerald-700/40 rounded-2xl p-5 sm:p-6 shadow-inner">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Track Info */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-600/50 text-xl text-amber-300">
                  {SHEIKH_RECITERS.find((s) => s.id === activeTrack.sheikhId)?.avatar || "🎙️"}
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-amber-200 font-amiri">
                    {activeTrack.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <span>{activeTrack.sheikhName}</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400">{activeTrack.categoryLabel}</span>
                  </p>
                </div>
              </div>

              {/* Arabic Text Display */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4">
                <p className="font-amiri text-lg sm:text-xl font-bold text-stone-100 leading-loose text-center sm:text-right">
                  {activeTrack.arabicText}
                </p>
              </div>

              {/* Progress Bar & Repeats */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>التقدم في التلاوة</span>
                  {totalRepeats > 1 && isPlaying && (
                    <span className="text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                      التكرار الحالي: {currentRepeat} من {totalRepeats}
                    </span>
                  )}
                  <span>{activeTrack.duration}</span>
                </div>
                <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full transition-all duration-100"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Playback Controls Box */}
            <div className="w-full lg:w-72 bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col gap-4">
              
              {/* Main Play / Pause / Stop Buttons */}
              <div className="flex items-center justify-center gap-3">
                {isPlaying && currentTrack?.id === activeTrack.id ? (
                  <button
                    id="pause-active-track-btn"
                    onClick={onPause}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>إيقاف مؤقت</span>
                  </button>
                ) : (
                  <button
                    id="play-active-track-btn"
                    onClick={() => onPlayTrack(activeTrack, repeatOption)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>استمع للتلاوة</span>
                  </button>
                )}

                {isPlaying && (
                  <button
                    id="stop-active-track-btn"
                    onClick={onStop}
                    className="p-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-200 cursor-pointer transition-all active:scale-95"
                    title="إيقاف نهائي"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>

              {/* Repeat Count Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-stone-300 font-semibold flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تكرار التلاوة تلقائياً:</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 3, 7, 10, 33, 100].map((rep) => (
                    <button
                      key={rep}
                      onClick={() => setRepeatOption(rep)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        repeatOption === rep
                          ? "bg-amber-500 text-stone-950 shadow-sm"
                          : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                      }`}
                    >
                      {rep === 1 ? "مرة" : `${rep} مرات`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed & Volume */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-800">
                {/* Speed */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-400">السرعة:</span>
                  {[0.75, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => onChangePlaybackRate(rate)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        playbackRate === rate
                          ? "bg-emerald-700 text-white"
                          : "bg-stone-800 text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Share Button */}
                <button
                  onClick={() => handleShareTrack(activeTrack)}
                  className="flex items-center gap-1 text-xs text-stone-300 hover:text-amber-300 cursor-pointer bg-stone-800 px-2.5 py-1 rounded-lg"
                >
                  {copiedId === activeTrack.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedId === activeTrack.id ? "تم النسخ" : "مشاركة"}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sheikhs Filter Carousel / Grid */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base sm:text-lg text-amber-200 font-amiri flex items-center gap-2">
            <span>🕌</span>
            <span>اختر الشيخ أو القارئ المفضل</span>
          </h3>
          <span className="text-xs text-stone-400">{SHEIKH_RECITERS.length} قراء معتمدين</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setSelectedSheikhId("all")}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
              selectedSheikhId === "all"
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md"
                : "bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300"
            }`}
          >
            <div className="text-xl mb-1">🕌</div>
            <span className="font-bold text-xs sm:text-sm">جميع الشيوخ والقراء</span>
            <span className="text-[10px] text-stone-400">كافة التسجيلات</span>
          </button>

          {SHEIKH_RECITERS.map((sheikh) => (
            <button
              key={sheikh.id}
              onClick={() => setSelectedSheikhId(sheikh.id)}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                selectedSheikhId === sheikh.id
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md"
                  : "bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300"
              }`}
            >
              <div className="text-xl mb-1">{sheikh.avatar}</div>
              <span className="font-bold text-xs sm:text-sm line-clamp-1">{sheikh.name}</span>
              <span className="text-[10px] text-stone-400 line-clamp-1">{sheikh.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-amber-600 text-stone-950 font-bold"
                : "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Track List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracks.map((track) => {
          const isThisPlaying = isPlaying && currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              className={`bg-stone-900/90 border rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                isThisPlaying
                  ? "border-emerald-500 bg-emerald-950/20 shadow-emerald-950/60"
                  : "border-stone-800 hover:border-emerald-700/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-sm">
                      {SHEIKH_RECITERS.find((s) => s.id === track.sheikhId)?.avatar || "🎙️"}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-amber-200">{track.title}</h4>
                      <p className="text-xs text-emerald-400 font-medium">{track.sheikhName}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                    {track.duration}
                  </span>
                </div>

                <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-4 my-2">
                  <p className="text-sm sm:text-base font-amiri font-bold text-stone-100 leading-loose">
                    {track.arabicText}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                <button
                  id={`play-sheikh-track-${track.id}`}
                  onClick={() => {
                    if (isThisPlaying) {
                      onPause();
                    } else {
                      onPlayTrack(track, repeatOption);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    isThisPlaying
                      ? "bg-amber-500 text-stone-950"
                      : "bg-emerald-700 hover:bg-emerald-600 text-white shadow"
                  }`}
                >
                  {isThisPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>استماع بصوت الشيخ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleShareTrack(track)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  {copiedId === track.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة التلاوة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
