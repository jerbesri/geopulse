import type { ImmutableObject } from "seamless-immutable";

export interface Config {
  agolLayerUrl: string;
  incidentLayerUrl: string;
  incidentTypeField: string;
  incidentSearchRadiusMiles: number;
  briefingProxyUrl: string;
}

export type IMConfig = ImmutableObject<Config>;
