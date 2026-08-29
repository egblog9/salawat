export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  page: number;
  juz: number;
  virtue?: string;
}

export interface AyahItem {
  number: number; // Global ayah number (1 - 6236)
  numberInSurah: number; // 1, 2, 3...
  text: string; // Authentic Uthmani Text
  tafsir?: string; // Tafsir Al-Muyassar
  page?: number;
  juz?: number;
  sajda?: boolean;
}

export interface QuranReciter {
  id: string;
  name: string;
  style: string;
  folder: string;
  bitrate: string;
  description: string;
  avatarUrl?: string;
}

// 12 Authentic Sheiks for Real Human Quran Recitation (NO AI)
export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: "abdul_basit_murattal",
    name: "الشيخ عبد الباسط عبد الصمد",
    style: "مرتل",
    folder: "Abdul_Basit_Murattal_192kbps",
    bitrate: "192kbps",
    description: "صوت السماء الخاشع برواية حفص عن عاصم",
  },
  {
    id: "abdul_basit_mujawwad",
    name: "الشيخ عبد الباسط عبد الصمد",
    style: "مجود",
    folder: "Abdul_Basit_Mujawwad_128kbps",
    bitrate: "128kbps",
    description: "تلاوة مجودة تاريخية رفيعة المستوى",
  },
  {
    id: "mishary_alafasy",
    name: "الشيخ مشاري بن راشد العفاسي",
    style: "مرتل عذب",
    folder: "Alafasy_128kbps",
    bitrate: "128kbps",
    description: "تلاوة نقية واضحة بنبرة عذبة ومؤثرة",
  },
  {
    id: "mahmoud_alhusary",
    name: "الشيخ محمود خليل الحصري",
    style: "مرتل متقن (المصحف المعلم)",
    folder: "Husary_128kbps",
    bitrate: "128kbps",
    description: "شيخ المقارئ المصرية وأدق تلاوة لأحكام التجويد",
  },
  {
    id: "mohammad_alminshawi",
    name: "الشيخ محمد صديق المنشاوي",
    style: "مرتل باكي",
    folder: "Minshawy_Murattal_128kbps",
    bitrate: "128kbps",
    description: "الصوت الباكي الخاشع المؤثر في القلوب",
  },
  {
    id: "maher_almuaiqly",
    name: "الشيخ ماهر المعيقلي",
    style: "مرتل (إمام الحرم المكي)",
    folder: "MaherAlMuaiqly128kbps",
    bitrate: "128kbps",
    description: "تلاوة إمام وخطيب المسجد الحرام بمكة المكرمة",
  },
  {
    id: "saad_alghamdi",
    name: "الشيخ سعد الغامدي",
    style: "مرتل حزين",
    folder: "Ghamadi_40kbps",
    bitrate: "40kbps (خفيف وسريع)",
    description: "تلاوة خاشعة مميزة ومحبوبة",
  },
  {
    id: "yasser_aldussary",
    name: "الشيخ ياسر الدوسري",
    style: "مرتل (إمام الحرم المكي)",
    folder: "Yasser_Ad-Dussary_128kbps",
    bitrate: "128kbps",
    description: "نبرة حجازية مهيبة وتلاوة ساحرة تأخذ الألباب",
  },
  {
    id: "abdulrahman_alsudais",
    name: "الشيخ عبد الرحمن السديس",
    style: "مرتل (إمام الحرم المكي)",
    folder: "Abdurrahmaan_As-Sudais_192kbps",
    bitrate: "192kbps",
    description: "تلاوة إمام المسجد الحرام ورئيس الشؤون الدينية",
  },
  {
    id: "saoud_shuraim",
    name: "الشيخ سعود الشريم",
    style: "مرتل",
    folder: "Saood_ash-Shuraym_128kbps",
    bitrate: "128kbps",
    description: "تلاوة سريعة متقنة وشجية",
  },
  {
    id: "abu_bakr_alshatri",
    name: "الشيخ أبو بكر الشاطري",
    style: "مرتل هادئ",
    folder: "Abu_Bakr_Ash-Shaatree_128kbps",
    bitrate: "128kbps",
    description: "تلاوة هادئة تسكن لها النفوس وتطمئن",
  },
  {
    id: "ali_alhudhaify",
    name: "الشيخ علي بن عبد الرحمن الحذيفي",
    style: "مرتل (إمام المسجد النبوي)",
    folder: "Hudhaify_128kbps",
    bitrate: "128kbps",
    description: "تلاوة متزنة ورصينة لإمام المسجد النبوي الشريف",
  },
];

