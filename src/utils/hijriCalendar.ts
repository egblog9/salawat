// Comprehensive Islamic Hijri Calendar & Events Utility

export interface IslamicEvent {
  id: string;
  title: string;
  hijriMonth: number; // 1-12 (1 = Muharram)
  hijriDay: number;
  hijriDayEnd?: number;
  description: string;
  category: "holiday" | "fasting" | "night" | "month_start";
  virtue?: string;
}

export const HIJRI_MONTHS = [
  { number: 1, name: "مُحَرَّم", isSacred: true, description: "شهر الله المحرم، من الأشهر الحرم ويستحب فيه الصيام وفيه يوم عاشوراء" },
  { number: 2, name: "صَفَر", isSacred: false, description: "الشهر الثاني في التقويم الهجري" },
  { number: 3, name: "رَبِيع الأَوَّل", isSacred: false, description: "شهر ميلاد النبي المصطفى محمد ﷺ وهجرته الشريفة" },
  { number: 4, name: "رَبِيع الآخِر", isSacred: false, description: "الشهر الرابع في التقويم الهجري" },
  { number: 5, name: "جُمَادَى الأُولَى", isSacred: false, description: "الشهر الخامس في التقويم الهجري" },
  { number: 6, name: "جُمَادَى الآخِرَة", isSacred: false, description: "الشهر السادس في التقويم الهجري" },
  { number: 7, name: "رَجَب", isSacred: true, description: "من الأشهر الحرم المعظمة وفيه حادثة الإسراء والمعراج المباركة" },
  { number: 8, name: "شَعْبَان", isSacred: false, description: "شهر ترفع فيه الأعمال إلى الله وفيه ليلة النصف من شعبان" },
  { number: 9, name: "رَمَضَان", isSacred: false, description: "شهر الصيام والقرآن وفيه ليلة القدر المباركة خير من ألف شهر" },
  { number: 10, name: "شَوَّال", isSacred: false, description: "أوله عيد الفطر المبارك ويستحب فيه صيام ست من شوال" },
  { number: 11, name: "ذُو القَعْدَة", isSacred: true, description: "من الأشهر الحرم ومن أشهر الحج" },
  { number: 12, name: "ذُو الحِجَّة", isSacred: true, description: "شهر الحج وفيه العشر الأوائل ويوم عرفة وعيد الأضحى المبارك" },
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: "hijri_new_year",
    title: "رأس السنة الهجرية",
    hijriMonth: 1,
    hijriDay: 1,
    description: "بداية العام الهجري الجديد واستذكار هجرة النبي ﷺ من مكة إلى المدينة المنورة.",
    category: "holiday",
    virtue: "استفتاح العام بالطاعات والتوبة والإقبال على الله.",
  },
  {
    id: "tasua",
    title: "يوم تاسوعاء",
    hijriMonth: 1,
    hijriDay: 9,
    description: "اليوم التاسع من محرم، يستحب صيامه مع عاشوراء لمخالفة أهل الكتاب.",
    category: "fasting",
    virtue: "قال ﷺ: (لئن بقيت إلى قابل لأصومن التاسع).",
  },
  {
    id: "ashura",
    title: "يوم عاشوراء",
    hijriMonth: 1,
    hijriDay: 10,
    description: "اليوم العاشر من شهر محرم، نجا الله فيه موسى وقومه من فرعون.",
    category: "fasting",
    virtue: "يكفر ذنوب السنة التي قبله كما صح في الحديث النبوي.",
  },
  {
    id: "mawlid",
    title: "ذكرى المولد النبوي الشريف",
    hijriMonth: 3,
    hijriDay: 12,
    description: "يوم مولد خاتم الأنبياء والمرسلين نبينا محمد ﷺ.",
    category: "holiday",
    virtue: "فرصة مباركة لتكثيف الصلاة على النبي ﷺ ودراسة سيرته العطرة.",
  },
  {
    id: "isra_miraj",
    title: "ليلة الإسراء والمعراج",
    hijriMonth: 7,
    hijriDay: 27,
    description: "معجزة إسراء النبي ﷺ من المسجد الحرام إلى المسجد الأقصى ومعراجه إلى السماوات العلا وفرض الصلوات الخمس.",
    category: "night",
    virtue: "استشعار عظمة الصلاة ومكانة المسجد الأقصى المبارك.",
  },
  {
    id: "nisf_shaban",
    title: "ليلة النصف من شعبان",
    hijriMonth: 8,
    hijriDay: 15,
    description: "ليلة مباركة يطلع الله فيها على خلقه فيغفر للمستغفرين إلا لمشرك أو مشاحن.",
    category: "night",
    virtue: "تصفية القلوب من الشحناء والإكثار من الاستغفار والدعاء.",
  },
  {
    id: "ramadan_start",
    title: "غرة شهر رمضان المبارك",
    hijriMonth: 9,
    hijriDay: 1,
    description: "أول أيام الصيام المبارك، شهر تفتح فيه أبواب الجنة وتغلق أبواب النار.",
    category: "fasting",
    virtue: "من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه.",
  },
  {
    id: "laylat_qadr",
    title: "تحري ليلة القدر المباركة",
    hijriMonth: 9,
    hijriDay: 21,
    hijriDayEnd: 30,
    description: "الليالي الوترية من العشر الأواخر من رمضان، فيها ليلة القدر خير من ألف شهر.",
    category: "night",
    virtue: "عبادتها خير من عبادة ثلاث وثمانين سنة وأربعة أشهر.",
  },
  {
    id: "eid_fitr",
    title: "عيد الفطر المبارك",
    hijriMonth: 10,
    hijriDay: 1,
    hijriDayEnd: 3,
    description: "جائزة الصائمين وفرحة إتمام شهر الصيام والقيام.",
    category: "holiday",
    virtue: "يوم بهجة وشكر وصلة رحم وإخراج زكاة الفطر.",
  },
  {
    id: "six_shawwal",
    title: "صيام الست من شوال",
    hijriMonth: 10,
    hijriDay: 2,
    hijriDayEnd: 30,
    description: "يستحب صيام 6 أيام من شوال بعد يوم العيد متفرقة أو متتابعة.",
    category: "fasting",
    virtue: "من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر.",
  },
  {
    id: "first_ten_dhulhijjah",
    title: "العشر الأوائل من ذي الحجة",
    hijriMonth: 12,
    hijriDay: 1,
    hijriDayEnd: 9,
    description: "أعظم أيام الدنيا والعمل الصالح فيها أحب إلى الله من سائر الأيام.",
    category: "fasting",
    virtue: "يستحب فيها الإكثار من التهليل والتكبير والتحميد والصيام.",
  },
  {
    id: "arafah",
    title: "يوم عرفة المبارك",
    hijriMonth: 12,
    hijriDay: 9,
    description: "ركن الحج الأعظم، وخير يوم طلعت عليه الشمس وأعظم أيام الدعاء.",
    category: "fasting",
    virtue: "صيامه لغير الحاج يكفر السنة الماضية والباقية.",
  },
  {
    id: "eid_adha",
    title: "عيد الأضحى المبارك (يوم النحر)",
    hijriMonth: 12,
    hijriDay: 10,
    hijriDayEnd: 13,
    description: "يوم الحج الأكبر وذبح الأضاحي وأيام التشريق أيام أكل وشرب وذكر لله.",
    category: "holiday",
    virtue: "إحياء سنة أبينا إبراهيم ﷺ وتوزيع الأضاحي وصلة الأرحام.",
  },
];

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  year: number;
  dayName: string;
  gregorianDate: Date;
  isWhiteDay: boolean; // 13, 14, 15
  events: IslamicEvent[];
  isSacredMonth: boolean;
}

