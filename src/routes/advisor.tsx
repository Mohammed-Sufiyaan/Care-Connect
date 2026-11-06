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

function Advisor() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-3xl font-bold md:text-4xl">AI Advisor</h1>
      <p className="mt-2 text-muted-foreground">
        Ask anything about Canada CareConnect: the strategy, the numbers, the risks, or a patient's options.
      </p>
      <div className="mt-8 h-[640px]"><AdvisorChat /></div>
    </div>
  );
}
