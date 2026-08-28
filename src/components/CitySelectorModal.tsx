import React from "react";
import { X, MapPin, Check } from "lucide-react";

interface CitySelectorModalProps {
  isOpen: boolean;
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  onClose: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  selectedCity,
  onSelectCity,
  onClose,
}) => {
  if (!isOpen) return null;

  const cities = [
    { name: "القاهرة", country: "مصر" },
    { name: "الإسكندرية", country: "مصر" },
    { name: "مكة المكرمة", country: "السعودية" },
    { name: "المدينة المنورة", country: "السعودية" },
    { name: "الرياض", country: "السعودية" },
    { name: "جدة", country: "السعودية" },
    { name: "القدس الشريف", country: "فلسطين" },
    { name: "دبي", country: "الإمارات" },
    { name: "أبوظبي", country: "الإمارات" },
    { name: "عمّان", country: "الأردن" },
    { name: "الكويت", country: "الكويت" },
    { name: "الدوحة", country: "قطر" },
    { name: "إسطنبول", country: "تركيا" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[34px] sm:rounded-[34px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-base font-bold font-tajawal text-stone-800">
              اختر المدينة لمواقيت الصلاة
            </h3>
            <p className="text-xs text-stone-500 font-tajawal">
              يتم ضبط وقت الأذان بدقة حسب موقعك
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* City list */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {cities.map((c) => {
            const isSelected = selectedCity === c.name;

            return (
              <button
                key={c.name}
                onClick={() => {
                  onSelectCity(c.name);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2F5241] text-white shadow-md"
                    : "bg-white text-stone-800 hover:bg-stone-100 border border-stone-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-emerald-800"}`} />
                  <div className="text-right">
                    <span className="text-sm font-bold font-tajawal block leading-tight">
                      {c.name}
                    </span>
                    <span className={`text-[10px] ${isSelected ? "text-stone-200" : "text-stone-400"}`}>
                      {c.country}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-5 h-5 text-amber-300" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