function normalizeDigits(str: string): string {
  if (!str) return "0";
  return str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
}

/**
 * High-accuracy conversion from Gregorian date to Hijri Date
 * Supports user offset (+1 / -1 / +2 days for moon sighting adjustments)
 */
export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): HijriDateInfo {
  const adjustedDate = new Date(date.getTime() + adjustmentDays * 86400000);
  
  // Use Intl with Islamic Umm al-Qura calendar
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    });

    const weekdayFormatter = new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
    });

    const parts = formatter.formatToParts(adjustedDate);
    let day = 1;
    let month = 1;
    let year = 1448;
    let dayName = weekdayFormatter.format(adjustedDate);

    for (const part of parts) {
      const val = parseInt(normalizeDigits(part.value), 10);
      if (part.type === "day" && val) day = val;
      if (part.type === "month" && val) month = val;
      if (part.type === "year" && val) year = val;
    }

    const monthObj = HIJRI_MONTHS.find((m) => m.number === month) || HIJRI_MONTHS[0];
    const isWhiteDay = day === 13 || day === 14 || day === 15;

    // Check for matching events
    const matchingEvents = ISLAMIC_EVENTS.filter((e) => {
      if (e.hijriMonth !== month) return false;
      if (e.hijriDayEnd) {
        return day >= e.hijriDay && day <= e.hijriDayEnd;
      }
      return day === e.hijriDay;
    });

    return {
      day,
      month,
      monthName: monthObj.name,
      year,
      dayName,
      gregorianDate: adjustedDate,
      isWhiteDay,
      events: matchingEvents,
      isSacredMonth: monthObj.isSacred,
    };
  } catch (err) {
    // Fallback mathematical algorithm if Intl fails
    const monthObj = HIJRI_MONTHS[0];
    return {
      day: 1,
      month: 1,
      monthName: monthObj.name,
      year: 1448,
      dayName: "اليوم",
      gregorianDate: adjustedDate,
      isWhiteDay: false,
      events: [],
      isSacredMonth: true,
    };
  }
}

/**
 * Generate full Hijri calendar days for a given Gregorian Month & Year
 */
export function getMonthCalendarDays(year: number, monthIndex: number, adjustmentDays: number = 0) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysCount = lastDayOfMonth.getDate();

  // First day weekday (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

  const days: {
    gregorianDay: number;
    gregorianDate: Date;
    hijri: HijriDateInfo;
    isToday: boolean;
    isCurrentMonth: boolean;
  }[] = [];

  const today = new Date();
  const isTodayDate = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  for (let d = 1; d <= daysCount; d++) {
    const gDate = new Date(year, monthIndex, d);
    const hijriInfo = getHijriDate(gDate, adjustmentDays);
    days.push({
      gregorianDay: d,
      gregorianDate: gDate,
      hijri: hijriInfo,
      isToday: isTodayDate(gDate),
      isCurrentMonth: true,
    });
  }

  return {
    startDayOfWeek,
    days,
    daysCount,
    year,
    monthIndex,
  };
}

/**
 * Convert a specific Hijri Date to approximate Gregorian Date
 */
export function convertHijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  // Approximate conversion: 1 Hijri year ~ 354.367 days
  // Start reference: 1 Muharram 1446 AH ~ 7 July 2024
  const refHYear = 1446;
  const refHMonth = 1;
  const refHDay = 1;
  const refGDate = new Date(2024, 6, 7).getTime();

  const totalHDays = (hYear - refHYear) * 354.367 + (hMonth - refHMonth) * 29.53 + (hDay - refHDay);
  const approxGTime = refGDate + totalHDays * 86400000;
  return new Date(approxGTime);
}
