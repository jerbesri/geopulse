/* eslint-disable semi */
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import Point from "@arcgis/core/geometry/Point";

interface PipelineConfig {
  featureLayerUrl: string;
  historicalLayerUrl: string;
  historicalLookbackDays: string;
  historicalProximityMeters: string;
  azureEndpoint: string;
  azureDeploymentName: string;
  azureApiKey: string;
  aiBriefingProxyUrl: string;
  forecastWindow: string;
}

interface IncidentTypeBreakdown {
  [key: string]: number;
}

interface AttributeMap {
  [key: string]: unknown;
}

interface QueryFeatureData {
  locationId: number;
  lat: number;
  lng: number;
  predictedScore: number;
  forecastPeakInterval: string;
  historicalPattern: string;
  recentIncidentCount30d: number;
  recentIncidentTypes: IncidentTypeBreakdown;
  geometry: any;
}

export interface StagingCandidate {
  locationId: number;
  lat: number;
  lng: number;
  predictedScore: number;
}

interface AzureDispatchPayload {
  location_id: number;
  latitude: number;
  longitude: number;
  forecast_window: string;
  forecast_total: number;
  forecast_peak_interval: string;
  recent_incident_count_30d: number;
  recent_incident_types: IncidentTypeBreakdown;
  historical_pattern: string;
  historical_incident_summary: string;
  historical_incident_totals: IncidentTypeBreakdown;
  historical_match_count: number;
  historical_lookup_mode: string;
  rank_citywide: number;
  weather_summary: string;
}

export interface StagingPipelineResult {
  locationId: number;
  lat: number;
  lng: number;
  predictedScore: number;
  weatherSummary: string;
  historicalIncidentSummary: string;
  historicalIncidentTotals: IncidentTypeBreakdown;
  historicalMatchCount: number;
  historicalLookupMode: string;
  aiBriefing: string;
  geometry: any;
}

interface HistoricalIncidentSummary {
  summary: string;
  totals: IncidentTypeBreakdown;
  matchCount: number;
  lookupMode: string;
}

let pipelineConfig: PipelineConfig = {
  featureLayerUrl: "",
  historicalLayerUrl: "",
  historicalLookbackDays: "30",
  historicalProximityMeters: "500",
  azureEndpoint: "",
  azureDeploymentName: "",
  azureApiKey: "",
  aiBriefingProxyUrl: "",
  forecastWindow: "next_24_hours",
};

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error object";
  }
};

export const setPipelineConfig = (config: Partial<PipelineConfig>) => {
  pipelineConfig = {
    ...pipelineConfig,
    ...config,
  };
};

const formatArcGISTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const sec = String(date.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};

const getAttributeValue = (
  attributes: AttributeMap,
  candidates: string[],
): unknown => {
  for (const candidate of candidates) {
    if (candidate in attributes) {
      return attributes[candidate];
    }

    const foundKey = Object.keys(attributes).find(
      (key) => key.toLowerCase() === candidate.toLowerCase(),
    );
    if (foundKey) {
      return attributes[foundKey];
    }
  }

  return undefined;
};

const parsePositiveNumber = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const findFieldName = (
  fields: Array<{ name: string; alias?: string }>,
  candidates: string[],
): string | undefined => {
  const normalizedCandidates = candidates.map((candidate) =>
    candidate.toLowerCase(),
  );

  const matched = fields.find((field) => {
    const normalizedName = field.name.toLowerCase();
    const normalizedAlias = (field.alias ?? "").toLowerCase();
    return (
      normalizedCandidates.includes(normalizedName) ||
      normalizedCandidates.includes(normalizedAlias)
    );
  });

  return matched?.name;
};

