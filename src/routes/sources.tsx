import { createFileRoute } from "@tanstack/react-router";
import { ASSUMPTIONS, PRICES, STATS } from "@/lib/sources";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources & Assumptions — Canada CareConnect" },
      { name: "description", content: "Every statistic used in the strategy with its source, plus the economic model's assumptions." },
      { property: "og:title", content: "Sources & Assumptions — Canada CareConnect" },
      { property: "og:description", content: "Cited statistics and model assumptions behind the Canada CareConnect strategy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sources,
});

function Sources() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-3xl font-bold md:text-4xl">Sources & assumptions</h1>
      <h2 className="mt-10 text-xl font-bold">Statistics</h2>
      <div className="mt-4 divide-y rounded-xl border bg-card">
        {STATS.map((s) => (
          <div key={s.label} className="grid gap-1 p-4 md:grid-cols-[120px_1fr_260px] md:gap-4">
            <span className="font-display font-bold text-primary">{s.value}</span>
            <span className="text-sm">{s.label}</span>
            <span className="text-sm text-muted-foreground">{s.source}</span>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold">Tummy tuck prices</h2>
      <div className="mt-4 divide-y rounded-xl border bg-card">
        {PRICES.map((p) => (
          <div key={p.market} className="grid gap-1 p-4 md:grid-cols-[120px_1fr_260px] md:gap-4">
            <span className="font-medium">{p.market}</span>
            <span className="text-sm">{p.price}</span>
            <span className="text-sm text-muted-foreground">{p.source}</span>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold">Model assumptions</h2>
      <ul className="mt-4 space-y-2 rounded-xl border bg-card p-5 text-sm">
        {ASSUMPTIONS.map((a) => (
          <li key={a} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
