import React, { useState } from "react";
import { X, Sun, Moon, Volume2, CheckCircle2, RotateCcw } from "lucide-react";

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
      reward: "من قرأها حين يصبح أجير من الجن حتى يمسي",
    },
    {
      id: "m2",
      title: "سيد الاستغفار",
      text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
      target: 1,
      reward: "من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة",
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
      reward: "لم تصبه فجأة بلاء",
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
              أذكار الصباح والمساء
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              حصن المسلم والسكينة والبركة
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Toggle Morning / Evening */}
        <div className="p-3 bg-white border-b border-stone-100 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveType("morning")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeType === "morning"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>أذكار الصباح</span>
          </button>

          <button
            onClick={() => setActiveType("evening")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold font-tajawal transition-all cursor-pointer ${
              activeType === "evening"
                ? "bg-[#2F5241] text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>أذكار المساء</span>
          </button>
        </div>

        {/* List of Azkar */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {currentList.map((item) => {
            const current = counts[item.id] || 0;
            const isCompleted = current >= item.target;

            return (
              <div
                key={item.id}
                onClick={() => handleIncrement(item.id, item.target)}
                className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer select-none relative overflow-hidden shadow-sm ${
                  isCompleted
                    ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400"
                    : "border-stone-100 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {item.title}
                  </span>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم الورد</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset(item.id);
                      }}
                      className="text-stone-400 hover:text-stone-600 p-1"
                      title="إعادة ضبط العداد"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-amiri font-bold text-stone-800 leading-relaxed text-right my-2">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11px] text-stone-400 font-amiri">
                    {item.reward}
                  </span>

                  {/* Circular Counter Pill */}
                  <div className={`px-3 py-1 rounded-full font-black text-xs font-tajawal ${
                    isCompleted ? "bg-emerald-600 text-white" : "bg-stone-100 text-emerald-900"
                  }`}>
                    {current} / {item.target}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