const summarizeHistoricalTotals = (totals: IncidentTypeBreakdown): string => {
  const ranked = Object.entries(totals)
    .filter(([, count]) => Number.isFinite(count) && count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (ranked.length === 0) {
    return "No historical incidents found in nearby area for the lookback window.";
  }

  const topThree = ranked.slice(0, 3).map(([name, count]) => {
    const readable = name.replace(/_/g, " ").toLowerCase();
    return `${readable}: ${Math.round(count)}`;
  });

  return `Common nearby historical incidents: ${topThree.join(", ")}.`;
};

const queryHistoricalIncidentSummary = async (
  lat: number,
  lng: number,
  targetTimeISO: string,
): Promise<HistoricalIncidentSummary> => {
  if (!pipelineConfig.historicalLayerUrl.trim()) {
    return {
      summary: "Historical layer not configured.",
      totals: {},
      matchCount: 0,
      lookupMode: "disabled",
    };
  }

  const layer = new FeatureLayer({
    url: pipelineConfig.historicalLayerUrl,
  });

  try {
    await layer.load();
  } catch (error) {
    throw new Error(
      `[Historical Query] Failed loading historical layer metadata (${pipelineConfig.historicalLayerUrl}): ${toErrorMessage(error)}`,
    );
  }

  const lookbackDays = parsePositiveNumber(
    pipelineConfig.historicalLookbackDays,
    30,
  );
  const proximityMeters = parsePositiveNumber(
    pipelineConfig.historicalProximityMeters,
    500,
  );

  const fields = (layer.fields ?? []).map((field) => ({
    name: field.name,
    alias: field.alias,
  }));

  const alarmDateField = findFieldName(fields, [
    "Alarm Date and Time",
    "AlarmDateandTime",
    "alarm_date_time",
    "alarm_datetime",
    "alarm_date_and_time",
  ]);
  const emsField = findFieldName(fields, [
    "EMS Rescue Incident Count",
    "ems_rescue_incident_count",
    "ems_rescue_count",
  ]);
  const fireField = findFieldName(fields, [
    "Fire Incident Count",
    "fire_incident_count",
    "fire_count",
  ]);
  const hazardsField = findFieldName(fields, [
    "Hazards Accidents Incident Count",
    "hazards_accidents_incident_count",
    "hazards_accidents_count",
  ]);
  const serviceFalseAlarmField = findFieldName(fields, [
    "Service FalseAlarm Incident Count",
    "service_falsealarm_incident_count",
    "service_false_alarm_count",
  ]);
  const totalField = findFieldName(fields, [
    "Total_Count",
    "total_count",
    "Total Count",
  ]);

  const dateEnd = new Date(targetTimeISO);
  const dateStart = new Date(dateEnd);
  dateStart.setUTCDate(dateEnd.getUTCDate() - lookbackDays);

  const whereClauses = ["1=1"];
  if (alarmDateField) {
    const startTimestamp = formatArcGISTimestamp(dateStart.toISOString());
    const endTimestamp = formatArcGISTimestamp(dateEnd.toISOString());
    whereClauses.push(
      `${alarmDateField} >= timestamp '${startTimestamp}' AND ${alarmDateField} <= timestamp '${endTimestamp}'`,
    );
  }

  const outFields = [
    emsField,
    fireField,
    hazardsField,
    serviceFalseAlarmField,
    totalField,
  ].filter(Boolean) as string[];

  const centerPoint = new Point({
    longitude: lng,
    latitude: lat,
    spatialReference: { wkid: 4326 },
  });

  const intersectsQuery = new Query({
    where: whereClauses.join(" AND "),
    geometry: centerPoint,
    spatialRelationship: "intersects",
    outFields: outFields.length > 0 ? outFields : ["*"],
    returnGeometry: false,
    num: 200,
  });

  let featureSet;
  let lookupMode = "intersects";
  try {
    featureSet = await layer.queryFeatures(intersectsQuery);
  } catch (error) {
    throw new Error(
      `[Historical Query] Intersects query failed: ${toErrorMessage(error)}`,
    );
  }

  if (!featureSet.features?.length) {
    const proximityQuery = new Query({
      where: whereClauses.join(" AND "),
      geometry: centerPoint,
      spatialRelationship: "intersects",
      distance: proximityMeters,
      units: "meters",
      outFields: outFields.length > 0 ? outFields : ["*"],
      returnGeometry: false,
      num: 200,
    });

    try {
      featureSet = await layer.queryFeatures(proximityQuery);
      lookupMode = `proximity_${Math.round(proximityMeters)}m`;
    } catch (error) {
      throw new Error(
        `[Historical Query] Proximity query failed: ${toErrorMessage(error)}`,
      );
    }
  }

  const totals: IncidentTypeBreakdown = {
    EMS_RESCUE: 0,
    FIRE: 0,
    HAZARDS_ACCIDENTS: 0,
    SERVICE_FALSE_ALARM: 0,
    TOTAL: 0,
  };

  const features = featureSet.features ?? [];
  features.forEach((feature) => {
    const attrs = (feature.attributes ?? {}) as AttributeMap;
    totals.EMS_RESCUE += Number(emsField ? attrs[emsField] : 0) || 0;
    totals.FIRE += Number(fireField ? attrs[fireField] : 0) || 0;
    totals.HAZARDS_ACCIDENTS +=
      Number(hazardsField ? attrs[hazardsField] : 0) || 0;
    totals.SERVICE_FALSE_ALARM +=
      Number(serviceFalseAlarmField ? attrs[serviceFalseAlarmField] : 0) || 0;
    totals.TOTAL += Number(totalField ? attrs[totalField] : 0) || 0;
  });

  return {
    summary: summarizeHistoricalTotals(totals),
    totals,
    matchCount: features.length,
    lookupMode,
  };
};

const parseIncidentTypes = (
  rawIncidentTypes: unknown,
): IncidentTypeBreakdown => {
  if (rawIncidentTypes && typeof rawIncidentTypes === "object") {
    return rawIncidentTypes as IncidentTypeBreakdown;
  }

  if (typeof rawIncidentTypes !== "string" || rawIncidentTypes.trim() === "") {
    return {
      MEDICAL: 0,
      TRAFFIC: 0,
      FIRE: 0,
      OTHER: 0,
    };
  }

  try {
    const parsed = JSON.parse(rawIncidentTypes) as IncidentTypeBreakdown;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Fall through to string parsing.
  }

  const parsedFromLabel: IncidentTypeBreakdown = {};
  const tokens = rawIncidentTypes.split(",").map((token) => token.trim());

  tokens.forEach((token) => {
    const [label, percentageRaw] = token.split("(");
    if (!label || !percentageRaw) return;

    const percentageNumber = Number(percentageRaw.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(percentageNumber)) return;

    const normalizedLabel = label.trim().toUpperCase();
    parsedFromLabel[normalizedLabel] = percentageNumber;
  });

  return Object.keys(parsedFromLabel).length > 0
    ? parsedFromLabel
    : {
        MEDICAL: 0,
        TRAFFIC: 0,
        FIRE: 0,
        OTHER: 0,
      };
};

const clampToTwoSentences = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) {
    return "Stage one ALS unit near the identified hotspot to reduce response time. Position one BLS backup on a nearby arterial route to preserve coverage in adjacent zones.";
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length >= 2) {
    return `${sentences[0]} ${sentences[1]}`;
  }

  return `${sentences[0]} Position a secondary unit on a nearby high-access corridor to preserve area coverage and reduce spillover risk.`;
};

