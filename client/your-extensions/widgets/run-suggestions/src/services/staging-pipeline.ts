import Query from "@arcgis/core/rest/support/Query";
import { executeQueryJSON } from "@arcgis/core/rest/query";
import type Point from "@arcgis/core/geometry/Point";
import { generateAIDispatchBriefing, DEFAULT_BRIEFING_PROXY_URL } from "./dispatch-briefing-service";
import { normalizeTargetTime } from "./time";
import {
  StagingPipelineError,
  type HotspotResult,
  type StagingPipelineOptions,
  type StagingPipelineResult,
} from "./types";
import { getWeatherForInterval } from "./weather-service";

export const AGOL_LAYER_URL = "https://services.arcgis.com/REPLACE_WITH_ORG_ID/arcgis/rest/services/REPLACE_WITH_LAYER/FeatureServer/0";
export const INCIDENT_LAYER_URL = "https://services.arcgis.com/REPLACE_WITH_ORG_ID/arcgis/rest/services/REPLACE_WITH_INCIDENT_LAYER/FeatureServer/0";
export const DEFAULT_INCIDENT_TYPE_FIELD = "incident_type";
export const DEFAULT_INCIDENT_SEARCH_RADIUS_MILES = 1.5;
const INCIDENT_QUERY_LIMIT = 2_000;

const BASE_OUT_FIELDS = [
  "location_ID",
  "latitude",
  "longitude",
  "forecast_start",
  "forecast_end",
  "predicted_incident_count",
];

export async function runStagingPipeline(
  targetTimeISO: string,
  availableAmbulances: number,
  options: StagingPipelineOptions = {},
): Promise<StagingPipelineResult> {
  if (!Number.isInteger(availableAmbulances) || availableAmbulances < 1 || availableAmbulances > 100) {
    throw new StagingPipelineError(
      "INVALID_AVAILABILITY",
      "Available ambulances must be a whole number between 1 and 100.",
    );
  }

  const normalizedTime = normalizeTargetTime(targetTimeISO);
  const hotspot = await queryTopHotspot(
    options.agolLayerUrl ?? AGOL_LAYER_URL,
    normalizedTime.arcgisTimestamp,
  );
  const [incidentBreakdown, weatherSummary] = await Promise.all([
    queryNearbyIncidentBreakdown(
      options.incidentLayerUrl ?? INCIDENT_LAYER_URL,
      hotspot.lat,
      hotspot.lng,
      options.incidentTypeField ?? DEFAULT_INCIDENT_TYPE_FIELD,
      options.incidentSearchRadiusMiles ?? DEFAULT_INCIDENT_SEARCH_RADIUS_MILES,
    ),
    getWeatherForInterval(
      hotspot.lat,
      hotspot.lng,
      hotspot.forecastStartISO || normalizedTime.localStartISO,
    ),
  ]);
  const aiBriefing = await generateAIDispatchBriefing(
    {
      locationId: hotspot.locationId,
      predictedScore: hotspot.predictedScore,
      availableAmbulances,
      incidentBreakdown,
      weatherSummary,
      forecastStartISO: hotspot.forecastStartISO,
      forecastEndISO: hotspot.forecastEndISO,
    },
    options.briefingProxyUrl ?? DEFAULT_BRIEFING_PROXY_URL,
  );

  return {
    locationId: hotspot.locationId,
    lat: hotspot.lat,
    lng: hotspot.lng,
    predictedScore: hotspot.predictedScore,
    availableAmbulances,
    incidentBreakdown,
    weatherSummary,
    aiBriefing,
    geometry: hotspot.geometry,
  };
}

export async function queryTopHotspot(
  layerUrl: string,
  arcgisTimestamp: string,
): Promise<HotspotResult> {
  if (!layerUrl || layerUrl.includes("REPLACE_WITH_")) {
    throw new StagingPipelineError("INVALID_HOTSPOT", "Configure the AGOL hosted feature layer URL.");
  }

  const query = new Query({
    where: `forecast_start <= timestamp '${arcgisTimestamp}' AND forecast_end > timestamp '${arcgisTimestamp}'`,
    orderByFields: ["predicted_incident_count DESC"],
    outFields: BASE_OUT_FIELDS,
    num: 1,
    returnGeometry: true,
  });
  const featureSet = await executeQueryJSON(layerUrl, query);
  const feature = featureSet.features[0];
  if (!feature) {
    throw new StagingPipelineError("NO_HOTSPOT", "No predicted hotspot covers the selected time.");
  }

  const attributes = feature.attributes as Record<string, unknown>;
  const geometry = feature.geometry;
  const locationId = toFiniteNumber(attributes.location_ID);
  const predictedScore = toFiniteNumber(attributes.predicted_incident_count);
  const point = geometry?.type === "point" ? geometry as Point : undefined;
  const lat = toFiniteNumber(attributes.latitude) ?? point?.latitude ?? point?.y;
  const lng = toFiniteNumber(attributes.longitude) ?? point?.longitude ?? point?.x;
  if (locationId === undefined || predictedScore === undefined || lat === undefined || lng === undefined || !geometry) {
    throw new StagingPipelineError("INVALID_HOTSPOT", "The hotspot feature is missing required attributes or geometry.");
  }

  return {
    locationId,
    lat,
    lng,
    predictedScore,
    forecastStartISO: toDateISO(attributes.forecast_start),
    forecastEndISO: toDateISO(attributes.forecast_end),
    geometry,
  };
}

export async function queryNearbyIncidentBreakdown(
  layerUrl: string,
  lat: number,
  lng: number,
  incidentTypeField: string,
  radiusMiles: number,
): Promise<string> {
  if (!layerUrl || layerUrl.includes("REPLACE_WITH_") ||
      !/^[A-Za-z_][A-Za-z0-9_]*$/.test(incidentTypeField) ||
      !Number.isFinite(radiusMiles) || radiusMiles <= 0) {
    return "Not available";
  }

  try {
    const query = new Query({
      where: "1=1",
      geometry: {
        type: "point",
        x: lng,
        y: lat,
        spatialReference: { wkid: 4326 },
      },
      distance: radiusMiles,
      units: "miles",
      spatialRelationship: "intersects",
      outFields: [incidentTypeField],
      returnGeometry: false,
      num: INCIDENT_QUERY_LIMIT,
    });
    const featureSet = await executeQueryJSON(layerUrl, query);
    const counts = new Map<string, number>();
    featureSet.features.forEach((feature) => {
      const value = feature.attributes?.[incidentTypeField];
      if (typeof value !== "string" || value.trim().length === 0) return;
      const incidentType = value.trim();
      counts.set(incidentType, (counts.get(incidentType) ?? 0) + 1);
    });

    const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
    if (total === 0) return "Not available";

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([incidentType, count]) => `${incidentType} (${Math.round((count / total) * 100)}%)`)
      .join(", ");
  } catch {
    return "Not available";
  }
}

function toFiniteNumber(value: unknown): number | undefined {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function toDateISO(value: unknown): string {
  const date = typeof value === "number" || typeof value === "string" ? new Date(value) : undefined;
  if (!date || Number.isNaN(date.getTime())) {
    throw new StagingPipelineError("INVALID_HOTSPOT", "The hotspot feature has an invalid forecast interval.");
  }
  return date.toISOString();
}