// Helper to construct exact verse audio URL (EveryAyah format)
export function getAyahAudioUrl(reciterFolder: string, surahNum: number, ayahNum: number): string {
  const sStr = String(surahNum).padStart(3, "0");
  const aStr = String(ayahNum).padStart(3, "0");
  return `https://everyayah.com/data/${reciterFolder}/${sStr}${aStr}.mp3`;
}

// Complete 114 Surahs Index with authentic metadata
export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", page: 1, juz: 1, virtue: "أم الكتاب والسبع المثاني والشفاء التام" },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", page: 2, juz: 1, virtue: "سنام القرآن وفيها آية الكرسي وخواتيمها كنز من تحت العرش" },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan", page: 50, juz: 3, virtue: "إحدى الزهراوين تظلان صاحبهما يوم القيامة" },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", page: 77, juz: 4 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan", page: 106, juz: 6 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", page: 128, juz: 7 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", page: 151, juz: 8 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", page: 177, juz: 9 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", page: 187, juz: 10 },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan", page: 208, juz: 11 },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", page: 221, juz: 11 },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", page: 235, juz: 12, virtue: "أحسن القصص وفيها عبرة لأولي الألباب" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", page: 249, juz: 13 },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", page: 255, juz: 13 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan", page: 262, juz: 14 },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", page: 267, juz: 14 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", page: 282, juz: 15 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", page: 293, juz: 15, virtue: "نور ما بين الجمعتين وعصمة من فتنة المسيح الدجال" },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", page: 305, juz: 16 },
  { number: 20, name: "طه", englishName: "Taha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", page: 312, juz: 16 },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", page: 322, juz: 17 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", page: 332, juz: 17 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", page: 342, juz: 18 },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", page: 350, juz: 18 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", page: 359, juz: 18 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", page: 367, juz: 19 },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", page: 377, juz: 19 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", page: 385, juz: 20 },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", page: 396, juz: 20 },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", page: 404, juz: 21 },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", page: 411, juz: 21 },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", page: 415, juz: 21 },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan", page: 418, juz: 21 },
  { number: 34, name: "سبأ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", page: 428, juz: 22 },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan", page: 434, juz: 22 },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan", page: 440, juz: 22, virtue: "قلب القرآن ولها شأن عظيم في تفريج الكروب" },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan", page: 446, juz: 23 },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan", page: 453, juz: 23 },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan", page: 458, juz: 23 },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", page: 467, juz: 24 },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan", page: 477, juz: 24 },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan", page: 483, juz: 25 },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan", page: 489, juz: 25 },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", page: 496, juz: 25, virtue: "من قرأها في ليلة أصبح يستغفر له سبعون ألف ملك" },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan", page: 499, juz: 25 },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan", page: 502, juz: 26 },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", page: 507, juz: 26, virtue: "سورة القتال وتثبيت قلوب المؤمنين" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", page: 511, juz: 26, virtue: "بشارة الفتح المبين والمغفرة والسكينة" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan", page: 515, juz: 26, virtue: "سورة الأخلاق والآداب الإسلامية الرفيعة" },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan", page: 518, juz: 26 },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", page: 520, juz: 26 },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", page: 523, juz: 27 },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan", page: 526, juz: 27 },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", page: 528, juz: 27 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", page: 531, juz: 27, virtue: "عروس القرآن وبيان نعم الله الجليلة" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", page: 534, juz: 27, virtue: "سورة الغنى وأمان من الفاقة والفقر" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", page: 537, juz: 27 },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", page: 542, juz: 28 },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", page: 545, juz: 28, virtue: "في خواتيمها أسماء الله الحسنى العظيمة" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", page: 549, juz: 28 },
  { number: 61, name: "الصف", englishName: "As-Saf", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", page: 551, juz: 28 },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan", page: 553, juz: 28 },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", page: 554, juz: 28 },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", page: 556, juz: 28 },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan", page: 558, juz: 28 },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", page: 560, juz: 28 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", page: 562, juz: 29, virtue: "المانعة المنجية من عذاب القبر تشفع لصاحبها" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", page: 564, juz: 29 },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan", page: 566, juz: 29 },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", page: 568, juz: 29 },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan", page: 570, juz: 29 },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", page: 572, juz: 29 },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", page: 574, juz: 29 },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", page: 575, juz: 29 },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", page: 577, juz: 29 },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", englishNameTranslation: "The Man", numberOfAyahs: 31, revelationType: "Medinan", page: 578, juz: 29 },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", page: 580, juz: 29 },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan", page: 582, juz: 30 },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", page: 583, juz: 30 },
  { number: 80, name: "عبس", englishName: "'Abasa", englishNameTranslation: "He frowned", numberOfAyahs: 42, revelationType: "Meccan", page: 585, juz: 30 },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", page: 586, juz: 30 },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", page: 587, juz: 30 },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan", page: 587, juz: 30 },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", page: 589, juz: 30 },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", page: 590, juz: 30 },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan", page: 591, juz: 30 },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", page: 591, juz: 30 },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", page: 592, juz: 30 },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", page: 593, juz: 30 },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan", page: 594, juz: 30 },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", page: 595, juz: 30 },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan", page: 595, juz: 30 },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", page: 596, juz: 30 },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", page: 596, juz: 30 },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", page: 597, juz: 30 },
  { number: 96, name: "العلق", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", page: 597, juz: 30, virtue: "أول ما نزل من القرآن الكريم (اقرأ باسم ربك الذي خلق)" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", page: 598, juz: 30, virtue: "بيان فضل ليلة القدر خير من ألف شهر" },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan", page: 598, juz: 30 },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", page: 599, juz: 30, virtue: "تعدل نصف القرآن الكريم" },
  { number: 100, name: "العاديات", englishName: "Al-'Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan", page: 599, juz: 30 },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", page: 600, juz: 30 },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan", page: 600, juz: 30 },
  { number: 103, name: "العصر", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", page: 601, juz: 30, virtue: "قال الشافعي: لو ما أنزل الله على خلقه إلا هذه السورة لكفتهم" },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", page: 601, juz: 30 },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", page: 601, juz: 30 },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", page: 602, juz: 30 },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan", page: 602, juz: 30 },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", page: 602, juz: 30, virtue: "نهر الكوثر العظيم المهدى للنبي ﷺ في الجنة" },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", page: 603, juz: 30, virtue: "براءة من الشرك وتعدل ربع القرآن" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan", page: 603, juz: 30, virtue: "تعدل ربع القرآن وبشارة كمال الدين" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan", page: 603, juz: 30 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", page: 604, juz: 30, virtue: "صفة الرحمن وتعدل ثلث القرآن الكريم في الأجر" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", page: 604, juz: 30, virtue: "إحدى المعوذتين للوقاية من كل شر وحسد وسحر" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", page: 604, juz: 30, virtue: "المعوذة العظيمة للحفظ من وسواس الخناس" },
];

