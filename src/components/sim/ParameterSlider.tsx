import { Slider } from "@/components/ui/slider";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  hint?: string;
  accent?: "primary" | "accent" | "danger";
}

export function ParameterSlider({
  icon: Icon,
  label,
  unit,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  hint,
  accent = "primary",
}: Props) {
  const accentColor =
    accent === "danger"
      ? "var(--color-danger)"
      : accent === "accent"
        ? "var(--color-accent)"
        : "var(--color-primary)";

  return (
    <div className="panel p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{
              background: `color-mix(in oklab, ${accentColor} 15%, transparent)`,
              color: accentColor,
            }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Input
            </div>
            <div className="text-sm font-medium">{label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl tabular-nums glow-text" style={{ color: accentColor }}>
            {value.toFixed(step < 1 ? 1 : 0)}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">{unit}</div>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  );
}
