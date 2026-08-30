export interface CityPrayerConfig {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
  methodName: string;
  qiblaAngle: number; // Degrees from North clockwise
  // Standard daily prayer times [fajr, sunrise, dhuhr, asr, maghrib, isha] (24h format "HH:MM")
  baseTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export const ISLAMIC_CITIES_DATABASE: CityPrayerConfig[] = [
  // Egypt
  {
    name: "القاهرة",
    country: "مصر",
    lat: 30.0444,
    lng: 31.2357,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 136,
    baseTimes: { fajr: "04:19", sunrise: "05:46", dhuhr: "12:57", asr: "16:32", maghrib: "20:07", isha: "21:30" },
  },
  {
    name: "الإسكندرية",
    country: "مصر",
    lat: 31.2001,
    lng: 29.9187,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 138,
    baseTimes: { fajr: "04:22", sunrise: "05:51", dhuhr: "13:02", asr: "16:39", maghrib: "20:13", isha: "21:37" },
  },
  {
    name: "الجيزة",
    country: "مصر",
    lat: 29.9870,
    lng: 31.2118,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 136,
    baseTimes: { fajr: "04:20", sunrise: "05:47", dhuhr: "12:57", asr: "16:32", maghrib: "20:07", isha: "21:30" },
  },
  {
    name: "طنطا",
    country: "مصر",
    lat: 30.7865,
    lng: 31.0004,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 137,
    baseTimes: { fajr: "04:18", sunrise: "05:46", dhuhr: "12:58", asr: "16:34", maghrib: "20:09", isha: "21:33" },
  },
  {
    name: "المنصورة",
    country: "مصر",
    lat: 31.0409,
    lng: 31.3785,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 137,
    baseTimes: { fajr: "04:16", sunrise: "05:44", dhuhr: "12:56", asr: "16:32", maghrib: "20:08", isha: "21:32" },
  },
  {
    name: "أسيوط",
    country: "مصر",
    lat: 27.1801,
    lng: 31.1837,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 130,
    baseTimes: { fajr: "04:24", sunrise: "05:48", dhuhr: "12:56", asr: "16:27", maghrib: "20:04", isha: "21:24" },
  },
  {
    name: "أسوان",
    country: "مصر",
    lat: 24.0889,
    lng: 32.8998,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 122,
    baseTimes: { fajr: "04:24", sunrise: "05:44", dhuhr: "12:49", asr: "16:16", maghrib: "19:54", isha: "21:11" },
  },

  // Saudi Arabia
  {
    name: "مكة المكرمة",
    country: "السعودية",
    lat: 21.4225,
    lng: 39.8262,
    timezone: 3,
    methodName: "أم القرى - مكة المكرمة",
    qiblaAngle: 0,
    baseTimes: { fajr: "04:46", sunrise: "06:05", dhuhr: "12:26", asr: "15:49", maghrib: "18:46", isha: "20:16" },
  },
  {
    name: "المدينة المنورة",
    country: "السعودية",
    lat: 24.4672,
    lng: 39.6111,
    timezone: 3,
    methodName: "أم القرى - مكة المكرمة",
    qiblaAngle: 177,
    baseTimes: { fajr: "04:45", sunrise: "06:06", dhuhr: "12:27", asr: "15:53", maghrib: "18:48", isha: "20:18" },
  },
  {
    name: "الرياض",
    country: "السعودية",
    lat: 24.7136,
    lng: 46.6753,
    timezone: 3,
    methodName: "أم القرى - مكة المكرمة",
    qiblaAngle: 244,
    baseTimes: { fajr: "04:19", sunrise: "05:40", dhuhr: "11:59", asr: "15:25", maghrib: "18:18", isha: "19:48" },
  },
  {
    name: "جدة",
    country: "السعودية",
    lat: 21.5433,
    lng: 39.1728,
    timezone: 3,
    methodName: "أم القرى - مكة المكرمة",
    qiblaAngle: 115,
    baseTimes: { fajr: "04:48", sunrise: "06:07", dhuhr: "12:28", asr: "15:51", maghrib: "18:49", isha: "20:19" },
  },
  {
    name: "الدمام",
    country: "السعودية",
    lat: 26.4207,
    lng: 50.0888,
    timezone: 3,
    methodName: "أم القرى - مكة المكرمة",
    qiblaAngle: 239,
    baseTimes: { fajr: "04:05", sunrise: "05:27", dhuhr: "11:46", asr: "15:13", maghrib: "18:04", isha: "19:34" },
  },

  // Palestine
  {
    name: "القدس الشريف",
    country: "فلسطين",
    lat: 31.7683,
    lng: 35.2137,
    timezone: 3,
    methodName: "رابطة العالم الإسلامي",
    qiblaAngle: 156,
    baseTimes: { fajr: "04:45", sunrise: "06:12", dhuhr: "12:38", asr: "16:14", maghrib: "19:04", isha: "20:25" },
  },
  {
    name: "غزة",
    country: "فلسطين",
    lat: 31.5017,
    lng: 34.4668,
    timezone: 3,
    methodName: "رابطة العالم الإسلامي",
    qiblaAngle: 152,
    baseTimes: { fajr: "04:48", sunrise: "06:14", dhuhr: "12:41", asr: "16:17", maghrib: "19:07", isha: "20:28" },
  },

  // UAE
  {
    name: "دبي",
    country: "الإمارات",
    lat: 25.2048,
    lng: 55.2708,
    timezone: 4,
    methodName: "الهيئة العامة للشؤون الإسلامية والأوقاف",
    qiblaAngle: 258,
    baseTimes: { fajr: "04:47", sunrise: "06:06", dhuhr: "12:26", asr: "15:53", maghrib: "18:45", isha: "20:05" },
  },
  {
    name: "أبوظبي",
    country: "الإمارات",
    lat: 24.4539,
    lng: 54.3773,
    timezone: 4,
    methodName: "الهيئة العامة للشؤون الإسلامية والأوقاف",
    qiblaAngle: 260,
    baseTimes: { fajr: "04:51", sunrise: "06:10", dhuhr: "12:30", asr: "15:57", maghrib: "18:49", isha: "20:09" },
  },

  // Kuwait
  {
    name: "الكويت",
    country: "الكويت",
    lat: 29.3759,
    lng: 47.9774,
    timezone: 3,
    methodName: "وزارة الأوقاف والشؤون الإسلامية بالكويت",
    qiblaAngle: 220,
    baseTimes: { fajr: "04:09", sunrise: "05:32", dhuhr: "11:55", asr: "15:25", maghrib: "18:17", isha: "19:42" },
  },

  // Qatar
  {
    name: "الدوحة",
    country: "قطر",
    lat: 25.2854,
    lng: 51.5310,
    timezone: 3,
    methodName: "وزارة الأوقاف والشؤون الإسلامية بقطر",
    qiblaAngle: 246,
    baseTimes: { fajr: "04:02", sunrise: "05:23", dhuhr: "11:42", asr: "15:09", maghrib: "18:01", isha: "19:24" },
  },

  // Jordan
  {
    name: "عمّان",
    country: "الأردن",
    lat: 31.9454,
    lng: 35.9284,
    timezone: 3,
    methodName: "وزارة الأوقاف والشؤون والمقدسات الإسلامية",
    qiblaAngle: 160,
    baseTimes: { fajr: "04:43", sunrise: "06:09", dhuhr: "12:35", asr: "16:11", maghrib: "19:01", isha: "20:22" },
  },

  // Syria & Lebanon
  {
    name: "دمشق",
    country: "سوريا",
    lat: 33.5138,
    lng: 36.2765,
    timezone: 3,
    methodName: "رابطة العالم الإسلامي",
    qiblaAngle: 163,
    baseTimes: { fajr: "04:40", sunrise: "06:08", dhuhr: "12:34", asr: "16:12", maghrib: "19:01", isha: "20:23" },
  },
  {
    name: "بيروت",
    country: "لبنان",
    lat: 33.8938,
    lng: 35.5018,
    timezone: 3,
    methodName: "دار الفتوى اللبنانية",
    qiblaAngle: 162,
    baseTimes: { fajr: "04:42", sunrise: "06:11", dhuhr: "12:37", asr: "16:16", maghrib: "19:04", isha: "20:27" },
  },

  // Iraq
  {
    name: "بغداد",
    country: "العراق",
    lat: 33.3152,
    lng: 44.3661,
    timezone: 3,
    methodName: "رابطة العالم الإسلامي",
    qiblaAngle: 198,
    baseTimes: { fajr: "04:14", sunrise: "05:40", dhuhr: "12:05", asr: "15:40", maghrib: "18:29", isha: "19:49" },
  },

  // North Africa
  {
    name: "الرباط",
    country: "المغرب",
    lat: 34.0209,
    lng: -6.8416,
    timezone: 1,
    methodName: "وزارة الأوقاف والشؤون الإسلامية بالمغرب",
    qiblaAngle: 98,
    baseTimes: { fajr: "05:15", sunrise: "06:44", dhuhr: "13:30", asr: "17:08", maghrib: "20:15", isha: "21:38" },
  },
  {
    name: "الجزائر العاصمة",
    country: "الجزائر",
    lat: 36.7538,
    lng: 3.0588,
    timezone: 1,
    methodName: "وزارة الشؤون الدينية والأوقاف",
    qiblaAngle: 110,
    baseTimes: { fajr: "04:43", sunrise: "06:14", dhuhr: "12:51", asr: "16:32", maghrib: "19:28", isha: "20:53" },
  },
  {
    name: "تونس",
    country: "تونس",
    lat: 36.8065,
    lng: 10.1815,
    timezone: 1,
    methodName: "ديوان الإفتاء بالجمهورية التونسية",
    qiblaAngle: 118,
    baseTimes: { fajr: "04:20", sunrise: "05:49", dhuhr: "12:22", asr: "16:03", maghrib: "18:55", isha: "20:19" },
  },
  {
    name: "طرابلس",
    country: "ليبيا",
    lat: 32.8872,
    lng: 13.1913,
    timezone: 2,
    methodName: "الهيئة العامة للأوقاف والشؤون الإسلامية",
    qiblaAngle: 116,
    baseTimes: { fajr: "05:05", sunrise: "06:33", dhuhr: "13:10", asr: "16:47", maghrib: "19:46", isha: "21:08" },
  },
  {
    name: "الخرطوم",
    country: "السودان",
    lat: 15.5007,
    lng: 32.5599,
    timezone: 2,
    methodName: "الهيئة المصرية العامة للمساحة",
    qiblaAngle: 58,
    baseTimes: { fajr: "04:36", sunrise: "05:51", dhuhr: "12:07", asr: "15:26", maghrib: "18:23", isha: "19:35" },
  },

  // Turkey & International
  {
    name: "إسطنبول",
    country: "تركيا",
    lat: 41.0082,
    lng: 28.9784,
    timezone: 3,
    methodName: "رئاسة الشؤون الدينية التركية (ديانت)",
    qiblaAngle: 151,
    baseTimes: { fajr: "04:47", sunrise: "06:22", dhuhr: "13:06", asr: "16:49", maghrib: "19:48", isha: "21:18" },
  },
  {
    name: "لندن",
    country: "بريطانيا",
    lat: 51.5074,
    lng: -0.1278,
    timezone: 1,
    methodName: "رابطة العالم الإسلامي",
    qiblaAngle: 119,
    baseTimes: { fajr: "04:22", sunrise: "06:05", dhuhr: "13:03", asr: "16:51", maghrib: "20:00", isha: "21:38" },
  },
];

export function getCityPrayerData(cityName: string): CityPrayerConfig {
  const found = ISLAMIC_CITIES_DATABASE.find(
    (c) => c.name.toLowerCase().trim() === cityName.toLowerCase().trim()
  );
  return found || ISLAMIC_CITIES_DATABASE[0];
}

export interface CityPrayerItem {
  id: string;
  name: string;
  displayTime: string;
  hours24: number;
  minutes: number;
  icon: "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
}

export function getCityPrayerList(cityName: string): CityPrayerItem[] {
  const city = getCityPrayerData(cityName);
  const times = city.baseTimes;

  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(":").map(Number);
    return { hours24: parts[0] || 0, minutes: parts[1] || 0 };
  };

  const formatDisplay = (h: number, m: number) => {
    const displayH = h % 12 || 12;
    const padM = String(m).padStart(2, "0");
    return `${displayH}:${padM}`;
  };

  const f = parseTime(times.fajr);
  const sr = parseTime(times.sunrise);
  const d = parseTime(times.dhuhr);
  const a = parseTime(times.asr);
  const m = parseTime(times.maghrib);
  const i = parseTime(times.isha);

  return [
    { id: "fajr", name: "الفجر", displayTime: formatDisplay(f.hours24, f.minutes), hours24: f.hours24, minutes: f.minutes, icon: "fajr" },
    { id: "sunrise", name: "الشروق", displayTime: formatDisplay(sr.hours24, sr.minutes), hours24: sr.hours24, minutes: sr.minutes, icon: "sunrise" },
    { id: "dhuhr", name: "الظهر", displayTime: formatDisplay(d.hours24, d.minutes), hours24: d.hours24, minutes: d.minutes, icon: "dhuhr" },
    { id: "asr", name: "العصر", displayTime: formatDisplay(a.hours24, a.minutes), hours24: a.hours24, minutes: a.minutes, icon: "asr" },
    { id: "maghrib", name: "المغرب", displayTime: formatDisplay(m.hours24, m.minutes), hours24: m.hours24, minutes: m.minutes, icon: "maghrib" },
    { id: "isha", name: "العشاء", displayTime: formatDisplay(i.hours24, i.minutes), hours24: i.hours24, minutes: i.minutes, icon: "isha" },
  ];
}

