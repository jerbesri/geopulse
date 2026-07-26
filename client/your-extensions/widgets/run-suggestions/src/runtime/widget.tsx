/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { Button } from "jimu-ui";
import { JimuMapViewComponent, type JimuMapView } from "jimu-arcgis";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
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

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(
    null,
  );
  const highlightGraphicRef = React.useRef<Graphic | null>(null);

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

  const zoomAndHighlight = async (lat: number, lng: number) => {
    if (!jimuMapView?.view) return;

    const pt = new Point({
      longitude: lng,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });

    if (highlightGraphicRef.current) {
      jimuMapView.view.graphics.remove(highlightGraphicRef.current);
      highlightGraphicRef.current = null;
    }

    const highlightGraphic = new Graphic({
      geometry: pt,
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [255, 87, 34, 0.95],
        size: 14,
        outline: {
          color: [255, 255, 255, 1],
          width: 2,
        },
      },
    });

    jimuMapView.view.graphics.add(highlightGraphic);
    highlightGraphicRef.current = highlightGraphic;

    await jimuMapView.view.goTo({
      target: pt,
      zoom: 14,
    });
  };

  const handleRunSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      setPipelineConfig({
        featureLayerUrl: props.config?.featureLayerUrl ?? "",
        historicalLayerUrl: props.config?.historicalLayerUrl ?? "",
        historicalLookbackDays: props.config?.historicalLookbackDays ?? "30",
        historicalProximityMeters:
          props.config?.historicalProximityMeters ?? "500",
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

      await zoomAndHighlight(stagingResult.lat, stagingResult.lng);
    } catch (err) {
      const errorMessage = toErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (!jimuMapView?.view || !highlightGraphicRef.current) return;
      jimuMapView.view.graphics.remove(highlightGraphicRef.current);
      highlightGraphicRef.current = null;
    };
  }, [jimuMapView]);

  return (
    <div className="widget-starter jimu-widget">
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />

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

      {!props.useMapWidgetIds?.[0] && (
        <p>Please select a map in widget settings to enable zoom/highlight.</p>
      )}

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
            <strong>Historical Incidents:</strong>{" "}
            {result.historicalIncidentSummary}
          </p>
          <p>
            <strong>Historical Matches:</strong> {result.historicalMatchCount} (
            {result.historicalLookupMode})
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
