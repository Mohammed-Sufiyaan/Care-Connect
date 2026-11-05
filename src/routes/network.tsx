import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, X, BadgeCheck, Plus, Minus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network Map — Canada CareConnect" },
      { name: "description", content: "Interactive map of Canadian hub cities and US source markets for the CareConnect network." },
      { property: "og:title", content: "Network Map — Canada CareConnect" },
      { property: "og:description", content: "Explore the Toronto pilot, expansion hubs and US patient flows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Network,
});

import { MAP_W, MAP_H, PROVINCES, US_LAND, LAKES, POINTS, PROVINCE_NAMES } from "@/lib/canada-map";

type Hub = { id: string; name: string; prov: string; base: number; clinics: number; capacity: number; label: { dx: number; dy: number; anchor: "start" | "middle" | "end" } };
const HUBS: Hub[] = [
  { id: "tor", name: "Toronto", prov: "ON", base: 78, clinics: 4, capacity: 10, label: { dx: -6, dy: -20, anchor: "end" } },
  { id: "mtl", name: "Montreal", prov: "QC", base: 66, clinics: 0, capacity: 0, label: { dx: 14, dy: -10, anchor: "start" } },
  { id: "van", name: "Vancouver", prov: "BC", base: 64, clinics: 0, capacity: 0, label: { dx: -14, dy: -8, anchor: "end" } },
  { id: "ott", name: "Ottawa", prov: "ON", base: 55, clinics: 0, capacity: 0, label: { dx: -14, dy: -10, anchor: "end" } },
  { id: "cal", name: "Calgary", prov: "AB", base: 52, clinics: 0, capacity: 0, label: { dx: 14, dy: 18, anchor: "start" } },
  { id: "edm", name: "Edmonton", prov: "AB", base: 48, clinics: 0, capacity: 0, label: { dx: 14, dy: -8, anchor: "start" } },
  { id: "wpg", name: "Winnipeg", prov: "MB", base: 44, clinics: 0, capacity: 0, label: { dx: 14, dy: -10, anchor: "start" } },
];
const MARKETS: { name: string; to: string[]; label: { dx: number; dy: number; anchor: "start" | "end" | "middle" } }[] = [
  { name: "New York", to: ["tor", "mtl", "ott"], label: { dx: 10, dy: 16, anchor: "start" } },
  { name: "Boston", to: ["mtl", "tor"], label: { dx: 10, dy: 5, anchor: "start" } },
  { name: "Chicago", to: ["tor", "wpg"], label: { dx: -10, dy: 16, anchor: "end" } },
  { name: "Detroit", to: ["tor"], label: { dx: 0, dy: 22, anchor: "middle" } },
  { name: "Minneapolis", to: ["wpg", "tor"], label: { dx: -10, dy: 5, anchor: "end" } },
  { name: "Seattle", to: ["van", "cal"], label: { dx: -10, dy: 16, anchor: "end" } },
];
const pt = (name: string): readonly [number, number] => POINTS[name] ?? [0, 0];

type View = { x: number; y: number; w: number };
const VIEWS = {
  all: { label: "All Canada", v: { x: 0, y: 40, w: 1000 } },
  south: { label: "Hub corridor", v: { x: 120, y: 270, w: 680 } },
  east: { label: "Eastern hubs", v: { x: 520, y: 450, w: 260 } },
} satisfies Record<string, { label: string; v: View }>;

type State = Record<string, { clinics: number; capacity: number }>;

