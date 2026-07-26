declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: (actual: unknown) => {
  toBe: (expected: unknown) => void;
};

import { resolveForecastTargetTime } from "./forecast-window";

describe("resolveForecastTargetTime", () => {
  const fixedNow = new Date("2026-07-26T12:00:00.000Z");

  it("uses the current time plus one hour for next_hour", () => {
    expect(resolveForecastTargetTime("next_hour", fixedNow).toISOString()).toBe(
      "2026-07-26T13:00:00.000Z",
    );
  });

  it("uses the current time plus one day for next_24_hours", () => {
    expect(resolveForecastTargetTime("next_24_hours", fixedNow).toISOString()).toBe(
      "2026-07-27T12:00:00.000Z",
    );
  });

  it("uses an explicitly provided ISO date when supplied", () => {
    expect(
      resolveForecastTargetTime("2026-07-27T08:30:00.000Z", fixedNow).toISOString(),
    ).toBe("2026-07-27T08:30:00.000Z");
  });

  it("falls back to the current time for unsupported values", () => {
    expect(resolveForecastTargetTime("custom-range", fixedNow).toISOString()).toBe(
      fixedNow.toISOString(),
    );
  });
});
