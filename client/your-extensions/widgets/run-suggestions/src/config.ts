/* eslint-disable semi */
import type { ImmutableObject } from "seamless-immutable";

export interface Config {
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

export type IMConfig = ImmutableObject<Config>;
