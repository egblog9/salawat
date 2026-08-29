import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
  Calendar,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Check,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

interface PrayerTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PrayerStatus = "mosque" | "on_time" | "late" | "missed" | "none";

interface DailyPrayerLog {
  date: string; // YYYY-MM-DD
  prayers: {
    fajr: PrayerStatus;
    dhuhr: PrayerStatus;
    asr: PrayerStatus;
    maghrib: PrayerStatus;
    isha: PrayerStatus;
  };
  sunnah: {
    fajrSunnah: boolean;
    dhuhrSunnahBefore: boolean;
    dhuhrSunnahAfter: boolean;
    maghribSunnah: boolean;
    ishaSunnah: boolean;
    duha: boolean;
    qiyamWitr: boolean;
  };
}

interface QadaaLog {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

const PRAYERS_CONFIG = [
  { id: "fajr", name: "الفجر", rakat: 2, icon: "🌅" },
  { id: "dhuhr", name: "الظهر", rakat: 4, icon: "☀️" },
  { id: "asr", name: "العصر", rakat: 4, icon: "⛅" },
  { id: "maghrib", name: "المغرب", rakat: 3, icon: "🌇" },
  { id: "isha", name: "العشاء", rakat: 4, icon: "🌙" },
] as const;

const SUNNAH_CONFIG = [
  { id: "fajrSunnah", name: "سنة الفجر", desc: "ركعتان قبل الفجر (خير من الدنيا وما فيها)", rakat: 2 },
  { id: "dhuhrSunnahBefore", name: "سنة الظهر القبلية", desc: "4 ركعات قبل الظهر", rakat: 4 },
  { id: "dhuhrSunnahAfter", name: "سنة الظهر البعدية", desc: "ركعتان بعد الظهر", rakat: 2 },
  { id: "maghribSunnah", name: "سنة المغرب", desc: "ركعتان بعد المغرب", rakat: 2 },
  { id: "ishaSunnah", name: "سنة العشاء", desc: "ركعتان بعد العشاء", rakat: 2 },
  { id: "duha", name: "صلاة الضحى", desc: "ركعتان أو أكثر صلاة الأوابين", rakat: 2 },
  { id: "qiyamWitr", name: "قيام الليل والوتر", desc: "شرف المؤمن وقربة إلى الله", rakat: 3 },
] as const;

export const PrayerTrackerModal: React.FC<PrayerTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"today" | "qadaa" | "stats">("today");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Logs Map stored in LocalStorage: { [YYYY-MM-DD]: DailyPrayerLog }
  const [allLogs, setAllLogs] = useState<Record<string, DailyPrayerLog>>(() => {
    try {
      const saved = localStorage.getItem("prayer_tracker_logs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Qadaa Missed Prayers Log
  const [qadaaLog, setQadaaLog] = useState<QadaaLog>(() => {
    try {
      const saved = localStorage.getItem("prayer_qadaa_logs");
      return saved
        ? JSON.parse(saved)
        : { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
    } catch {
      return { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
    }
  });

  // Missed days batch calculator
  const [batchDaysInput, setBatchDaysInput] = useState<number>(7);

  // Save changes to LocalStorage
  const saveLogs = (newLogs: Record<string, DailyPrayerLog>) => {
    setAllLogs(newLogs);
    localStorage.setItem("prayer_tracker_logs", JSON.stringify(newLogs));
  };

  const saveQadaa = (newQadaa: QadaaLog) => {
    setQadaaLog(newQadaa);
    localStorage.setItem("prayer_qadaa_logs", JSON.stringify(newQadaa));
  };

  // Get current day's log or default
  const currentDayLog: DailyPrayerLog = useMemo(() => {
    return (
      allLogs[selectedDate] || {
        date: selectedDate,
        prayers: {
          fajr: "none",
          dhuhr: "none",
          asr: "none",
          maghrib: "none",
          isha: "none",
        },
        sunnah: {
          fajrSunnah: false,
          dhuhrSunnahBefore: false,
          dhuhrSunnahAfter: false,
          maghribSunnah: false,
          ishaSunnah: false,
          duha: false,
          qiyamWitr: false,
        },
      }
    );
  }, [allLogs, selectedDate]);

  // Update Prayer Status
  const handleSetPrayerStatus = (
    prayerKey: keyof DailyPrayerLog["prayers"],
    status: PrayerStatus
  ) => {
    const updated = {
      ...currentDayLog,
      prayers: {
        ...currentDayLog.prayers,
        [prayerKey]: currentDayLog.prayers[prayerKey] === status ? "none" : status,
      },
    };
    saveLogs({ ...allLogs, [selectedDate]: updated });
  };

  // Update Sunnah Status
  const handleToggleSunnah = (sunnahKey: keyof DailyPrayerLog["sunnah"]) => {
    const updated = {
      ...currentDayLog,
      sunnah: {
        ...currentDayLog.sunnah,
        [sunnahKey]: !currentDayLog.sunnah[sunnahKey],
      },
    };
    saveLogs({ ...allLogs, [selectedDate]: updated });
  };

  // Qadaa decrement
  const handleCompleteQadaa = (pKey: keyof QadaaLog) => {
    if (qadaaLog[pKey] <= 0) return;
    saveQadaa({
      ...qadaaLog,
      [pKey]: qadaaLog[pKey] - 1,
    });
  };

  // Qadaa increment
  const handleAddQadaa = (pKey: keyof QadaaLog, amount = 1) => {
    saveQadaa({
      ...qadaaLog,
      [pKey]: qadaaLog[pKey] + amount,
    });
  };

  // Add batch missed days
  const handleAddBatchQadaa = () => {
    if (batchDaysInput <= 0) return;
    saveQadaa({
      fajr: qadaaLog.fajr + batchDaysInput,
      dhuhr: qadaaLog.dhuhr + batchDaysInput,
      asr: qadaaLog.asr + batchDaysInput,
      maghrib: qadaaLog.maghrib + batchDaysInput,
      isha: qadaaLog.isha + batchDaysInput,
    });
    setBatchDaysInput(1);
  };

  // Calculate Streak & Stats
  const stats = useMemo(() => {
    const dates = Object.keys(allLogs).sort();
    let totalFardhPrayed = 0;
    let totalMosquePrayed = 0;
    let totalSunnahPrayed = 0;

    dates.forEach((d) => {
      const log = allLogs[d];
      Object.values(log.prayers).forEach((st) => {
        if (st === "mosque" || st === "on_time" || st === "late") {
          totalFardhPrayed++;
        }
        if (st === "mosque") {
          totalMosquePrayed++;
        }
      });
      Object.values(log.sunnah).forEach((sn) => {
        if (sn) totalSunnahPrayed++;
      });
    });

    // Current day stats
    const todayFardhCount = Object.values(currentDayLog.prayers).filter(
      (st) => st === "mosque" || st === "on_time" || st === "late"
    ).length;

    const todaySunnahCount = Object.values(currentDayLog.sunnah).filter(Boolean).length;

    return {
      totalFardhPrayed,
      totalMosquePrayed,
      totalSunnahPrayed,
      todayFardhCount,
      todaySunnahCount,
      daysLoggedCount: dates.length,
    };
  }, [allLogs, currentDayLog]);

  // Date Navigation
  const changeSelectedDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const isTodaySelected = selectedDate === new Date().toISOString().split("T")[0];

  const totalQadaaRemaining =
    qadaaLog.fajr + qadaaLog.dhuhr + qadaaLog.asr + qadaaLog.maghrib + qadaaLog.isha;

  if (!isOpen) return null;

  return (
    <div
      id="prayer-tracker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
    >
      <div className="bg-[#FAF9F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-tajawal text-white flex items-center gap-2">
                <span>متتبع الصلوات والسنن</span>
                <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-bold">
                  {stats.todayFardhCount}/5 فريضة
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90 font-amiri">
                أحب الأعمال إلى الله: الصلاة على وقتها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-white px-3 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-2.5 px-2 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "today"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>سجل الصلوات اليومي</span>
          </button>

          <button
            onClick={() => setActiveTab("qadaa")}
            className={`flex-1 py-2.5 px-2 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "qadaa"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>حاسبة قضاء الفوائت</span>
            {totalQadaaRemaining > 0 && (
              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-sans">
                {totalQadaaRemaining}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2.5 px-2 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "stats"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>الإحصائيات والالتزام</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: DAILY PRAYERS CHECKLIST */}
          {activeTab === "today" && (
            <div className="space-y-4">
              
              {/* Date Selector Header */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
                <button
                  onClick={() => changeSelectedDay(-1)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 transition-colors cursor-pointer"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm sm:text-base font-bold font-tajawal text-emerald-950">
                      {new Date(selectedDate).toLocaleDateString("ar-EG", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    {isTodaySelected && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                        اليوم
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {selectedDate}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {!isTodaySelected && (
                    <button
                      onClick={() =>
                        setSelectedDate(new Date().toISOString().split("T")[0])
                      }
                      className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-[10.5px] font-bold"
                    >
                      اليوم
                    </button>
                  )}
                  <button
                    onClick={() => changeSelectedDay(1)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 transition-colors cursor-pointer"
                    title="اليوم التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-300 font-tajawal block">
                    إنجاز صلوات اليوم
                  </span>
                  <p className="text-sm font-bold font-amiri text-stone-200 mt-0.5">
                    {stats.todayFardhCount === 5
                      ? "ما شاء الله! أتممت جميع الصلوات الخمس 🌟"
                      : `أديت ${stats.todayFardhCount} من 5 صلوات مفروضة`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-500/50 flex flex-col items-center justify-center font-bold">
                    <span className="text-sm text-emerald-300 leading-none">
                      {Math.round((stats.todayFardhCount / 5) * 100)}%
                    </span>
                    <span className="text-[8px] text-emerald-400">الفرائض</span>
                  </div>
                </div>
              </div>

              {/* 5 FARDH PRAYERS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-tajawal text-stone-700 px-1 flex items-center gap-1.5">
                  <span>الصلوات المفروضة الخمس:</span>
                </h4>

                <div className="space-y-2">
                  {PRAYERS_CONFIG.map((p) => {
                    const status = currentDayLog.prayers[p.id as keyof DailyPrayerLog["prayers"]];

                    return (
                      <div
                        key={p.id}
                        className={`bg-white p-3 rounded-2xl border transition-all shadow-sm ${
                          status === "mosque"
                            ? "border-emerald-500 bg-emerald-50/40"
                            : status === "on_time"
                            ? "border-teal-400 bg-teal-50/30"
                            : status === "late"
                            ? "border-amber-300 bg-amber-50/30"
                            : status === "missed"
                            ? "border-rose-300 bg-rose-50/30"
                            : "border-stone-200/90"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{p.icon}</span>
                            <div>
                              <h5 className="text-sm font-bold font-tajawal text-stone-900">
                                صلاة {p.name}
                              </h5>
                              <span className="text-[10.5px] text-stone-500 font-tajawal">
                                {p.rakat} ركعات مفروضة
                              </span>
                            </div>
                          </div>

                          {/* Current Status Tag */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg font-tajawal ${
                              status === "mosque"
                                ? "bg-emerald-700 text-white"
                                : status === "on_time"
                                ? "bg-emerald-100 text-emerald-900"
                                : status === "late"
                                ? "bg-amber-100 text-amber-900"
                                : status === "missed"
                                ? "bg-rose-100 text-rose-900"
                                : "bg-stone-100 text-stone-400"
                            }`}
                          >
                            {status === "mosque"
                              ? "في المسجد 🕌"
                              : status === "on_time"
                              ? "في وقتها ⏱️"
                              : status === "late"
                              ? "متأخرة ⏳"
                              : status === "missed"
                              ? "فائتة ❌"
                              : "لم تسجل بعد"}
                          </span>
                        </div>

                        {/* Status Buttons Row */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-stone-100">
                          <button
                            onClick={() =>
                              handleSetPrayerStatus(
                                p.id as keyof DailyPrayerLog["prayers"],
                                "mosque"
                              )
                            }
                            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold font-tajawal cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 ${
                              status === "mosque"
                                ? "bg-emerald-700 text-white shadow"
                                : "bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900"
                            }`}
                          >
                            <span>مسجد</span>
                          </button>

                          <button
                            onClick={() =>
                              handleSetPrayerStatus(
                                p.id as keyof DailyPrayerLog["prayers"],
                                "on_time"
                              )
                            }
                            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold font-tajawal cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 ${
                              status === "on_time"
                                ? "bg-emerald-600 text-white shadow"
                                : "bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900"
                            }`}
                          >
                            <span>في وقتها</span>
                          </button>

                          <button
                            onClick={() =>
                              handleSetPrayerStatus(
                                p.id as keyof DailyPrayerLog["prayers"],
                                "late"
                              )
                            }
                            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold font-tajawal cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 ${
                              status === "late"
                                ? "bg-amber-600 text-white shadow"
                                : "bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900"
                            }`}
                          >
                            <span>متأخرة</span>
                          </button>

                          <button
                            onClick={() =>
                              handleSetPrayerStatus(
                                p.id as keyof DailyPrayerLog["prayers"],
                                "missed"
                              )
                            }
                            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold font-tajawal cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 ${
                              status === "missed"
                                ? "bg-rose-700 text-white shadow"
                                : "bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-900"
                            }`}
                          >
                            <span>فائتة</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SUNNAH & NAWAFIL SECTION */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold font-tajawal text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>السنن الرواتب والنوافل (12 ركعة + الضحى والوتر):</span>
                  </h4>
                  <span className="text-[10.5px] text-emerald-800 font-bold">
                    {stats.todaySunnahCount}/{SUNNAH_CONFIG.length} مكتمل
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUNNAH_CONFIG.map((s) => {
                    const isChecked =
                      currentDayLog.sunnah[s.id as keyof DailyPrayerLog["sunnah"]];

                    return (
                      <button
                        key={s.id}
                        onClick={() =>
                          handleToggleSunnah(s.id as keyof DailyPrayerLog["sunnah"])
                        }
                        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 active:scale-95 ${
                          isChecked
                            ? "bg-emerald-50/90 border-emerald-400 shadow-sm"
                            : "bg-white border-stone-200/90 hover:bg-stone-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold font-tajawal text-stone-900">
                              {s.name}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              ({s.rakat} ركعات)
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 font-amiri truncate">
                            {s.desc}
                          </p>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked
                              ? "bg-emerald-700 border-emerald-700 text-white"
                              : "border-stone-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: QADAA MISSED PRAYERS CALCULATOR */}
          {activeTab === "qadaa" && (
            <div className="space-y-4">
              
              {/* Qadaa Overview Header */}
              <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-white p-4 rounded-2xl border border-rose-500/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-rose-400" />
                    <span className="text-sm font-bold font-tajawal text-rose-200">
                      إجمالي الصلوات الفائتة المطلوب قضاؤها
                    </span>
                  </div>
                  <span className="text-xl font-black text-rose-300 font-mono">
                    {totalQadaaRemaining} صلاة
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-amiri leading-relaxed">
                  دين الله أحق أن يُقضى. اجعل لك ورداً مع كل صلاة حاضرة لقضاء صلاة فائتة حتى تبرأ ذمتك.
                </p>
              </div>

              {/* 5 Prayers Qadaa Tracker Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-tajawal text-stone-700 px-1">
                  قائمة الصلوات الفائتة:
                </h4>

                <div className="space-y-2">
                  {PRAYERS_CONFIG.map((p) => {
                    const count = qadaaLog[p.id as keyof QadaaLog];

                    return (
                      <div
                        key={p.id}
                        className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{p.icon}</span>
                          <div>
                            <h5 className="text-sm font-bold font-tajawal text-stone-900">
                              صلاة {p.name}
                            </h5>
                            <span className="text-xs font-mono font-bold text-rose-700">
                              المتبقي: {count} صلاة
                            </span>
                          </div>
                        </div>

                        {/* Increment / Decrement & One-Click Complete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleAddQadaa(p.id as keyof QadaaLog, -1)
                            }
                            disabled={count <= 0}
                            className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-30 flex items-center justify-center text-stone-700 font-bold cursor-pointer transition-colors"
                            title="إنقاص"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              handleAddQadaa(p.id as keyof QadaaLog, 1)
                            }
                            className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold cursor-pointer transition-colors"
                            title="زيادة"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Green Quick Complete Button */}
                          <button
                            onClick={() =>
                              handleCompleteQadaa(p.id as keyof QadaaLog)
                            }
                            disabled={count <= 0}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 text-white font-bold text-xs font-tajawal flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
                            title="قضيت الآن صلاة واحدة"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>قضيت صلاة</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Batch Missed Days Estimator */}
              <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>إضافة فترة فوائت مجمعة (أيام/أشهر):</span>
                </h4>
                <p className="text-xs text-stone-600 font-amiri">
                  إذا فاتتك صلوات لعدة أيام، أدخل عدد الأيام وسيتم إضافة 5 صلوات عن كل يوم:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={batchDaysInput}
                    onChange={(e) => setBatchDaysInput(parseInt(e.target.value, 10) || 0)}
                    className="w-28 px-3 py-2 rounded-xl bg-white border border-stone-300 text-sm font-mono text-center"
                    placeholder="عدد الأيام"
                  />
                  <span className="text-xs font-bold text-stone-700 font-tajawal">يوم</span>

                  <button
                    onClick={handleAddBatchQadaa}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs font-tajawal shadow cursor-pointer transition-all active:scale-95"
                  >
                    إضافة {batchDaysInput * 5} صلاة فائتة
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STATS & STREAK */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              
              {/* Overall Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm text-center">
                  <span className="text-2xl font-bold font-mono text-emerald-900">
                    {stats.totalFardhPrayed}
                  </span>
                  <span className="text-xs text-stone-500 font-tajawal block mt-0.5">
                    إجمالي الفرائض المسجلة
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm text-center">
                  <span className="text-2xl font-bold font-mono text-teal-800">
                    {stats.totalMosquePrayed}
                  </span>
                  <span className="text-xs text-stone-500 font-tajawal block mt-0.5">
                    صلاة في المسجد 🕌
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-sm text-center col-span-2 sm:col-span-1">
                  <span className="text-2xl font-bold font-mono text-amber-600">
                    {stats.totalSunnahPrayed}
                  </span>
                  <span className="text-xs text-stone-500 font-tajawal block mt-0.5">
                    سنن ونوافل مكتملة ✨
                  </span>
                </div>
              </div>

              {/* Hadith on Prayer */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs font-tajawal">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>فضل المحافظة على الصلوات الخمس:</span>
                </div>
                <p className="text-xs text-emerald-900 font-amiri leading-relaxed">
                  قال رسول الله ﷺ: «مَنْ حَافَظَ عَلَيْهِنَّ كَانَتْ لَهُ نُورًا وَبُرْهَانًا وَنَجَاةً يَوْمَ الْقِيَامَةِ».
                </p>
              </div>

              {/* Sunan Rawatib Reward */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs font-tajawal">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>بيت في الجنة لمن صلى 12 ركعة راتبة:</span>
                </div>
                <p className="text-xs text-amber-900 font-amiri leading-relaxed">
                  قال ﷺ: «مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ فَرِيضَةٍ، إِلَّا بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ».
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-tajawal">
            يُحفظ السجل تلقائياً على جهازك 🔒
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-tajawal cursor-pointer transition-all active:scale-95 shadow"
          >
            تم
          </button>
        </div>

      </div>
    </div>
  );
};
