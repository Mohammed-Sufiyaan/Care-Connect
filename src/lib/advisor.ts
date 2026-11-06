// CareConnect AI Advisor.
// Two modes:
//  1. Knowledge base (default): answers from the team's strategy content. Works for every visitor, no key needed.
//  2. Claude (optional): a visitor pastes their own Anthropic API key, kept only in their browser.
//     The site is static (GitHub Pages), so no key is ever published with it.

export type ChatMsg = { role: "user" | "assistant"; content: string };
export type Answer = { text: string; links: { to: string; label: string }[] };

type Topic = { keys: string[]; text: string; links?: { to: string; label: string }[] };

const TOPICS: Topic[] = [
  {
    keys: ["overview", "summary", "what is", "strategy", "idea", "pitch", "explain", "about", "careconnect plan", "big picture"],
    text: "Canada CareConnect makes Canada the trusted destination for post-weight-loss body contouring (tummy tucks, liposuction and skin removal), mainly for US patients. We compete on trust, safety and coordinated recovery, not price. The strategy runs in three stages: Connect (a certified provider network and Toronto pilot), Expand (new surgical capacity and talent) and Reinvest (a proposed 5% Health Dividend returned to Canadian healthcare).",
    links: [{ to: "/network", label: "See the network map" }],
  },
  {
    keys: ["policy 1", "careconnect", "connect", "pilot", "certification", "certify", "trusted provider", "platform", "recovery network", "short term", "short-term"],
    text: "Policy 1, Canada CareConnect (months 0–12): a government-supported, privately delivered network. It has three parts: trusted provider certification (verified licences, facility standards, transparent prices, complication plans), one platform for consultations, booking, accommodation and transport, and a recovery network with follow-up through the patient's home doctor. It starts as a Toronto pilot with 3–5 clinics and expands only if demand, safety, finances and public access all hold.",
    links: [{ to: "/network", label: "Try the pilot gate on the map" }],
  },
  {
    keys: ["policy 2", "accelerator", "capacity", "expand", "recruit", "recruitment", "talent", "immigration", "incentive", "operating room", "staff", "nurses", "surgeons", "workforce"],
    text: "Policy 2, the Healthcare Capacity Accelerator (years 1–5): conditional grants and tax incentives for new operating rooms, equipment and recovery space, paid only when providers prove both net new staff and usable surgical capacity. It recruits surgeons, anesthesiologists and nurses through existing immigration and licensing routes (for example IRCC's December 2025 measures, with 5,000 reserved physician spaces), and builds training and research partnerships. Provincial licensing still applies to everyone.",
  },
  {
    keys: ["policy 3", "dividend", "reinvest", "levy", "5%", "five percent", "contribution", "tax", "fund", "audit"],
    text: "Policy 3, the Canada Health Dividend (years 2–5): a proposed 5% contribution on eligible international body-contouring revenue, reinvested in healthcare workforce training, surgical capacity and documented program costs. It starts through voluntary agreements or program contracts (a compulsory levy would need legislation), with audited reports and public disclosure. It continues only if net funds deliver measurable healthcare gains.",
    links: [{ to: "/economics", label: "Model the dividend" }],
  },
  {
    keys: ["wait", "waiting", "canadians", "two-tier", "two tier", "priority", "queue", "why serve", "foreigners", "public system", "judge question"],
    text: "Why serve international patients when Canadians already wait? Three answers. No priority: international patients never move ahead of Canadians in any public queue, and the pilot runs in private, accredited clinics. Capacity before volume: incentives pay only for proven new staff and operating rooms, never reallocated public capacity. Revenue reinvested: the Health Dividend returns a share of every eligible procedure to Canadian care. Expansion pauses if public access worsens.",
  },
  {
    keys: ["why canada", "advantage", "compete", "competitive", "trust", "differentiat", "versus", "vs"],
    text: "Canada can't beat Turkey or Mexico on price, so it competes on trust: Royal College–certified surgeons, provincially regulated facilities, recovery that continues after the patient flies home, and proximity. Toronto is a short flight from New York, Chicago and Boston, with no visa for US patients. That matters because complications from cosmetic surgery abroad cost about $18,211 each to treat back home.",
  },
  {
    keys: ["price", "cost", "cheap", "expensive", "turkey", "mexico", "how much", "afford"],
    text: "Tummy tuck prices: Canada about CAD $8,500–$15,000; US surgeon fee alone USD $8,000–$13,500 (ASPS 2024), so a full US bill is higher; Turkey about USD $1,500–$5,500; Mexico about USD $3,000–$5,000. Canada sits below a typical US all-in quote but above Turkey and Mexico.",
    links: [{ to: "/careroute", label: "Estimate a trip in CareRoute" }],
  },
  {
    keys: ["glp", "ozempic", "wegovy", "weight loss", "weight-loss", "demand", "trend", "skin removal", "why now", "market"],
    text: "GLP-1 weight-loss drugs are reshaping demand. Liposuction demand fell 11.4% in 2025 (The National, October 2026), while tummy tucks and skin removal after major weight loss are growing. That is why we target post-weight-loss contouring, where coordinated recovery matters most. In the US alone there were 349,728 liposuctions and 171,064 tummy tucks in 2024 (ASPS).",
  },
  {
    keys: ["economic", "economics", "revenue", "money", "660", "procedures", "financial", "model", "numbers", "projection", "roi", "return"],
    text: "The team model: 10 surgeons × 2 procedures a week × 44 weeks × 75% utilization = 660 procedures a year. At CAD $12,000 average revenue (within published Canadian prices of about $8,500–$20,000), that is about $7.9M a year in procedure revenue, and a 5% Health Dividend of about $396,000 a year from year 2. All figures are illustrative.",
    links: [{ to: "/economics", label: "Open the economic model" }],
  },
  {
    keys: ["risk", "risks", "downside", "fail", "weakness", "concern", "problem"],
    text: "Main risks and safeguards: weak demand (start with a small pilot and sell quality, not price); complications (documented recovery plans, insurance and emergency transfer protocols); staff pulled from public hospitals (incentives only for net new staff, pause expansion if access drops); the 5% raising prices (pilot the rate and test price sensitivity); and GLP-1 shifting the procedure mix (focus on skin removal).",
    links: [{ to: "/simulator", label: "Stress-test in the simulator" }],
  },
  {
    keys: ["safe", "safety", "complication", "fly", "flying", "recovery", "aftercare", "follow-up", "follow up", "cdc", "clearance"],
    text: "Safety is built in. Patients fly home only after medical clearance; the CDC advises not flying for at least 10 days after abdominal surgery. Each certified clinic needs a documented complication plan, insurance and an emergency transfer protocol, and the recovery network hands follow-up to the patient's home doctor.",
    links: [{ to: "/careroute", label: "See a recovery itinerary" }],
  },
  {
    keys: ["toronto", "ontario", "why toronto", "289", "surgeons in ontario", "location"],
    text: "Toronto is the pilot city because Ontario has 289 plastic surgeons, 66.8% of them in Toronto and Central Ontario (Ontario Plastic Surgery Workforce Study, 2026), and because it is a short flight from the biggest US source markets. Montreal, Vancouver, Ottawa, Calgary, Edmonton and Winnipeg are expansion candidates, unlocked only after the pilot passes evaluation.",
    links: [{ to: "/network", label: "Explore the hubs" }],
  },
  {
    keys: ["stakeholder", "stakeholders", "who benefits", "who wins", "hospital", "clinic", "government", "hotel", "tourism", "impact"],
    text: "Stakeholders: international patients gain a trusted, coordinated option; private clinics gain demand and a trust label; hotels and tourism gain long recovery stays; Canadian patients and public hospitals gain long term from new capacity and the dividend, with safeguards against short-term strain; governments gain activity-linked revenue.",
    links: [{ to: "/simulator", label: "Run the stakeholder simulator" }],
  },
  {
    keys: ["korea", "precedent", "example", "other countries", "evidence", "proof"],
    text: "Precedent: South Korea runs a formal foreign-patient registration system. As of March 2025, Medical Korea listed 3,114 registered medical institutions and 1,927 registered patient-attraction agencies. It shows an organised provider registry and patient coordination can work at scale.",
  },
  {
    keys: ["source", "sources", "cite", "citation", "reference", "data"],
    text: "Every statistic on this site is listed with its source on the Sources page: ASPS 2024 procedure statistics and fees, the Ontario plastic surgery workforce study, the CDC's medical tourism guidance, The National on GLP-1 trends, and published price ranges. Map readiness scores and simulator scores are illustrative.",
    links: [{ to: "/sources", label: "Open Sources" }],
  },
  {
    keys: ["careroute", "plan my trip", "itinerary", "patient", "book", "how long", "stay", "planner", "trip", "visit"],
    text: "CareRoute plans a patient's journey: pick where you're coming from, the procedure, city and month, and it builds a day-by-day care and recovery itinerary, an all-in cost estimate and the provider standards you can expect. It's a planning tool, not medical advice; the surgeon decides candidacy and when it is safe to fly.",
    links: [{ to: "/careroute", label: "Open CareRoute" }],
  },
  {
    keys: ["map", "network map", "hub", "readiness", "how to use", "demo", "website", "site"],
    text: "On the network map, Toronto runs the pilot. Switch on 'Pilot evaluation passed' to unlock other cities, then certify clinics or add surgeons and watch the KPIs and US patient flows update. Readiness scores combine US access, surgeon base, regulation, recovery capacity and public-system pressure, and are illustrative.",
    links: [{ to: "/network", label: "Open the map" }],
  },
];