function Network() {
  const [pilotPassed, setPilotPassed] = useState(false);
  const [dividend, setDividend] = useState(false);
  const [sel, setSel] = useState<string | null>("tor");
  const [view, setView] = useState<View>(VIEWS.all.v);
  const [hover, setHover] = useState<{ x: number; y: number; text: string; sub?: string | undefined } | null>(null);
  const [st, setSt] = useState<State>(() => Object.fromEntries(HUBS.map((h) => [h.id, { clinics: h.clinics, capacity: h.capacity }])));

  const status = (h: Hub): "pilot" | "active" | "candidate" | "locked" => {
    if (h.id === "tor") return "pilot";
    if (!pilotPassed) return "locked";
    return st[h.id].clinics > 0 ? "active" : "candidate";
  };
  const score = (h: Hub) => {
    const s = st[h.id];
    const parts = {
      Market: h.base * 0.4,
      Certification: Math.min(25, s.clinics * 6),
      Capacity: Math.min(20, s.capacity * 1.5),
      Reinvestment: dividend ? 8 : 0,
    };
    return { total: Math.min(100, Math.round(Object.values(parts).reduce((a, b) => a + b, 0))), parts };
  };

  const activeIds = HUBS.filter((h) => ["pilot", "active"].includes(status(h))).map((h) => h.id);
  const kpis = useMemo(() => {
    const clinics = activeIds.reduce((a, id) => a + st[id].clinics, 0);
    const surgeons = activeIds.reduce((a, id) => a + st[id].capacity, 0);
    const procs = Math.round(surgeons * 2 * 44 * 0.75);
    return { hubs: activeIds.length, clinics, surgeons, procs, div: dividend ? procs * 12000 * 0.05 : 0 };
  }, [activeIds.join(), st, dividend]);

  const hub = HUBS.find((h) => h.id === sel);
  const act = (id: string, k: "clinics" | "capacity", n: number) => setSt({ ...st, [id]: { ...st[id], [k]: st[id][k] + n } });

  const activeProvs = new Set(HUBS.filter((h) => activeIds.includes(h.id)).map((h) => h.prov));
  const vh = view.w * (MAP_H / MAP_W) * 0.92;
  const zoom = (f: number) => {
    const w = Math.max(220, Math.min(1000, view.w * f));
    const cx = view.x + view.w / 2, cy = view.y + vh / 2, nh = w * (MAP_H / MAP_W) * 0.92;
    setView({ w, x: Math.max(-40, Math.min(1040 - w, cx - w / 2)), y: Math.max(0, Math.min(740 - nh, cy - nh / 2)) });
  };
  const k = view.w / 1000; // keep labels and markers a constant on-screen size
  const showTip = (e: React.MouseEvent, text: string, sub?: string) => {
    const r = (e.currentTarget as Element).closest("[data-map]")!.getBoundingClientRect();
    setHover({ x: e.clientX - r.left, y: e.clientY - r.top, text, sub });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-3xl font-bold md:text-4xl">Network map</h1>
      <p className="mt-2 text-muted-foreground">Click a city. Certify clinics and add capacity to grow the network.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["Active hubs", kpis.hubs],
          ["Certified clinics", kpis.clinics],
          ["Surgeons", kpis.surgeons],
          ["Procedures / yr", kpis.procs.toLocaleString()],
          ["Dividend / yr", kpis.div ? "$" + Math.round(kpis.div / 1000) + "k" : "Off"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="mt-1 font-display text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><Switch checked={pilotPassed} onCheckedChange={setPilotPassed} /> Pilot evaluation passed</label>
        <label className="flex items-center gap-2"><Switch checked={dividend} onCheckedChange={setDividend} /> Health Dividend</label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
            <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs font-medium">
              {Object.entries(VIEWS).map(([id, v]) => (
                <button key={id} onClick={() => setView(v.v)}
                  className={`rounded-md px-2.5 py-1 transition ${view === v.v ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}>
                  {v.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={() => zoom(0.7)} aria-label="Zoom in" className="flex h-7 w-7 items-center justify-center rounded-md border text-sm hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
              <button onClick={() => zoom(1 / 0.7)} aria-label="Zoom out" className="flex h-7 w-7 items-center justify-center rounded-md border text-sm hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="relative" data-map onMouseLeave={() => setHover(null)}>
            <svg viewBox={`${view.x} ${view.y} ${view.w} ${vh}`} className="block h-auto w-full bg-secondary transition-[viewBox] duration-300" role="img" aria-label="Map of Canada showing CareConnect hubs and US source markets">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className="fill-primary" />
                </marker>
              </defs>
              <path d={US_LAND} className="fill-map-us stroke-border" strokeWidth={1 * k} />
              {Object.entries(PROVINCES).map(([code, d]) => (
                <path key={code} d={d} strokeWidth={1.2 * k}
                  className={`stroke-card transition-colors ${activeProvs.has(code) ? "fill-primary/25 hover:fill-primary/35" : "fill-map-land hover:fill-primary/15"}`}
                  onMouseMove={(e) => showTip(e, PROVINCE_NAMES[code] ?? code, HUBS.filter((h) => h.prov === code).map((h) => h.name).join(" · ") || undefined)} />
              ))}
              {LAKES.map((d, i) => <path key={i} d={d} className="fill-secondary" />)}
              <text x={330} y={300} className="fill-chart-4 font-semibold" style={{ fontSize: 15, letterSpacing: "0.4em" }}>CANADA</text>
              <text x={560} y={690} className="fill-chart-4 font-semibold" style={{ fontSize: 13, letterSpacing: "0.35em" }}>UNITED STATES</text>

              {MARKETS.flatMap((m) =>
                m.to.filter((t) => activeIds.includes(t)).slice(0, 2).map((t, i) => {
                  const h = HUBS.find((x) => x.id === t)!;
                  const [x1, y1] = pt(m.name), [x2, y2] = pt(h.name);
                  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
                  const bend = (0.22 + i * 0.1) * len;
                  const cx = (x1 + x2) / 2 + (dy / len) * bend, cy = (y1 + y2) / 2 - (dx / len) * bend * 0.4 - bend * 0.5;
                  const ex = x2 - (dx / len) * 17 * k, ey = y2 - (dy / len) * 17 * k;
                  return <path key={m.name + t} d={`M${x1},${y1} Q${cx},${cy} ${ex},${ey}`} fill="none" markerEnd="url(#arrow)"
                    className="flow-line stroke-primary" strokeWidth={(i === 0 ? 2.2 : 1.4) * k} opacity={i === 0 ? 0.75 : 0.45} />;
                }),
              )}

              {MARKETS.map((m) => {
                const [x, y] = pt(m.name);
                return (
                  <g key={m.name} onMouseMove={(e) => showTip(e, m.name, "US source market")}>
                    <rect x={x - 5 * k} y={y - 5 * k} width={10 * k} height={10 * k} rx={2 * k} className="fill-card stroke-chart-3" strokeWidth={1.5 * k} />
                    <text x={x + m.label.dx * k} y={y + m.label.dy * k} textAnchor={m.label.anchor} className="fill-muted-foreground"
                      style={{ fontSize: 12.5 * k, paintOrder: "stroke", stroke: "var(--secondary)", strokeWidth: 3 * k, strokeLinejoin: "round" }}>{m.name}</text>
                  </g>
                );
              })}

              {HUBS.map((h) => {
                const [x, y] = pt(h.name);
                const s = status(h);
                const r = (s === "pilot" ? 9 : 7.5) * k;
                const on = sel === h.id;
                return (
                  <g key={h.id} onClick={() => setSel(h.id)} tabIndex={0} role="button" aria-label={`${h.name}, ${s}`}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(h.id)}
                    onMouseMove={(e) => showTip(e, h.name, `${s[0].toUpperCase() + s.slice(1)} · readiness ${score(h).total}`)}
                    className="cursor-pointer outline-none">
                    {(s === "pilot" || s === "active") && <circle cx={x} cy={y} r={r + 9 * k} className="fill-primary animate-pulse" opacity={0.18} />}
                    {on && <circle cx={x} cy={y} r={r + 5 * k} fill="none" className="stroke-primary" strokeWidth={2 * k} />}
                    <circle cx={x} cy={y} r={r} strokeWidth={2 * k}
                      className={s === "locked" ? "fill-muted stroke-chart-4" : s === "candidate" ? "fill-card stroke-primary" : "fill-primary stroke-card"} />
                    {s === "locked" && <circle cx={x} cy={y} r={2.2 * k} className="fill-chart-4" />}
                    <text x={x + h.label.dx * k} y={y + h.label.dy * k} textAnchor={h.label.anchor}
                      className={on ? "fill-primary font-semibold" : "fill-foreground font-semibold"}
                      style={{ fontSize: 15 * k, paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 3.5 * k, strokeLinejoin: "round" }}>{h.name}</text>
                  </g>
                );
              })}
            </svg>
            {hover && (
              <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-soft"
                style={{ left: hover.x, top: hover.y }}>
                <div className="font-semibold">{hover.text}</div>
                {hover.sub && <div className="opacity-75">{hover.sub}</div>}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 border-t px-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-primary" /> Pilot / active hub</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-primary bg-card" /> Candidate</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-muted ring-1 ring-chart-4" /> Locked</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px] border-[1.5px] border-chart-3 bg-card" /> US source market</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-primary" /> Patient flow</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-4 rounded-sm bg-primary/25" /> Province with active hub</span>
          </div>
        </div>

        <aside className="rounded-xl border bg-card p-5 shadow-soft">
          {hub ? (() => {
            const s = status(hub), sc = score(hub);
            return (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{hub.name}</h2>
                    <span className="mt-1 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium capitalize text-accent-foreground">{s}</span>
                  </div>
                  <button onClick={() => setSel(null)} aria-label="Close"><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm">Readiness score</span>
                    <span className="font-display text-3xl font-bold text-primary">{sc.total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Illustrative score, not measured data.</p>
                  <div className="mt-3 space-y-2">
                    {Object.entries(sc.parts).map(([k, v]) => (
                      <div key={k}>
                        <div className="flex justify-between text-xs"><span>{k}</span><span>{Math.round(v)}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, v * 2.5)}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 text-sm text-muted-foreground">
                  {st[hub.id].clinics} certified clinics · {st[hub.id].capacity} surgeons
                </div>
                {s === "locked" ? (
                  <p className="mt-4 flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground"><Lock className="h-4 w-4 shrink-0" /> Unlocks once the Toronto pilot evaluation passes.</p>
                ) : (
                  <div className="mt-4 space-y-2">
                    <button onClick={() => act(hub.id, "clinics", 1)} disabled={st[hub.id].clinics >= (hub.id === "tor" ? 5 : 6)}
                      className="flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                      <BadgeCheck className="h-4 w-4" /> Certify a clinic <span className="ml-auto text-xs opacity-80">CareConnect</span>
                    </button>
                    <button onClick={() => act(hub.id, "capacity", 2)} disabled={st[hub.id].clinics === 0}
                      className="flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium disabled:opacity-50">
                      <Plus className="h-4 w-4" /> Add 2 surgeons <span className="ml-auto text-xs text-muted-foreground">Accelerator</span>
                    </button>
                    {st[hub.id].clinics === 0 && <p className="text-xs text-muted-foreground">Certify a clinic before adding capacity.</p>}
                  </div>
                )}
              </div>
            );
          })() : <p className="text-sm text-muted-foreground">Select a city on the map.</p>}
        </aside>
      </div>
    </div>
  );
}
