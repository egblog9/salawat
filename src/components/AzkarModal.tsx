import React, { useState } from "react";
import { ArrowRight, X, Sun, Moon, Volume2, CheckCircle2, RotateCcw, Share2, Sparkles } from "lucide-react";

interface AzkarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AzkarModal: React.FC<AzkarModalProps> = ({ isOpen, onClose }) => {
  const [activeType, setActiveType] = useState<"morning" | "evening">("morning");
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  if (!isOpen) return null;

  const morningAzkar = [
    {
      id: "m1",
      title: "آية الكرسي",
      text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      target: 1,
      reward: "من قرأها حين يصبح أُجير من الجن حتى يمسي",
    },
    {
      id: "m2",
      title: "سيد الاستغفار",
      text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
      target: 1,
      reward: "من قالها موقناً بها حين يصبح فمات من يومه دخل الجنة",
    },
    {
      id: "m3",
      title: "الصلاة على النبي ﷺ",
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      target: 10,
      reward: "من صلى عليّ حين يصبح عشراً وحين يمسي عشراً أدركته شفاعتي",
    },
    {
      id: "m4",
      title: "أصبحنا وأصبح الملك لله",
      text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      target: 1,
      reward: "سؤال خير هذا اليوم وخير ما بعده والاستعاذة من الشرور",
    },
    {
      id: "m5",
      title: "رضيت بالله رباً",
      text: "رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلَامِ دِينَاً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيَّاً.",
      target: 3,
      reward: "كان حقاً على الله أن يرضيه يوم القيامة",
    },
    {
      id: "m6",
      title: "بسم الله الذي لا يضر مع اسمه شيء",
      text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
      target: 3,
      reward: "لم يضره شيء ولم تصبه فجأة بلاء",
    },
    {
      id: "m7",
      title: "حسبنا الله ونعم الوكيل",
      text: "حَسْبِيَ اللَّهُ لا إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
      target: 7,
      reward: "كفاه الله ما أهمه من أمر الدنيا والآخرة",
    },
  ];

  const eveningAzkar = [
    {
      id: "e1",
      title: "أمسينا وأمسى الملك لله",
      text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      target: 1,
      reward: "حفظ النفس والمساء من كل مكروه",
    },
    {
      id: "e2",
      title: "سيد الاستغفار",
      text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
      target: 1,
      reward: "من مات في ليلته دخل الجنة",
    },
    {
      id: "e3",
      title: "الصلاة على النبي ﷺ",
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      target: 10,
      reward: "شفاعة النبي ﷺ يوم القيامة",
    },
    {
      id: "e4",
      title: "أعوذ بكلمات الله التامات",
      text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
      target: 3,
      reward: "لم يضره شيء في تلك الليلة",
    },
    {
      id: "e5",
      title: "بسم الله الذي لا يضر مع اسمه شيء",
      text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
      target: 3,
      reward: "لم تصبه فجأة بلاء حتى يصبح",
    },
    {
      id: "e6",
      title: "سورة الإخلاص والمعوذتين",
      text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ.",
      target: 3,
      reward: "تكفيك من كل شيء",
    },
  ];

  const currentList = activeType === "morning" ? morningAzkar : eveningAzkar;

  const handleIncrement = (id: string, target: number) => {
    const current = counts[id] || 0;
    if (current < target) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(25);
      }
      setCounts((prev) => ({ ...prev, [id]: current + 1 }));
    }
  };

  const handleReset = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const completedCount = currentList.filter(
    (item) => (counts[item.id] || 0) >= item.target
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none">
      
      {/* Full Page Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 sm:px-6 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
            title="رجوع للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-tajawal text-stone-900 flex items-center gap-2">
              <span>أذكار الصباح والمساء</span>
              {activeType === "morning" ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </h1>
            <p className="text-xs text-stone-500 font-amiri">
              حصن المسلم والسكينة والبركة اليومية
            </p>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-emerald-900 font-tajawal">
          المكتمل: {completedCount} / {currentList.length}
        </div>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="bg-stone-100 p-2 border-b border-stone-200">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveType("morning")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeType === "morning"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>أذكار الصباح</span>
          </button>

          <button
            onClick={() => setActiveType("evening")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeType === "evening"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-300" />
            <span>أذكار المساء</span>
          </button>
        </div>
      </div>

      {/* Full Page Content List */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-12">
          {currentList.map((item) => {
            const current = counts[item.id] || 0;
            const isCompleted = current >= item.target;

            return (
              <div
                key={item.id}
                onClick={() => handleIncrement(item.id, item.target)}
                className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer select-none relative overflow-hidden shadow-sm ${
                  isCompleted
                    ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400"
                    : "border-stone-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full font-tajawal">
                    {item.title}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold font-tajawal bg-emerald-100/80 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم الورد</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset(item.id);
                      }}
                      className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                      title="إعادة ضبط العداد"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-base sm:text-lg font-amiri font-bold text-stone-800 leading-relaxed text-right my-3 p-3 bg-stone-50/60 rounded-2xl border border-stone-100">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11.5px] text-stone-500 font-amiri max-w-[70%]">
                    {item.reward}
                  </span>

                  {/* Circular Counter Button */}
                  <div
                    className={`px-4 py-1.5 rounded-2xl font-black text-xs font-tajawal shadow-sm transition-transform active:scale-95 ${
                      isCompleted
                        ? "bg-emerald-700 text-white"
                        : "bg-[#2F5241] text-white"
                    }`}
                  >
                    {current} / {item.target}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

    </div>
  );
};