const GREET = /^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/i;

export const SUGGESTIONS = [
  "Explain the strategy in 30 seconds",
  "Why serve international patients when Canadians wait?",
  "How does the Health Dividend work?",
  "What are the biggest risks?",
  "How much does a tummy tuck cost in Canada?",
];

export function answerFromKnowledge(q: string): Answer {
  const s = q.toLowerCase();
  if (GREET.test(s.trim()) && s.length < 30)
    return { text: "Hi! I'm the CareConnect Advisor. Ask me about the three policies, the economics, risks, safety, or how to plan a patient trip.", links: [] };
  const scored = TOPICS.map((t) => ({ t, n: t.keys.reduce((a, k) => a + (s.includes(k) ? k.length : 0), 0) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  if (!scored.length)
    return {
      text: "I don't have a specific answer for that yet. Try asking about the strategy, one of the three policies, the wait-times question, prices, economics, risks, safety, Toronto, or CareRoute.",
      links: [],
    };
  const top = scored.slice(0, scored[1] && scored[1].n >= scored[0]!.n * 0.7 ? 2 : 1).map((x) => x.t);
  return { text: top.map((t) => t.text).join("\n\n"), links: top.flatMap((t) => t.links ?? []).slice(0, 2) };
}

/* ---------- optional Claude mode ---------- */
const KEY = "cc-advisor-anthropic-key";
export const getKey = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};
export const setKey = (k: string) => {
  try {
    if (k) localStorage.setItem(KEY, k);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: key lives for this session only */
  }
};

const SYSTEM = `You are the CareConnect AI Advisor on a UEC case-competition website. The team proposes making Canada the trusted destination for post-weight-loss body contouring, mainly for US patients, through three linked policies (Connect → Expand → Reinvest). Answer questions from judges, teammates and prospective patients clearly and persuasively in under 150 words, plain text. Use only the facts below; if something isn't covered, say so and reason carefully. Be honest about weak assumptions. Never give medical advice; say the surgeon decides candidacy and fitness to fly.

FACTS:
${TOPICS.map((t) => "- " + t.text).join("\n")}`;

export async function askClaude(history: ChatMsg[], key: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 700, system: SYSTEM, messages: history.slice(-12) }),
  });
  if (res.status === 401) throw new Error("That API key was rejected. Check it in AI settings.");
  if (res.status === 429) throw new Error("Too many requests right now. Try again in a minute.");
  if (!res.ok) throw new Error(`Claude couldn't answer (error ${res.status}). Switched back to the built-in answers.`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim();
}
