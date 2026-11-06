import { ArrowRight, ShieldCheck, Siren, UserRound } from "lucide-react";
import type { RiskItem } from "@/lib/simulate";

const score = (l: number, i: number) => l * i;
const level = (s: number) => (s >= 15 ? "High" : s >= 8 ? "Medium" : "Low");
const tone = (s: number) =>
  s >= 15 ? "bg-destructive/12 text-destructive" : s >= 8 ? "bg-warning-soft text-warning" : "bg-success/12 text-success";
const cell = (s: number) => (s >= 15 ? "bg-destructive/15" : s >= 8 ? "bg-warning-soft" : "bg-success/10");

export function RiskPanel({ register }: { register: RiskItem[] }) {
  const before = register.map((r) => score(r.likelihood, r.impact));
  const after = register.map((r) => score(r.residual.likelihood, r.residual.impact));
  const count = (arr: number[], lv: string) => arr.filter((s) => level(s) === lv).length;
  const avgDrop = Math.round((1 - after.reduce((a, b) => a + b, 0) / before.reduce((a, b) => a + b, 0)) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Risks tracked", String(register.length), "from the policy plan"],
          ["High before mitigation", String(count(before, "High")), `${count(before, "Medium")} medium`],
          ["High after mitigation", String(count(after, "High")), `${count(after, "Medium")} medium`],
          ["Risk reduced", `${avgDrop}%`, "average score, after mitigation"],
        ].map(([k, v, s]) => (
          <div key={k} className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold">{v}</p>
            <p className="text-xs text-muted-foreground">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {(["Before mitigation", "After mitigation"] as const).map((title, m) => (
          <div key={title} className="rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
              <div className="flex items-center"><span className="-rotate-180 text-[11px] text-muted-foreground [writing-mode:vertical-rl]">Likelihood →</span></div>
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {[5, 4, 3, 2, 1].flatMap((l) =>
                    [1, 2, 3, 4, 5].map((i) => {
                      const here = register.map((r, n) => ({ n: n + 1, r })).filter(({ r }) =>
                        m === 0 ? r.likelihood === l && r.impact === i : r.residual.likelihood === l && r.residual.impact === i);
                      return (
                        <div key={`${l}-${i}`} className={`flex h-12 flex-wrap content-center items-center justify-center gap-0.5 rounded-md p-1 ${cell(l * i)}`}>
                          {here.map(({ n, r }) => (
                            <span key={n} title={r.risk} className="grid h-[18px] w-[18px] place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">{n}</span>
                          ))}
                        </div>
                      );
                    }),
                  )}
                </div>
                <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Impact →</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {register.map((r, n) => {
          const b = score(r.likelihood, r.impact), a = score(r.residual.likelihood, r.residual.impact);
          return (
            <div key={r.risk} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">{n + 1}</span>
                  <div>
                    <h3 className="font-semibold">{r.risk}</h3>
                    <p className="text-xs text-muted-foreground">{r.policy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-medium ${tone(b)}`}>{level(b)} · {r.likelihood}×{r.impact}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={`rounded-full px-2.5 py-1 font-medium ${tone(a)}`}>{level(a)} · {r.residual.likelihood}×{r.residual.impact}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-[1.4fr_1fr_0.8fr]">
                <p><span className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-primary"><ShieldCheck className="h-3.5 w-3.5" /> Mitigation</span>{r.mitigation}</p>
                <p><span className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-warning"><Siren className="h-3.5 w-3.5" /> Early warning</span>{r.trigger}</p>
                <p><span className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><UserRound className="h-3.5 w-3.5" /> Owner</span>{r.owner}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Likelihood and impact are scored 1–5 (score = likelihood × impact; 15+ high, 8–14 medium). Scores are the team's judgement and change with policy intensity.</p>
    </div>
  );
}
