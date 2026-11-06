# Canada CareConnect

Interactive strategy site for our UEC Advanced Case Competition proposal: making Canada the trusted destination for post-weight-loss body contouring.

**Live site:** https://mohammed-sufiyaan.github.io/Care-Connect/

## The strategy: Connect → Expand → Reinvest

1. **Canada CareConnect** (0–12 months): trusted provider certification, one patient-coordination platform and a recovery network. Toronto pilot with 3–5 clinics.
2. **Healthcare Capacity Accelerator** (years 1–5): incentives paid only for proven new staff and operating-room capacity, plus international talent recruitment.
3. **Canada Health Dividend** (years 2–5): a proposed 5% contribution on international procedure revenue, reinvested in Canadian healthcare.

## Pages

- **Home**: the three-stage strategy at a glance and links to every tool.
- **Network Map**: real Canadian geography with clickable hub cities, US source markets, patient flows, a pilot gate and readiness scores.
- **Policy Simulator**: short- and long-term impact of each policy on eight stakeholder groups, with pros, cons and risks.
- **CareRoute**: a patient journey planner with a recovery-safe itinerary, provider standards and an all-in cost.
- **Economic Model**: five-year projection of procedures, revenue and the Health Dividend.
- **AI Advisor**: a chatbot (on its own page and as a floating button everywhere) that answers from the team's strategy research. Visitors can optionally add their own Anthropic API key in AI settings for live Claude answers; the key stays in their browser and is never part of the site.
- **Sources**: every statistic with its source.

## Run locally

```sh
npm install   # or: bun install
npm run dev
```

## Deploy

`npm run build` produces a static site in `dist/` (including a `404.html` so deep links work). The `gh-pages` branch holds the built site; GitHub Pages serves it from that branch.

## Credits

Map boundaries: Natural Earth via [sane-topojson](https://github.com/plotly/sane-topojson) (MIT). Charts: Recharts. All projections, scores and simulations are illustrative and not medical advice.
