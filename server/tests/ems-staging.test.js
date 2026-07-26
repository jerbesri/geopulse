const test = require("node:test");
const assert = require("node:assert/strict");
const { hasExactlyTwoSentences } = require("../src/middlewares/ems-staging/azure-openai");
const { validateRequest } = require("../src/middlewares/ems-staging");

test("accepts exactly two briefing sentences", () => {
  assert.equal(
    hasExactlyTwoSentences("Stage one ALS unit at the hotspot centroid. Keep the second unit ready for traffic access."),
    true,
  );
  assert.equal(hasExactlyTwoSentences("Stage one ALS unit at the hotspot centroid."), false);
});

test("validates a complete staging briefing request", () => {
  const request = validateRequest({
    locationId: 12,
    predictedScore: 4.7,
    availableAmbulances: 2,
    incidentBreakdown: "Cardiac (60%), Traffic Collision (40%)",
    weatherSummary: "Max Temp: 95.0°F, Precip: 0.00 in",
    forecastStartISO: "2026-07-25T15:00:00Z",
    forecastEndISO: "2026-07-25T23:00:00Z",
  });

  assert.equal(request.availableAmbulances, 2);
  assert.equal(request.locationId, 12);
});

test("rejects an invalid ambulance count", () => {
  assert.throws(() => validateRequest({
    locationId: 12,
    predictedScore: 4.7,
    availableAmbulances: 0,
    incidentBreakdown: "Not available",
    weatherSummary: "Not available",
    forecastStartISO: "2026-07-25T15:00:00Z",
    forecastEndISO: "2026-07-25T23:00:00Z",
  }), /availableAmbulances/);
});