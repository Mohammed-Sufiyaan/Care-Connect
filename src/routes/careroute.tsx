import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, HeartPulse, Plane, Wallet } from "lucide-react";

export const Route = createFileRoute("/careroute")({
  head: () => ({
    meta: [
      { title: "CareRoute — Canada CareConnect" },
      { name: "description", content: "Plan a body-contouring care journey to Canada: certified provider, recovery-safe itinerary and all-in cost." },
    ],
  }),
  component: CareRoute,
});

const PROCS = {
  tummy: { name: "Tummy tuck (abdominoplasty)", cad: [8500, 15000], us: [8000, 13500], nights: 12, rest: 6, fly: "10–14 days" },
  combo: { name: "Tummy tuck + liposuction", cad: [10500, 20000], us: [12300, 21000], nights: 13, rest: 6, fly: "10–14 days" },
  extended: { name: "Post-weight-loss extended tummy tuck", cad: [10000, 17000], us: null, nights: 15, rest: 7, fly: "about 14 days" },
  lipo: { name: "Liposuction (1–2 areas)", cad: [6000, 12000], us: [4300, 7500], nights: 7, rest: 4, fly: "5–7 days" },
} as const;
const HOMES = {
  us: { name: "United States", flight: 550, entry: "No visa needed for US citizens; bring a passport." },
  uk: { name: "United Kingdom", flight: 1200, entry: "Apply for an eTA before you fly." },
  gulf: { name: "UAE / Gulf states", flight: 1900, entry: "Check eTA or visitor-visa rules for your passport." },
  carib: { name: "Caribbean", flight: 800, entry: "Check eTA or visitor-visa rules for your passport." },
} as const;
const CITIES = {
  toronto: { name: "Toronto", tag: "Pilot city", hotel: 230, regulator: "CPSO Out-of-Hospital Premises Inspection Program",
    acts: [["Royal Ontario Museum", "culture", true], ["St. Lawrence Market", "food", true], ["Harbourfront lakeside stroll", "nature", false], ["Allan Gardens Conservatory", "calm", true], ["Distillery District", "shopping", false], ["Art Gallery of Ontario", "culture", true]] },
  montreal: { name: "Montreal", tag: "After pilot", hotel: 190, regulator: "Quebec specialized medical centre (CMS) permit",
    acts: [["Montreal Museum of Fine Arts", "culture", true], ["Jean-Talon Market", "food", false], ["Botanical Garden greenhouses", "calm", true], ["Old Montreal by taxi", "culture", false], ["Underground city (RÉSO)", "shopping", true]] },
  vancouver: { name: "Vancouver", tag: "After pilot", hotel: 250, regulator: "CPSBC Non-Hospital Medical and Surgical Facilities Accreditation",
    acts: [["Granville Island Market", "food", true], ["Bloedel Conservatory", "calm", true], ["Stanley Park seawall, short stretch", "nature", false], ["Vancouver Art Gallery", "culture", true], ["Gastown", "shopping", false]] },
  calgary: { name: "Calgary", tag: "After pilot", hotel: 170, regulator: "CPSA Non-Hospital Surgical Facility Accreditation",
    acts: [["Studio Bell", "culture", true], ["Calgary Farmers' Market", "food", true], ["Devonian Gardens", "calm", true], ["Prince's Island Park", "nature", false], ["Kensington Village", "shopping", false]] },
} as const;
const INTERESTS = { culture: "Museums", food: "Food", nature: "Nature", shopping: "Shopping", calm: "Quiet" } as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const FX = 1.38;
type Phase = "travel" | "clinic" | "surgery" | "rest" | "outing";
const PHASE: Record<Phase, string> = {
  travel: "bg-warning-soft text-warning",
  clinic: "bg-primary-soft text-accent-foreground",
  surgery: "bg-destructive/10 text-destructive",
  rest: "bg-muted text-muted-foreground",
  outing: "bg-success/10 text-success",
};
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