const resolveProxyUrl = (rawProxyUrl: string): string => {
  const trimmed = rawProxyUrl.trim();
  const routePath = "/rest/ai-briefing-proxy";

  if (!trimmed) {
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      return `https://localhost:3001${routePath}`;
    }
    return `http://localhost:3000${routePath}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      return `https://localhost:3001${trimmed}`;
    }
    return `http://localhost:3000${trimmed}`;
  }

  return trimmed;
};

const mapForecastFeatureToData = (
  feature: any,
  targetTimeISO: string,
): QueryFeatureData => {
  const attributes = (feature.attributes ?? {}) as AttributeMap;
  const locationIdRaw = getAttributeValue(attributes, [
    "location_ID",
    "location_id",
    "locationid",
  ]);
  const predictedScoreRaw = getAttributeValue(attributes, [
    "predicted_incident_count",
    "prediction",
    "predicted_count",
  ]);
  const latitudeRaw = getAttributeValue(attributes, ["latitude", "lat"]);
  const longitudeRaw = getAttributeValue(attributes, [
    "longitude",
    "lng",
    "lon",
  ]);
  const forecastStartRaw = getAttributeValue(attributes, ["forecast_start"]);
  const historicalPatternRaw = getAttributeValue(attributes, [
    "historical_pattern",
    "historicalPattern",
  ]);
  const recentIncidentCountRaw = getAttributeValue(attributes, [
    "recent_incident_count_30d",
    "recentIncidentCount30d",
  ]);
  const incidentTypesRaw =
    getAttributeValue(attributes, ["recent_incident_types"]) ??
    getAttributeValue(attributes, ["incident_types"]) ??
    getAttributeValue(attributes, ["joined_incident_types"]);

  const locationId = Number(locationIdRaw ?? -1);
  const predictedScore = Number(predictedScoreRaw ?? 0);

  const geometry = feature.geometry as unknown;
  const geometryLatitude =
    geometry && typeof geometry === "object" && "latitude" in geometry
      ? Number((geometry as { latitude: number }).latitude)
      : 0;
  const geometryLongitude =
    geometry && typeof geometry === "object" && "longitude" in geometry
      ? Number((geometry as { longitude: number }).longitude)
      : 0;

  const lat = Number(latitudeRaw ?? geometryLatitude ?? 0);
  const lng = Number(longitudeRaw ?? geometryLongitude ?? 0);

  const forecastPeakIntervalDate =
    forecastStartRaw instanceof Date
      ? forecastStartRaw
      : new Date(
          (forecastStartRaw as string | number | undefined) ?? targetTimeISO,
        );

  const historicalPattern =
    typeof historicalPatternRaw === "string" ||
    typeof historicalPatternRaw === "number"
      ? String(historicalPatternRaw)
      : "recurring demand";

  return {
    locationId,
    lat,
    lng,
    predictedScore,
    forecastPeakInterval: forecastPeakIntervalDate.toISOString(),
    historicalPattern,
    recentIncidentCount30d: Number(recentIncidentCountRaw ?? 0),
    recentIncidentTypes: parseIncidentTypes(incidentTypesRaw),
    geometry: feature.geometry,
  };
};

