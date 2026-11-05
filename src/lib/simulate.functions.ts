import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

export type StakeholderImpact = {
  stakeholder: string;
  shortTerm: number;
  longTerm: number;
  gain: string;
  concern: string;
  safeguard: string;
};
export type SimResult = {
  impacts: StakeholderImpact[];
  pros: string[];
  cons: string[];
  risks: string[];
  verdict: string;
};

type Input = { policy: string; stakeholders: string[]; intensity: "low" | "medium" | "high" };

const CONTEXT = `Context: A university case competition strategy for Canada's medical tourism opportunity in post-weight-loss body contouring (tummy tuck, liposuction, skin removal after GLP-1 weight loss), targeting mainly US patients. Thesis: win on trust, safety and coordinated recovery, not price. Policies: (1) Canada CareConnect – government-supported, privately delivered network with provider certification, one coordination platform, recovery network with home-doctor follow-up; Toronto pilot with 3–5 clinics. (2) Healthcare Capacity Accelerator – conditional incentives for new ORs/equipment paid only for proven new staff and capacity; recruitment via existing immigration/licensing; training partnerships. (3) Canada Health Dividend – 5% contribution on eligible international procedure revenue reinvested in Canadian healthcare with audits. International patients receive no priority over Canadians.`;

function extractText(res: unknown): string {
  const r = res as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (typeof r.output_text === "string" && r.output_text) return r.output_text;
  return (r.output ?? [])
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");
}

const clamp = (n: unknown) => Math.max(-10, Math.min(10, Math.round(Number(n) || 0)));

export const simulatePolicy = createServerFn({ method: "POST" })
  .inputValidator((d: Input) => {
    if (!d || typeof d.policy !== "string" || d.policy.trim().length < 5 || d.policy.length > 3000)
      throw new Error("Please describe the policy (5–3000 characters).");
    if (!Array.isArray(d.stakeholders) || d.stakeholders.length === 0 || d.stakeholders.length > 12)
      throw new Error("Select at least one stakeholder.");
    if (!["low", "medium", "high"].includes(d.intensity)) throw new Error("Invalid intensity.");
    return { policy: d.policy.trim(), stakeholders: d.stakeholders.map(String).slice(0, 12), intensity: d.intensity };
  })
  .handler(async ({ data }): Promise<{ result?: SimResult; error?: string }> => {
    const prompt = `${CONTEXT}

Policy to evaluate (intensity: ${data.intensity}):
${data.policy}

Stakeholders: ${data.stakeholders.join(", ")}

Act as a balanced policy analyst. For EACH stakeholder listed, score short-term (0–12 months) and long-term (3–5 years) impact from -10 (very negative) to +10 (very positive), and give one short main gain, main concern and safeguard (each under 18 words). Then give 3 overall pros, 3 cons, 3 risks (each under 18 words) and a one-line verdict (under 25 words). Do not invent statistics. Do not give medical advice.
Return JSON only, shaped exactly: {"impacts":[{"stakeholder":"","shortTerm":0,"longTerm":0,"gain":"","concern":"","safeguard":""}],"pros":[],"cons":[],"risks":[],"verdict":""}`;
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        input: [{ role: "user", content: prompt }],
        text: { format: { type: "json_object" } },
      });
      const parsed = JSON.parse(extractText(res)) as Partial<SimResult>;
      const result: SimResult = {
        impacts: (parsed.impacts ?? []).map((i) => ({
          stakeholder: String(i.stakeholder ?? ""),
          shortTerm: clamp(i.shortTerm),
          longTerm: clamp(i.longTerm),
          gain: String(i.gain ?? ""),
          concern: String(i.concern ?? ""),
          safeguard: String(i.safeguard ?? ""),
        })),
        pros: (parsed.pros ?? []).map(String),
        cons: (parsed.cons ?? []).map(String),
        risks: (parsed.risks ?? []).map(String),
        verdict: String(parsed.verdict ?? ""),
      };
      return { result };
    } catch (e) {
      console.error("simulatePolicy failed", e);
      if (e instanceof GatewayError) {
        if (e.code === "payment_required" || e.httpStatus === 402) return { error: "AI credits are used up. Please top up and try again." };
        if (e.httpStatus === 429) return { error: "Too many requests right now. Please wait a moment and try again." };
      }
      return { error: "The simulation couldn't be completed. Please try again." };
    }
  });