function CareRoute() {
  const [home, setHome] = useState<keyof typeof HOMES>("us");
  const [proc, setProc] = useState<keyof typeof PROCS>("tummy");
  const [city, setCity] = useState<keyof typeof CITIES>("toronto");
  const [month, setMonth] = useState(5);
  const [ints, setInts] = useState<string[]>(["food", "culture"]);
  const [companion, setCompanion] = useState(true);
  const [nurse, setNurse] = useState(false);

  const plan = useMemo(() => {
    const p = PROCS[proc], c = CITIES[city], h = HOMES[home];
    const ppl = companion ? 2 : 1, n = p.nights, winter = [10, 11, 0, 1, 2].includes(month);
    const lodging = n * c.hotel, daily = n * 75 * ppl, flights = h.flight * ppl, extra = 500 + (nurse ? 1500 : 0);
    const travel = lodging + daily + flights + extra;
    const pool = c.acts.filter((a) => ints.includes(a[1]) && (!winter || a[2]));
    const acts = pool.length ? pool : c.acts.filter((a) => a[2]);
    let ai = 0;
    const days: { d: number; ph: Phase; t: string; x: string }[] = [];
    for (let d = 0; d <= n; d++) {
      if (d === 0) days.push({ d, ph: "travel", t: `Arrive in ${c.name}`, x: `${h.entry} CareConnect transfer to your recovery hotel.` });
      else if (d === 1) days.push({ d, ph: "clinic", t: "Consultation and pre-op tests", x: "Meet your certified surgeon; confirm the plan, quote and consent." });
      else if (d === 2) days.push({ d, ph: "surgery", t: p.name, x: companion ? "Your companion stays with you tonight." : "CareConnect arranges a caregiver for the first night." });
      else if (d === 3) days.push({ d, ph: "clinic", t: "First post-op check", x: "Dressing and drain review; short walks to keep blood moving." });
      else if (d === n - 1) days.push({ d, ph: "clinic", t: "Fit-to-fly clearance", x: `Typical guidance: ${p.fly} after surgery. Records go to your home doctor.` });
      else if (d === n) days.push({ d, ph: "travel", t: "Fly home", x: "Aisle seat, compression garment, walk every hour." });
      else if (d - 2 < p.rest) days.push({ d, ph: "rest", t: "Rest and recover", x: "Hotel rest and short indoor walks." + (nurse ? " Recovery nurse visit." : "") });
      else {
        const a = acts[ai++ % acts.length]!;
        days.push({ d, ph: "outing", t: a[0], x: `${a[2] ? "Indoor" : "Outdoor"}, gentle pace${winter && !a[2] ? ", dress warmly" : ""}` });
      }
    }
    return { p, c, h, ppl, n, lodging, daily, flights, extra, total: [p.cad[0] + travel, p.cad[1] + travel] as const, days };
  }, [home, proc, city, month, ints, companion, nurse]);

  const sel = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs transition ${on ? "border-primary bg-primary-soft font-medium text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">Patient journey planner</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">CareRoute</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your route from consultation to recovery: a certified provider, a day-by-day itinerary built around healing, and one all-in cost.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-fit space-y-4 rounded-xl border bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <label className="block space-y-1.5"><span className="text-sm font-semibold">Travelling from</span>
            <select className={sel} value={home} onChange={(e) => setHome(e.target.value as keyof typeof HOMES)}>
              {Object.entries(HOMES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select></label>
          <label className="block space-y-1.5"><span className="text-sm font-semibold">Procedure</span>
            <select className={sel} value={proc} onChange={(e) => setProc(e.target.value as keyof typeof PROCS)}>
              {Object.entries(PROCS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5"><span className="text-sm font-semibold">City</span>
              <select className={sel} value={city} onChange={(e) => setCity(e.target.value as keyof typeof CITIES)}>
                {Object.entries(CITIES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select></label>
            <label className="block space-y-1.5"><span className="text-sm font-semibold">Month</span>
              <select className={sel} value={month} onChange={(e) => setMonth(+e.target.value)}>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select></label>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">While recovering I enjoy</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(INTERESTS).map(([k, v]) => (
                <button key={k} className={chip(ints.includes(k))} onClick={() => setInts(ints.includes(k) ? ints.filter((x) => x !== k) : [...ints, k])}>{v}</button>
              ))}
            </div>
          </div>
          <label className="flex items-start justify-between gap-3 border-t pt-3">
            <span className="text-sm font-medium">Companion travelling<span className="block text-xs font-normal text-muted-foreground">Recommended for the first 72 hours</span></span>
            <input type="checkbox" checked={companion} onChange={(e) => setCompanion(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
          </label>
          <label className="flex items-start justify-between gap-3 border-t pt-3">
            <span className="text-sm font-medium">Recovery nurse package<span className="block text-xs font-normal text-muted-foreground">Daily hotel check-ins for 5 days</span></span>
            <input type="checkbox" checked={nurse} onChange={(e) => setNurse(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
          </label>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [Wallet, "All-in estimate", `${money(plan.total[0])}–${money(plan.total[1]).slice(1)}`, "CAD, procedure + trip"],
              [CalendarDays, "Stay", `${plan.n} nights`, `${plan.c.name}, ${MONTHS[month]}`],
              [HeartPulse, "Procedure", `${money(plan.p.cad[0])}–${money(plan.p.cad[1]).slice(1)}`, "Published Canadian range"],
              [Plane, "Fit to fly", plan.p.fly, "Your surgeon confirms"],
            ].map(([Icon, l, v, s]) => {
              const I = Icon as typeof Wallet;
              return (
                <div key={l as string} className="rounded-xl border bg-card p-5 shadow-soft">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><I className="h-3.5 w-3.5" />{l as string}</p>
                  <p className="mt-1 font-display text-lg font-bold leading-snug">{v as string}</p>
                  <p className="text-xs text-muted-foreground">{s as string}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
            <div className="rounded-xl border bg-card p-5 shadow-soft">
              <h2 className="text-sm font-semibold">Care and recovery itinerary</h2>
              <ol className="mt-3">
                {plan.days.map((x) => (
                  <li key={x.d} className="grid grid-cols-[48px_1fr] gap-3 border-t py-2.5 first:border-t-0">
                    <span className="text-xs text-muted-foreground">Day<b className="block text-base font-semibold text-foreground">{x.d}</b></span>
                    <div>
                      <p className="text-sm font-medium"><span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PHASE[x.ph]}`}>{x.ph}</span>{x.t}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{x.x}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-5 shadow-soft">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><BadgeCheck className="h-4 w-4 text-primary" /> Your provider standards</h2>
                <dl className="mt-3 divide-y text-sm">
                  {[
                    ["City", `${plan.c.name} · ${plan.c.tag}`],
                    ["Certification", "CareConnect Trusted Provider: licences, facility, pricing and complication plan verified"],
                    ["Regulator", plan.c.regulator],
                    ["Recovery", "Recovery hotel, scheduled follow-ups, emergency transfer protocol"],
                    ["Back home", "Records and follow-up plan sent to your doctor"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[100px_1fr] gap-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="rounded-xl border bg-card p-5 shadow-soft">
                <h2 className="text-sm font-semibold">Cost breakdown (CAD)</h2>
                <table className="mt-3 w-full text-sm">
                  <tbody className="divide-y">
                    {[
                      ["Procedure", `${money(plan.p.cad[0])}–${money(plan.p.cad[1]).slice(1)}`],
                      [`Lodging (${plan.n} nights)`, money(plan.lodging)],
                      [`Food and local transport (${plan.ppl})`, money(plan.daily)],
                      [`Return flights (${plan.ppl})`, money(plan.flights)],
                      [nurse ? "Insurance + nurse package" : "Travel and complication insurance", money(plan.extra)],
                    ].map(([k, v]) => <tr key={k}><td className="py-2">{k}</td><td className="py-2 text-right tabular-nums">{v}</td></tr>)}
                    <tr className="font-semibold"><td className="py-2">Total</td><td className="py-2 text-right tabular-nums">{money(plan.total[0])}–{money(plan.total[1]).slice(1)}</td></tr>
                  </tbody>
                </table>
                {plan.p.us && home === "us" && (
                  <p className="mt-3 rounded-lg bg-primary-soft p-3 text-xs text-accent-foreground">
                    A typical US all-in quote for this procedure is about {money((plan.p.us[0] / 0.55) * FX)}–{money((plan.p.us[1] / 0.55) * FX).slice(1)} CAD before travel (ASPS 2024 surgeon fees scaled to a full bill).
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">Procedure ranges are published Canadian prices; travel costs are planning assumptions.</p>
              </div>
            </div>
          </div>
          <p className="rounded-lg border-l-4 border-warning bg-warning-soft px-4 py-3 text-sm">Planning tool, not medical advice. Your surgeon decides candidacy and when it's safe to fly.</p>
        </div>
      </div>
    </div>
  );
}
