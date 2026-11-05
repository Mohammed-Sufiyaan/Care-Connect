export type ModelInputs = {
  surgeons: number;
  perWeek: number;
  utilization: number; // 0-1
  revenue: number; // CAD per procedure
  dividendRate: number; // 0-1
  growth: number; // annual surgeon growth 0-1
};

export const WEEKS_PER_YEAR = 44;
export const PRICE_MIN = 8500;
export const PRICE_MAX = 20000;

export const DEFAULT_INPUTS: ModelInputs = {
  surgeons: 10,
  perWeek: 2,
  utilization: 0.75,
  revenue: 12000,
  dividendRate: 0.05,
  growth: 0.2,
};

export function proceduresPerYear(i: Pick<ModelInputs, "surgeons" | "perWeek" | "utilization">) {
  return Math.round(i.surgeons * i.perWeek * WEEKS_PER_YEAR * i.utilization);
}

export function projectFiveYears(i: ModelInputs) {
  return Array.from({ length: 5 }, (_, idx) => {
    const year = idx + 1;
    const surgeons = i.surgeons * Math.pow(1 + i.growth, idx);
    const procedures = proceduresPerYear({ ...i, surgeons });
    const revenue = procedures * i.revenue;
    // Dividend starts in year 2 (policy timeline: years 2–5)
    const dividend = year >= 2 ? revenue * i.dividendRate : 0;
    return { year: `Y${year}`, procedures, revenue, dividend };
  });
}

export function priceWarning(revenue: number) {
  return revenue > PRICE_MAX;
}
