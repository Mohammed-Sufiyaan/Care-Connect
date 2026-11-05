import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS, priceWarning, proceduresPerYear, projectFiveYears } from "./model";

describe("economic model", () => {
  it("defaults to 660 procedures per year", () => {
    expect(proceduresPerYear(DEFAULT_INPUTS)).toBe(660);
  });
  it("dividend is 5% of revenue and starts in year 2", () => {
    const y = projectFiveYears({ ...DEFAULT_INPUTS, growth: 0 });
    expect(y[0].dividend).toBe(0);
    expect(y[1].dividend).toBeCloseTo(660 * 12000 * 0.05);
  });
  it("warns above CAD $20,000", () => {
    expect(priceWarning(20000)).toBe(false);
    expect(priceWarning(20001)).toBe(true);
  });
});
