import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  ppm: number;
  risk: "safe" | "warning" | "dangerous";
}

const MAX = 60; // gauge ceiling

export function NH3Gauge({ ppm, risk }: Props) {
  const { t } = useI18n();
  const pct = Math.min(1, ppm / MAX);
  const angle = -120 + pct * 240; // -120° to +120°
  const color = risk === "safe" ? "var(--color-safe)"
    : risk === "warning" ? "var(--color-warning)"
    : "var(--color-danger)";

  // Build arc segments
  const arcs = useMemo(() => {
    const segs: { from: number; to: number; color: string }[] = [
      { from: 0, to: 10 / MAX, color: "var(--color-safe)" },
      { from: 10 / MAX, to: 25 / MAX, color: "var(--color-warning)" },
      { from: 25 / MAX, to: 1, color: "var(--color-danger)" },
    ];
    return segs;
  }, []);

  const r = 90;
  const cx = 110, cy = 110;
  const polar = (a: number) => {
    const rad = (a - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const arcPath = (from: number, to: number) => {
    const a1 = -120 + from * 240;
    const a2 = -120 + to * 240;
    const [x1, y1] = polar(a1);
    const [x2, y2] = polar(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="panel p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("liveReading")}</div>
          <div className="text-sm font-medium">{t("nh3Conc")}</div>
        </div>
        <div
          className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider"
          style={{
            background: `color-mix(in oklab, ${color} 18%, transparent)`,
            color,
            border: `1px solid color-mix(in oklab, ${color} 45%, transparent)`,
          }}
        >
          {risk === "safe" ? t("riskSafe") : risk === "warning" ? t("riskWarning") : t("riskDangerous")}
        </div>
      </div>

      <svg viewBox="0 0 220 160" className="w-full max-w-[320px]">
        {/* Track */}
        <path d={arcPath(0, 1)} stroke="var(--color-grid)" strokeWidth={14} fill="none" strokeLinecap="round" />
        {arcs.map((s, i) => (
          <path key={i} d={arcPath(s.from, s.to)} stroke={s.color} strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
        ))}
        {/* Active fill */}
        <path
          d={arcPath(0, Math.max(0.001, pct))}
          stroke={color}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "all .3s ease" }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle} ${cx} ${cy})`} style={{ transition: "transform .35s cubic-bezier(.4,1.4,.5,1)" }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r + 6} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={6} fill="var(--color-card)" stroke={color} strokeWidth={2} />
        </g>
        {/* Tick labels */}
        {[0, 10, 25, 40, 60].map((t) => {
          const a = -120 + (t / MAX) * 240;
          const [tx, ty] = (() => {
            const rr = r + 18;
            const rad = (a - 90) * Math.PI / 180;
            return [cx + rr * Math.cos(rad), cy + rr * Math.sin(rad)];
          })();
          return (
            <text key={t} x={tx} y={ty} fontSize={9} textAnchor="middle" dominantBaseline="middle"
              fill="var(--color-muted-foreground)" className="font-mono">{t}</text>
          );
        })}
      </svg>

      <div className="mt-2 text-center">
        <div className="font-mono text-5xl tabular-nums glow-text" style={{ color }}>
          {ppm.toFixed(1)}
        </div>
        <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase">ppm NH₃</div>
      </div>

      <div className="mt-4 grid grid-cols-3 w-full gap-2 text-center font-mono text-[10px]">
        <Legend label={t("safe")} range="< 10" color="var(--color-safe)" active={risk === "safe"} />
        <Legend label={t("warn")} range="10–25" color="var(--color-warning)" active={risk === "warning"} />
        <Legend label={t("danger")} range="> 25" color="var(--color-danger)" active={risk === "dangerous"} />
      </div>
    </div>
  );
}

function Legend({ label, range, color, active }: { label: string; range: string; color: string; active: boolean }) {
  return (
    <div
      className="rounded-md py-1.5 px-2 border transition"
      style={{
        background: active ? `color-mix(in oklab, ${color} 18%, transparent)` : "transparent",
        borderColor: active ? color : "var(--color-border)",
        color: active ? color : "var(--color-muted-foreground)",
      }}
    >
      <div className="font-semibold tracking-widest">{label}</div>
      <div className="opacity-70">{range} ppm</div>
    </div>
  );
}
