import React, { useState, useEffect } from "react";
import {
  AlarmClock,
  Volume2,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RefreshCw,
} from "lucide-react";
import { loudAlarmAudioService } from "../utils/alarmAudio";
import { sheikhAudioManager } from "../utils/audio";

export interface AlarmChallengeConfig {
  type: "math" | "tasbeeh" | "order";
  difficulty: "easy" | "medium" | "hard";
  questionsCount: number;
}

interface FajrAlarmChallengeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  challengeType?: "math" | "tasbeeh" | "order";
  difficulty?: "easy" | "medium" | "hard";
}

interface MathProblem {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  answer: number;
}

export const FajrAlarmChallengeModal: React.FC<FajrAlarmChallengeModalProps> = ({
  isOpen,
  onDismiss,
  challengeType = "math",
  difficulty = "medium",
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;

  // Math State
  const [problem, setProblem] = useState<MathProblem>({ num1: 12, num2: 15, operator: "+", answer: 27 });
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tasbeeh State
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const targetTasbeeh = 33;

  // Word Order State
  const initialSentence = ["الصَّلَاةُ", "خَيْرٌ", "مِنَ", "النَّوْمِ"];
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Generate Math Problem
  const generateProblem = () => {
    let n1 = 10;
    let n2 = 5;
    let op: "+" | "-" | "×" = "+";
    let ans = 15;

    if (difficulty === "easy") {
      n1 = Math.floor(Math.random() * 20) + 10;
      n2 = Math.floor(Math.random() * 15) + 5;
      op = Math.random() > 0.5 ? "+" : "-";
      if (op === "-" && n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
      ans = op === "+" ? n1 + n2 : n1 - n2;
    } else if (difficulty === "medium") {
      const isMultiplication = Math.random() > 0.6;
      if (isMultiplication) {
        n1 = Math.floor(Math.random() * 9) + 4;
        n2 = Math.floor(Math.random() * 8) + 3;
        op = "×";
        ans = n1 * n2;
      } else {
        n1 = Math.floor(Math.random() * 50) + 25;
        n2 = Math.floor(Math.random() * 40) + 15;
        op = Math.random() > 0.5 ? "+" : "-";
        if (op === "-" && n1 < n2) {
          const temp = n1;
          n1 = n2;
          n2 = temp;
        }
        ans = op === "+" ? n1 + n2 : n1 - n2;
      }
    } else {
      // Hard / Genius
      n1 = Math.floor(Math.random() * 80) + 30;
      n2 = Math.floor(Math.random() * 60) + 20;
      const isMultiplication = Math.random() > 0.5;
      if (isMultiplication) {
        n1 = Math.floor(Math.random() * 14) + 6;
        n2 = Math.floor(Math.random() * 12) + 5;
        op = "×";
        ans = n1 * n2;
      } else {
        op = Math.random() > 0.5 ? "+" : "-";
        if (op === "-" && n1 < n2) {
          const temp = n1;
          n1 = n2;
          n2 = temp;
        }
        ans = op === "+" ? n1 + n2 : n1 - n2;
      }
    }

    setProblem({ num1: n1, num2: n2, operator: op, answer: ans });
    setUserAnswer("");
    setErrorMessage(null);
  };

  // Auto enforce volume and fullscreen on user touch
  const handleUserInteraction = () => {
    loudAlarmAudioService.enforceMaxVolume();
    if (typeof document !== "undefined" && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setTasbeehCount(0);
      generateProblem();

      // Scramble words for order puzzle
      const shuffled = [...initialSentence].sort(() => Math.random() - 0.5);
      setScrambledWords(shuffled);
      setSelectedWords([]);

      // Attempt fullscreen on open if allowed
      if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Math Answer
  const handleCheckMath = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsed)) {
      setErrorMessage("يرجى كتابة رقم صحيح!");
      return;
    }

    if (parsed === problem.answer) {
      // Correct!
      sheikhAudioManager.playBeadClick();
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        generateProblem();
      } else {
        // All math solved!
        finishAlarm();
      }
    } else {
      setErrorMessage(`إجابة غير صحيحة! (${userAnswer}) - ركّز واستيقظ!`);
      setUserAnswer("");
      // Vibrate warning
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };

  // Handle Tasbeeh Click
  const handleTasbeehClick = () => {
    sheikhAudioManager.playBeadClick();
    const nextCount = tasbeehCount + 1;
    setTasbeehCount(nextCount);
    if (nextCount >= targetTasbeeh) {
      finishAlarm();
    }
  };

  // Handle Word Order Click
  const handleWordSelect = (word: string, index: number) => {
    sheikhAudioManager.playBeadClick();
    const nextSelected = [...selectedWords, word];
    setSelectedWords(nextSelected);
    setScrambledWords((prev) => prev.filter((_, i) => i !== index));

    if (nextSelected.length === initialSentence.length) {
      const isCorrect = nextSelected.join(" ") === initialSentence.join(" ");
      if (isCorrect) {
        finishAlarm();
      } else {
        setErrorMessage("الترتيب غير صحيح! حاول مجدداً");
        setTimeout(() => {
          setSelectedWords([]);
          setScrambledWords([...initialSentence].sort(() => Math.random() - 0.5));
          setErrorMessage(null);
        }, 1200);
      }
    }
  };

  const finishAlarm = () => {
    loudAlarmAudioService.stopLoudAlarm();
    sheikhAudioManager.playCompletionChime();
    onDismiss();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      className="fixed inset-0 z-[9999] bg-stone-950/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Flashing Alert Beacon Borders */}
      <div className="absolute inset-0 border-4 border-red-500/50 pointer-events-none animate-pulse" />

      <div className="w-full max-w-lg bg-stone-900 border-2 border-red-500/80 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-red-950/80 text-center relative overflow-hidden my-auto">
        
        {/* Animated emergency glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Warning Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-red-500/80 text-red-300 text-xs font-bold mb-4 shadow-lg animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>منبه الفجر الذكي الخارق يصدح الآن!</span>
        </div>

        {/* Loud Audio Notice */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 mb-5 text-amber-200 text-xs flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="font-tajawal">
            المنبه يستعيد أقصى قوة صوتية تلقائياً حتى تُنهي التحدي وتستيقظ تماماً!
          </span>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-bold font-amiri text-stone-100 mb-1">
          الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-tajawal mb-6">
          أجب عن التحدي لإثبات استيقاظك وإيقاف المنبه:
        </p>

        {/* CHALLENGE 1: MATH PROBLEMS */}
        {challengeType === "math" && (
          <div className="space-y-5 bg-stone-950/80 border border-stone-800 p-5 rounded-3xl">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Brain className="w-4 h-4" />
                <span>تحدي المسائل الحسابية</span>
              </span>
              <span className="font-tajawal">
                المسألة {currentStep} من {totalSteps}
              </span>
            </div>

            {/* Problem Display */}
            <div className="py-4 text-4xl sm:text-5xl font-black text-amber-300 tracking-wider font-mono select-none direction-ltr">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>

            {/* Form Input */}
            <form onSubmit={handleCheckMath} className="space-y-4">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="اكتب الناتج هنا..."
                className="w-full text-center text-2xl font-bold font-mono py-3.5 px-4 rounded-2xl bg-stone-900 border-2 border-amber-500/60 text-amber-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20"
              />

              {errorMessage && (
                <p className="text-xs font-bold text-red-400 animate-shake">
                  {errorMessage}
                </p>
              )}

              {/* Number Pad Quick Helpers on Mobile */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setUserAnswer((prev) => prev + num.toString());
                      setErrorMessage(null);
                    }}
                    className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-lg cursor-pointer active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setUserAnswer("")}
                  className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-red-300 font-bold text-sm cursor-pointer active:scale-95 transition-all"
                >
                  مسح
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 text-stone-950 font-bold text-base cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  تأكيد الحل
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CHALLENGE 2: RAPID TASBEEH */}
        {challengeType === "tasbeeh" && (
          <div className="space-y-5 bg-stone-950/80 border border-stone-800 p-5 rounded-3xl">
            <div className="text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span className="text-amber-300 font-bold">
                تحدي ٣٣ تسبيحة لاستحضار النية والاستيقاظ
              </span>
            </div>

            <p className="font-amiri text-lg text-stone-200">
              «أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ»
            </p>

            <button
              type="button"
              onClick={handleTasbeehClick}
              className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-emerald-600 via-amber-600 to-emerald-700 p-1.5 shadow-2xl flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-transform select-none"
            >
              <div className="w-full h-full rounded-full bg-stone-950 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-amber-300 font-mono">
                  {tasbeehCount}
                </span>
                <span className="text-[11px] text-stone-400">
                  من {targetTasbeeh}
                </span>
              </div>
            </button>

            <p className="text-xs text-stone-400">
              اضغط على الدائرة {targetTasbeeh - tasbeehCount} مرات إضافية لإيقاف المنبه
            </p>
          </div>
        )}

        {/* CHALLENGE 3: WORD ORDER PUZZLE */}
        {challengeType === "order" && (
          <div className="space-y-5 bg-stone-950/80 border border-stone-800 p-5 rounded-3xl">
            <div className="text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span className="text-amber-300 font-bold">
                رتب كلمات أذان الفجر بالترتيب الصحيح
              </span>
            </div>

            {/* Target Area */}
            <div className="min-h-[50px] p-3 rounded-2xl bg-stone-900 border border-dashed border-amber-500/50 flex items-center justify-center gap-2 flex-wrap">
              {selectedWords.length === 0 ? (
                <span className="text-xs text-stone-500">اضغط على الكلمات بالترتيب لتضعها هنا</span>
              ) : (
                selectedWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 text-emerald-100 font-amiri font-bold text-sm"
                  >
                    {word}
                  </span>
                ))
              )}
            </div>

            {errorMessage && (
              <p className="text-xs font-bold text-red-400">{errorMessage}</p>
            )}

            {/* Word Chips to Click */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {scrambledWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordSelect(word, idx)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-amiri text-base font-bold shadow cursor-pointer active:scale-95 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedWords([]);
                setScrambledWords([...initialSentence].sort(() => Math.random() - 0.5));
              }}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة خلط الكلمات</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
