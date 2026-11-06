import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdvisorChat } from "@/components/advisor-chat";
import { Robot } from "@/components/robot";

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
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="text-center lg:text-left">
          <div className="mx-auto w-fit rounded-full bg-primary-soft p-6 lg:mx-0">
            <Robot size={200} thinking={busy} />
          </div>
          <h1 className="mt-6 text-3xl font-bold md:text-4xl">AI Advisor</h1>
          <p className="mt-2 text-muted-foreground">
            {busy ? "Working on your answer…" : "Ask anything about Canada CareConnect: the strategy, the numbers, the risks, or a patient's options."}
          </p>
        </div>
        <div className="h-[620px]"><AdvisorChat onBusy={setBusy} /></div>
      </div>
    </div>
  );
}
