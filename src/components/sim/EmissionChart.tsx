import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { simulate } from "@/lib/nh3-model";

interface Props {
  T: number;
  RH: number;
  pH: number;
  sweep: "T" | "RH" | "pH";
}

const config = {
  T: { min: -15, max: 60, step: 1.5, label: "Temperature (°C)" },
  RH: { min: 0, max: 100, step: 2, label: "Relative Humidity (%)" },
  pH: { min: 1, max: 14, step: 0.2, label: "Litter pH" },
};

export function EmissionChart({ T, RH, pH, sweep }: Props) {
  const { data, currentX } = useMemo(() => {
    const c = config[sweep];
    const arr: { x: number; ppm: number }[] = [];
    for (let v = c.min; v <= c.max + 1e-6; v += c.step) {
      const inputs = { T, RH, pH, [sweep]: v } as { T: number; RH: number; pH: number };
      const r = simulate(inputs);
      arr.push({ x: +v.toFixed(2), ppm: +r.ppm.toFixed(2) });
    }
    return { data: arr, currentX: sweep === "T" ? T : sweep === "RH" ? RH : pH };
  }, [T, RH, pH, sweep]);

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="ppmFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[config[sweep].min, config[sweep].max]}
            tick={{
              fill: "var(--color-muted-foreground)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            }}
            stroke="var(--color-grid)"
            label={{
              value: config[sweep].label,
              position: "insideBottom",
              offset: -2,
              fill: "var(--color-muted-foreground)",
              fontSize: 10,
            }}
          />
          <YAxis
            tick={{
              fill: "var(--color-muted-foreground)",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
            }}
            stroke="var(--color-grid)"
            width={40}
            label={{
              value: "ppm",
              angle: -90,
              position: "insideLeft",
              fill: "var(--color-muted-foreground)",
              fontSize: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
            labelFormatter={(l) => `${config[sweep].label.split(" ")[0]}: ${l}`}
            formatter={(v: number) => [`${v} ppm`, "NH₃"]}
          />
          <ReferenceLine y={10} stroke="var(--color-safe)" strokeDasharray="3 3" />
          <ReferenceLine y={25} stroke="var(--color-danger)" strokeDasharray="3 3" />
          <ReferenceLine x={currentX} stroke="var(--color-accent)" strokeDasharray="2 2" />
          <Area
            type="monotone"
            dataKey="ppm"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#ppmFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
