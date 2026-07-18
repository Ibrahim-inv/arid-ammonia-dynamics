import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator,
  CalendarCheck,
  CheckCircle2,
  FileSpreadsheet,
  Gift,
  Languages,
  LineChart,
  ListChecks,
  ShieldCheck,
  Smartphone,
  Snowflake,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { STORE_URL } from "@/lib/config";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "صفر ديون · حاسبة التحرر من الديون" },
      {
        name: "description",
        content:
          "أداة عربية مجانية تحسب خطة سداد ديونك بطريقة كرة الثلج أو الانهيار الجليدي وتحدد تاريخ تحررك من الدين — وكل بياناتك تبقى على جهازك.",
      },
    ],
  }),
});

function Landing() {
  const { t, lang, setLang, dir } = useI18n();

  const features = [
    { icon: Snowflake, title: t("feat1Title"), desc: t("feat1Desc") },
    { icon: TrendingDown, title: t("feat2Title"), desc: t("feat2Desc") },
    { icon: ShieldCheck, title: t("feat3Title"), desc: t("feat3Desc") },
    { icon: Languages, title: t("feat4Title"), desc: t("feat4Desc") },
    { icon: Smartphone, title: t("feat5Title"), desc: t("feat5Desc") },
    { icon: Gift, title: t("feat6Title"), desc: t("feat6Desc") },
  ];

  const steps = [
    { icon: ListChecks, title: t("how1Title"), desc: t("how1Desc") },
    { icon: Calculator, title: t("how2Title"), desc: t("how2Desc") },
    { icon: CalendarCheck, title: t("how3Title"), desc: t("how3Desc") },
  ];

  const toolkitItems = [
    t("toolkitItem1"),
    t("toolkitItem2"),
    t("toolkitItem3"),
    t("toolkitItem4"),
    t("toolkitItem5"),
  ];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
  ];

  return (
    <div dir={dir} style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : undefined }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border/60 bg-background/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">{t("brand")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              {t("navFeatures")}
            </a>
            <Link to="/app" className="hover:text-foreground transition-colors">
              {t("navTool")}
            </Link>
            <a href="#toolkit" className="hover:text-foreground transition-colors">
              {t("navToolkit")}
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              {t("navFaq")}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="panel px-3 py-1.5 text-xs font-mono hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              {t("langToggle")}
            </button>
            <Link
              to="/app"
              className="hidden sm:inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("heroCtaPrimary")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 panel px-4 py-1.5 text-xs text-primary font-medium mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {t("heroBadge")}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          {t("heroTitle1")} <span className="text-primary glow-text">{t("heroTitle2")}</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-[var(--shadow-glow)]"
          >
            <Calculator className="h-5 w-5" />
            {t("heroCtaPrimary")}
          </Link>
          <a
            href="#toolkit"
            className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3.5 text-base font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5" />
            {t("heroCtaSecondary")}
          </a>
        </div>
        <p className="mt-5 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {t("heroPrivacy")}
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">{t("howTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="panel p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-semibold mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">{t("featTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="panel p-5 hover:border-primary/50 transition-colors">
              <f.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paid toolkit */}
      <section id="toolkit" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div
          className="panel p-8 md:p-12 border-primary/40"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block rounded-full bg-primary/15 text-primary text-xs font-semibold px-3 py-1 mb-4">
                {t("toolkitBadge")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("toolkitTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t("toolkitSubtitle")}</p>
              <ul className="space-y-2.5">
                {toolkitItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center lg:border-s border-border lg:ps-10">
              <FileSpreadsheet className="h-16 w-16 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-1">{t("toolkitPrice")}</div>
              <div className="text-xs text-muted-foreground mb-6">{t("toolkitPriceNote")}</div>
              <a
                href={STORE_URL}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("toolkitCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">{t("faqTitle")}</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="panel px-5 py-4 group">
              <summary className="cursor-pointer font-medium list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Chart teaser + final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="panel p-10">
          <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">{t("how3Title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">{t("heroSubtitle")}</p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calculator className="h-5 w-5" />
            {t("heroCtaPrimary")}
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">{t("brand")}</span>
        </div>
        {t("footerNote")}
      </footer>
    </div>
  );
}
