import React, { useState } from "react";
import { X, Play, Pause, Volume2, BookOpen } from "lucide-react";
import { SHEIKH_RECITERS, SHEIKH_AUDIO_TRACKS, SALAWAT_COLLECTION } from "../data/salawatData";
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
  const [activeTab, setActiveTab] = useState<"audio" | "formulas">("audio");

  if (!isOpen) return null;

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
            <h3 className="text-lg font-bold font-tajawal text-stone-800">
              المكتبة الإسلامية والتلاوات
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              أصوات كبار الشيوخ وصيغ الصلاة على النبي ﷺ
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Tab switcher */}
        <div className="p-3 bg-white border-b border-stone-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeTab === "audio"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            تلاوات وتسجيلات الشيوخ ({SHEIKH_AUDIO_TRACKS.length})
          </button>

          <button
            onClick={() => setActiveTab("formulas")}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeTab === "formulas"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            الصيغ المأثورة والفضائل ({SALAWAT_COLLECTION.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {activeTab === "audio" ? (
            SHEIKH_AUDIO_TRACKS.map((track) => {
              const isCurrent = activeTrackId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (isCurrent) {
                      onTogglePlayPause();
                    } else {
                      onPlayTrack(track);
                    }
                  }}
                  className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                    isCurrent
                      ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-stone-100 hover:border-emerald-200"
                  }`}
                >
                  <button
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95 ${
                      isCurrent && isPlaying
                        ? "bg-[#2F5241] text-white animate-pulse"
                        : "bg-stone-100 text-[#2F5241] hover:bg-emerald-100"
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current mr-0.5" />
                    )}
                  </button>

                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs font-bold text-stone-900 font-tajawal">
                        {track.sheikhName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        {track.categoryLabel}
                      </span>
                    </div>

                    <h4 className="text-xs text-stone-600 font-tajawal mt-0.5 line-clamp-1">
                      {track.title}
                    </h4>

                    <p className="text-[11px] font-amiri text-stone-500 mt-1 line-clamp-1">
                      {track.arabicText}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            SALAWAT_COLLECTION.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {item.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400 font-tajawal">
                    المستحب: {item.recommendedCount} مرات
                  </span>
                </div>

                <h4 className="text-sm font-bold font-tajawal text-stone-900">
                  {item.title}
                </h4>

                <p className="text-sm sm:text-base font-amiri font-bold text-stone-800 leading-relaxed text-right bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {item.arabicText}
                </p>

                <div className="text-xs text-stone-500 font-amiri space-y-1">
                  <p><strong>المعنى:</strong> {item.meaning}</p>
                  <p><strong>الفضل:</strong> {item.virtue}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
