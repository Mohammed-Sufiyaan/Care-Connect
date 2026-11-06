import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Calculator, Map, Route as RouteIcon, ScrollText, Users } from "lucide-react";
import { STATS } from "@/lib/sources";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Canada CareConnect — UEC Case Competition" },
      { name: "description", content: "Making Canada the trusted destination for post-weight-loss body contouring." },
      { property: "og:title", content: "Canada CareConnect" },
      { property: "og:description", content: "Connect → Expand → Reinvest: Canada's medical tourism opportunity in body contouring." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const TOOLS = [
  { to: "/network", icon: Map, title: "Network Map", text: "Clickable hubs across Canada, US patient flows and a pilot gate that unlocks expansion." },
  { to: "/careroute", icon: RouteIcon, title: "CareRoute", text: "Plan a patient's journey: certified provider, recovery itinerary and all-in cost." },
  { to: "/simulator", icon: Users, title: "Policy Simulator", text: "See who gains and who worries under each policy, short and long term." },
  { to: "/economics", icon: Calculator, title: "Economic Model", text: "Five years of procedures, revenue and the Health Dividend." },
  { to: "/advisor", icon: Bot, title: "AI Advisor", text: "Ask anything about the strategy, the numbers or a patient's options." },
  { to: "/sources", icon: ScrollText, title: "Sources", text: "Every statistic with its source, and every model assumption." },
] as const;

const STEPS = [
  ["Connect", "0–12 months", "Canada CareConnect: a certified provider network and Toronto pilot."],
  ["Expand", "Years 1–5", "Capacity Accelerator: new staff and operating rooms before new volume."],
  ["Reinvest", "Years 2–5", "Health Dividend: a proposed 5% of revenue back to Canadian care."],
] as const;

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">UEC Advanced Case Competition</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Canada CareConnect
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Making Canada the trusted destination for post-weight-loss body contouring: certified surgeons, coordinated recovery, and growth that gives back to Canadian healthcare.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/network" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground shadow-soft">
              Explore the network <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/careroute" className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 font-medium">
              Plan a patient trip
            </Link>
          </div>
        </div>
        <ol className="space-y-3">
          {STEPS.map(([step, when, text], i) => (
            <li key={step} className="flex gap-4 rounded-xl border bg-card p-4 shadow-soft">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">{i + 1}</span>
              <div>
                <p className="font-display font-bold">{step} <span className="ml-1 text-xs font-normal text-muted-foreground">{when}</span></p>
                <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-16">
        <h2 className="text-2xl font-bold">Explore</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="group rounded-xl border bg-card p-5 shadow-soft transition hover:border-primary">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary"><t.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 flex items-center gap-1.5 font-display text-lg font-bold">
                {t.title} <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <h2 className="text-2xl font-bold">Why now</h2>
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
    </div>
  );
}
