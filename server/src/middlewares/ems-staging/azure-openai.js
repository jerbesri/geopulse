const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY || "";
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";
const CHAT_COMPLETIONS_URL = process.env.AZURE_OPENAI_CHAT_COMPLETIONS_URL || "";

const API_VERSION = "2024-02-01";
const REQUEST_TIMEOUT_MS = 25_000;

async function generateAIDispatchBriefing(input) {
  assertConfiguration();
  const messages = [
    {
      role: "system",
      content: "You are an EMS Tactical Dispatch AI. Return exactly two actionable sentences for a dispatcher. State where and how to stage ambulances, including ALS versus BLS posture when supported by the data, and account for heat preparation or traffic-collision positioning when relevant. Do not invent street names, resources, incident types, or operational facts that were not provided.",
    },
    {
      role: "user",
      content: [
        `Location ID: ${input.locationId}`,
        `Predicted incident score: ${input.predictedScore}`,
        `Available ambulances: ${input.availableAmbulances}`,
        `Historical incident breakdown: ${input.incidentBreakdown}`,
        `Weather: ${input.weatherSummary}`,
        `Forecast interval: ${input.forecastStartISO} through ${input.forecastEndISO}`,
      ].join("\n"),
    },
  ];

  let briefing = await requestCompletion(messages);
  if (!hasExactlyTwoSentences(briefing)) {
    briefing = await requestCompletion([
      ...messages,
      { role: "assistant", content: briefing },
      { role: "user", content: "Rewrite the recommendation as exactly two complete, actionable sentences and return no other text." },
    ]);
  }
  if (!hasExactlyTwoSentences(briefing)) {
    throw new AzureOpenAIError("Azure OpenAI did not return exactly two sentences.", 502);
  }
  return briefing.trim();
}

async function requestCompletion(messages) {
  const url = getChatCompletionsUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": AZURE_OPENAI_KEY },
      body: JSON.stringify({ messages, temperature: 0.2, max_tokens: 220 }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new AzureOpenAIError(`Azure OpenAI returned status ${response.status}.`, 502);
    }
    const payload = await response.json();
    const content = payload && payload.choices && payload.choices[0] &&
      payload.choices[0].message && payload.choices[0].message.content;
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new AzureOpenAIError("Azure OpenAI returned an invalid response.", 502);
    }
    return content.trim();
  } catch (error) {
    if (error instanceof AzureOpenAIError) throw error;
    const message = error && error.name === "AbortError"
      ? "Azure OpenAI request timed out."
      : "Azure OpenAI request failed.";
    throw new AzureOpenAIError(message, 502);
  } finally {
    clearTimeout(timeout);
  }
}

function hasExactlyTwoSentences(value) {
  if (typeof value !== "string") return false;
  const matches = value.trim().match(/[^.!?]+[.!?]+(?:["')\]]+)?(?=\s|$)/g);
  return Boolean(matches && matches.length === 2);
}

function assertConfiguration() {
  const hasStandardEndpoint = AZURE_OPENAI_ENDPOINT && DEPLOYMENT_NAME;
  if (!AZURE_OPENAI_KEY || (!CHAT_COMPLETIONS_URL && !hasStandardEndpoint)) {
    throw new AzureOpenAIError("Azure OpenAI is not configured on the server.", 503);
  }
}

function getChatCompletionsUrl() {
  if (CHAT_COMPLETIONS_URL) return CHAT_COMPLETIONS_URL;
  const endpoint = AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
  const deployment = encodeURIComponent(DEPLOYMENT_NAME);
  return `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${API_VERSION}`;
}

class AzureOpenAIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AzureOpenAIError";
    this.status = status;
  }
}

module.exports = {
  AzureOpenAIError,
  generateAIDispatchBriefing,
  getChatCompletionsUrl,
  hasExactlyTwoSentences,
};