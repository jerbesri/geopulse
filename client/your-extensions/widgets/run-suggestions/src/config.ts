import type { ImmutableObject } from "seamless-immutable";

export interface Config {
  featureLayerUrl: string;
  azureEndpoint: string;
  azureDeploymentName: string;
  azureApiKey: string;
  aiBriefingProxyUrl: string;
  forecastWindow: string;
}

export type IMConfig = ImmutableObject<Config>;
