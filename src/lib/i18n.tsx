import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  // ---- ZeroDebt product ----
  brand: "ZeroDebt",
  brandAr: "صفر ديون",
  navFeatures: "Features",
  navTool: "Free Calculator",
  navToolkit: "Full Toolkit",
  navFaq: "FAQ",
  heroBadge: "Free · Private · 100% in your browser",
  heroTitle1: "Know your exact",
  heroTitle2: "debt-free date",
  heroSubtitle:
    "An Arabic-first planner that builds your payoff plan with the Snowball or Avalanche method — and shows you exactly how many months and how much interest you'll save.",
  heroCtaPrimary: "Try the free calculator",
  heroCtaSecondary: "Get the full toolkit",
  heroPrivacy: "Your numbers never leave your device. No sign-up, no upload.",
  howTitle: "Three steps to a real plan",
  how1Title: "List your debts",
  how1Desc: "Add each debt: balance, interest rate, and minimum payment.",
  how2Title: "Choose a strategy",
  how2Desc:
    "Snowball (smallest first, quick wins) or Avalanche (highest interest first, maximum savings).",
  how3Title: "See your freedom date",
  how3Desc: "A month-by-month plan, your debt-free date, and exactly how much interest you avoid.",
  featTitle: "Why this planner",
  feat1Title: "Two proven strategies",
  feat1Desc: "Snowball and Avalanche, computed correctly with payment rollover.",
  feat2Title: "See the savings",
  feat2Desc: "Compare against minimum-payments-only and watch the interest you avoid.",
  feat3Title: "Fully private",
  feat3Desc: "Everything runs in your browser. Your financial data is never uploaded.",
  feat4Title: "Arabic first",
  feat4Desc: "Built right-to-left from day one, with English included.",
  feat5Title: "Works everywhere",
  feat5Desc: "Phone, tablet, or laptop — no install, no account.",
  feat6Title: "Free forever",
  feat6Desc: "The calculator is free. The paid toolkit is there when you want more.",
  toolkitBadge: "The paid product",
  toolkitTitle: "The Debt-Freedom Toolkit (Excel)",
  toolkitSubtitle:
    "A professional Arabic Excel workbook that turns the plan into a daily system: debt register, automatic payoff schedule, monthly budget, and a progress dashboard.",
  toolkitItem1: "Debt register with automatic sorting for Snowball / Avalanche",
  toolkitItem2: "Month-by-month payoff schedule with rollover payments",
  toolkitItem3: "Monthly budget sheet (needs / wants / debt attack)",
  toolkitItem4: "Progress dashboard: debt-free date, interest saved, payoff bar",
  toolkitItem5: "Quick-start guide in Arabic",
  toolkitPrice: "49 SAR",
  toolkitPriceNote: "One-time purchase · yours forever · free updates",
  toolkitCta: "Buy the toolkit",
  faqTitle: "Frequently asked questions",
  faq1Q: "Is the calculator really free?",
  faq1A:
    "Yes. The web calculator is completely free. The Excel toolkit is a separate one-time purchase for those who want a full daily system.",
  faq2Q: "Where does my financial data go?",
  faq2A:
    "Nowhere. All calculations run inside your browser and are saved only on your device. Nothing is uploaded to any server.",
  faq3Q: "Snowball or Avalanche — which should I pick?",
  faq3A:
    "Avalanche saves the most money (pay highest interest first). Snowball gives faster psychological wins (pay smallest balance first). The calculator shows you both — pick the one you'll actually stick to.",
  faq4Q: "Does it work for interest-free debts?",
  faq4A:
    "Yes. Set the rate to 0% for family loans or interest-free installments, and they are planned alongside everything else.",
  footerNote: "Made to help people become debt-free.",
  langToggle: "عربي",

  // ---- Planner app ----
  appTitle: "Debt-Freedom Calculator",
  appSubtitle: "Add your debts, choose a strategy, and see your plan instantly.",
  yourDebts: "Your debts",
  addDebt: "Add debt",
  debtName: "Name",
  debtNamePlaceholder: "e.g. Credit card",
  balance: "Balance",
  apr: "Interest %",
  aprHint: "Annual rate. Use 0 for interest-free debts.",
  minPayment: "Min. payment",
  remove: "Remove",
  extraPayment: "Extra monthly payment",
  extraPaymentHint: "Any amount above the minimums that you can attack debt with each month.",
  strategy: "Strategy",
  snowball: "Snowball",
  snowballDesc: "Smallest balance first — quick wins",
  avalanche: "Avalanche",
  avalancheDesc: "Highest interest first — biggest savings",
  results: "Your plan",
  debtFreeIn: "Debt-free in",
  months: "months",
  debtFreeDate: "Freedom date",
  totalInterest: "Total interest",
  interestSaved: "Interest saved",
  monthsSaved: "Months saved",
  vsMinimum: "vs. minimum payments only",
  payoffOrder: "Payoff order",
  payoffMonth: "month",
  chartTitle: "Balance over time",
  chartBalance: "Remaining balance",
  neverWarnTitle: "Payments don't cover the interest",
  neverWarnDesc:
    "With these numbers the balance grows instead of shrinking. Increase payments or negotiate a lower rate — even a small extra payment changes everything.",
  emptyState: "Add your first debt to see the plan.",
  totalDebts: "Total debt",
  currency: "SAR",
  upsellTitle: "Want this as a daily system?",
  upsellDesc:
    "The Excel toolkit adds a monthly budget, a printable plan, and a progress dashboard.",
  upsellCta: "Get the toolkit",
  backHome: "Home",
  sampleData: "Try sample data",
  clearAll: "Clear all",

  // ---- NH3 simulator (kept at /nh3) ----
  liveModel: "Live · Scientific Model v1.0",
  title1: "NH₃ Emission Dynamics",
  title2: "Simulator",
  subtitle:
    "Coupled thermo-microbial-chemical model of ammonia volatilization in poultry houses across arid environmental envelopes.",
  session: "SESSION",
  model: "MODEL",
  input: "Input",
  airTemp: "Air Temperature",
  rh: "Relative Humidity",
  litterPH: "Litter pH",
  hintT:
    "Sutton et al. 2013 — emission ≈ doubles every +5 °C via accelerated urease & vapor pressure.",
  hintRH: "Above 80% RH, NH₃ dissolves into water films forming NH₄⁺, lowering airborne ppm.",
  hintPH: "Reece et al. 1979 — pH > 8 triggers exponential equilibrium shift toward gaseous NH₃.",
  liveReading: "Live Reading",
  nh3Conc: "NH₃ Concentration",
  safe: "SAFE",
  warn: "WARN",
  danger: "DANGER",
  riskSafe: "safe",
  riskWarning: "warning",
  riskDangerous: "dangerous",
  sensitivity: "Sensitivity Sweep",
  nh3VsVar: "NH₃ vs Variable",
  safeCeiling: "10 ppm safe ceiling",
  dangerLine: "25 ppm danger",
  currentVal: "current value",
  scientific: "Scientific Interpretation",
  multipliers: "Active Multipliers",
  refs: "Refs: Sutton et al. 2013 · Reece et al. 1979 · Henry's Law of NH₃ solubility · Urease enzyme kinetics.",
  aridRegime: "Arid Synergistic Regime",
  aridDesc: "Activated when RH < 20% and T > 45 °C — water trap collapses, maximum volatilization.",
  active: "ACTIVE",
  inactive: "INACTIVE",
  microbial: "Microbial",
  henry: "Henry",
  aridSynergy: "Arid Synergy",
};

