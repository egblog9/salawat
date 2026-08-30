import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  X,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ShoppingBag,
  DollarSign,
  Copy,
  Check,
  Users,
} from "lucide-react";

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"wealth" | "gold_silver" | "fitr" | "recipients">("wealth");
  const [currency, setCurrency] = useState<string>("EGP");

  // Currency list
  const currencies = [
    { code: "EGP", name: "جنيه مصري (ج.م)", symbol: "ج.م" },
    { code: "SAR", name: "ريال سعودي (ر.س)", symbol: "ر.س" },
    { code: "AED", name: "درهم إماراتي (د.إ)", symbol: "د.إ" },
    { code: "KWD", name: "دينار كويتي (د.ك)", symbol: "د.ك" },
    { code: "USD", name: "دولار أمريكي ($)", symbol: "$" },
    { code: "JOD", name: "دينار أردني (د.أ)", symbol: "د.أ" },
    { code: "QAR", name: "ريال قطري (ر.ق)", symbol: "ر.ق" },
  ];

  // Gold & Silver Prices per Gram (Editable defaults)
  const [gold24Price, setGold24Price] = useState<number>(3600);
  const [silverPrice, setSilverPrice] = useState<number>(45);

  // 1. Cash & Wealth State
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [cashInBank, setCashInBank] = useState<number>(0);
  const [receivables, setReceivables] = useState<number>(0);
  const [tradeGoods, setTradeGoods] = useState<number>(0);
  const [stocksTrading, setStocksTrading] = useState<number>(0);
  const [debtsOwed, setDebtsOwed] = useState<number>(0);

  // 2. Gold & Silver State
  const [gold24Grams, setGold24Grams] = useState<number>(0);
  const [gold21Grams, setGold21Grams] = useState<number>(0);
  const [gold18Grams, setGold18Grams] = useState<number>(0);
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [goldType, setGoldType] = useState<"savings" | "adornment">("savings");

  // 3. Zakat al-Fitr State
  const [fitrFamilyMembers, setFitrFamilyMembers] = useState<number>(4);
  const [fitrValuePerPerson, setFitrValuePerPerson] = useState<number>(35);

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Gold Nisab: 85g 24k Gold
  const goldNisabValue = useMemo(() => {
    return 85 * gold24Price;
  }, [gold24Price]);

  // Total Gold converted to 24k equivalent
  const equivalentGold24Grams = useMemo(() => {
    const from24 = gold24Grams;
    const from21 = (gold21Grams * 21) / 24;
    const from18 = (gold18Grams * 18) / 24;
    return from24 + from21 + from18;
  }, [gold24Grams, gold21Grams, gold18Grams]);

  const totalGoldValue = useMemo(() => {
    return equivalentGold24Grams * gold24Price;
  }, [equivalentGold24Grams, gold24Price]);

  const totalSilverValue = useMemo(() => {
    return silverGrams * silverPrice;
  }, [silverGrams, silverPrice]);

  // Total Liquid Wealth (Money, Business Goods, Receivables minus Debts)
  const totalGrossCashWealth = useMemo(() => {
    return (cashInHand || 0) + (cashInBank || 0) + (receivables || 0) + (tradeGoods || 0) + (stocksTrading || 0);
  }, [cashInHand, cashInBank, receivables, tradeGoods, stocksTrading]);

  const netCashWealth = useMemo(() => {
    const val = totalGrossCashWealth - (debtsOwed || 0);
    return val > 0 ? val : 0;
  }, [totalGrossCashWealth, debtsOwed]);

  // Total Combined Zakat Pool
  const totalCombinedZakatPool = useMemo(() => {
    let pool = netCashWealth;
    if (goldType === "savings" || goldType === "adornment") {
      pool += totalGoldValue + totalSilverValue;
    }
    return pool;
  }, [netCashWealth, totalGoldValue, totalSilverValue, goldType]);

  // Is Nisab Reached (Using Gold Nisab ~ 85g 24k)
  const isNisabReached = useMemo(() => {
    return totalCombinedZakatPool >= goldNisabValue && goldNisabValue > 0;
  }, [totalCombinedZakatPool, goldNisabValue]);

  // Total Zakat Due (2.5% = 1/40)
  const totalZakatDue = useMemo(() => {
    if (!isNisabReached) return 0;
    return totalCombinedZakatPool * 0.025;
  }, [totalCombinedZakatPool, isNisabReached]);

  // Zakat al-Fitr Due
  const totalFitrDue = useMemo(() => {
    return (fitrFamilyMembers || 0) * (fitrValuePerPerson || 0);
  }, [fitrFamilyMembers, fitrValuePerPerson]);

  const currSymbol = currencies.find((c) => c.code === currency)?.symbol || currency;

  const handleCopySummary = () => {
    const text = `ملخص حساب الزكاة الشرعية:
- إجمالي وعاء الأموال والمدخرات: ${netCashWealth.toLocaleString("en-US")} ${currSymbol}
- قيمة الذهب والفضة: ${(totalGoldValue + totalSilverValue).toLocaleString("en-US")} ${currSymbol}
- قيمة النصاب الشرعي (85 جرام عيار 24): ${goldNisabValue.toLocaleString("en-US")} ${currSymbol}
- حالة النصاب: ${isNisabReached ? "بلغ النصاب الشرعي وحالت عليه شروط الوجوب" : "لم يبلغ النصاب بعد"}
- مقدار الزكاة الواجب إخراجها (2.5%): ${totalZakatDue.toLocaleString("en-US")} ${currSymbol}
- زكاة الفطر لعدد (${fitrFamilyMembers}) أفراد: ${totalFitrDue.toLocaleString("en-US")} ${currSymbol}
(تم الحساب عبر تطبيق صلوات المبارك)`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      id="zakat-calculator-page"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Standard Full Page Header */}
      <header className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white px-3.5 py-3 sm:px-6 sticky top-0 z-30 shadow-md border-b border-emerald-800/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            title="رجوع للصفحة الرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-tajawal text-white truncate">
                حاسبة الزكاة الشرعية
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full font-bold font-tajawal border border-emerald-600/40 whitespace-nowrap flex-shrink-0">
                2.5% ربع العشر
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-amiri truncate">
              وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ
            </p>
          </div>
        </div>

        {/* Currency Picker and Done in Header */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 bg-white/10 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl border border-white/10 text-xs font-tajawal">
            <span className="text-stone-300 text-[10px] sm:text-[11px]">العملة:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-stone-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            تم
          </button>
        </div>
      </header>

      {/* Live Nisab Banner */}
      <div className="bg-stone-900 text-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 text-xs font-tajawal">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">نصاب الذهب (85 جرام عيار 24):</span>
            <span className="font-mono font-bold text-white tracking-wide">
              {goldNisabValue.toLocaleString("en-US")} {currSymbol}
            </span>
          </div>
          <span className="text-stone-400 text-[11px]">
            {isNisabReached ? "✅ بلغ النصاب" : "⏳ دون النصاب"}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-2 sm:p-3 border-b border-stone-200 shadow-sm">
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("wealth")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "wealth"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>المال والمدخرات</span>
          </button>

          <button
            onClick={() => setActiveTab("gold_silver")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "gold_silver"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>الذهب والفضة</span>
          </button>

          <button
            onClick={() => setActiveTab("fitr")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "fitr"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>زكاة الفطر</span>
          </button>

          <button
            onClick={() => setActiveTab("recipients")}
            className={`py-2 px-2 text-xs font-bold font-tajawal rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "recipients"
                ? "bg-[#2F5241] text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>المصارف الثمانية</span>
          </button>
        </div>
      </div>

      {/* Main Full Page Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-16">
          
          {/* TAB 1: CASH & WEALTH */}
          {activeTab === "wealth" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3.5">
                <h3 className="text-sm font-bold font-tajawal text-stone-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-800" />
                  <span>السيولة النقدية والودائع البنكية (حال عليها الحول):</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      النقود السائلة في اليد أو المنزل ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={cashInHand || ""}
                      onChange={(e) => setCashInHand(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      الأموال في الحسابات البنكية والودائع ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={cashInBank || ""}
                      onChange={(e) => setCashInBank(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      الديون المرجوة الاسترداد (أموال لك عند الآخرين) ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={receivables || ""}
                      onChange={(e) => setReceivables(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Trade Goods */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3.5">
                <h3 className="text-sm font-bold font-tajawal text-stone-800 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  <span>عروض التجارة والأسهم المضاربة:</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      قيمة بضائع التجارة بسعر السوق الحالي ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={tradeGoods || ""}
                      onChange={(e) => setTradeGoods(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      قيمة الأسهم المشتراة للتداول والمضاربة ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={stocksTrading || ""}
                      onChange={(e) => setStocksTrading(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Deductible Debts */}
              <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-sm space-y-2.5">
                <h3 className="text-sm font-bold font-tajawal text-rose-900">
                  الديون والالتزامات العاجلة الواجب سدادها حالاً ({currSymbol}):
                </h3>
                <input
                  type="number"
                  dir="ltr"
                  min="0"
                  value={debtsOwed || ""}
                  onChange={(e) => setDebtsOwed(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-rose-200 text-sm font-mono text-stone-900 focus:ring-2 focus:ring-rose-500 focus:outline-none text-right"
                />
                <span className="text-xs text-stone-500 font-amiri block">
                  تخصم من الوعاء الديون المستحقة السداد الفوري فقط.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: GOLD & SILVER */}
          {activeTab === "gold_silver" && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 p-4 rounded-3xl border border-amber-200/90 space-y-3">
                <h3 className="text-xs font-bold font-tajawal text-amber-950 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-700" />
                  <span>تعديل سعر الجرام الحالي لبلدك ({currSymbol}):</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      سعر جرام الذهب عيار 24:
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="1"
                      value={gold24Price}
                      onChange={(e) => setGold24Price(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      سعر جرام الفضة الخالصة:
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="1"
                      value={silverPrice}
                      onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Gold Weight Inputs */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-tajawal text-stone-800">
                    أوزان الذهب المملوك (بالجرام):
                  </h3>
                  <span className="text-xs text-amber-800 font-bold font-tajawal">
                    النصاب: 85 جرام عيار 24
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1 text-center">
                      عيار 24 (جرام)
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={gold24Grams || ""}
                      onChange={(e) => setGold24Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1 text-center">
                      عيار 21 (جرام)
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={gold21Grams || ""}
                      onChange={(e) => setGold21Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1 text-center">
                      عيار 18 (جرام)
                    </label>
                    <input
                      type="number"
                      dir="ltr"
                      min="0"
                      value={gold18Grams || ""}
                      onChange={(e) => setGold18Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono font-bold text-center"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-stone-600 font-tajawal block">
                      وزن الفضة الخالصة (بالجرام):
                    </label>
                    <span className="text-[11px] text-stone-500 font-tajawal">
                      نصاب الفضة: 595 جرام
                    </span>
                  </div>
                  <input
                    type="number"
                    dir="ltr"
                    min="0"
                    value={silverGrams || ""}
                    onChange={(e) => setSilverGrams(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FITR */}
          {activeTab === "fitr" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-5 rounded-3xl border border-emerald-200/90 space-y-2">
                <h3 className="text-base font-bold font-tajawal text-emerald-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-800" />
                  <span>زكاة الفطر (طهرة للصائم وطعمة للمساكين):</span>
                </h3>
                <p className="text-xs text-emerald-900 font-amiri leading-relaxed">
                  تجب زكاة الفطر على كل مسلم ومسلمة يملك قوت يومه وليلته وتخرج قبل صلاة عيد الفطر عن نفسه وعمن يعول.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold font-tajawal text-stone-800 block mb-1">
                    عدد أفراد الأسرة (المشمولين بالزكاة):
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    min="1"
                    max="100"
                    value={fitrFamilyMembers}
                    onChange={(e) => setFitrFamilyMembers(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-base font-mono font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-tajawal text-stone-800 block mb-1">
                    قيمة زكاة الفطر المعتمدة للفرد الواحد ({currSymbol}):
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    min="1"
                    value={fitrValuePerPerson}
                    onChange={(e) => setFitrValuePerPerson(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-white p-5 rounded-3xl border border-emerald-700/60 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-200 font-tajawal block">
                    إجمالي زكاة الفطر لأسرتك:
                  </span>
                  <span className="text-2xl font-black font-mono text-white mt-1 block">
                    {totalFitrDue.toLocaleString("en-US")} {currSymbol}
                  </span>
                  <span className="text-xs text-emerald-300 font-tajawal">
                    عن ({fitrFamilyMembers}) أفراد
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECIPIENTS */}
          {activeTab === "recipients" && (
            <div className="space-y-4">
              <div className="bg-stone-100 p-4 rounded-3xl border border-stone-300 text-stone-900 space-y-2">
                <span className="text-xs font-bold font-tajawal block text-emerald-900">
                  قال الله تعالى في سورة التوبة (الآية 60):
                </span>
                <p className="text-xs font-amiri leading-relaxed text-stone-800 italic">
                  ﴿إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ فَرِيضَةً مِنَ اللَّهِ وَاللَّهُ عَلِيمٌ حَكِيمٌ﴾
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { num: 1, name: "الفقراء", desc: "الذين لا يملكون كفايتهم اليومية ولا يجدون ما يسد رمقهم." },
                  { num: 2, name: "المساكين", desc: "الذين يملكون بعض الكفاية ولكن لا تسد كل حاجاتهم الأساسية." },
                  { num: 3, name: "العاملون عليها", desc: "السعاة والجباة الموكلون بجمع الزكاة وتوزيعها." },
                  { num: 4, name: "المؤلفة قلوبهم", desc: "حديثو العهد بالإسلام لتثبيتهم أو من يُرجى إسلامهم." },
                  { num: 5, name: "في الرقاب", desc: "تحرير العبيد وفكاك الأسرى والمساجين المعسرين." },
                  { num: 6, name: "الغارمون", desc: "من أثقلتهم الديون الحلال وعجزوا عن سدادها." },
                  { num: 7, name: "في سبيل الله", desc: "الإنفاق في أوجه الخير العامة والدعوة ونشر العلم النافع." },
                  { num: 8, name: "ابن السبيل", desc: "المسافر المنقطع عن ماله وبلده فيعطى ما يبلغه مقصده." },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-3"
                  >
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs flex-shrink-0 font-mono">
                      {item.num}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold font-tajawal text-stone-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 font-amiri leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOTAL ZAKAT SUMMARY FOOTER CARD (FOR WEALTH & GOLD) */}
          {(activeTab === "wealth" || activeTab === "gold_silver") && (
            <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-5 rounded-3xl border border-emerald-600/50 shadow-xl space-y-3.5">
              
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-300 font-tajawal block">
                    إجمالي وعاء الزكاة الخاضع للحساب:
                  </span>
                  <span className="text-lg font-bold font-mono text-stone-200 tracking-wide">
                    {totalCombinedZakatPool.toLocaleString("en-US")} {currSymbol}
                  </span>
                </div>

                <div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl font-tajawal inline-block ${
                      isNisabReached
                        ? "bg-emerald-700 text-white border border-emerald-500/40"
                        : "bg-stone-800 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {isNisabReached ? "بلغ النصاب الشرعي" : "لم يبلغ النصاب"}
                  </span>
                </div>
              </div>

              {/* Total Due Amount & Action */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-xs font-bold font-tajawal text-amber-300 block">
                    مقدار الزكاة الواجب إخراجها (2.5%):
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wide">
                    {totalZakatDue.toLocaleString("en-US")} {currSymbol}
                  </span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs font-tajawal flex items-center gap-2 transition-all active:scale-95 shadow cursor-pointer border border-emerald-600/40"
                  title="نسخ تقرير الزكاة"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ التقرير</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
};
