const Router = require("@koa/router").default;
const { AzureOpenAIError, generateAIDispatchBriefing } = require("./azure-openai");

const router = new Router();

router.post("/rest/ems/staging-briefing", async (context) => {
  try {
    const input = validateRequest(context.request.body);
    context.body = { briefing: await generateAIDispatchBriefing(input) };
  } catch (error) {
    context.status = error instanceof AzureOpenAIError ? error.status : 400;
    context.body = {
      error: error instanceof AzureOpenAIError
        ? error.message
        : "Invalid staging briefing request.",
    };
  }
});

function validateRequest(body) {
  if (!body || typeof body !== "object") throw new TypeError("Request body is required.");
  return {
    locationId: finiteNumber(body.locationId, "locationId"),
    predictedScore: finiteNumber(body.predictedScore, "predictedScore"),
    availableAmbulances: ambulanceCount(body.availableAmbulances),
    incidentBreakdown: boundedString(body.incidentBreakdown, "incidentBreakdown", 1_000),
    weatherSummary: boundedString(body.weatherSummary, "weatherSummary", 500),
    forecastStartISO: isoDate(body.forecastStartISO, "forecastStartISO"),
    forecastEndISO: isoDate(body.forecastEndISO, "forecastEndISO"),
  };
}

function ambulanceCount(value) {
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new TypeError("availableAmbulances must be a whole number between 1 and 100.");
  }
  return value;
}

function finiteNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${field} must be a finite number.`);
  }
  return value;
}

function boundedString(value, field, maxLength) {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > maxLength) {
    throw new TypeError(`${field} must be a non-empty string of at most ${maxLength} characters.`);
  }
  return value.trim();
}

function isoDate(value, field) {
  const text = boundedString(value, field, 50);
  if (Number.isNaN(Date.parse(text))) throw new TypeError(`${field} must be a valid ISO date.`);
  return text;
}

module.exports = { router, validateRequest };