/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { Button } from "jimu-ui";
import { JimuMapViewComponent, type JimuMapView } from "jimu-arcgis";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { IMConfig } from "../config";
import { runStagingPipeline } from "../services/staging-pipeline";
import type { StagingPipelineResult } from "../services/types";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [targetTime, setTargetTime] = React.useState<string>("");
  const [availableAmbulances, setAvailableAmbulances] = React.useState<string>("1");
  const [result, setResult] = React.useState<StagingPipelineResult | null>(null);
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleRunPipeline = async () => {
    const availableCount = Number(availableAmbulances);
    if (!targetTime || loading || !Number.isInteger(availableCount) || availableCount < 1) return;
    try {
      setLoading(true);
      setError("");
      setResult(null);
      const pipelineResult = await runStagingPipeline(targetTime, availableCount, {
        agolLayerUrl: props.config?.agolLayerUrl,
        incidentLayerUrl: props.config?.incidentLayerUrl,
        incidentTypeField: props.config?.incidentTypeField,
        incidentSearchRadiusMiles: props.config?.incidentSearchRadiusMiles,
        briefingProxyUrl: props.config?.briefingProxyUrl,
      });
      setResult(pipelineResult);
      await showStagingArea(pipelineResult);
    } catch (caughtError) {
      const message = caughtError instanceof Error
        ? caughtError.message
        : "The staging recommendation could not be generated.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const showStagingArea = async (pipelineResult: StagingPipelineResult) => {
    const view = jimuMapView?.view;
    if (!view) return;

    const stagingGraphic = new Graphic({
      geometry: new Point({
        longitude: pipelineResult.lng,
        latitude: pipelineResult.lat,
        spatialReference: { wkid: 4326 },
      }),
      symbol: new SimpleMarkerSymbol({
        color: "#c62828",
        size: 14,
        outline: { color: "#ffffff", width: 2 },
      }),
      attributes: {
        stagingRecommendation: true,
        locationId: pipelineResult.locationId,
        predictedScore: pipelineResult.predictedScore,
      },
      popupTemplate: {
        title: `Recommended staging area ${pipelineResult.locationId}`,
        content: `Predicted incidents: ${pipelineResult.predictedScore.toFixed(2)}<br>Available ambulances: ${pipelineResult.availableAmbulances}<br>${pipelineResult.weatherSummary}`,
      },
    });

    const previousGraphic = view.graphics.find((graphic) => graphic.attributes?.stagingRecommendation === true);
    if (previousGraphic) view.graphics.remove(previousGraphic);
    view.graphics.add(stagingGraphic);
    await view.goTo({ target: stagingGraphic, zoom: 14 });
  };

  return (
    <section className="widget-starter jimu-widget p-3" aria-labelledby="staging-title">
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />
      <h4 id="staging-title">EMS Staging Recommendation</h4>
      <label htmlFor={`target-time-${props.id}`} className="d-block mb-1">
        Target time in Redlands
      </label>
      <input
        id={`target-time-${props.id}`}
        className="form-control mb-2"
        type="datetime-local"
        value={targetTime}
        onChange={(event) => setTargetTime(event.currentTarget.value)}
        disabled={loading}
        required
      />
      <label htmlFor={`available-ambulances-${props.id}`} className="d-block mb-1">
        Available ambulances
      </label>
      <input
        id={`available-ambulances-${props.id}`}
        className="form-control mb-2"
        type="number"
        min="1"
        max="100"
        step="1"
        value={availableAmbulances}
        onChange={(event) => setAvailableAmbulances(event.currentTarget.value)}
        disabled={loading}
        required
      />
      <Button
        type="primary"
        onClick={() => {
          handleRunPipeline();
        }}
        size="default"
        disabled={loading || !targetTime || !Number.isInteger(Number(availableAmbulances)) || Number(availableAmbulances) < 1}
      >
        {loading ? "Analyzing..." : "Generate recommendation"}
      </Button>
      {loading && <p className="mt-3" role="status">Evaluating hotspot and conditions...</p>}
      {!loading && error && <p className="mt-3 text-danger" role="alert">{error}</p>}
      {!loading && result && (
        <div className="mt-3" aria-live="polite">
          <h5>Location {result.locationId}</h5>
          <dl className="mb-2">
            <dt>Predicted incidents</dt>
            <dd>{result.predictedScore.toFixed(2)}</dd>
            <dt>Available ambulances</dt>
            <dd>{result.availableAmbulances}</dd>
            <dt>Coordinates</dt>
            <dd>{result.lat.toFixed(5)}, {result.lng.toFixed(5)}</dd>
            <dt>Nearby incident mix</dt>
            <dd>{result.incidentBreakdown}</dd>
            <dt>Weather</dt>
            <dd>{result.weatherSummary}</dd>
          </dl>
          <h5>Tactical briefing</h5>
          <p>{result.aiBriefing}</p>
        </div>
      )}
    </section>
  );
};

export default Widget;
