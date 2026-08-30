import React, { useState } from "react";
import { VIRTUES_LIST, SHEIKH_AUDIO_TRACKS } from "../data/salawatData";
import { SheikhAudioTrack } from "../types";
import { Volume2, Share2, Check, Copy, BookOpen, Heart } from "lucide-react";

interface VirtuesSectionProps {
  onPlaySheikhTrack: (track: SheikhAudioTrack) => void;
  activePlayingId: string | null;
  isPlaying: boolean;
}

export const VirtuesSection: React.FC<VirtuesSectionProps> = ({
  onPlaySheikhTrack,
  activePlayingId,
  isPlaying,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyHadith = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Virtues Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200">
            فضائل الصلاة على النبي ﷺ من صريح السنة النبوية المطهرة
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
          الصلاة على رسول الله ﷺ من أجلّ القربات وأعظم الطاعات؛ بها تُفرّج الهموم، وتُغفر الذنوب، وتتنزّل الرحمات والبركات، وتُرفع الدرجات في أعلى عليين.
        </p>
      </div>

      {/* Grid of Authentic Hadith Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VIRTUES_LIST.map((v, idx) => {
          const matchedTrack = SHEIKH_AUDIO_TRACKS.find((t) => t.id === v.sheikhTrackId) || SHEIKH_AUDIO_TRACKS[0];
          const isPlayingThis = isPlaying && activePlayingId === matchedTrack.id;
          const shareText = `فضل: ${v.title}\n\nقال رسول الله ﷺ: ${v.hadith}\n(${v.narrator})\n\nالفائدة: ${v.benefit}\n\nاللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ\nتواصل معنا: https://www.facebook.com/share/1Bm2aq9mKm/`;

          return (
            <div
              key={idx}
              className="bg-stone-900/80 border border-stone-800 hover:border-emerald-700/50 rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-xs font-bold text-amber-300">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-amber-200">{v.title}</h3>
                  </div>
                </div>

                <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 my-2">
                  <p className="text-base sm:text-lg font-amiri font-bold text-stone-100 leading-loose">
                    {v.hadith}
                  </p>
                  <span className="text-[11px] text-stone-400 block mt-2">({v.narrator})</span>
                </div>

                <div className="mt-3 text-xs sm:text-sm text-stone-300 font-amiri leading-relaxed">
                  <span className="text-emerald-400 font-semibold">الثمرة والأثر: </span>
                  <span>{v.benefit}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                <button
                  id={`play-hadith-sheikh-${idx}`}
                  onClick={() => onPlaySheikhTrack(matchedTrack)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isPlayingThis
                      ? "bg-amber-600 text-stone-950 font-bold shadow"
                      : "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingThis ? `تلاوة ${matchedTrack.sheikhName}...` : `استمع بصوت ${matchedTrack.sheikhName}`}</span>
                </button>

                <button
                  id={`copy-hadith-${idx}`}
                  onClick={() => handleCopyHadith(shareText, idx)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الفائدة</span>
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
