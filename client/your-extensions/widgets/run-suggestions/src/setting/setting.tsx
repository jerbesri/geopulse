/* eslint-disable semi */
import type { AllWidgetSettingProps } from "jimu-for-builder";
import { TextInput } from "jimu-ui";
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import type { Config, IMConfig } from "../config";

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds,
    });
  };

  const onConfigChange = (key: keyof Config, value: string) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set(key, value),
    });
  };

  return (
    <div className="p-2">
      <SettingSection title="Pipeline">
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Feature Layer URL</p>
            <TextInput
              value={props.config?.featureLayerUrl ?? ""}
              onChange={(event) => {
                onConfigChange("featureLayerUrl", event.target.value);
              }}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Historical Layer URL (Redlands_Hexagons_28)</p>
            <TextInput
              value={props.config?.historicalLayerUrl ?? ""}
              onChange={(event) => {
                onConfigChange("historicalLayerUrl", event.target.value);
              }}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Historical Lookback Days</p>
            <TextInput
              value={props.config?.historicalLookbackDays ?? "30"}
              onChange={(event) => {
                onConfigChange("historicalLookbackDays", event.target.value);
              }}
              placeholder="30"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Historical Proximity Radius (meters)</p>
            <TextInput
              value={props.config?.historicalProximityMeters ?? "500"}
              onChange={(event) => {
                onConfigChange("historicalProximityMeters", event.target.value);
              }}
              placeholder="500"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Azure Endpoint</p>
            <TextInput
              value={props.config?.azureEndpoint ?? ""}
              onChange={(event) => {
                onConfigChange("azureEndpoint", event.target.value);
              }}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Azure Deployment Name</p>
            <TextInput
              value={props.config?.azureDeploymentName ?? ""}
              onChange={(event) => {
                onConfigChange("azureDeploymentName", event.target.value);
              }}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Azure API Key</p>
            <TextInput
              type="password"
              value={props.config?.azureApiKey ?? ""}
              onChange={(event) => {
                onConfigChange("azureApiKey", event.target.value);
              }}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">AI Briefing Proxy URL (Recommended)</p>
            <TextInput
              value={props.config?.aiBriefingProxyUrl ?? ""}
              onChange={(event) => {
                onConfigChange("aiBriefingProxyUrl", event.target.value);
              }}
              placeholder="/rest/ai-briefing-proxy"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="w-100">
            <p className="mb-1">Forecast Window</p>
            <TextInput
              value={props.config?.forecastWindow ?? "next_24_hours"}
              onChange={(event) => {
                onConfigChange("forecastWindow", event.target.value);
              }}
            />
          </div>
        </SettingRow>
      </SettingSection>
      <SettingSection title="Map">
        <SettingRow>
          <MapWidgetSelector
            useMapWidgetIds={props.useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export default Setting;