const queryTopForecastFeatures = async (
  targetTimeISO: string,
  limit: number,
): Promise<QueryFeatureData[]> => {
  if (!pipelineConfig.featureLayerUrl.trim()) {
    throw new Error("Feature layer URL is required in widget settings.");
  }

  const layer = new FeatureLayer({
    url: pipelineConfig.featureLayerUrl,
  });

  try {
    await layer.load();
  } catch (error) {
    throw new Error(
      `[Layer Query] Failed loading layer metadata (${pipelineConfig.featureLayerUrl}): ${toErrorMessage(error)}`,
    );
  }

  const requestedFields = [
    "location_ID",
    "latitude",
    "longitude",
    "predicted_incident_count",
    "forecast_start",
    "forecast_end",
    "historical_pattern",
    "recent_incident_count_30d",
    "recent_incident_types",
    "incident_types",
    "joined_incident_types",
  ];

  const layerFieldSet = new Set(
    (layer.fields ?? []).map((field) => field.name.toLowerCase()),
  );

  const supportedOutFields = requestedFields.filter((fieldName) =>
    layerFieldSet.has(fieldName.toLowerCase()),
  );

  const timestamp = formatArcGISTimestamp(targetTimeISO);
  const query = new Query({
    where: `forecast_start <= timestamp '${timestamp}' AND forecast_end > timestamp '${timestamp}'`,
    outFields: supportedOutFields.length > 0 ? supportedOutFields : ["*"],
    orderByFields: ["predicted_incident_count DESC"],
    num: Math.max(1, limit),
    returnGeometry: true,
  });

  let featureSet;
  try {
    featureSet = await layer.queryFeatures(query);
  } catch (error) {
    throw new Error(
      `[Layer Query] Failed querying forecast layer (${pipelineConfig.featureLayerUrl}): ${toErrorMessage(error)}`,
    );
  }

  const features = featureSet.features ?? [];
  if (features.length === 0) {
    throw new Error("No forecast features found for the requested interval.");
  }

  return features.map((feature) =>
    mapForecastFeatureToData(feature, targetTimeISO),
  );
};

const queryTopForecastFeature = async (
  targetTimeISO: string,
): Promise<QueryFeatureData> => {
  const features = await queryTopForecastFeatures(targetTimeISO, 1);
  return features[0];
};

export const getTopStagingCandidates = async (
  targetTimeISO: string,
  limit = 3,
): Promise<StagingCandidate[]> => {
  const features = await queryTopForecastFeatures(targetTimeISO, limit);
  return features.slice(0, Math.max(1, limit)).map((feature) => ({
    locationId: feature.locationId,
    lat: feature.lat,
    lng: feature.lng,
    predictedScore: feature.predictedScore,
  }));
};

