/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { Button } from "jimu-ui";
import type { IMConfig } from "../config";
import {
  runStagingPipeline,
  setPipelineConfig,
  type StagingPipelineResult,
} from "./staging-pipeline";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [result, setResult] = React.useState<StagingPipelineResult | null>(
    null,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const toErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === "string") {
      return err;
    }

    try {
      return JSON.stringify(err);
    } catch {
      return "Unknown error object";
    }
  };

  const handleRunSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      setPipelineConfig({
        featureLayerUrl: props.config?.featureLayerUrl ?? "",
        azureEndpoint: props.config?.azureEndpoint ?? "",
        azureDeploymentName: props.config?.azureDeploymentName ?? "",
        azureApiKey: props.config?.azureApiKey ?? "",
        aiBriefingProxyUrl: props.config?.aiBriefingProxyUrl ?? "",
        forecastWindow: props.config?.forecastWindow ?? "next_24_hours",
      });

      if (!props.config?.featureLayerUrl?.trim()) {
        throw new Error("Set Feature Layer URL in widget settings first.");
      }

      const stagingResult = await runStagingPipeline(new Date().toISOString());
      setResult(stagingResult);
    } catch (err) {
      const errorMessage = toErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="widget-starter jimu-widget">
      <h4>Run Suggestions</h4>
      <Button
        type="primary"
        onClick={() => {
          void handleRunSuggestions();
        }}
        size="default"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Staging Suggestions"}
      </Button>
      {loading && <p>Running feature, weather, and AI pipeline...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && result && (
        <div className="mt-3">
          <p>
            <strong>Recommended Location ID:</strong> {result.locationId}
          </p>
          <p>
            <strong>Coordinates:</strong> {result.lat.toFixed(6)},{" "}
            {result.lng.toFixed(6)}
          </p>
          <p>
            <strong>Predicted Incident Score:</strong>{" "}
            {result.predictedScore.toFixed(2)}
          </p>
          <p>
            <strong>Weather:</strong> {result.weatherSummary}
          </p>
          <p>
            <strong>Dispatch Briefing:</strong> {result.aiBriefing}
          </p>
        </div>
      )}
    </div>
  );
};

export default Widget;
