import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Building2, HandCoins } from "lucide-react";
import { STATS } from "@/lib/sources";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Strategy — Canada CareConnect" },
      { name: "description", content: "Canada can win post-weight-loss body contouring on trust, safety and coordinated recovery — not price." },
      { property: "og:title", content: "Strategy — Canada CareConnect" },
      { property: "og:description", content: "Connect → Expand → Reinvest: a three-policy strategy for Canada's medical tourism opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const POLICIES = [
  {
    step: "Connect",
    when: "0–12 months",
    title: "Canada CareConnect",
    icon: ShieldCheck,
    points: [
      "Trusted provider certification",
      "One platform for consultations, booking, stay and transport",
      "Recovery network with home-doctor follow-up",
      "Toronto pilot, 3–5 clinics — expands only if demand, safety, finances and public access hold",
    ],
  },
  {
    step: "Expand",
    when: "Years 1–5",
    title: "Healthcare Capacity Accelerator",
    icon: Building2,
    points: [
      "Conditional incentives for new ORs and equipment",
      "Paid only for proven new staff and capacity",
      "Recruit surgeons, anesthesiologists and nurses via existing pathways",
      "Training and research partnerships",
    ],
  },
  {
    step: "Reinvest",
    when: "Years 2–5",
    title: "Canada Health Dividend",
    icon: HandCoins,
    points: [
      "Proposed 5% contribution on eligible international procedure revenue",
      "Reinvested in Canadian healthcare",
      "Independent audits and public reporting",
    ],
  },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">UEC Advanced Case Competition</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Canada wins on <span className="text-primary">trust, safety</span> and coordinated recovery — not on price.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A strategy for post-weight-loss body contouring — tummy tucks, liposuction and skin removal after GLP-1 weight loss — for
          patients mainly from the United States.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/network" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground shadow-soft">
            Explore the network <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/simulator" className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 font-medium">
            Run the simulator
          </Link>
        </div>
      </section>

      <section className="pb-16">
        <h2 className="text-2xl font-bold">The problem, in numbers</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
              <p className="mt-2 text-sm">{s.label}</p>
              <p className="mt-3 text-xs text-muted-foreground">{s.source}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <h2 className="text-2xl font-bold">Connect → Expand → Reinvest</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {POLICIES.map((p, i) => (
            <div key={p.title} className="relative rounded-xl border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <span className="text-xs text-muted-foreground">{p.when}</span>
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
                {i + 1}. {p.step}
              </p>
              <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 rounded-2xl bg-primary-soft p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">The key judge question</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">"Why serve international patients when Canadians already wait?"</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["No priority", "International patients never move ahead of Canadians in any public queue."],
            ["Capacity before volume", "Incentives pay only for proven new ORs and staff — never reallocated public capacity."],
            ["Revenue reinvested", "The Health Dividend returns a share of every eligible procedure to Canadian care."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
