import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Award,
} from "lucide-react";
import { SURAH_LIST, SurahMeta, AyahItem, EMBEDDED_SURAHS, getAyahAudioUrl } from "../data/quranData";
import { quranService } from "../utils/quranService";

interface QuranMemorizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Word Recitation Status
type WordStatus = "unspoken" | "correct" | "incorrect" | "skipped";

interface QuranWordItem {
  id: string;
  originalWord: string; // Original word with Tashkeel
  cleanWord: string; // Cleaned normalized word
  ayahNumberInSurah: number;
  wordIndexInAyah: number;
  isAyahEnd?: boolean;
}

interface EvaluatedWord {
  target: QuranWordItem;
  status: WordStatus;
  userSpokenWord?: string;
  feedback?: string;
}

// Arabic Normalization Helper
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // remove harakat/tashkeel & pause marks
    .replace(/[أإآٱ]/g, "ا") // normalize Alef
    .replace(/ى/g, "ي") // normalize Ya
    .replace(/ة/g, "ه") // normalize Ta Marbuta
    .replace(/ؤ/g, "و") // normalize Waw Hamza
    .replace(/ئ/g, "ي") // normalize Ya Hamza
    .replace(/[^\u0621-\u064A\s]/g, "") // remove non-arabic letters/punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export const QuranMemorizeModal: React.FC<QuranMemorizeModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Selected Surah & Page
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [surahAyahs, setSurahAyahs] = useState<AyahItem[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);
  const [isSurahPickerOpen, setIsSurahPickerOpen] = useState<boolean>(false);

  // Speech Recognition & Listening State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [manualInputText, setManualInputText] = useState<string>("");
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  // Mushaf Display Modes
  const [showFullTextHint, setShowFullTextHint] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentSurah = useMemo(() => {
    return SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[0];
  }, [selectedSurahNumber]);

  // Load Ayahs when Surah changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingAyahs(true);
    setSpokenTranscript("");
    setManualInputText("");
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    quranService.loadSurahAyahs(selectedSurahNumber).then((ayahs) => {
      if (isMounted) {
        setSurahAyahs(ayahs);
        setIsLoadingAyahs(false);
      }
    });

    return () => {
      isMounted = false;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, [selectedSurahNumber, isOpen]);

  // Break Surah into flat list of Words
  const allTargetWords = useMemo<QuranWordItem[]>(() => {
    const list: QuranWordItem[] = [];
    if (!surahAyahs || surahAyahs.length === 0) return list;

    surahAyahs.forEach((ayah) => {
      // Split words
      const rawWords = ayah.text.split(/\s+/).filter(Boolean);
      rawWords.forEach((rawW, idx) => {
        const isLastInAyah = idx === rawWords.length - 1;
        list.push({
          id: `${ayah.numberInSurah}-${idx}`,
          originalWord: rawW,
          cleanWord: normalizeArabicText(rawW),
          ayahNumberInSurah: ayah.numberInSurah,
          wordIndexInAyah: idx,
          isAyahEnd: isLastInAyah,
        });
      });
    });

    return list;
  }, [surahAyahs]);

  // Evaluate user speech against Quran words in real-time
  const evaluatedWords = useMemo<EvaluatedWord[]>(() => {
    if (allTargetWords.length === 0) return [];

    const rawInput = (spokenTranscript + " " + manualInputText).trim();
    if (!rawInput) {
      return allTargetWords.map((w) => ({
        target: w,
        status: "unspoken",
      }));
    }

    const spokenTokens = normalizeArabicText(rawInput).split(/\s+/).filter(Boolean);
    const result: EvaluatedWord[] = [];
    let spokenIdx = 0;

    for (let targetIdx = 0; targetIdx < allTargetWords.length; targetIdx++) {
      const target = allTargetWords[targetIdx];

      if (spokenIdx >= spokenTokens.length) {
        // Remaining words haven't been reached yet
        result.push({
          target,
          status: "unspoken",
        });
        continue;
      }

      const currentSpoken = spokenTokens[spokenIdx];

      // Exact match or clean Arabic match
      if (currentSpoken === target.cleanWord) {
        result.push({
          target,
          status: "correct",
          userSpokenWord: currentSpoken,
        });
        spokenIdx++;
      } else {
        // Check if next target word matches instead (single word skipped)
        const nextTarget1 = allTargetWords[targetIdx + 1]?.cleanWord;

        if (nextTarget1 && nextTarget1 === currentSpoken) {
          // Current target was skipped/forgotten
          result.push({
            target,
            status: "skipped",
            feedback: `نسيان: الكلمة هي «${target.originalWord}»`,
          });
          // Do not increment spokenIdx so next iteration matches nextTarget1
        } else {
          // User pronounced a different word or misspelled word
          result.push({
            target,
            status: "incorrect",
            userSpokenWord: currentSpoken,
            feedback: `نُطق: «${currentSpoken}» | الأصل: «${target.originalWord}»`,
          });
          spokenIdx++;
        }
      }
    }

    return result;
  }, [allTargetWords, spokenTranscript, manualInputText]);

  // Calculate Accuracy Stats
  const stats = useMemo(() => {
    const correctCount = evaluatedWords.filter((w) => w.status === "correct").length;
    const errorCount = evaluatedWords.filter((w) => w.status === "incorrect").length;
    const skippedCount = evaluatedWords.filter((w) => w.status === "skipped").length;
    const totalAttempted = correctCount + errorCount + skippedCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const progressPercent =
      allTargetWords.length > 0
        ? Math.min(100, Math.round((correctCount / allTargetWords.length) * 100))
        : 0;

    return {
      correctCount,
      errorCount,
      skippedCount,
      accuracy,
      progressPercent,
      isCompleted: correctCount === allTargetWords.length && allTargetWords.length > 0,
    };
  }, [evaluatedWords, allTargetWords]);

  // Speech Recognition Initializer
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setSpeechError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("متصفحك لا يدعم التعرف الصوتي المباشر. يمكنك استخدام زر التجربة اليدوية أدناه.");
      setShowManualInput(true);
      return;
    }

    try {
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "ar-SA";

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setSpokenTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setSpeechError("يرجى إعطاء إذن استخدام الميكروفون للبدء بالتسميع.");
          } else if (event.error === "network") {
            setSpeechError("تعذر الاتصال بخدمة الصوت. يمكنك استخدام الإدخال اليدوي.");
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      console.warn("Error starting speech recognition:", e);
      setIsListening(false);
      setSpeechError("تعذر بدء الميكروفون. يمكنك التجربة عبر الكتابة أو متصفح Chrome/Safari.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Reset recitation
  const handleResetRecitation = () => {
    setSpokenTranscript("");
    setManualInputText("");
    setSpeechError(null);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  // Play Reciter Audio for Reference
  const handleToggleReferenceAudio = () => {
    if (isPlayingAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (surahAyahs.length === 0) return;

    // Play first ayah of the surah
    const audioUrl = getAyahAudioUrl("Alafasy_128kbps", selectedSurahNumber, 1);
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }

    audioPlayerRef.current.src = audioUrl;
    audioPlayerRef.current.play();
    setIsPlayingAudio(true);

    audioPlayerRef.current.onended = () => {
      setIsPlayingAudio(false);
    };
    audioPlayerRef.current.onerror = () => {
      setIsPlayingAudio(false);
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F4EE] flex flex-col text-stone-900 overflow-hidden font-tajawal animate-in fade-in duration-200 select-none">
      
      {/* 1. Top Bar Navigation */}
      <header className="h-16 bg-white border-b border-stone-200/90 px-4 sm:px-6 flex items-center justify-between shadow-sm flex-shrink-0 z-20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center: Surah & Page Selector Info */}
        <div className="flex items-center gap-2 text-center">
          <button
            onClick={() => setIsSurahPickerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span className="font-bold text-sm sm:text-base font-amiri">
              سورة {currentSurah.name}
            </span>
            <span className="text-xs text-emerald-700 bg-white px-2 py-0.5 rounded-full font-tajawal font-medium">
              صفحة {currentSurah.page}
            </span>
          </button>

          {/* Beta Badge (تجريبي) */}
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] tracking-wide shadow-sm ring-1 ring-white animate-pulse">
            تجريبي
          </span>
        </div>

        {/* Top Right: Full Text Hint Toggle & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFullTextHint(!showFullTextHint)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              showFullTextHint
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-stone-100 hover:bg-stone-200 text-stone-600"
            }`}
            title={showFullTextHint ? "إخفاء المصحف" : "إظهار المصحف للمراجعة"}
          >
            {showFullTextHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={handleResetRecitation}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-all cursor-pointer"
            title="إعادة التسميع من البداية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Surah Quick Switcher Modal / Dropdown */}
      {isSurahPickerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h4 className="font-bold text-stone-800 text-base">
                اختر السورة للاختبار والتسميع
              </h4>
              <button
                onClick={() => setIsSurahPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto grid grid-cols-2 gap-2">
              {SURAH_LIST.map((s) => (
                <button
                  key={s.number}
                  onClick={() => {
                    setSelectedSurahNumber(s.number);
                    setIsSurahPickerOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    s.number === selectedSurahNumber
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                      : "bg-[#FBFBFA] border-stone-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                      {s.number}
                    </span>
                    <span className="font-amiri font-bold text-sm">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {s.numberOfAyahs} آية
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Stats & Live Feedback Banner */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200/80 px-4 py-2 flex items-center justify-between gap-2 text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>صحيح: {stats.correctCount}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-red-700">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span>أخطاء ونسيان: {stats.errorCount + stats.skippedCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">نسبة الحفظ:</span>
          <div className="w-24 bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
            <div
              className={`h-full transition-all duration-300 ${
                stats.progressPercent === 100
                  ? "bg-emerald-600"
                  : stats.errorCount > 0
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-stone-800 font-mono">
            {stats.progressPercent}%
          </span>
        </div>
      </div>

      {/* 4. Main Mushaf Page Canvas */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
        
        {/* Authentic Mushaf Page Container */}
        <div className="w-full max-w-xl bg-[#FCFAF5] rounded-[32px] sm:rounded-[36px] border-[6px] sm:border-[8px] border-[#2A4839] shadow-2xl p-5 sm:p-8 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
          
          {/* Inner Golden Decorative Border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#C5A869]/60 rounded-[24px] sm:rounded-[28px] pointer-events-none" />

          {/* Surah Header Banner Ribbon */}
          <div className="relative z-10 text-center mb-6">
            <div className="inline-block bg-[#2A4839] text-[#F3E7C4] px-6 py-2 rounded-2xl shadow-md border-2 border-[#C5A869]/70">
              <span className="font-amiri font-bold text-lg sm:text-xl">
                سُورَةُ {currentSurah.name}
              </span>
              <div className="text-[10px] text-emerald-200/90 font-tajawal mt-0.5">
                {currentSurah.revelationType === "Meccan" ? "مكية" : "مدنية"} • {currentSurah.numberOfAyahs} آيات
              </div>
            </div>

            {/* Basmalah (For all except Surah 9) */}
            {selectedSurahNumber !== 9 && (
              <div className="font-amiri font-bold text-base sm:text-xl text-stone-800 mt-4 tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}
          </div>

          {/* Page Quranic Recitation Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
            {isLoadingAyahs ? (
              <div className="text-center py-12 text-stone-400">
                <BookOpen className="w-8 h-8 mx-auto animate-bounce text-emerald-700" />
                <p className="text-xs font-tajawal mt-2">جاري تجهيز صفحة المصحف الشريف...</p>
              </div>
            ) : showFullTextHint ? (
              /* Full Text Peek / Reference View */
              <div className="space-y-4 text-center">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-tajawal text-amber-900 mb-2">
                  وضع المراجعة: يمكنك قراءة الآيات وتثبيتها قبل بدء التسميع
                </div>
                <div className="text-right leading-loose font-amiri text-lg sm:text-xl text-stone-900">
                  {surahAyahs.map((a) => (
                    <span key={a.numberInSurah} className="inline">
                      {a.text}{" "}
                      <span className="text-emerald-800 font-bold px-1.5 py-0.5 text-sm">
                        ﴿{a.numberInSurah}﴾
                      </span>{" "}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* Voice Tested Words Stream */
              <div className="text-right font-amiri leading-loose text-lg sm:text-2xl text-stone-900">
                {evaluatedWords.map((item, idx) => {
                  if (item.status === "correct") {
                    return (
                      <span
                        key={item.target.id}
                        className="inline text-stone-900 font-bold transition-all"
                      >
                        {item.target.originalWord}{" "}
                        {item.target.isAyahEnd && (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-900 font-bold text-sm border border-emerald-300 mx-1 align-middle shadow-xs">
                            {item.target.ayahNumberInSurah}
                          </span>
                        )}{" "}
                      </span>
                    );
                  }

                  if (item.status === "incorrect") {
                    return (
                      <span
                        key={item.target.id}
                        className="inline-block px-1.5 py-0.5 mx-0.5 rounded-lg bg-red-100 text-red-700 border border-red-300 font-bold underline decoration-red-500 underline-offset-4 animate-shake"
                        title={item.feedback}
                      >
                        {item.target.originalWord}
                        <span className="block text-[10px] font-tajawal text-red-600 no-underline font-normal">
                          (نُطق: {item.userSpokenWord})
                        </span>
                      </span>
                    );
                  }

                  if (item.status === "skipped") {
                    return (
                      <span
                        key={item.target.id}
                        className="inline-block px-1.5 py-0.5 mx-0.5 rounded-lg bg-red-50 text-red-600 border border-dashed border-red-400 font-bold"
                        title={item.feedback}
                      >
                        [نسيان: {item.target.originalWord}]
                      </span>
                    );
                  }

                  // Unspoken word (blank guided dash)
                  return (
                    <span
                      key={item.target.id}
                      className="inline-block w-8 sm:w-10 border-b-2 border-dashed border-stone-300 mx-1 align-middle opacity-50"
                    />
                  );
                })}
              </div>
            )}

            {/* If user completed successfully */}
            {stats.isCompleted && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-100/90 border border-emerald-400 text-center text-emerald-950 animate-in zoom-in-95">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="w-6 h-6 text-emerald-700" />
                  <span className="font-bold font-amiri text-lg">
                    مَا شَاءَ اللَّهُ! أَحْسَنْتَ وَبَارَكَ اللَّهُ فِيكَ
                  </span>
                </div>
                <p className="text-xs font-tajawal">
                  أتممت تسميع سورة {currentSurah.name} بنجاح تام وبدقة عالية.
                </p>
              </div>
            )}
          </div>

          {/* Mushaf Page Footer */}
          <div className="relative z-10 pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500 font-tajawal">
            <span>الجزء {currentSurah.juz}</span>
            <span className="font-bold text-[#2A4839]">مصحف التسميع والتحفيظ الذكي</span>
            <span>صفحة {currentSurah.page}</span>
          </div>
        </div>
      </main>

      {/* 5. Live Speech Transcript Display (يكتب اللي بيتقال بالضبط) */}
      {(spokenTranscript || isListening) && (
        <div className="bg-emerald-950/90 text-white px-4 py-2 text-xs flex items-center justify-between gap-2 border-t border-emerald-800/40 animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-emerald-300 font-bold whitespace-nowrap">ما التقطه المايك:</span>
            <p className="font-amiri text-sm text-stone-100 truncate">
              {spokenTranscript || "بانتظار نطق الآيات..."}
            </p>
          </div>
          {spokenTranscript && (
            <button
              onClick={() => setSpokenTranscript("")}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white px-2 py-0.5 rounded-md transition-colors cursor-pointer flex-shrink-0"
            >
              مسح الصوت
            </button>
          )}
        </div>
      )}

      {/* 6. Speech / Manual Input Notification Banner */}
      {speechError && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-2 text-xs text-red-700 flex items-center justify-between">
          <span>{speechError}</span>
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-red-900 font-bold underline cursor-pointer"
          >
            {showManualInput ? "إخفاء الكتابة" : "فتح الكتابة اليدوية"}
          </button>
        </div>
      )}

      {/* Manual Input Bar (For devices without mic or quick testing) */}
      {showManualInput && (
        <div className="bg-white border-t border-stone-200 p-3 flex items-center gap-2 z-20">
          <input
            type="text"
            value={manualInputText}
            onChange={(e) => setManualInputText(e.target.value)}
            placeholder="اكتب الآيات هنا لاختبار التطابق الفوري (مثال: الحمد لله رب العالمين)..."
            className="flex-1 px-3 py-2 rounded-xl bg-stone-100 text-xs font-amiri text-stone-900 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={() => setManualInputText("")}
            className="px-3 py-2 rounded-xl bg-stone-100 text-xs font-tajawal text-stone-600 hover:bg-stone-200"
          >
            مسح
          </button>
        </div>
      )}

      {/* 6. Prominent Bottom Microphone & Recitation Controls */}
      <footer className="bg-white border-t border-stone-200/90 p-4 sm:p-5 flex items-center justify-between max-w-lg w-full mx-auto shadow-lg z-20">
        
        {/* Left: Listen to Correct Recitation Audio */}
        <button
          onClick={handleToggleReferenceAudio}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
            isPlayingAudio
              ? "bg-emerald-700 text-white shadow-md animate-pulse"
              : "bg-stone-100 hover:bg-stone-200 text-stone-700"
          }`}
          title="الاستماع للتلاوة الصحيحة بصوت الشيخ"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>إيقاف القارئ</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>استماع للتلاوة</span>
            </>
          )}
        </button>

        {/* Center: Large Pulsing Microphone Button (علامة مايك في الأسفل) */}
        <div className="relative -mt-8 flex flex-col items-center">
          <button
            onClick={toggleListening}
            id="quran-mic-recite-btn"
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ring-4 ring-white ${
              isListening
                ? "bg-red-600 text-white scale-110 shadow-red-600/50 animate-pulse"
                : "bg-gradient-to-tr from-[#1E3A2B] to-[#2F5241] text-white hover:scale-105 shadow-emerald-950/40"
            }`}
            title={isListening ? "انقر لإيقاف التسجيل" : "انقر للتسميع بالصوت"}
          >
            {isListening ? (
              <Mic className="w-8 h-8 sm:w-9 sm:h-9 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
            )}
          </button>

          <span className="text-[11px] font-bold font-tajawal mt-1 text-stone-700">
            {isListening ? "جاري الاستماع... رتّل الآن" : "اضغط المايك وابدأ التسميع"}
          </span>
        </div>

        {/* Right: Reset Recitation */}
        <button
          onClick={handleResetRecitation}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold font-tajawal transition-all cursor-pointer"
          title="إعادة التسميع"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة</span>
        </button>

      </footer>

    </div>
  );
};