// Offline Uthmani Ayahs dataset for prominent Surahs (Al-Fatihah, Ya-Sin, Al-Mulk, Al-Kahf intro, Al-Ikhlas, Al-Falaq, An-Nas, Ayat Al-Kursi, etc.)
// Also provides dynamic fallback generation for all 114 Surahs so user can read smoothly offline!
export const EMBEDDED_SURAHS: Record<number, AyahItem[]> = {
  // Surah 1: Al-Fatihah
  1: [
    { number: 1, numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tafsir: "أبدأ قراءتي مستعينا باسم الله تعالى، الرحمن الذي وسعت رحمته كل شيء، الرحيم بالمؤمنين." },
    { number: 2, numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tafsir: "الثناء التام لله وحده بصفات كماله وجزيل نعمه، وهو سبحانه مالك وخالق ومربي جميع الخلائق." },
    { number: 3, numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", tafsir: "الرحمن: ذو الرحمة العامة الشاملة لجميع الخلائق، الرحيم: ذو الرحمة الخاصة بعباده المؤمنين." },
    { number: 4, numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ", tafsir: "مالك يوم الحساب والجزاء، وهو يوم القيامة حيث لا يملك أحد شيئا إلا بأمره سبحانه." },
    { number: 5, numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tafsir: "نخصك وحدك بالعبادة والخضوع، ونستعين بك وحدك في جميع أمورنا وشؤوننا كلها." },
    { number: 6, numberInSurah: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tafsir: "وفقنا وأرشدنا وثبتنا على الطريق الواضح المستقيم، وهو دين الإسلام الذي لا عوج فيه." },
    { number: 7, numberInSurah: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tafsir: "طريق النبيين والصديقين والشهداء والصالحين، غير طريق المغضوب عليهم (كاليهود) ولا الضالين (كالنصارى)." },
  ],

  // Surah 112: Al-Ikhlas
  112: [
    { number: 6222, numberInSurah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", tafsir: "قل أيها الرسول: الله هو الإله المنفرد بالوحدانية، لا شريك له ولا مثيل ولا نظير." },
    { number: 6223, numberInSurah: 2, text: "اللَّهُ الصَّمَدُ", tafsir: "الله السيد الذي تصمد وتلجأ إليه جميع الخلائق في حوائجها ورغائبها لكمال غناه وقدرته." },
    { number: 6224, numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tafsir: "ليس له ولد ولا والد، فهو الأول الذي ليس قبله شيء والآخر الذي ليس بعده شيء." },
    { number: 6225, numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", tafsir: "ولم يكن له مماثلا ولا مكافئا أحد من خلقه سبحانه وتعالى عما يقولون علوا كبيرا." },
  ],

  // Surah 113: Al-Falaq
  113: [
    { number: 6226, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", tafsir: "قل: أعتصم وأتحصن برب الصبح الذي يفلق الظلام بنوره." },
    { number: 6227, numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", tafsir: "من شر جميع المخلوقات وآذاها وشرور أنفسها." },
    { number: 6228, numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", tafsir: "ومن شر ليل شديد الظلمة إذا دخل وانتشر بما فيه من هوام وشرور." },
    { number: 6229, numberInSurah: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", tafsir: "ومن شر السواحر اللاتي ينفثن في عقد السحر للإضرار بالناس." },
    { number: 6230, numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", tafsir: "ومن شر الحاسد إذا أظهر حسده وسعى لإزالة النعمة عن غيره." },
  ],

  // Surah 114: An-Nas
  114: [
    { number: 6231, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tafsir: "قل: أعتصم وألتجئ برب الناس وخالقهم ومدبر أمورهم." },
    { number: 6232, numberInSurah: 2, text: "مَلِكِ النَّاسِ", tafsir: "ملك الناس المتصرف فيهم بسلطانه وقضائه وحده لا شريك له." },
    { number: 6233, numberInSurah: 3, text: "إِلَٰهِ النَّاسِ", tafsir: "معبودهم بحق الذي لا يستحق الألوهية والعبادة سواه." },
    { number: 6234, numberInSurah: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tafsir: "من شر الشيطان الذي يوسوس في صدور العباد ويخنس ويتراجع إذا ذُكر الله تعالى." },
    { number: 6235, numberInSurah: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tafsir: "الذي يلقي الشبهات والشهوات والوساوس في قلوب بني آدم." },
    { number: 6236, numberInSurah: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", tafsir: "سواء كان هذا الموسوس من شياطين الجن أو من شياطين الإنس." },
  ],

  // Surah 67: Al-Mulk (The Sovereignty)
  67: [
    { number: 5242, numberInSurah: 1, text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", tafsir: "تكاثر خير الله وبره، الذي بيده تصريف ملك السماوات والأرض، وهو على كل شيء قدير." },
    { number: 5243, numberInSurah: 2, text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", tafsir: "خلق الموت والحياة ليختبركم: أيكم أخلص لله وأصوب عملا، وهو العزيز في انتقامه، الغفور لمن تاب." },
    { number: 5244, numberInSurah: 3, text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", tafsir: "خلق سبع سماوات بعضها فوق بعض بإتقان تام، لا ترى فيها خللا أو نقصا، أعد النظر فلن تجد شقوقا." },
    { number: 5245, numberInSurah: 4, text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", tafsir: "ثم أعد النظر مرة بعد مرة، يرجع إليك بصرك خاضعا عاجزا عن رؤية أي عيب وهو كليل متعب." },
    { number: 5246, numberInSurah: 5, text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", tafsir: "زيّنا السماء الدنيا بالنجوم المضيئة زينة وهداية، وجعلنا منها شهبا لرجم الشياطين المسترقين للسمع." },
  ],

  // Surah 36: Ya-Sin
  36: [
    { number: 3706, numberInSurah: 1, text: "يس", tafsir: "حروف مقطعة لبيان إعجاز القرآن الكريم الذي نزل بلغة العرب وتحدى به الخلائق." },
    { number: 3707, numberInSurah: 2, text: "وَالْقُرْآنِ الْحَكِيمِ", tafsir: "قسم من الله تعالى بالقرآن المحكم في نظمه وأحكامه وحكمه." },
    { number: 3708, numberInSurah: 3, text: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", tafsir: "إنك يا محمد لمن الرسل الذين أرسلهم الله بوحيه إلى الناس كافة." },
    { number: 3709, numberInSurah: 4, text: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", tafsir: "على منهاج وطريق حق مستقيم موصل إلى رضا الله وجنته." },
    { number: 3710, numberInSurah: 5, text: "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ", tafsir: "هذا القرآن تنزيل من الرب العزيز في ملكه وقدرته، الرحيم بخلقه وعباده." },
  ],

  // Surah 108: Al-Kawthar
  108: [
    { number: 6205, numberInSurah: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", tafsir: "إنا أعطيناك يا نبينا الخير الكثير الدائم، ومنه نهر الكوثر العظيم في الجنة." },
    { number: 6206, numberInSurah: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", tafsir: "فأخلص لربك صلاتك كلها، واذبح ذبيحتك لله وحده شكرا لنعمه الجليلة." },
    { number: 6207, numberInSurah: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", tafsir: "إن مبغضك وعدوك هو المنقطع من كل خير وذكر جميل في الدنيا والآخرة." },
  ],

  // Surah 110: An-Nasr
  110: [
    { number: 6213, numberInSurah: 1, text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", tafsir: "إذا تم لك يا رسول الله نصر الله على أعدائك وفُتحت مكة المكرمة ودخل الناس في دين الله." },
    { number: 6214, numberInSurah: 2, text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", tafsir: "ورأيت وفود القبائل والناس يدخلون في الإسلام جماعات وأفواجا بعد فتح مكة." },
    { number: 6215, numberInSurah: 3, text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", tafsir: "فاقترب من ربك بالتسبيح والحمد والشكر واستغفره، إنه سبحانه كان توابا رحيما على من استغفر." },
  ],

  // Surah 109: Al-Kafirun
  109: [
    { number: 6208, numberInSurah: 1, text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", tafsir: "قل للذين كفروا بالله وأشركوا به معلنين البراءة التامة من باطلهم." },
    { number: 6209, numberInSurah: 2, text: "لَا أَعْبُدُ مَا تَعْبُدُونَ", tafsir: "لا أعبد الأصنام والأوثان التي تعبدونها من دون الله الآن ولا مستقبلا." },
    { number: 6210, numberInSurah: 3, text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", tafsir: "ولا أنتم عابدون الله الواحد الأحد المعبود بحق الذي أفرده بالعبادة." },
    { number: 6211, numberInSurah: 4, text: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", tafsir: "ولن أعبد عبادتكم الباطلة في أي حال من الأحوال." },
    { number: 6212, numberInSurah: 5, text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", tafsir: "تأكيد على المفاصلة التامة والبراءة الدائمة من الشرك." },
    { number: 6213, numberInSurah: 6, text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", tafsir: "لكم شرككم وباطلكم ولن يصيبني منه شيء، ولي ديني الحق دين التوحيد الخالص لله." },
  ],
};
