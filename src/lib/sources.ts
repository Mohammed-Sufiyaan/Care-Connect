export const STATS = [
  { value: "349,728", label: "US liposuctions in 2024", source: "ASPS 2024 Procedural Statistics" },
  { value: "171,064", label: "US tummy tucks in 2024", source: "ASPS 2024 Procedural Statistics" },
  { value: "$18,211", label: "Average cost to treat one complication from cosmetic surgery abroad", source: "ASPS / Plastic and Reconstructive Surgery, 2017" },
  { value: "289", label: "Plastic surgeons in Ontario, 66.8% in Toronto & Central Ontario", source: "Ontario Plastic Surgery Workforce Study, 2026" },
  { value: "−11.4%", label: "Drop in liposuction demand in 2025 as GLP-1 drugs spread, while tummy tucks and skin removal grew", source: "ASPS 2025 trend reporting" },
  { value: "10 days", label: "Minimum the CDC advises before flying after abdominal surgery", source: "CDC Travelers' Health — Medical Tourism" },
];

export const PRICES = [
  { market: "Canada", price: "CAD $8,500–$15,000", source: "Published Canadian clinic price ranges" },
  { market: "United States", price: "USD $8,000–$13,500 (surgeon fee)", source: "ASPS 2024" },
  { market: "Turkey", price: "USD $1,500–$5,500", source: "Published medical tourism price ranges" },
  { market: "Mexico", price: "USD $3,000–$5,000", source: "Published medical tourism price ranges" },
];

export const ASSUMPTIONS = [
  "Pilot starts with 10 surgeons across 3–5 Toronto clinics.",
  "2 international procedures per surgeon per week, over 44 operating weeks per year.",
  "75% utilization of planned slots → 660 procedures in year 1.",
  "Default average revenue of CAD $12,000 per procedure, within published Canadian ranges (≈ $8,500–$20,000).",
  "Health Dividend of 5% on eligible international procedure revenue, collected from year 2.",
  "Surgeon capacity growth (default 20%/yr) reflects new staff funded by the Capacity Accelerator — not reallocated public capacity.",
  "Network map readiness scores are illustrative, not measured data.",
];
