import React from "react";
import { Volume2, Square, Play, Pause, X } from "lucide-react";
import { SheikhAudioTrack } from "../types";

interface AudioFloatingBarProps {
  isPlaying: boolean;
  currentTrack: SheikhAudioTrack | null;
  customTitle?: string | null;
  customSubtitle?: string | null;
  progress: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  currentRepeat?: number;
  totalRepeats?: number;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

export const AudioFloatingBar: React.FC<AudioFloatingBarProps> = ({
  isPlaying,
  currentTrack,
  customTitle,
  customSubtitle,
  progress,
  onPause,
  onResume,
  onStop,
  currentRepeat = 1,
  totalRepeats = 1,
  volume,
  onChangeVolume,
}) => {
  // If nothing is playing and no active track/custom audio, hide
  const hasContent = currentTrack || customTitle || customSubtitle;
  if (!hasContent && !isPlaying) return null;

  const displayTitle =
    currentTrack?.title || customTitle || "تشغيل تلاوة مباركة";
  const displaySheikh =
    currentTrack?.sheikhName || customSubtitle || "صوت نقي ومبارك";
  const displayArabicText = currentTrack?.arabicText || "";

  return (
    <div
      id="floating-audio-controller"
      className="fixed bottom-[74px] sm:bottom-[80px] md:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto z-40 animate-slideUp"
    >
      <div className="bg-stone-950/95 border-2 border-emerald-500/70 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-xl flex flex-col gap-2 ring-4 ring-emerald-950/40">
        
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Audio Visualizer & Sheikh Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 flex-shrink-0 relative overflow-hidden">
              <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 ${isPlaying ? "animate-pulse" : ""}`} />
              {isPlaying && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>

            <div className="min-w-0 flex-1 text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span className="truncate">{displaySheikh}</span>
                {totalRepeats > 1 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 flex-shrink-0">
                    {currentRepeat}/{totalRepeats}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 truncate font-amiri font-semibold">
                {displayTitle} {displayArabicText ? `— ${displayArabicText}` : ""}
              </p>
            </div>
          </div>

          {/* Audio Control Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Play / Pause Toggle Button */}
            {isPlaying ? (
              <button
                type="button"
                id="floating-pause-btn"
                onClick={onPause}
                className="p-2 sm:p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer active:scale-95 flex-shrink-0 shadow transition-all"
                title="إيقاف مؤقت"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                id="floating-resume-btn"
                onClick={onResume}
                className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer active:scale-95 flex-shrink-0 shadow transition-all"
                title="استئناف التشغيل"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            )}

            {/* Volume slider (desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 px-1.5 py-1 bg-stone-900 rounded-xl border border-stone-800">
              <input
                id="floating-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-14 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                title="مستوى الصوت"
              />
            </div>

            {/* Dedicated High-Visibility STOP Button */}
            <button
              type="button"
              id="floating-stop-btn"
              onClick={onStop}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold font-tajawal flex items-center gap-1.5 border border-rose-500/60 shadow-lg cursor-pointer active:scale-95 flex-shrink-0 transition-all ring-2 ring-rose-500/20"
              title="إيقاف الصوت بالكامل"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>إيقاف الصوت</span>
            </button>

            {/* Dismiss Cross */}
            <button
              type="button"
              onClick={onStop}
              className="p-1 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors"
              title="إغلاق وإيقاف"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
