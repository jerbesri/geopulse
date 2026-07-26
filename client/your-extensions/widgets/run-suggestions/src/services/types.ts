import type Geometry from "@arcgis/core/geometry/Geometry";

export interface StagingPipelineResult {
  locationId: number;
  lat: number;
  lng: number;
  predictedScore: number;
  availableAmbulances: number;
  incidentBreakdown: string;
  weatherSummary: string;
  aiBriefing: string;
  geometry: Geometry;
}

export interface HotspotResult {
  locationId: number;
  lat: number;
  lng: number;
  predictedScore: number;
  incidentBreakdown?: string;
  forecastStartISO: string;
  forecastEndISO: string;
  geometry: Geometry;
}

export interface DispatchBriefingRequest {
  locationId: number;
  predictedScore: number;
  availableAmbulances: number;
  incidentBreakdown: string;
  weatherSummary: string;
  forecastStartISO: string;
  forecastEndISO: string;
}

export interface DispatchBriefingResponse {
  briefing: string;
}

export interface OpenMeteoHourlyResponse {
  hourly?: {
    time?: string[];
    temperature_2m?: Array<number | null>;
    precipitation?: Array<number | null>;
  };
}

export interface NormalizedTargetTime {
  instantISO: string;
  arcgisTimestamp: string;
  localStartISO: string;
  localEndISO: string;
}

export interface StagingPipelineOptions {
  agolLayerUrl?: string;
  incidentLayerUrl?: string;
  incidentTypeField?: string;
  incidentSearchRadiusMiles?: number;
  briefingProxyUrl?: string;
}

export class StagingPipelineError extends Error {
  constructor(
    public readonly code: "INVALID_TIME" | "INVALID_AVAILABILITY" | "NO_HOTSPOT" | "INVALID_HOTSPOT" | "BRIEFING_FAILED",
    message: string,
  ) {
    super(message);
    this.name = "StagingPipelineError";
  }
}