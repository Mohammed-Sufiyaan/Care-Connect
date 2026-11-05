// Policy Simulator engine. Runs entirely in the browser (the site is static, hosted on GitHub Pages).
// Presets return the team's scored stakeholder analysis; custom policies get a keyword-based estimate.
export type StakeholderImpact = { stakeholder: string; shortTerm: number; longTerm: number; gain: string; concern: string; safeguard: string };
export type SimResult = { impacts: StakeholderImpact[]; pros: string[]; cons: string[]; risks: string[]; verdict: string };

type Row = [number, number, string, string, string];
type Matrix = Record<string, Row>;

const CARECONNECT: Matrix = {
  "International patients": [6, 7, "One trusted place for certified surgeons, real prices and coordinated recovery.", "Higher price than Turkey or Mexico.", "Sell the full package: recovery, follow-up and a complication plan."],
  "Canadian patients": [0, 1, "Clinic standards and price transparency rise for everyone.", "Worry that international patients take surgeon time.", "Pilot runs in private, accredited clinics; public access monitored."],
  "Private clinics": [5, 6, "New international demand and a government-backed trust label.", "Certification paperwork and price disclosure.", "Voluntary program; certification doubles as marketing."],
  "Public hospitals": [-1, 0, "Little direct effect during a small pilot.", "Complications could land in emergency departments.", "Clinic complication plans, insurance and transfer protocols."],
  "Surgeons and nurses": [2, 3, "More cases for participating surgeons and recovery nurses.", "Pull of private work away from public shifts.", "Track staffing at participating clinics before expanding."],
  "Provincial governments": [1, 2, "Health-economy growth with oversight through regulators.", "Political risk if seen as two-tier care.", "Public-first rules and published pilot results."],
  "Federal government": [2, 2, "Tourism exports and a new trade story for Canada.", "Funding a pilot that may not prove demand.", "Small budget and a hard expansion gate at month 12."],
  "Hotels and tourism": [4, 5, "Ten-to-fifteen-night stays with companions fill hotels.", "Need recovery-friendly rooms and trained staff.", "Certify partner hotels as recovery accommodation."],
};
const ACCELERATOR: Matrix = {
  "International patients": [2, 5, "Shorter waits for bookings as capacity grows.", "Little change in year one.", "Capacity follows proven pilot demand."],
  "Canadian patients": [0, 4, "New surgeons, nurses and OR time also serve Canadians.", "Recruits could drift into private-only work.", "Incentives tied to net new staff and usable OR capacity."],
  "Private clinics": [2, 5, "Grants and tax incentives for new ORs and equipment.", "Strict proof of additional capacity.", "Clear eligibility rules and staged payments."],
  "Public hospitals": [-2, 3, "Less pressure once new staff and ORs come online.", "Short-term poaching risk during recruitment.", "Monitor workforce movement; pause expansion if staffing drops."],
  "Surgeons and nurses": [3, 4, "Jobs, training and research partnerships.", "Licensing hurdles for internationally trained staff.", "Credential-navigation support; Canadian standards unchanged."],
  "Provincial governments": [-2, 3, "A bigger surgical workforce long term.", "Upfront incentive cost and licensing workload.", "Prioritise private capital; pay for results."],
  "Federal government": [-1, 3, "Builds on existing physician immigration measures.", "Incentive spending before returns appear.", "Performance-based incentives phased over years 2–3."],
  "Hotels and tourism": [1, 3, "Larger patient volumes as capacity grows.", "Depends on capacity actually being built.", "Tie marketing to capacity, not ahead of it."],
};
const DIVIDEND: Matrix = {
  "International patients": [-1, -1, "Their spending visibly supports the host country's care.", "5% could raise prices slightly.", "Pilot first and test price sensitivity."],
  "Canadian patients": [1, 5, "Dedicated funding for training and surgical capacity.", "Funds may not cut wait times directly.", "Target known bottlenecks and publish results."],
  "Private clinics": [-3, -1, "A clear public benefit to point to.", "Lower margins and audit obligations.", "Start with voluntary agreements; review the rate."],
  "Public hospitals": [2, 4, "Money for equipment, staff and documented program costs.", "Allocations could become political.", "Independent needs assessment and audits."],
  "Surgeons and nurses": [1, 3, "Training seats and workforce programs funded.", "Little direct gain for private staff.", "Fund training that serves both sectors."],
  "Provincial governments": [2, 4, "New revenue tied to activity, not taxes.", "Legal authority for a compulsory levy is unclear.", "Legal review in year 1; contracts before legislation."],
  "Federal government": [1, 2, "Shows tourism growth paying into public care.", "Administration and enforcement cost.", "Keep collection simple; measure net benefit."],
  "Hotels and tourism": [0, 1, "Supports public acceptance of the industry.", "Could deter some price-sensitive patients.", "Keep the rate modest and competitive."],
};
const FULL: Matrix = Object.fromEntries(
  Object.keys(CARECONNECT).map((k) => {
    const a = CARECONNECT[k]!, b = ACCELERATOR[k]!, c = DIVIDEND[k]!;
    const worst = [a, b, c].sort((x, y) => x[1] - y[1])[0]!;
    return [k, [Math.round((a[0] + b[0] * 0.6 + c[0] * 0.4) / 1.6), Math.round((a[1] + b[1] + c[1]) / 2.4), a[2], worst[3], worst[4]] as Row];
  }),
);