export const getWeatherForInterval = async (
  lat: number,
  lng: number,
  dateISO: string,
): Promise<string> => {
  try {
    const date = new Date(dateISO);
    const day = date.toISOString().slice(0, 10);
    const targetHour = date.toISOString().slice(0, 13);

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(lat));
    weatherUrl.searchParams.set("longitude", String(lng));
    weatherUrl.searchParams.set("hourly", "temperature_2m,precipitation");
    weatherUrl.searchParams.set("start_date", day);
    weatherUrl.searchParams.set("end_date", day);
    weatherUrl.searchParams.set("timezone", "UTC");

    const response = await fetch(weatherUrl.toString());
    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const weatherJson = (await response.json()) as {
      hourly?: {
        time?: string[];
        temperature_2m?: number[];
        precipitation?: number[];
      };
    };

    const hourly = weatherJson.hourly;
    const times = hourly?.time ?? [];
    const temperaturesC = hourly?.temperature_2m ?? [];
    const precipMM = hourly?.precipitation ?? [];

    if (
      times.length === 0 ||
      temperaturesC.length === 0 ||
      precipMM.length === 0
    ) {
      throw new Error("Weather response missing expected hourly arrays.");
    }

    const matchingHourIndex = times.findIndex((hourIso) =>
      hourIso.startsWith(targetHour),
    );

    const selectedIndex = matchingHourIndex >= 0 ? matchingHourIndex : 0;
    const selectedTempC = temperaturesC[selectedIndex] ?? temperaturesC[0] ?? 0;
    const maxTempC = Math.max(...temperaturesC);
    const selectedPrecipMM = precipMM[selectedIndex] ?? precipMM[0] ?? 0;

    const selectedTempF = (selectedTempC * 9) / 5 + 32;
    const maxTempF = (maxTempC * 9) / 5 + 32;
    const precipInches = selectedPrecipMM / 25.4;

    let heatLabel = "NORMAL";
    if (maxTempF >= 100) {
      heatLabel = "EXTREME HEAT";
    } else if (maxTempF >= 90) {
      heatLabel = "HIGH HEAT";
    } else if (maxTempF <= 40) {
      heatLabel = "COLD";
    }

    return `Temp: ${Math.round(selectedTempF)}F (Max ${Math.round(maxTempF)}F, ${heatLabel}), Precip: ${precipInches.toFixed(2)} in`;
  } catch {
    return "Weather unavailable; assume standard operating conditions.";
  }
};

export const generateAIDispatchBriefing = async (
  payload: AzureDispatchPayload,
): Promise<string> => {
  const proxyUrl = resolveProxyUrl(pipelineConfig.aiBriefingProxyUrl);

  if (proxyUrl) {
    let proxyResponse: Response;
    try {
      proxyResponse = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload,
          azureEndpoint: pipelineConfig.azureEndpoint,
          azureDeploymentName: pipelineConfig.azureDeploymentName,
          azureApiKey: pipelineConfig.azureApiKey,
        }),
      });
    } catch (error) {
      throw new Error(
        `[AI Proxy] Request to ${proxyUrl} failed: ${toErrorMessage(error)}`,
      );
    }

    const proxyBody = await proxyResponse.text();
    if (!proxyResponse.ok) {
      throw new Error(
        `[AI Proxy] Request failed with status ${proxyResponse.status}. Body: ${proxyBody}`,
      );
    }

    try {
      const proxyJson = JSON.parse(proxyBody) as {
        aiBriefing?: string;
        briefing?: string;
        text?: string;
      };
      const candidateText =
        proxyJson.aiBriefing ?? proxyJson.briefing ?? proxyJson.text ?? "";
      return clampToTwoSentences(candidateText);
    } catch {
      return clampToTwoSentences(proxyBody);
    }
  }

  if (
    !pipelineConfig.azureEndpoint.trim() ||
    !pipelineConfig.azureDeploymentName.trim() ||
    !pipelineConfig.azureApiKey.trim()
  ) {
    return "Stage one ALS unit at the forecast hotspot and keep one BLS unit along a nearby arterial corridor for overflow coverage. Prepare crews for expected conditions and maintain rapid relocation flexibility as call density changes through the interval.";
  }

  const endpointRoot = pipelineConfig.azureEndpoint.replace(/\/+$/, "");
  const endpoint = `${endpointRoot}/openai/deployments/${pipelineConfig.azureDeploymentName}/chat/completions?api-version=2024-02-01`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": pipelineConfig.azureApiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are EMS Tactical Dispatch AI. Analyze hotspot risk, incident patterns, and weather. Output exactly 2 actionable sentences for ambulance staging decisions including ALS/BLS posture and operational preparation guidance.",
          },
          {
            role: "user",
            content: `Create a concise staging briefing from this JSON: ${JSON.stringify(payload)}`,
          },
        ],
        temperature: 0.2,
        max_completion_tokens: 180,
      }),
    });
  } catch (error) {
    throw new Error(
      `[Azure OpenAI] Browser request blocked or failed. This is commonly CORS on direct client calls. Configure AI Briefing Proxy URL in widget settings and route through your backend. Original error: ${toErrorMessage(error)}`,
    );
  }

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `[Azure OpenAI] Request failed with status ${response.status}. Body: ${responseBody}`,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const text = data.choices?.[0]?.message?.content ?? "";
  return clampToTwoSentences(text);
};

