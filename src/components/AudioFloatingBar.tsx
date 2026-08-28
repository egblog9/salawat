import React from "react";
import { Volume2, Square, Play, Pause, FastForward, Repeat } from "lucide-react";
import { SheikhAudioTrack } from "../types";

interface AudioFloatingBarProps {
  isPlaying: boolean;
  currentTrack: SheikhAudioTrack | null;
  progress: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  currentRepeat: number;
  totalRepeats: number;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

export const AudioFloatingBar: React.FC<AudioFloatingBarProps> = ({
  isPlaying,
  currentTrack,
  progress,
  onPause,
  onResume,
  onStop,
  currentRepeat,
  totalRepeats,
  volume,
  onChangeVolume,
}) => {
  if (!currentTrack || (!isPlaying && progress === 0)) return null;

  return (
    <div className="fixed bottom-[76px] sm:bottom-[82px] md:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto z-30 animate-slideUp">
      <div className="bg-stone-900/95 border border-emerald-500/50 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-2">
        
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Audio Visualizer & Sheikh Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-950 border border-emerald-600/50 text-emerald-300 flex-shrink-0">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span className="truncate">بصوت: {currentTrack.sheikhName}</span>
                {totalRepeats > 1 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 flex-shrink-0">
                    {currentRepeat}/{totalRepeats}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 truncate font-amiri">
                {currentTrack.title} — {currentTrack.arabicText}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Play / Pause Toggle */}
            {isPlaying ? (
              <button
                onClick={onPause}
                className="p-1.5 sm:p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold cursor-pointer active:scale-95 flex-shrink-0"
                title="إيقاف مؤقت"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={onResume}
                className="p-1.5 sm:p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer active:scale-95 flex-shrink-0"
                title="استئناف"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-1.5">
              <input
                id="floating-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <button
              id="floating-stop-btn"
              onClick={onStop}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-900/90 hover:bg-rose-800 text-rose-100 text-xs font-bold flex items-center gap-1 border border-rose-600/40 shadow cursor-pointer active:scale-95 flex-shrink-0"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>إيقاف</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
