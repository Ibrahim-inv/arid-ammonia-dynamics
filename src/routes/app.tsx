import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  FileSpreadsheet,
  Plus,
  Trash2,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addMonths, comparePlan, formatMoney, type Debt, type Strategy } from "@/lib/debt-model";
import { useI18n } from "@/lib/i18n";
import { STORE_URL } from "@/lib/config";

export const Route = createFileRoute("/app")({
  component: PlannerApp,
  head: () => ({
    meta: [
      { title: "حاسبة التحرر من الديون · صفر ديون" },
      {
        name: "description",
        content:
          "أضف ديونك واختر استراتيجية كرة الثلج أو الانهيار الجليدي وشاهد خطة سدادك وتاريخ تحررك فوراً — مجاناً وبخصوصية كاملة.",
      },
    ],
  }),
});

const STORAGE_KEY = "zerodebt-planner-v1";

interface Persisted {
  debts: Debt[];
  extra: number;
  strategy: Strategy;
}

const SAMPLE_DEBTS: Debt[] = [
  { id: "s1", name: "بطاقة ائتمانية", balance: 15000, apr: 24, minPayment: 500 },
  { id: "s2", name: "قرض شخصي", balance: 80000, apr: 6, minPayment: 1800 },
  { id: "s3", name: "دين عائلي", balance: 20000, apr: 0, minPayment: 400 },
];

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `d${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function PlannerApp() {
  const { t, lang, setLang, dir } = useI18n();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extra, setExtra] = useState(1000);
  const [strategy, setStrategy] = useState<Strategy>("snowball");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        if (Array.isArray(p.debts)) setDebts(p.debts);
        if (typeof p.extra === "number") setExtra(p.extra);
        if (p.strategy === "snowball" || p.strategy === "avalanche") setStrategy(p.strategy);
      }
    } catch {
      // corrupted storage — start fresh
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ debts, extra, strategy } satisfies Persisted),
      );
    } catch {
      // storage unavailable (private mode) — planner still works in-memory
    }
  }, [debts, extra, strategy, loaded]);

  const validDebts = useMemo(() => debts.filter((d) => d.balance > 0 && d.minPayment > 0), [debts]);

  const cmp = useMemo(
    () => (validDebts.length ? comparePlan(validDebts, strategy, Math.max(0, extra)) : null),
    [validDebts, strategy, extra],
  );

  const totalDebt = useMemo(() => validDebts.reduce((s, d) => s + d.balance, 0), [validDebts]);

  const freeDate = useMemo(() => {
    if (!cmp || cmp.plan.neverPaysOff) return null;
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en", {
      calendar: "gregory",
      year: "numeric",
      month: "long",
    }).format(addMonths(new Date(), cmp.plan.months));
  }, [cmp, lang]);

  const updateDebt = (id: string, patch: Partial<Debt>) =>
    setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const addDebt = () =>
    setDebts((ds) => [...ds, { id: newId(), name: "", balance: 0, apr: 0, minPayment: 0 }]);

  const cur = t("currency");

  return (
    <div
      dir={dir}
      className="min-h-screen"
      style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : undefined }}
    >
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border/60 bg-background/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">{t("brand")}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("backHome")}
            </Link>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="panel px-3 py-1.5 text-xs font-mono hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              {t("langToggle")}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("appTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{t("appSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-5">
            <div className="panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{t("yourDebts")}</h2>
                <div className="flex gap-2">
                  {debts.length === 0 && (
                    <button
                      onClick={() => setDebts(SAMPLE_DEBTS.map((d) => ({ ...d, id: newId() })))}
                      className="text-xs text-primary hover:underline"
                    >
                      {t("sampleData")}
                    </button>
                  )}
                  {debts.length > 0 && (
                    <button
                      onClick={() => setDebts([])}
                      className="text-xs text-muted-foreground hover:text-danger"
                    >
                      {t("clearAll")}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {debts.map((d) => (
                  <div key={d.id} className="rounded-md border border-border p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        value={d.name}
                        onChange={(e) => updateDebt(d.id, { name: e.target.value })}
                        placeholder={t("debtNamePlaceholder")}
                        className="flex-1 bg-transparent border-b border-border/70 focus:border-primary outline-none text-sm py-1"
                      />
                      <button
                        onClick={() => setDebts((ds) => ds.filter((x) => x.id !== d.id))}
                        className="text-muted-foreground hover:text-danger transition-colors"
                        aria-label={t("remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <NumField
                        label={`${t("balance")} (${cur})`}
                        value={d.balance}
                        onChange={(v) => updateDebt(d.id, { balance: v })}
                      />
                      <NumField
                        label={t("apr")}
                        value={d.apr}
                        step={0.1}
                        onChange={(v) => updateDebt(d.id, { apr: v })}
                      />
                      <NumField
                        label={`${t("minPayment")} (${cur})`}
                        value={d.minPayment}
                        onChange={(v) => updateDebt(d.id, { minPayment: v })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addDebt}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t("addDebt")}
              </button>
              <p className="mt-2 text-[11px] text-muted-foreground">{t("aprHint")}</p>
            </div>

            <div className="panel p-5">
              <label className="block text-sm font-semibold mb-2">
                {t("extraPayment")} ({cur})
              </label>
              <input
                type="number"
                dir="ltr"
                min={0}
                value={extra}
                onChange={(e) => setExtra(Number(e.target.value) || 0)}
                className="w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-lg font-mono outline-none focus:border-primary"
              />
              <p className="mt-2 text-[11px] text-muted-foreground">{t("extraPaymentHint")}</p>
            </div>

            <div className="panel p-5">
              <div className="text-sm font-semibold mb-3">{t("strategy")}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { key: "snowball", label: t("snowball"), desc: t("snowballDesc") },
                    { key: "avalanche", label: t("avalanche"), desc: t("avalancheDesc") },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStrategy(s.key)}
                    className="rounded-md border p-3 text-start transition-colors"
                    style={{
                      borderColor:
                        strategy === s.key ? "var(--color-primary)" : "var(--color-border)",
                      background:
                        strategy === s.key
                          ? "color-mix(in oklab, var(--color-primary) 12%, transparent)"
                          : "transparent",
                    }}
                  >
                    <div className="font-medium text-sm">{s.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-5">
            {!cmp && (
              <div className="panel p-10 text-center text-muted-foreground">{t("emptyState")}</div>
            )}

            {cmp?.plan.neverPaysOff && (
              <div
                className="panel p-5 flex items-start gap-3"
                style={{ borderColor: "var(--color-danger)" }}
              >
                <AlertTriangle
                  className="h-5 w-5 shrink-0 mt-0.5"
                  style={{ color: "var(--color-danger)" }}
                />
                <div>
                  <div className="font-semibold" style={{ color: "var(--color-danger)" }}>
                    {t("neverWarnTitle")}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t("neverWarnDesc")}</p>
                </div>
              </div>
            )}

            {cmp && !cmp.plan.neverPaysOff && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Stat label={t("totalDebts")} value={`${formatMoney(totalDebt)} ${cur}`} />
                  <Stat
                    label={t("debtFreeIn")}
                    value={`${cmp.plan.months} ${t("months")}`}
                    highlight
                    icon={<CalendarCheck className="h-4 w-4" />}
                    sub={freeDate ?? undefined}
                  />
                  <Stat
                    label={t("totalInterest")}
                    value={`${formatMoney(cmp.plan.totalInterest)} ${cur}`}
                  />
                  <Stat
                    label={t("interestSaved")}
                    value={`${formatMoney(cmp.interestSaved)} ${cur}`}
                    highlight
                    icon={<TrendingDown className="h-4 w-4" />}
                    sub={`${t("monthsSaved")}: ${cmp.monthsSaved} · ${t("vsMinimum")}`}
                  />
                </div>

                <div className="panel p-5">
                  <h3 className="font-semibold text-sm mb-4">{t("chartTitle")}</h3>
                  <div dir="ltr" className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={cmp.plan.schedule}
                        margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                            <stop
                              offset="100%"
                              stopColor="var(--color-primary)"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="var(--color-grid)"
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          width={70}
                          tickFormatter={(v: number) => formatMoney(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(v: number) => [`${formatMoney(v)} ${cur}`, t("chartBalance")]}
                          labelFormatter={(m) => `${t("payoffMonth")} ${m}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalBalance"
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          fill="url(#balFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="panel p-5">
                  <h3 className="font-semibold text-sm mb-4">{t("payoffOrder")}</h3>
                  <ol className="space-y-2.5">
                    {cmp.plan.payoffOrder.map((p, i) => (
                      <li key={p.debtId} className="flex items-center gap-3 text-sm">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-mono text-xs">
                          {i + 1}
                        </span>
                        <span className="flex-1">{p.name || "—"}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {t("payoffMonth")} {p.month}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {/* Upsell */}
            <div className="panel p-6 flex flex-col sm:flex-row items-center gap-5 border-primary/40">
              <FileSpreadsheet className="h-10 w-10 text-primary shrink-0" />
              <div className="flex-1 text-center sm:text-start">
                <div className="font-semibold">{t("upsellTitle")}</div>
                <p className="text-sm text-muted-foreground mt-0.5">{t("upsellDesc")}</p>
              </div>
              <a
                href={STORE_URL}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
              >
                {t("upsellCta")}
                <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] text-muted-foreground mb-1">{label}</span>
      <input
        type="number"
        dir="ltr"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-sm font-mono outline-none focus:border-primary"
      />
    </label>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="panel p-4"
      style={
        highlight
          ? { borderColor: "color-mix(in oklab, var(--color-primary) 50%, transparent)" }
          : undefined
      }
    >
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </div>
      <div className={`text-lg font-bold font-mono ${highlight ? "text-primary" : ""}`} dir="ltr">
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