const buildStagingPipelineResult = async (
  feature: QueryFeatureData,
  targetTimeISO: string,
  rankCitywide: number,
): Promise<StagingPipelineResult> => {
  let weatherSummary;
  try {
    weatherSummary = await getWeatherForInterval(
      feature.lat,
      feature.lng,
      targetTimeISO,
    );
  } catch (error) {
    throw new Error(`[Pipeline] Weather step failed: ${toErrorMessage(error)}`);
  }

  let historicalIncidentSummary: HistoricalIncidentSummary;
  try {
    historicalIncidentSummary = await queryHistoricalIncidentSummary(
      feature.lat,
      feature.lng,
      targetTimeISO,
    );
  } catch (error) {
    historicalIncidentSummary = {
      summary: `Historical query failed: ${toErrorMessage(error)}`,
      totals: {},
      matchCount: 0,
      lookupMode: "error",
    };
  }

  const azurePayload: AzureDispatchPayload = {
    location_id: feature.locationId,
    latitude: feature.lat,
    longitude: feature.lng,
    forecast_window: pipelineConfig.forecastWindow || "next_24_hours",
    forecast_total: feature.predictedScore,
    forecast_peak_interval: feature.forecastPeakInterval,
    recent_incident_count_30d: feature.recentIncidentCount30d,
    recent_incident_types: feature.recentIncidentTypes,
    historical_pattern: feature.historicalPattern,
    historical_incident_summary: historicalIncidentSummary.summary,
    historical_incident_totals: historicalIncidentSummary.totals,
    historical_match_count: historicalIncidentSummary.matchCount,
    historical_lookup_mode: historicalIncidentSummary.lookupMode,
    rank_citywide: rankCitywide,
    weather_summary: weatherSummary,
  };

  let aiBriefing;
  try {
    aiBriefing = await generateAIDispatchBriefing(azurePayload);
  } catch (error) {
    throw new Error(
      `[Pipeline] AI briefing step failed: ${toErrorMessage(error)}`,
    );
  }

  return {
    locationId: feature.locationId,
    lat: feature.lat,
    lng: feature.lng,
    predictedScore: feature.predictedScore,
    weatherSummary,
    historicalIncidentSummary: historicalIncidentSummary.summary,
    historicalIncidentTotals: historicalIncidentSummary.totals,
    historicalMatchCount: historicalIncidentSummary.matchCount,
    historicalLookupMode: historicalIncidentSummary.lookupMode,
    aiBriefing,
    geometry: feature.geometry,
  };
};

export const runStagingPipelineForCandidate = async (
  targetTimeISO: string,
  candidateIndex: number,
): Promise<StagingPipelineResult> => {
  let features;
  try {
    features = await queryTopForecastFeatures(
      targetTimeISO,
      Math.max(1, candidateIndex + 1),
    );
  } catch (error) {
    throw new Error(`[Pipeline] Query step failed: ${toErrorMessage(error)}`);
  }

  const selectedFeature = features[candidateIndex];
  if (!selectedFeature) {
    throw new Error(
      `No forecast feature found for candidate index ${candidateIndex}.`,
    );
  }

  return buildStagingPipelineResult(
    selectedFeature,
    targetTimeISO,
    candidateIndex + 1,
  );
};

export const runStagingPipeline = async (
  targetTimeISO: string,
): Promise<StagingPipelineResult> => {
  return runStagingPipelineForCandidate(targetTimeISO, 0);
};
