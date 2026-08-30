// Accurate Hijri & Gregorian date calculation utilities

export interface FullDateInfo {
  dayName: string;
  gregorianDate: string;
  gregorianYear: number;
  hijriDay: number;
  hijriMonthName: string;
  hijriYear: number;
  hijriDateStr: string;
}

export const HIJRI_MONTHS_AR = [
  "المُحَرَّم",
  "صَفَر",
  "رَبِيع الأَوَّل",
  "رَبِيع الآخِر",
  "جُمَادَى الأُولَى",
  "جُمَادَى الآخِرَة",
  "رَجَب",
  "شَعْبَان",
  "رَمَضَان",
  "شَوَّال",
  "ذُو القَعْدَة",
  "ذُو الحِجَّة",
];

export const GREGORIAN_MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const DAY_NAMES_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

function normalizeDigits(str: string): string {
  if (!str) return "0";
  return str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
}

export function getStoredHijriAdjustment(): number {
  try {
    const saved = localStorage.getItem("hijri_day_adjustment");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function setStoredHijriAdjustment(adjustment: number): void {
  try {
    localStorage.setItem("hijri_day_adjustment", adjustment.toString());
  } catch {}
}

export function getFullDateInfo(
  date: Date = new Date(),
  customAdjustmentDays?: number
): FullDateInfo {
  const adjustment =
    customAdjustmentDays !== undefined
      ? customAdjustmentDays
      : getStoredHijriAdjustment();

  const adjustedDate = new Date(date.getTime() + adjustment * 86400000);
  const dayName = DAY_NAMES_AR[adjustedDate.getDay()];
  const gDay = adjustedDate.getDate();
  const gMonth = GREGORIAN_MONTHS_AR[adjustedDate.getMonth()];
  const gYear = adjustedDate.getFullYear();
  const gregorianDate = `${gDay} ${gMonth} ${gYear} م`;

  // Calculate accurate Hijri date using Intl with fallback
  let hDay = 1;
  let monthIndex = 1;
  let hYear = 1448;

  try {
    // Using Latin numerals (-nu-latn) avoids NaN in parseInt
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = formatter.formatToParts(adjustedDate);

    for (const p of parts) {
      const cleanVal = parseInt(normalizeDigits(p.value), 10);
      if (p.type === "day" && cleanVal) {
        hDay = cleanVal;
      } else if (p.type === "month" && cleanVal) {
        monthIndex = cleanVal;
      } else if (p.type === "year" && cleanVal) {
        hYear = cleanVal;
      }
    }
  } catch {
    // Fallback mathematical approximation if Intl is unavailable
    const refHYear = 1446;
    const refHMonth = 1;
    const refHDay = 1;
    const refGDate = new Date(2024, 6, 7).getTime();
    const diffDays = Math.floor((adjustedDate.getTime() - refGDate) / 86400000);
    const totalHijriMonths = Math.floor(diffDays / 29.530588);
    hYear = refHYear + Math.floor(totalHijriMonths / 12);
    monthIndex = ((refHMonth - 1 + (totalHijriMonths % 12) + 12) % 12) + 1;
    hDay = Math.max(1, Math.min(30, (diffDays % 30) + 1));
  }

  const mIdx = Math.max(0, Math.min(11, monthIndex - 1));
  const hMonth = HIJRI_MONTHS_AR[mIdx];
  const hijriDateStr = `${hDay} ${hMonth} ${hYear} هـ`;

  return {
    dayName,
    gregorianDate,
    gregorianYear: gYear,
    hijriDay: hDay,
    hijriMonthName: hMonth,
    hijriYear: hYear,
    hijriDateStr,
  };
}

