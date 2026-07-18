import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, Droplets, FlaskConical, Languages, Thermometer, Wind } from "lucide-react";
import { simulate } from "@/lib/nh3-model";
import { ParameterSlider } from "@/components/sim/ParameterSlider";
import { NH3Gauge } from "@/components/sim/NH3Gauge";
import { EmissionChart } from "@/components/sim/EmissionChart";
import { ExplanationPanel } from "@/components/sim/ExplanationPanel";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/nh3")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "NH₃ Emission Simulator · Poultry Houses (Arid Climate)" },
      {
        name: "description",
        content:
          "Interactive scientific simulator of ammonia (NH₃) emission dynamics in poultry housing under arid-region conditions — temperature, humidity, and litter pH coupling.",
      },
    ],
  }),
});

type Sweep = "T" | "RH" | "pH";

function Dashboard() {
  const [T, setT] = useState(28);
  const [RH, setRH] = useState(45);
  const [pH, setPH] = useState(7.5);
  const [sweep, setSweep] = useState<Sweep>("T");
  const { t, lang, setLang, dir } = useI18n();

  const out = useMemo(() => simulate({ T, RH, pH }), [T, RH, pH]);

  return (
    <div
      dir={dir}
      className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 max-w-[1500px] mx-auto"
      style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : undefined }}
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              {t("liveModel")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {t("title1")} <span className="text-primary glow-text">{t("title2")}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="panel px-4 py-3 font-mono text-[11px] text-muted-foreground">
            <div>
              {t("session")} · <span className="text-foreground">poultry-arid-01</span>
            </div>
            <div>{t("model")} · Sutton·Reece·Henry</div>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="panel px-3 py-3 flex items-center gap-2 font-mono text-xs hover:text-primary transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "عربي" : "EN"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-4">
          <ParameterSlider
            icon={Thermometer}
            label={t("airTemp")}
            unit="°C"
            value={T}
            min={-15}
            max={60}
            step={0.5}
            onChange={setT}
            accent="danger"
            hint={t("hintT")}
          />
          <ParameterSlider
            icon={Droplets}
            label={t("rh")}
            unit="%"
            value={RH}
            min={0}
            max={100}
            step={1}
            onChange={setRH}
            accent="primary"
            hint={t("hintRH")}
          />
          <ParameterSlider
            icon={FlaskConical}
            label={t("litterPH")}
            unit=""
            value={pH}
            min={1}
            max={14}
            step={0.1}
            onChange={setPH}
            accent="accent"
            hint={t("hintPH")}
          />
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NH3Gauge ppm={out.ppm} risk={out.risk} />

            <div className="panel p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t("sensitivity")}
                    </div>
                    <div className="text-sm font-medium">{t("nh3VsVar")}</div>
                  </div>
                </div>
                <div
                  className="flex rounded-md border border-border overflow-hidden font-mono text-[11px]"
                  dir="ltr"
                >
                  {(["T", "RH", "pH"] as Sweep[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSweep(s)}
                      className="px-2.5 py-1 transition-colors"
                      style={{
                        background: sweep === s ? "var(--color-primary)" : "transparent",
                        color:
                          sweep === s
                            ? "var(--color-primary-foreground)"
                            : "var(--color-muted-foreground)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <EmissionChart T={T} RH={RH} pH={pH} sweep={sweep} />
              <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-px bg-[color:var(--color-safe)]" />{" "}
                  {t("safeCeiling")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-px bg-[color:var(--color-danger)]" />{" "}
                  {t("dangerLine")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-px bg-[color:var(--color-accent)]" />{" "}
                  {t("currentVal")}
                </span>
              </div>
            </div>
          </div>

          <ExplanationPanel output={out} />

          <div
            className="panel p-4 flex items-center gap-3"
            style={{
              borderColor:
                out.factors.aridSynergy > 1.05 ? "var(--color-danger)" : "var(--color-border)",
            }}
          >
            <Wind
              className="h-5 w-5"
              style={{
                color:
                  out.factors.aridSynergy > 1.05
                    ? "var(--color-danger)"
                    : "var(--color-muted-foreground)",
              }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{t("aridRegime")}</div>
              <div className="text-xs text-muted-foreground">{t("aridDesc")}</div>
            </div>
            <div
              className="font-mono text-sm px-3 py-1 rounded-md"
              style={{
                background:
                  out.factors.aridSynergy > 1.05
                    ? "color-mix(in oklab, var(--color-danger) 18%, transparent)"
                    : "color-mix(in oklab, var(--color-foreground) 5%, transparent)",
                color:
                  out.factors.aridSynergy > 1.05
                    ? "var(--color-danger)"
                    : "var(--color-muted-foreground)",
              }}
            >
              {out.factors.aridSynergy > 1.05 ? t("active") : t("inactive")} · ×
              {out.factors.aridSynergy.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
