import React, { useState, useMemo } from "react";
import {
  X,
  Coins,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ShoppingBag,
  DollarSign,
  Copy,
  Check,
  Share2,
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
  const [currency, setCurrency] = useState<string>("EGP"); // EGP, SAR, AED, KWD, USD, JOD

  // Currency list
  const currencies = [
    { code: "EGP", name: "جنيه مصري (ج.م)", symbol: "ج.م" },
    { code: "SAR", name: "ريال سعودي (ر.س)", symbol: "ر.س" },
    { code: "AED", name: "درهم إماراتي (د.إ)", symbol: "د.إ" },
    { code: "KWD", name: "دينار كويتي (د.ك)", symbol: "د.ك" },
    { code: "USD", name: "دولار أمريكي ($)", symbol: "$" },
    { code: "JOD", name: "دينار أردني (د.أ)", symbol: "د.أ" },
  ];

  // Gold & Silver Prices per Gram (Editable defaults)
  const [gold24Price, setGold24Price] = useState<number>(3600); // in selected currency
  const [silverPrice, setSilverPrice] = useState<number>(45);

  // 1. Cash & Wealth State
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [cashInBank, setCashInBank] = useState<number>(0);
  const [receivables, setReceivables] = useState<number>(0); // Good debts to be collected
  const [tradeGoods, setTradeGoods] = useState<number>(0); // Business inventory
  const [stocksTrading, setStocksTrading] = useState<number>(0); // Speculation stocks
  const [debtsOwed, setDebtsOwed] = useState<number>(0); // Deductible immediate debts

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

  // Calculations
  // Gold Nisab: 85g 24k Gold
  const goldNisabValue = useMemo(() => {
    return 85 * gold24Price;
  }, [gold24Price]);

  // Silver Nisab: 595g Silver
  const silverNisabValue = useMemo(() => {
    return 595 * silverPrice;
  }, [silverPrice]);

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
    return cashInHand + cashInBank + receivables + tradeGoods + stocksTrading;
  }, [cashInHand, cashInBank, receivables, tradeGoods, stocksTrading]);

  const netCashWealth = useMemo(() => {
    const val = totalGrossCashWealth - debtsOwed;
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
    return fitrFamilyMembers * fitrValuePerPerson;
  }, [fitrFamilyMembers, fitrValuePerPerson]);

  const currSymbol = currencies.find((c) => c.code === currency)?.symbol || currency;

  const handleCopySummary = () => {
    const text = `📊 *ملخص حساب الزكاة الشرعية*:
• إجمالي الأموال والمدخرات: ${netCashWealth.toLocaleString("ar-EG")} ${currSymbol}
• قيمة الذهب والفضة: ${(totalGoldValue + totalSilverValue).toLocaleString("ar-EG")} ${currSymbol}
• النصاب الشرعي (85 جرام ذهب 24): ${goldNisabValue.toLocaleString("ar-EG")} ${currSymbol}
• حالة النصاب: ${isNisabReached ? "بلغ النصاب الشرعي وجبت الزكاة (2.5%)" : "لم يبلغ النصاب"}
• *مقدار الزكاة الواجب إخراجها*: ${totalZakatDue.toLocaleString("ar-EG")} ${currSymbol}

• زكاة الفطر لعدد (${fitrFamilyMembers}) أفراد: ${totalFitrDue.toLocaleString("ar-EG")} ${currSymbol}
— تم الحساب عبر تطبيق صلوات المبارك`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      id="zakat-calculator-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
    >
      <div className="bg-[#FAF9F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-tajawal text-white flex items-center gap-2">
                <span>حاسبة الزكاة الشرعية</span>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  2.5% ربع العشر
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90 font-amiri">
                وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ
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

        {/* Currency & Live Nisab Banner */}
        <div className="bg-stone-900 text-stone-200 px-4 py-2.5 flex items-center justify-between gap-2 border-b border-stone-800 text-xs font-tajawal">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">نصاب الذهب (85g):</span>
            <span className="font-mono font-bold text-white">
              {goldNisabValue.toLocaleString("ar-EG")} {currSymbol}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 text-[11px]">العملة:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-stone-800 border border-stone-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-white px-3 pt-2 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("wealth")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "wealth"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>المال والمدخرات</span>
          </button>

          <button
            onClick={() => setActiveTab("gold_silver")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "gold_silver"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>الذهب والفضة</span>
          </button>

          <button
            onClick={() => setActiveTab("fitr")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "fitr"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>زكاة الفطر</span>
          </button>

          <button
            onClick={() => setActiveTab("recipients")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold font-tajawal rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "recipients"
                ? "bg-[#FAF9F5] text-emerald-900 border-t-2 border-emerald-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>المصارف الثمانية</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: CASH, WEALTH, SAVINGS & TRADE */}
          {activeTab === "wealth" && (
            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
                <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>السيولة النقدية والودائع البنكية (حال عليها الحول):</span>
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      النقود السائلة في اليد / المنزل ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cashInHand || ""}
                      onChange={(e) => setCashInHand(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      الأموال في الحسابات البنكية والودائع الاستثمارية ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cashInBank || ""}
                      onChange={(e) => setCashInBank(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      الديون الجيدة المرجوة الاسترداد (أموال لك عند الآخرين) ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={receivables || ""}
                      onChange={(e) => setReceivables(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Business & Stocks */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
                <h4 className="text-xs font-bold font-tajawal text-stone-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>عروض التجارة والأسهم المضاربة:</span>
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      قيمة بضائع التجارة بسعر البيع الحالي ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tradeGoods || ""}
                      onChange={(e) => setTradeGoods(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-600 font-tajawal block mb-1">
                      قيمة الأسهم المشتراة للمضاربة والتداول ({currSymbol}):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stocksTrading || ""}
                      onChange={(e) => setStocksTrading(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Deductible Debts */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-2">
                <h4 className="text-xs font-bold font-tajawal text-rose-800 flex items-center gap-1.5">
                  <span>الديون والالتزامات العاجلة التي عليك (تخصم من الوعاء):</span>
                </h4>

                <div>
                  <input
                    type="number"
                    min="0"
                    value={debtsOwed || ""}
                    onChange={(e) => setDebtsOwed(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <span className="text-[10.5px] text-stone-500 font-amiri block mt-1">
                    تخصم الديون المستحقة السداد حالاً فقط.
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GOLD & SILVER */}
          {activeTab === "gold_silver" && (
            <div className="space-y-4">
              
              {/* Gram Prices Config */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/90 space-y-2">
                <h4 className="text-xs font-bold font-tajawal text-amber-950 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>تعديل سعر الجرام الحالي لبلدك ({currSymbol}):</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-600 font-tajawal block mb-1">
                      سعر جرام الذهب عيار 24:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={gold24Price}
                      onChange={(e) => setGold24Price(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 font-tajawal block mb-1">
                      سعر جرام الفضة:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={silverPrice}
                      onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Gold Weight Inputs */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-tajawal text-stone-800">
                    أوزان الذهب المملوك (بالجرام):
                  </h4>
                  <span className="text-[11px] text-amber-700 font-bold">
                    النصاب: 85 جرام عيار 24
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-600 font-tajawal block mb-1">
                      عيار 24 (جرام):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={gold24Grams || ""}
                      onChange={(e) => setGold24Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 font-tajawal block mb-1">
                      عيار 21 (جرام):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={gold21Grams || ""}
                      onChange={(e) => setGold21Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 font-tajawal block mb-1">
                      عيار 18 (جرام):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={gold18Grams || ""}
                      onChange={(e) => setGold18Grams(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Silver weight */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-stone-600 font-tajawal block">
                      وزن الفضة الخالصة (بالجرام):
                    </label>
                    <span className="text-[10.5px] text-stone-500">
                      نصاب الفضة: 595 جرام
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={silverGrams || ""}
                    onChange={(e) => setSilverGrams(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Gold Fiqh Note */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs font-amiri text-stone-700 leading-relaxed space-y-1">
                <span className="font-bold font-tajawal text-emerald-900 block">
                  💡 فائدة فقهية معتمدة:
                </span>
                <p>
                  ذهب الادخار والاستثمار والسبائك تجب فيه الزكاة إجماعاً إذا بلغ 85 جراماً وحال عليه الحول. أما حلي المرأة المستعمل للزينة المعتادة فجمهور الفقهاء (المالكية والشافعية والحنابلة) على أنه لا زكاة فيه، والأحوط إخراج زكاته إذا رغبت في الاستبراء لدينك.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: ZAKAT AL-FITR */}
          {activeTab === "fitr" && (
            <div className="space-y-4">
              
              <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200/90 space-y-2">
                <h4 className="text-sm font-bold font-tajawal text-teal-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-700" />
                  <span>زكاة الفطر (طهرة للصائم وطعمة للمساكين):</span>
                </h4>
                <p className="text-xs text-teal-900 font-amiri leading-relaxed">
                  تجب زكاة الفطر على كل مسلم ومسلمة يملك قوت يومه وليلته وتخرج قبل صلاة عيد الفطر عن نفسه وعمن يعول (الزوجة والأولاد والوالدين إن كان ينفق عليهم).
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
                <div>
                  <label className="text-xs font-bold font-tajawal text-stone-800 block mb-1">
                    عدد أفراد الأسرة (المشمولين بالزكاة):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={fitrFamilyMembers}
                    onChange={(e) => setFitrFamilyMembers(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base font-mono font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold font-tajawal text-stone-800 block mb-1">
                    قيمة زكاة الفطر المعتمدة للفرد الواحد ({currSymbol}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={fitrValuePerPerson}
                    onChange={(e) => setFitrValuePerPerson(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono text-center font-bold"
                  />
                  <span className="text-[10.5px] text-stone-500 font-amiri block mt-1 text-center">
                    (أو ما يعادل صاعاً من غالب قوت البلد ~ 2.5 إلى 3 كجم أرز أو قمح)
                  </span>
                </div>
              </div>

              {/* Fitr Calculation Result Card */}
              <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white p-4 rounded-2xl border border-teal-600 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-200 font-tajawal block">
                    إجمالي زكاة الفطر لأسرتك
                  </span>
                  <span className="text-2xl font-black font-mono text-white mt-1 block">
                    {totalFitrDue.toLocaleString("ar-EG")} {currSymbol}
                  </span>
                  <span className="text-[11px] text-teal-300 font-tajawal">
                    عن ({fitrFamilyMembers}) أفراد
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-teal-800/80 border border-teal-400/50 flex items-center justify-center text-teal-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: THE 8 RECIPIENTS OF ZAKAT */}
          {activeTab === "recipients" && (
            <div className="space-y-3">
              
              <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200 text-purple-950 space-y-1.5">
                <span className="text-xs font-bold font-tajawal block text-purple-900">
                  قال الله تعالى في سورة التوبة (الآية 60):
                </span>
                <p className="text-xs font-amiri leading-relaxed text-purple-900 italic">
                  ﴿إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ ۖ فَرِيضَةً مِّنَ اللَّهِ ۗ وَاللَّهُ عَلِيمٌ حَكِيمٌ﴾
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { num: 1, name: "الفقراء", desc: "الذين لا يملكون كفايتهم اليومية ولا يجدون ما يسد رمقهم." },
                  { num: 2, name: "المساكين", desc: "الذين يملكون بعض الكفاية ولكن لا تسد كل حاجاتهم الأساسية." },
                  { num: 3, name: "العاملون عليها", desc: "السعاة والجباة الموكلون بجمع الزكاة وتوزيعها." },
                  { num: 4, name: "المؤلفة قلوبهم", desc: "حديثو العهد بالإسلام لتثبيتهم أو من يُرجى إسلامهم." },
                  { num: 5, name: "في الرقاب", desc: "تحرير العبيد وفكاك الأسرى والمساجين المعسرين." },
                  { num: 6, name: "الغارمون", desc: "من أثقلتهم الديون الحلال وعجزوا عن سدادها." },
                  { num: 7, name: "في سبيل الله", desc: "الإنفاق في الجهاد الشرعي والدعوة ونشر العلم النافع." },
                  { num: 8, name: "ابن السبيل", desc: "المسافر المنقطع عن ماله وبلده فيعطى ما يبلغه مقصده." },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-2.5"
                  >
                    <span className="w-6 h-6 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold font-tajawal text-stone-900">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-stone-600 font-amiri leading-relaxed">
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
            <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-300 font-tajawal block">
                    إجمالي وعاء الزكاة الخاضع للحساب:
                  </span>
                  <span className="text-base font-bold font-mono text-stone-200">
                    {totalCombinedZakatPool.toLocaleString("ar-EG")} {currSymbol}
                  </span>
                </div>

                <div className="text-left">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg font-tajawal ${
                      isNisabReached
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {isNisabReached ? "بلغ النصاب الشرعي ✓" : "دون النصاب ✕"}
                  </span>
                </div>
              </div>

              {/* Total Due Amount */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold font-tajawal text-amber-300 block">
                    مقدار الزكاة الواجب إخراجها (2.5%):
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    {totalZakatDue.toLocaleString("ar-EG")} {currSymbol}
                  </span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-tajawal flex items-center gap-1.5 transition-all active:scale-95 shadow cursor-pointer"
                  title="نسخ تقرير الزكاة"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>تم النسخ!</span>
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

        {/* Modal Footer */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-tajawal">
            حساب شرعي دقيق وفق الضوابط الفقهية المعتمدة
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-tajawal cursor-pointer transition-all active:scale-95 shadow"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