const ar: Dict = {
  // ---- ZeroDebt product ----
  brand: "صفر ديون",
  brandAr: "ZeroDebt",
  navFeatures: "المميزات",
  navTool: "الحاسبة المجانية",
  navToolkit: "العدة الكاملة",
  navFaq: "الأسئلة الشائعة",
  heroBadge: "مجاني · خاص · يعمل بالكامل في متصفحك",
  heroTitle1: "اعرف بالضبط",
  heroTitle2: "تاريخ تحرّرك من الديون",
  heroSubtitle:
    "أداة عربية تبني لك خطة سداد ديونك بطريقة «كرة الثلج» أو «الانهيار الجليدي»، وتوريك كم شهراً وكم ريالاً من الفوائد ستوفّر.",
  heroCtaPrimary: "جرّب الحاسبة مجاناً",
  heroCtaSecondary: "احصل على العدة الكاملة",
  heroPrivacy: "أرقامك لا تغادر جهازك أبداً. بدون تسجيل، بدون رفع بيانات.",
  howTitle: "ثلاث خطوات لخطة حقيقية",
  how1Title: "سجّل ديونك",
  how1Desc: "أضف كل دين: المبلغ المتبقي، نسبة الفائدة، والقسط الأدنى.",
  how2Title: "اختر استراتيجيتك",
  how2Desc:
    "كرة الثلج (الأصغر أولاً — انتصارات سريعة) أو الانهيار الجليدي (الفائدة الأعلى أولاً — أكبر توفير).",
  how3Title: "شاهد تاريخ حريتك",
  how3Desc: "خطة شهراً بشهر، تاريخ تحررك من الدين، وكم ريالاً من الفوائد ستتجنب.",
  featTitle: "لماذا هذه الأداة؟",
  feat1Title: "استراتيجيتان مجرّبتان",
  feat1Desc: "كرة الثلج والانهيار الجليدي، محسوبتان بدقة مع تدوير الأقساط المحرَّرة.",
  feat2Title: "شاهد التوفير",
  feat2Desc: "مقارنة مباشرة مع سيناريو «الحد الأدنى فقط» لترى الفوائد التي تتجنبها.",
  feat3Title: "خصوصية كاملة",
  feat3Desc: "كل الحسابات تتم داخل متصفحك. بياناتك المالية لا تُرفع لأي خادم.",
  feat4Title: "عربي أولاً",
  feat4Desc: "مصمم من اليمين لليسار منذ اليوم الأول، مع دعم الإنجليزية.",
  feat5Title: "يعمل في كل مكان",
  feat5Desc: "جوال أو حاسب — بدون تحميل وبدون حساب.",
  feat6Title: "مجاني للأبد",
  feat6Desc: "الحاسبة مجانية. والعدة المدفوعة موجودة متى ما أردت المزيد.",
  toolkitBadge: "المنتج المدفوع",
  toolkitTitle: "عدة التحرر من الديون (Excel)",
  toolkitSubtitle:
    "ملف Excel عربي احترافي يحوّل الخطة إلى نظام يومي: سجل الديون، جدول سداد تلقائي، ميزانية شهرية، ولوحة متابعة للتقدم.",
  toolkitItem1: "سجل الديون مع ترتيب تلقائي لكرة الثلج / الانهيار الجليدي",
  toolkitItem2: "جدول سداد شهراً بشهر مع تدوير الأقساط المحرَّرة",
  toolkitItem3: "ورقة ميزانية شهرية (أساسيات / كماليات / هجوم على الدين)",
  toolkitItem4: "لوحة متابعة: تاريخ التحرر، الفوائد الموفَّرة، شريط الإنجاز",
  toolkitItem5: "دليل بدء سريع باللغة العربية",
  toolkitPrice: "49 ر.س",
  toolkitPriceNote: "دفعة واحدة · ملكك للأبد · تحديثات مجانية",
  toolkitCta: "اشترِ العدة الآن",
  faqTitle: "الأسئلة الشائعة",
  faq1Q: "هل الحاسبة مجانية فعلاً؟",
  faq1A:
    "نعم. حاسبة الويب مجانية بالكامل. أما عدة Excel فهي منتج منفصل بدفعة واحدة لمن يريد نظاماً يومياً متكاملاً.",
  faq2Q: "أين تذهب بياناتي المالية؟",
  faq2A: "لا مكان. كل الحسابات تتم داخل متصفحك وتُحفظ على جهازك فقط. لا يُرفع أي شيء لأي خادم.",
  faq3Q: "كرة الثلج أم الانهيار الجليدي — أيهما أختار؟",
  faq3A:
    "الانهيار الجليدي يوفّر أكبر مبلغ (تسدد الفائدة الأعلى أولاً). كرة الثلج تعطيك انتصارات نفسية أسرع (تسدد الأصغر أولاً). الحاسبة تعرض لك الاثنتين — اختر ما ستلتزم به فعلاً.",
  faq4Q: "هل تعمل مع الديون بدون فوائد؟",
  faq4A: "نعم. ضع النسبة 0% للديون العائلية أو الأقساط بدون فوائد، وستدخل في الخطة مع بقية الديون.",
  footerNote: "صُنعت لمساعدة الناس على التحرر من الديون.",
  langToggle: "EN",

  // ---- Planner app ----
  appTitle: "حاسبة التحرر من الديون",
  appSubtitle: "أضف ديونك، اختر استراتيجيتك، وشاهد خطتك فوراً.",
  yourDebts: "ديونك",
  addDebt: "أضف ديناً",
  debtName: "الاسم",
  debtNamePlaceholder: "مثال: بطاقة ائتمانية",
  balance: "المبلغ المتبقي",
  apr: "الفائدة %",
  aprHint: "النسبة السنوية. ضع 0 للديون بدون فوائد.",
  minPayment: "القسط الأدنى",
  remove: "حذف",
  extraPayment: "دفعة شهرية إضافية",
  extraPaymentHint: "أي مبلغ فوق الأقساط الدنيا تستطيع مهاجمة الدين به كل شهر.",
  strategy: "الاستراتيجية",
  snowball: "كرة الثلج",
  snowballDesc: "الأصغر أولاً — انتصارات سريعة",
  avalanche: "الانهيار الجليدي",
  avalancheDesc: "الفائدة الأعلى أولاً — أكبر توفير",
  results: "خطتك",
  debtFreeIn: "التحرر خلال",
  months: "شهراً",
  debtFreeDate: "تاريخ الحرية",
  totalInterest: "إجمالي الفوائد",
  interestSaved: "فوائد موفَّرة",
  monthsSaved: "أشهر موفَّرة",
  vsMinimum: "مقارنةً بالحد الأدنى فقط",
  payoffOrder: "ترتيب السداد",
  payoffMonth: "الشهر",
  chartTitle: "الرصيد عبر الزمن",
  chartBalance: "الرصيد المتبقي",
  neverWarnTitle: "الأقساط لا تغطي الفوائد",
  neverWarnDesc:
    "بهذه الأرقام يتضخم الدين بدل أن ينقص. ارفع الأقساط أو تفاوض على خفض النسبة — حتى الزيادة الصغيرة تغيّر كل شيء.",
  emptyState: "أضف أول دين لتشاهد الخطة.",
  totalDebts: "إجمالي الديون",
  currency: "ر.س",
  upsellTitle: "تريدها نظاماً يومياً؟",
  upsellDesc: "عدة Excel تضيف ميزانية شهرية وخطة قابلة للطباعة ولوحة متابعة للتقدم.",
  upsellCta: "احصل على العدة",
  backHome: "الرئيسية",
  sampleData: "جرّب بيانات تجريبية",
  clearAll: "مسح الكل",

  // ---- NH3 simulator (kept at /nh3) ----
  liveModel: "مباشر · النموذج العلمي v1.0",
  title1: "ديناميكيات انبعاث",
  title2: "محاكي NH₃",
  subtitle:
    "نموذج حراري-ميكروبي-كيميائي مقترن لتطاير الأمونيا في حظائر الدواجن ضمن البيئات القاحلة.",
  session: "الجلسة",
  model: "النموذج",
  input: "إدخال",
  airTemp: "درجة حرارة الهواء",
  rh: "الرطوبة النسبية",
  litterPH: "حموضة الفرشة (pH)",
  hintT:
    "ساتون وآخرون 2013 — يتضاعف الانبعاث تقريباً كل +5 °م بفعل تسارع إنزيم اليورياز وضغط البخار.",
  hintRH: "فوق 80% رطوبة، يذوب NH₃ في أغشية الماء مكوّناً NH₄⁺ مما يخفض التركيز الهوائي.",
  hintPH: "ريس وآخرون 1979 — عند pH > 8 يحدث تحول أسي للتوازن نحو NH₃ الغازي.",
  liveReading: "قراءة مباشرة",
  nh3Conc: "تركيز NH₃",
  safe: "آمن",
  warn: "تحذير",
  danger: "خطر",
  riskSafe: "آمن",
  riskWarning: "تحذير",
  riskDangerous: "خطر",
  sensitivity: "مسح الحساسية",
  nh3VsVar: "NH₃ مقابل المتغير",
  safeCeiling: "10 ppm حد الأمان",
  dangerLine: "25 ppm حد الخطر",
  currentVal: "القيمة الحالية",
  scientific: "التفسير العلمي",
  multipliers: "المعاملات النشطة",
  refs: "المراجع: ساتون 2013 · ريس 1979 · قانون هنري لذوبانية NH₃ · حركية إنزيم اليورياز.",
  aridRegime: "نظام التآزر القاحل",
  aridDesc: "يُفعَّل عند RH < 20% و T > 45 °م — ينهار المصيدة المائية ويبلغ التطاير ذروته.",
  active: "نشط",
  inactive: "غير نشط",
  microbial: "ميكروبي",
  henry: "هنري",
  aridSynergy: "تآزر قاحل",
};

const dicts = { en, ar };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof en) => string;
  dir: "ltr" | "rtl";
}

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  };
  const t = (k: keyof typeof en) => dicts[lang][k] ?? en[k];
  return (
    <I18nCtx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}

export function localizeExplanation(lang: Lang, lines: string[]): string[] {
  if (lang === "en") return lines;
  return lines;
}
