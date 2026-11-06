import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Sparkles } from "lucide-react";
import { simulatePolicy, type SimResult } from "@/lib/simulate";
import { RiskPanel } from "@/components/risk-panel";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Policy Simulator — Canada CareConnect" },
      { name: "description", content: "Stakeholder impact simulator for Canada's medical tourism policies." },
      { property: "og:title", content: "Policy Simulator — Canada CareConnect" },
      { property: "og:description", content: "Score short- and long-term impacts of each policy on every stakeholder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Simulator,
});

const PRESETS: Record<string, string> = {
  "Canada CareConnect": "Canada CareConnect: a government-supported, privately delivered network with trusted provider certification, one platform for patient coordination (consultations, booking, accommodation, transport), and a recovery network with follow-up through the patient's home doctor. Toronto pilot with 3–5 clinics; expands only if demand, safety, finances and public access hold.",
  "Capacity Accelerator": "Healthcare Capacity Accelerator: conditional incentives for new operating rooms and equipment, paid only for proven new staff and capacity; recruitment of surgeons, anesthesiologists and nurses through existing immigration and licensing pathways; training and research partnerships.",
  "Health Dividend": "Canada Health Dividend: a proposed 5% contribution on eligible international procedure revenue, reinvested in Canadian healthcare, with audits and public reporting.",
  "Full strategy": "Full Connect → Expand → Reinvest strategy: (1) Canada CareConnect certified, coordinated network piloted in Toronto; (2) Capacity Accelerator paying only for proven new ORs and staff; (3) 5% Canada Health Dividend on international procedure revenue reinvested in Canadian care. International patients receive no priority over Canadians.",
};
const STAKEHOLDERS = ["International patients", "Canadian patients", "Private clinics", "Public hospitals", "Surgeons and nurses", "Provincial governments", "Federal government", "Hotels and tourism"];

function Simulator() {
  const run = simulatePolicy;
  const [preset, setPreset] = useState("Full strategy");
  const [policy, setPolicy] = useState(PRESETS["Full strategy"]);
  const [sel, setSel] = useState<string[]>(STAKEHOLDERS);
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<SimResult | null>(null);

  const go = async () => {
    setLoading(true); setError(null);
    try {
      const r = await run({ data: { policy, stakeholders: sel, intensity } });
      if (r.error) setError(r.error); else setRes(r.result ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  };

  const chip = (on: boolean) => `rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card text-muted-foreground"}`;
  const short = (s: string) => s.replace(" and ", " & ").replace("International", "Intl.").replace("Provincial governments", "Provinces").replace("Federal government", "Federal").replace("Hotels & tourism", "Tourism").replace("Hotels and tourism", "Tourism");

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-3xl font-bold md:text-4xl">Policy simulator</h1>
      <p className="mt-2 text-muted-foreground">Stakeholder impacts, risks and mitigations for each policy. Impact scores range from −10 to +10 and are illustrative.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-soft">
          <div>
            <p className="mb-2 text-sm font-semibold">Policy</p>
            <div className="flex flex-wrap gap-2">
              {[...Object.keys(PRESETS), "Custom"].map((p) => (
                <button key={p} className={chip(preset === p)} onClick={() => { setPreset(p); setPolicy(PRESETS[p] ?? ""); }}>{p}</button>
              ))}
            </div>
            <textarea value={policy} onChange={(e) => { setPolicy(e.target.value); setPreset("Custom"); }} rows={6} maxLength={3000}
              placeholder="Describe your custom policy…" className="mt-3 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Stakeholders</p>
            <div className="flex flex-wrap gap-2">
              {STAKEHOLDERS.map((s) => (
                <button key={s} className={chip(sel.includes(s))} onClick={() => setSel(sel.includes(s) ? sel.filter((x) => x !== s) : [...sel, s])}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Intensity</p>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {(["low", "medium", "high"] as const).map((l) => (
                <button key={l} onClick={() => setIntensity(l)} className={`rounded-md py-1.5 text-sm capitalize ${intensity === l ? "bg-card font-medium shadow-soft" : "text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <button onClick={go} disabled={loading || sel.length === 0 || policy.trim().length < 5}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Simulating…" : "Run simulation"}
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="space-y-6">
          {!res && !loading && (
            <div className="grid h-full min-h-64 place-items-center rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              Choose a policy and run the simulation to see stakeholder impacts, risks and mitigations.
            </div>
          )}
          {loading && !res && <div className="grid min-h-64 place-items-center rounded-xl border"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
          {res && (
            <>
              <div className="rounded-xl bg-primary-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Verdict</p>
                <p className="mt-1 font-display text-lg font-semibold">{res.verdict}</p>
                <a href="#risks" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-sm font-medium text-primary shadow-soft hover:brightness-95">
                  See {res.register.length} risks &amp; mitigations ↓
                </a>
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-soft">
                  <h3 className="mb-2 text-sm font-semibold">Short vs long-term impact</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={res.impacts.map((i) => ({ ...i, name: short(i.stakeholder) }))} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" domain={[-10, 10]} fontSize={11} stroke="var(--muted-foreground)" />
                      <YAxis type="category" dataKey="name" width={110} fontSize={11} stroke="var(--muted-foreground)" />
                      <ReferenceLine x={0} stroke="var(--chart-4)" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="shortTerm" name="Short-term" fill="var(--chart-2)" radius={3} />
                      <Bar dataKey="longTerm" name="Long-term" fill="var(--chart-1)" radius={3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-soft">
                  <h3 className="mb-2 text-sm font-semibold">Long-term impact profile</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="62%" margin={{ top: 8, right: 36, bottom: 8, left: 36 }} data={res.impacts.map((i) => ({ name: short(i.stakeholder), v: i.longTerm }))}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="name" fontSize={10} />
                      <PolarRadiusAxis domain={[-10, 10]} tick={false} axisLine={false} />
                      <Radar dataKey="v" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {([["Pros", res.pros], ["Cons", res.cons]] as const).map(([t, l]) => (
                  <div key={t} className="rounded-xl border bg-card p-5 shadow-soft">
                    <h3 className="text-sm font-semibold">{t}</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{l.map((x) => <li key={x}>• {x}</li>)}</ul>
                  </div>
                ))}
              </div>
              <section id="risks" className="space-y-4 rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-soft">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">Risks &amp; mitigations</p>
                  <h2 className="mt-1 font-display text-xl font-bold">What could go wrong, and how we handle it</h2>
                </div>
                <RiskPanel register={res.register} />
              </section>
              <h2 className="pt-2 font-display text-xl font-bold">Stakeholder detail</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {res.impacts.map((i) => (
                  <div key={i.stakeholder} className="rounded-xl border bg-card p-5 text-sm shadow-soft">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{i.stakeholder}</h3>
                      <span className="text-xs text-muted-foreground">{i.shortTerm > 0 ? "+" : ""}{i.shortTerm} → {i.longTerm > 0 ? "+" : ""}{i.longTerm}</span>
                    </div>
                    <p className="mt-2"><span className="font-medium text-success">Gain:</span> {i.gain}</p>
                    <p className="mt-1"><span className="font-medium text-warning">Concern:</span> {i.concern}</p>
                    <p className="mt-1"><span className="font-medium text-primary">Safeguard:</span> {i.safeguard}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
