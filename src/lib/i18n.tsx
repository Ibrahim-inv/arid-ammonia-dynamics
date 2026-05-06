import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  liveModel: "Live · Scientific Model v1.0",
  title1: "NH₃ Emission Dynamics",
  title2: "Simulator",
  subtitle: "Coupled thermo-microbial-chemical model of ammonia volatilization in poultry houses across arid environmental envelopes.",
  session: "SESSION",
  model: "MODEL",
  input: "Input",
  airTemp: "Air Temperature",
  rh: "Relative Humidity",
  litterPH: "Litter pH",
  hintT: "Sutton et al. 2013 — emission ≈ doubles every +5 °C via accelerated urease & vapor pressure.",
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
  liveModel: "مباشر · النموذج العلمي v1.0",
  title1: "ديناميكيات انبعاث",
  title2: "محاكي NH₃",
  subtitle: "نموذج حراري-ميكروبي-كيميائي مقترن لتطاير الأمونيا في حظائر الدواجن ضمن البيئات القاحلة.",
  session: "الجلسة",
  model: "النموذج",
  input: "إدخال",
  airTemp: "درجة حرارة الهواء",
  rh: "الرطوبة النسبية",
  litterPH: "حموضة الفرشة (pH)",
  hintT: "ساتون وآخرون 2013 — يتضاعف الانبعاث تقريباً كل +5 °م بفعل تسارع إنزيم اليورياز وضغط البخار.",
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
  const [lang, setLangState] = useState<Lang>("en");
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