const SUMMARY: Record<string, Omit<SimResult, "impacts">> = {
  careconnect: { verdict: "Low-risk way to prove demand; Canada competes on trust and recovery rather than price.", pros: ["Builds a trusted brand before scaling.", "Uses private, accredited clinics, so public ORs are untouched.", "Creates real data on demand, safety and costs."], cons: ["Small pilot means limited early revenue.", "Certification adds administrative work for clinics.", "Price gap with Turkey and Mexico remains."], risks: ["Demand may be lower than expected.", "A visible complication could hurt the brand.", "Staff could drift from public shifts."] },
  accelerator: { verdict: "Turns proven demand into new capacity, protecting Canadians if incentives pay only for verified gains.", pros: ["Adds surgeons, nurses and OR time for everyone.", "Uses existing immigration and licensing routes.", "Private capital carries most of the cost."], cons: ["Upfront public incentive spending.", "Licensing timelines slow recruitment.", "Benefits arrive in years 2–5, not year 1."], risks: ["Poaching from public hospitals during recruitment.", "Capacity built ahead of demand.", "Incentives paid for capacity that isn't truly new."] },
  dividend: { verdict: "Makes the industry pay into public care; keep the rate modest and start with voluntary agreements.", pros: ["Dedicated, activity-linked funding for Canadian healthcare.", "Strong answer to the two-tier criticism.", "Audits and public reporting build trust."], cons: ["Lowers clinic margins.", "Administration eats part of the collections.", "Legal authority for a compulsory levy is unclear."], risks: ["Higher prices push patients elsewhere.", "Funds spread too thin to cut waits.", "Collections fall short of projections."] },
  full: { verdict: "A credible, staged strategy: prove demand, add capacity, then reinvest, with Canadians protected at each gate.", pros: ["Each stage unlocks only on evidence.", "Adds capacity before adding volume.", "Returns a share of revenue to public care."], cons: ["Slower ramp than a price-led strategy.", "Requires coordination across governments and regulators.", "Early years rely on a small pilot."], risks: ["International demand may disappoint.", "Workforce diversion if safeguards slip.", "GLP-1 shifts the procedure mix faster than planned."] },
};

function pick(policy: string): keyof typeof SUMMARY | null {
  const p = policy.toLowerCase();
  if (p.startsWith("full")) return "full";
  if (p.startsWith("canada careconnect")) return "careconnect";
  if (p.startsWith("healthcare capacity accelerator")) return "accelerator";
  if (p.startsWith("canada health dividend")) return "dividend";
  return null;
}
const MATRIX = { careconnect: CARECONNECT, accelerator: ACCELERATOR, dividend: DIVIDEND, full: FULL };
const SCALE = { low: 0.6, medium: 1, high: 1.3 };

function keywordGuess(policy: string): keyof typeof SUMMARY {
  const p = policy.toLowerCase();
  if (/(levy|contribution|tax|reinvest|dividend)/.test(p)) return "dividend";
  if (/(recruit|capacity|operating room|\bor\b|incentive|grant|immigra)/.test(p)) return "accelerator";
  return "careconnect";
}

export async function simulatePolicy({ data }: { data: { policy: string; stakeholders: string[]; intensity: "low" | "medium" | "high" } }): Promise<{ result?: SimResult; error?: string }> {
  if (!data.policy || data.policy.trim().length < 5) return { error: "Please describe the policy (at least 5 characters)." };
  if (!data.stakeholders.length) return { error: "Select at least one stakeholder." };
  await new Promise((r) => setTimeout(r, 500));
  const preset = pick(data.policy);
  const key = preset ?? keywordGuess(data.policy);
  const m = MATRIX[key], k = SCALE[data.intensity];
  const clamp = (n: number) => Math.max(-10, Math.min(10, Math.round(n)));
  const impacts: StakeholderImpact[] = data.stakeholders.map((s) => {
    const r = m[s] ?? [0, 0, "No specific effect identified.", "Unclear exposure.", "Monitor during the pilot."];
    const strain = data.intensity === "high" && ["Public hospitals", "Canadian patients", "Surgeons and nurses"].includes(s) ? -2 : 0;
    return { stakeholder: s, shortTerm: clamp(r[0] * k + strain), longTerm: clamp(r[1] * k + strain / 2), gain: r[2], concern: r[3], safeguard: r[4] };
  });
  const sum = SUMMARY[key]!;
  const note = preset ? "" : " (Estimated from the closest of our three policies, based on keywords in your description.)";
  return { result: { impacts, pros: sum.pros, cons: sum.cons, risks: sum.risks, verdict: sum.verdict + note } };
}
