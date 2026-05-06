import { BookOpen, FlaskConical } from "lucide-react";
import type { ModelOutput } from "@/lib/nh3-model";
import { useI18n } from "@/lib/i18n";

export function ExplanationPanel({ output }: { output: ModelOutput }) {
  const { t, lang } = useI18n();
  const lines = lang === "ar" ? output.explanationAr : output.explanation;
  const f = output.factors;
  return (
    <div className="panel p-5 space-y-4">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-primary" />
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("scientific")}</div>
      </div>

      <ul className="space-y-2.5">
        {lines.map((line, i) => (
          <li key={i} className="text-sm leading-relaxed text-foreground/90 ps-4 relative">
            <span
              className="absolute start-0 top-2 h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-primary)" }}
            />
            {line}
          </li>
        ))}
      </ul>

      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("multipliers")}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <Factor label="Tᶠ" value={f.fT} />
          <Factor label="RHᶠ" value={f.fRH} />
          <Factor label="pHᶠ" value={f.fpH} />
          <Factor label={t("microbial")} value={f.microbial} />
          <Factor label={t("henry")} value={f.henry} />
          <Factor label={t("aridSynergy")} value={f.aridSynergy} highlight={f.aridSynergy > 1.05} />
        </div>
      </div>

      <div className="border-t border-border pt-3 text-[10px] text-muted-foreground leading-relaxed">
        {t("refs")}
      </div>
    </div>
  );
}

function Factor({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className="rounded-md border px-2.5 py-1.5"
      style={{
        background: highlight ? "color-mix(in oklab, var(--color-danger) 15%, transparent)" : "color-mix(in oklab, var(--color-foreground) 4%, transparent)",
        borderColor: highlight ? "var(--color-danger)" : "var(--color-border)",
      }}
    >
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="tabular-nums" style={{ color: highlight ? "var(--color-danger)" : "var(--color-primary)" }}>
        ×{value.toFixed(2)}
      </div>
    </div>
  );
}
