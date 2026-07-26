import {
  StagingPipelineError,
  type DispatchBriefingRequest,
  type DispatchBriefingResponse,
} from "./types";

export const DEFAULT_BRIEFING_PROXY_URL = "/rest/ems/staging-briefing";
const REQUEST_TIMEOUT_MS = 20_000;

export async function generateAIDispatchBriefing(
  request: DispatchBriefingRequest,
  proxyUrl = DEFAULT_BRIEFING_PROXY_URL,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Briefing service returned ${response.status}`);
    }

    const payload = (await response.json()) as Partial<DispatchBriefingResponse>;
    if (typeof payload.briefing !== "string" || payload.briefing.trim().length === 0) {
      throw new Error("Briefing service returned an invalid response");
    }

    return payload.briefing.trim();
  } catch (error) {
    const reason = error instanceof DOMException && error.name === "AbortError"
      ? "The briefing request timed out."
      : "The tactical briefing could not be generated.";
    throw new StagingPipelineError("BRIEFING_FAILED", reason);
  } finally {
    clearTimeout(timeout);
  }
}