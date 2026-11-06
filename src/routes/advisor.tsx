import { createFileRoute } from "@tanstack/react-router";
import { AdvisorChat } from "@/components/advisor-chat";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor — Canada CareConnect" },
      { name: "description", content: "Ask the CareConnect Advisor about the strategy, policies, economics, risks and patient journeys." },
    ],
  }),
  component: Advisor,
});

const TOPICS = [
  ["The strategy", "Connect → Expand → Reinvest, and why Canada competes on trust"],
  ["Judge questions", "Wait times, two-tier care, demand, risks"],
  ["The numbers", "660 procedures a year, revenue, the Health Dividend"],
  ["Patients", "Prices, safety, recovery and when it's safe to fly"],
];

function Advisor() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-3xl font-bold md:text-4xl">AI Advisor</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Ask anything about Canada CareConnect: rehearse judge questions, check a number, or help a patient understand their options.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="h-[620px]"><AdvisorChat /></div>
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-soft">
            <h2 className="text-sm font-semibold">What you can ask</h2>
            <ul className="mt-3 space-y-3">
              {TOPICS.map(([t, d]) => (
                <li key={t}>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-primary-soft p-5 text-sm">
            <p className="font-semibold text-accent-foreground">Two modes</p>
            <p className="mt-2 text-muted-foreground">
              By default the Advisor answers from our strategy research, so it works for everyone. Add your own Anthropic API key in AI settings for live Claude answers; the key stays in your browser.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
