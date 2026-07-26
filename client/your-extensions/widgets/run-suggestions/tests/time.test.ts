import { normalizeTargetTime } from "../src/services/time";

describe("normalizeTargetTime", () => {
  it("interprets a summer local time in Redlands using PDT", () => {
    const result = normalizeTargetTime("2026-07-25T08:00");

    expect(result.arcgisTimestamp).toBe("2026-07-25 15:00:00");
    expect(result.localStartISO).toContain("2026-07-25T08:00:00-07:00");
    expect(result.localEndISO).toContain("2026-07-25T16:00:00-07:00");
  });

  it("interprets a winter local time in Redlands using PST", () => {
    const result = normalizeTargetTime("2026-01-25T08:00");

    expect(result.arcgisTimestamp).toBe("2026-01-25 16:00:00");
  });

  it("rejects a nonexistent local time during the spring DST gap", () => {
    expect(() => normalizeTargetTime("2026-03-08T02:30")).toThrow("Invalid target time");
  });
});