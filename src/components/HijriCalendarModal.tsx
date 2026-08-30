import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Award,
  Bookmark,
  ArrowRightLeft,
  Clock,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  HIJRI_MONTHS,
  ISLAMIC_EVENTS,
  getHijriDate,
  getMonthCalendarDays,
  HijriDateInfo,
} from "../utils/hijriCalendar";
import {
  fastingReminderManager,
  FastingReminderConfig,
} from "../utils/fastingReminderManager";
import { Bell, Sparkles, Send } from "lucide-react";

interface HijriCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HijriCalendarModal: React.FC<HijriCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"calendar" | "events" | "converter">("calendar");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayInfo, setSelectedDayInfo] = useState<HijriDateInfo>(() =>
    getHijriDate(new Date(), 0)
  );
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    return parseInt(localStorage.getItem("hijri_day_offset") || "0", 10);
  });

  const [fastingConfig, setFastingConfig] = useState<FastingReminderConfig>(() =>
    fastingReminderManager.getConfig()
  );
  const [fastingTestStatus, setFastingTestStatus] = useState<string | null>(null);

  const updateFastingConfig = (partial: Partial<FastingReminderConfig>) => {
    const updated = { ...fastingConfig, ...partial };
    setFastingConfig(updated);
    fastingReminderManager.saveConfig(updated);
  };

  const handleTestFasting = async () => {
    setFastingTestStatus("sending");
    try {
      await fastingReminderManager.sendFastingNotification();
      setFastingTestStatus("sent");
      setTimeout(() => setFastingTestStatus(null), 3000);
    } catch {
      setFastingTestStatus(null);
    }
  };

  // Converter Form State
  const [convMode, setConvMode] = useState<"g2h" | "h2g">("g2h");
  const [convGDate, setConvGDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [convHDay, setConvHDay] = useState<number>(1);
  const [convHMonth, setConvHMonth] = useState<number>(9);
  const [convHYear, setConvHYear] = useState<number>(1447);

  const saveAdjustment = (adj: number) => {
    setHijriAdjustment(adj);
    localStorage.setItem("hijri_day_offset", adj.toString());
  };

  const calendarData = useMemo(() => {
    return getMonthCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      hijriAdjustment
    );
  }, [currentDate, hijriAdjustment]);

  const todayHijri = useMemo(() => {
    return getHijriDate(new Date(), hijriAdjustment);
  }, [hijriAdjustment]);

  const monthNamesAr = [
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDayInfo(getHijriDate(now, hijriAdjustment));
  };

  // Convert Result
  const convertedResult = useMemo(() => {
    if (convMode === "g2h") {
      try {
        const d = new Date(convGDate);
        if (isNaN(d.getTime())) return null;
        return getHijriDate(d, hijriAdjustment);
      } catch {
        return null;
      }
    } else {
      try {
        const refHYear = 1446;
        const refHMonth = 1;
        const refHDay = 1;
        const refGDate = new Date(2024, 6, 7).getTime();

        const totalHDays =
          (convHYear - refHYear) * 354.367 +
          (convHMonth - refHMonth) * 29.53 +
          (convHDay - refHDay);
        const approxGTime = refGDate + totalHDays * 86400000;
        const resultDate = new Date(approxGTime);
        const hInfo = getHijriDate(resultDate, hijriAdjustment);
        return {
          gregorianDate: resultDate,
          hijriInfo: hInfo,
        };
      } catch {
        return null;
      }
    }
  }, [convMode, convGDate, convHDay, convHMonth, convHYear, hijriAdjustment]);

  if (!isOpen) return null;

  const weekDayLabels = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  return (
    <div
      id="hijri-calendar-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Full Page Header */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-4 py-3 sm:px-6 sticky top-0 z-20 shadow-md flex items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="رجوع للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-tajawal text-white">
                  التقويم الهجري والمناسبات الإسلامية
                </h1>
                <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40">
                  {todayHijri.year} هـ
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-amiri">
                اليوم: {todayHijri.dayName} {todayHijri.day} {todayHijri.monthName} {todayHijri.year} هـ
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs font-tajawal transition-all"
        >
          تم
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-stone-200 shadow-sm p-2 sm:p-3">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "calendar"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>عرض الشهر</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "events"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>المناسبات الإسلامية</span>
          </button>

          <button
            onClick={() => setActiveTab("converter")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "converter"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <span>محول التاريخ</span>
          </button>
        </div>
      </div>

      {/* Main Full Page Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-16">
          
          {/* TAB 1: CALENDAR VIEW */}
          {activeTab === "calendar" && (
            <div className="space-y-4">
              
              {/* Month Switcher Header */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="p-2.5 rounded-2xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  title="الشهر السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-bold font-tajawal text-emerald-950">
                    {monthNamesAr[currentDate.getMonth()]} {currentDate.getFullYear()} م
                  </h3>
                  <div className="text-xs text-stone-500 font-amiri flex items-center justify-center gap-1.5 mt-0.5">
                    <span>
                      {calendarData.days[0]?.hijri.monthName} /{" "}
                      {calendarData.days[calendarData.days.length - 1]?.hijri.monthName}{" "}
                      {calendarData.days[0]?.hijri.year} هـ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleGoToday}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold font-tajawal transition-colors cursor-pointer"
                  >
                    اليوم
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2.5 rounded-2xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    title="الشهر القادم"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Days Grid */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
                
                {/* Week Day Header */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-2 border-b border-stone-100">
                  {weekDayLabels.map((w, idx) => (
                    <span
                      key={w}
                      className={`text-xs font-bold font-tajawal ${
                        idx === 5 ? "text-emerald-700 font-black" : "text-stone-500"
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </div>

                {/* Empty cells before start of month */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: calendarData.startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16 sm:h-18 rounded-2xl bg-stone-50/50 opacity-25"></div>
                  ))}

                  {/* Month Days */}
                  {calendarData.days.map((item) => {
                    const isSelected =
                      selectedDayInfo.gregorianDate.getDate() === item.gregorianDate.getDate() &&
                      selectedDayInfo.gregorianDate.getMonth() === item.gregorianDate.getMonth();

                    const hasEvents = item.hijri.events.length > 0;
                    const isWhite = item.hijri.isWhiteDay;

                    return (
                      <button
                        key={item.gregorianDay}
                        onClick={() => setSelectedDayInfo(item.hijri)}
                        className={`h-16 sm:h-18 rounded-2xl p-1.5 flex flex-col justify-between items-center transition-all cursor-pointer relative border ${
                          item.isToday
                            ? "bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/40"
                            : isSelected
                            ? "bg-emerald-50 text-emerald-950 border-emerald-400 ring-2 ring-emerald-300"
                            : isWhite
                            ? "bg-amber-50/70 hover:bg-amber-100/80 text-stone-800 border-amber-200/80"
                            : "bg-white hover:bg-stone-50 text-stone-800 border-stone-100"
                        }`}
                      >
                        {/* Top indicator: Gregorian day & event dot */}
                        <div className="w-full flex items-center justify-between px-0.5">
                          <span
                            className={`text-[10px] font-mono leading-none ${
                              item.isToday ? "text-emerald-200 font-bold" : "text-stone-400"
                            }`}
                          >
                            {item.gregorianDay}
                          </span>
                          {hasEvents && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isToday ? "bg-amber-300" : "bg-amber-500"
                              }`}
                              title={item.hijri.events[0]?.title}
                            ></span>
                          )}
                        </div>

                        {/* Main Hijri Day Number */}
                        <span
                          className={`text-base sm:text-lg font-bold font-tajawal leading-none ${
                            item.isToday ? "text-white font-black" : "text-stone-900"
                          }`}
                        >
                          {item.hijri.day}
                        </span>

                        {/* Bottom Tag / White Day Indicator */}
                        <div className="w-full flex items-center justify-center">
                          {isWhite ? (
                            <span
                              className={`text-[9px] font-tajawal px-1.5 py-0.2 rounded leading-none ${
                                item.isToday
                                  ? "bg-emerald-900 text-emerald-200"
                                  : "bg-amber-100 text-amber-900 font-bold"
                              }`}
                            >
                              أبيض
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-amiri truncate max-w-[45px] leading-none ${
                                item.isToday ? "text-emerald-100" : "text-stone-400"
                              }`}
                            >
                              {item.hijri.monthName.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Selected Day Details Card */}
              {selectedDayInfo && (
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs text-stone-400 font-tajawal">تفاصيل اليوم المختار</span>
                      <h4 className="text-lg font-bold font-tajawal text-emerald-950 mt-0.5">
                        {selectedDayInfo.dayName} {selectedDayInfo.day} {selectedDayInfo.monthName} {selectedDayInfo.year} هـ
                      </h4>
                      <p className="text-xs text-stone-500 font-sans mt-0.5">
                        الموافق: {selectedDayInfo.gregorianDate.getDate()} {monthNamesAr[selectedDayInfo.gregorianDate.getMonth()]} {selectedDayInfo.gregorianDate.getFullYear()} م
                      </p>
                    </div>

                    {selectedDayInfo.isWhiteDay && (
                      <span className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-xs font-bold font-tajawal flex items-center gap-1.5 border border-amber-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-700" />
                        <span>من الأيام البيض (سنة صيامه)</span>
                      </span>
                    )}
                  </div>

                  {/* Events on this day if any */}
                  {selectedDayInfo.events.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedDayInfo.events.map((ev) => (
                        <div
                          key={ev.id}
                          className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-1.5"
                        >
                          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm font-tajawal">
                            <Bookmark className="w-4 h-4 text-emerald-700" />
                            <span>{ev.title}</span>
                          </div>
                          <p className="text-xs text-emerald-900 font-amiri leading-relaxed">
                            {ev.description}
                          </p>
                          {ev.virtue && (
                            <p className="text-xs text-emerald-800 font-amiri bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                              <span className="font-bold">الفضل:</span> {ev.virtue}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 font-amiri">
                      {selectedDayInfo.isSacredMonth
                        ? "هذا اليوم يقع في أحد الأشهر الحُرُم المعظمة، يستحب فيه الإكثار من الطاعات والذكر والصلاة على النبي ﷺ."
                        : "يوم مبارك، احرص على المحافظة على صلواتك وأذكارك والورد اليومي."}
                    </p>
                  )}
                </div>
              )}

              {/* Moon Sighting Day Adjustment Setting */}
              <div className="bg-stone-50 p-4 rounded-3xl border border-stone-200 flex items-center justify-between text-xs font-tajawal">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-700">تعديل رؤية الهلال المحلية:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[-1, 0, 1].map((adj) => (
                    <button
                      key={adj}
                      onClick={() => saveAdjustment(adj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        hijriAdjustment === adj
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {adj > 0 ? `+${adj} يوم` : adj < 0 ? `${adj} يوم` : "الافتراضي"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fasting Reminder (Monday & Thursday + White Days) in Hijri Calendar */}
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50/50 p-4 rounded-3xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-tajawal text-emerald-950 flex items-center gap-1.5">
                        <span>تذكير صيام الإثنين والخميس والأيام البيض</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      </h4>
                      <p className="text-[11px] text-emerald-800/80 font-tajawal">
                        تنبيه تلقائي حسب التقويم الهجري المعتمد
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={fastingConfig.mondayThursdayEnabled}
                    onClick={() =>
                      updateFastingConfig({
                        mondayThursdayEnabled: !fastingConfig.mondayThursdayEnabled,
                      })
                    }
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      fastingConfig.mondayThursdayEnabled ? "bg-emerald-700" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        fastingConfig.mondayThursdayEnabled ? "-translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {fastingConfig.mondayThursdayEnabled && (
                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-tajawal">
                    <span className="text-stone-600">
                      {fastingTestStatus === "sent" ? (
                        <span className="text-emerald-700 font-bold">✓ تم إرسال التنبيه التجريبي للهاتف!</span>
                      ) : (
                        "التذكير مفعّل (ليلة الصيام وفجرها)"
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleTestFasting}
                      disabled={fastingTestStatus === "sending"}
                      className="px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10.5px] flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{fastingTestStatus === "sending" ? "جاري الإرسال..." : "إشعار تجريبي"}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: ISLAMIC EVENTS LIST */}
          {activeTab === "events" && (
            <div className="space-y-3">
              <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200 text-amber-900 text-xs font-amiri leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  أهم المناسبات والأعياد والأيام المباركة في السنة الهجرية وفضائلها الشرعية المعتمدة.
                </span>
              </div>

              <div className="space-y-3">
                {ISLAMIC_EVENTS.map((item) => {
                  const mObj = HIJRI_MONTHS.find((m) => m.number === item.hijriMonth);
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold text-xs">
                            {item.hijriDay}
                          </span>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold font-tajawal text-emerald-950">
                              {item.title}
                            </h4>
                            <span className="text-xs text-stone-500 font-amiri">
                              {item.hijriDayEnd
                                ? `من ${item.hijriDay} إلى ${item.hijriDayEnd}`
                                : `${item.hijriDay}`}{" "}
                              {mObj?.name}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-tajawal ${
                            item.category === "holiday"
                              ? "bg-emerald-100 text-emerald-900"
                              : item.category === "fasting"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-purple-100 text-purple-900"
                          }`}
                        >
                          {item.category === "holiday"
                            ? "عيد ومناسبة"
                            : item.category === "fasting"
                            ? "صيام مستحب"
                            : "ليلة مباركة"}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 font-amiri leading-relaxed">
                        {item.description}
                      </p>

                      {item.virtue && (
                        <div className="text-xs bg-stone-50 p-3 rounded-2xl text-emerald-900 font-amiri border border-stone-100">
                          <span className="font-bold">الفضل:</span> {item.virtue}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DATE CONVERTER */}
          {activeTab === "converter" && (
            <div className="space-y-4">
              <div className="flex bg-stone-100 p-1 rounded-2xl">
                <button
                  onClick={() => setConvMode("g2h")}
                  className={`flex-1 py-2.5 text-xs font-bold font-tajawal rounded-xl transition-all cursor-pointer ${
                    convMode === "g2h"
                      ? "bg-emerald-700 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  من ميلادي إلى هجري
                </button>
                <button
                  onClick={() => setConvMode("h2g")}
                  className={`flex-1 py-2.5 text-xs font-bold font-tajawal rounded-xl transition-all cursor-pointer ${
                    convMode === "h2g"
                      ? "bg-emerald-700 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  من هجري إلى ميلادي
                </button>
              </div>

              {/* Form Input */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                {convMode === "g2h" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-tajawal text-stone-700 block">
                      اختر التاريخ الميلادي:
                    </label>
                    <input
                      type="date"
                      value={convGDate}
                      onChange={(e) => setConvGDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-bold font-tajawal text-stone-700 block">
                      حدد التاريخ الهجري:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <span className="text-xs text-stone-500 block mb-1 font-tajawal">اليوم</span>
                        <select
                          value={convHDay}
                          onChange={(e) => setConvHDay(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-tajawal"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-xs text-stone-500 block mb-1 font-tajawal">الشهر</span>
                        <select
                          value={convHMonth}
                          onChange={(e) => setConvHMonth(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-tajawal"
                        >
                          {HIJRI_MONTHS.map((m) => (
                            <option key={m.number} value={m.number}>
                              {m.number} - {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-xs text-stone-500 block mb-1 font-tajawal">السنة الهجرية</span>
                        <select
                          value={convHYear}
                          onChange={(e) => setConvHYear(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-tajawal"
                        >
                          {Array.from({ length: 20 }, (_, i) => 1440 + i).map((y) => (
                            <option key={y} value={y}>
                              {y} هـ
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Conversion Result Display */}
              {convertedResult && (
                <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-white p-5 rounded-3xl border border-emerald-700 shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold font-tajawal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>نتيجة التحويل الدقيقة</span>
                  </div>

                  {convMode === "g2h" ? (
                    <div>
                      <p className="text-xl font-bold font-tajawal text-white">
                        {(convertedResult as HijriDateInfo).dayName} {(convertedResult as HijriDateInfo).day}{" "}
                        {(convertedResult as HijriDateInfo).monthName} {(convertedResult as HijriDateInfo).year} هـ
                      </p>
                      <p className="text-xs text-stone-300 font-sans mt-0.5">
                        الموافق: {convGDate}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-bold font-tajawal text-white">
                        {((convertedResult as any).gregorianDate as Date).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-emerald-300 font-amiri mt-0.5">
                        الموافق: {convHDay} {HIJRI_MONTHS.find((m) => m.number === convHMonth)?.name}{" "}
                        {convHYear} هـ
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
