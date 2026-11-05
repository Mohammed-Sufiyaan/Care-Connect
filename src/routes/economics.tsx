import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_INPUTS, PRICE_MAX, PRICE_MIN, WEEKS_PER_YEAR, priceWarning, proceduresPerYear, projectFiveYears, type ModelInputs } from "@/lib/model";

export const Route = createFileRoute("/economics")({
  head: () => ({
    meta: [
      { title: "Economic Model — Canada CareConnect" },
      { name: "description", content: "Project five years of procedures, revenue and Health Dividend for the Canada CareConnect strategy." },
      { property: "og:title", content: "Economic Model — Canada CareConnect" },
      { property: "og:description", content: "Interactive 5-year projection: 10 surgeons × 2/week × 44 weeks × 75% = 660 procedures/year." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Economics,
});

const cad = (n: number) => "$" + (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : Math.round(n).toString());

function Economics() {
  const [i, setI] = useState<ModelInputs>(DEFAULT_INPUTS);
  const years = useMemo(() => projectFiveYears(i), [i]);
  const totals = years.reduce((a, y) => ({ p: a.p + y.procedures, r: a.r + y.revenue, d: a.d + y.dividend }), { p: 0, r: 0, d: 0 });
  const set = (k: keyof ModelInputs) => (v: number[]) => setI({ ...i, [k]: v[0] });

  const sliders: Array<{ k: keyof ModelInputs; label: string; min: number; max: number; step: number; fmt: (n: number) => string }> = [
    { k: "surgeons", label: "Surgeons (year 1)", min: 2, max: 40, step: 1, fmt: String },
    { k: "perWeek", label: "Procedures per surgeon / week", min: 1, max: 6, step: 0.5, fmt: String },
    { k: "utilization", label: "Utilization", min: 0.3, max: 1, step: 0.05, fmt: (n) => Math.round(n * 100) + "%" },
    { k: "revenue", label: "Avg revenue / procedure (CAD)", min: 5000, max: 30000, step: 500, fmt: (n) => "$" + n.toLocaleString() },
    { k: "dividendRate", label: "Health Dividend rate", min: 0, max: 0.15, step: 0.01, fmt: (n) => Math.round(n * 100) + "%" },
    { k: "growth", label: "Annual capacity growth", min: 0, max: 0.5, step: 0.05, fmt: (n) => Math.round(n * 100) + "%" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Economic model</h1>
          <p className="mt-2 text-muted-foreground">
            Year 1: {i.surgeons} surgeons × {i.perWeek}/week × {WEEKS_PER_YEAR} weeks × {Math.round(i.utilization * 100)}% ={" "}
            <strong className="text-foreground">{proceduresPerYear(i).toLocaleString()} procedures</strong>
          </p>
        </div>
        <button onClick={() => setI(DEFAULT_INPUTS)} className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
          <RotateCcw className="h-4 w-4" /> Team defaults
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-soft">
          {sliders.map((s) => (
            <div key={s.k}>
              <div className="mb-3 flex justify-between text-sm">
                <span>{s.label}</span>
                <span className="font-semibold text-primary">{s.fmt(i[s.k])}</span>
              </div>
              <Slider value={[i[s.k]]} min={s.min} max={s.max} step={s.step} onValueChange={set(s.k)} />
            </div>
          ))}
          {priceWarning(i.revenue) && (
            <div className="flex gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Above published Canadian prices (about CAD ${PRICE_MIN.toLocaleString()}–${PRICE_MAX.toLocaleString()}). Consider a lower assumption.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["5-yr procedures", totals.p.toLocaleString()],
              ["5-yr revenue (CAD)", cad(totals.r)],
              ["5-yr Health Dividend", cad(totals.d)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl border bg-card p-5 shadow-soft">
                <p className="text-xs text-muted-foreground">{l}</p>
                <p className="mt-1 font-display text-2xl font-bold">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="mb-4 text-sm font-semibold">Revenue & Health Dividend (CAD)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={years}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis tickFormatter={cad} stroke="var(--muted-foreground)" fontSize={12} width={60} />
                <Tooltip formatter={(v: number) => cad(v)} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dividend" name="Dividend" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="mb-4 text-sm font-semibold">Procedures per year</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={years}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} width={60} />
                <Tooltip />
                <Line type="monotone" dataKey="procedures" name="Procedures" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground">Illustrative projection. Dividend collected from year 2. Growth reflects new capacity only.</p>
        </div>
      </div>
    </div>
  );
}
