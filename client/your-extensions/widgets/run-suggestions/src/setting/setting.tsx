/* eslint-disable semi */
import type { AllWidgetSettingProps } from "jimu-for-builder";
import { NumericInput, TextInput } from "jimu-ui";
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import type { IMConfig } from "../config";

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds,
    });
  };

  const updateConfig = (key: keyof IMConfig, value: string | number) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set(key, value),
    });
  };

  return (
    <div className="p-2">
      <SettingSection title="Map">
        <SettingRow>
          <MapWidgetSelector
            useMapWidgetIds={props.useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>
      </SettingSection>
      <SettingSection title="Prediction service">
        <SettingRow label="Feature layer URL" flow="wrap">
          <TextInput
            className="w-100"
            value={props.config.agolLayerUrl}
            onAcceptValue={(value) => updateConfig("agolLayerUrl", value.trim())}
          />
        </SettingRow>
      </SettingSection>
      <SettingSection title="Incident service">
        <SettingRow label="Feature layer URL" flow="wrap">
          <TextInput
            className="w-100"
            value={props.config.incidentLayerUrl}
            onAcceptValue={(value) => updateConfig("incidentLayerUrl", value.trim())}
          />
        </SettingRow>
        <SettingRow label="Incident type field" flow="wrap">
          <TextInput
            className="w-100"
            value={props.config.incidentTypeField}
            onAcceptValue={(value) => updateConfig("incidentTypeField", value.trim())}
          />
        </SettingRow>
        <SettingRow label="Search radius (miles)" flow="wrap">
          <NumericInput
            className="w-100"
            min={0.1}
            max={25}
            precision={1}
            value={props.config.incidentSearchRadiusMiles}
            onChange={(value) => {
              if (value !== undefined) updateConfig("incidentSearchRadiusMiles", value);
            }}
          />
        </SettingRow>
      </SettingSection>
      <SettingSection title="AI briefing service">
        <SettingRow label="Proxy URL" flow="wrap">
          <TextInput
            className="w-100"
            value={props.config.briefingProxyUrl}
            onAcceptValue={(value) => updateConfig("briefingProxyUrl", value.trim())}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export default Setting;
