/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { Button } from "jimu-ui";
import { JimuMapViewComponent, type JimuMapView } from "jimu-arcgis";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import type { IMConfig } from "../config";
import {
  getTopStagingCandidates,
  runStagingPipeline,
  setPipelineConfig,
  type StagingCandidate,
  type StagingPipelineResult,
} from "./staging-pipeline";
import { resolveForecastTargetTime } from "./forecast-window";

interface AmbulanceCandidate {
  id: string;
  lat: number;
  lng: number;
}

interface AmbulanceMoveSuggestion {
  ambulanceId: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  moveDistanceKm: number;
  nearestNeighborDistanceKm: number;
  rationale: string;
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const LIVE_AMBULANCE_LAYER_URL =
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/AmbulancesAGOL/FeatureServer/0";
  const LIVE_AMBULANCE_LAYER_ID = "run-suggestions-live-ambulance-overlay";

  const [result, setResult] = React.useState<StagingPipelineResult | null>(
    null,
  );
  const [moveSuggestion, setMoveSuggestion] =
    React.useState<AmbulanceMoveSuggestion | null>(null);
  const [topCandidates, setTopCandidates] = React.useState<StagingCandidate[]>(
    [],
  );
  const [selectedCandidateIndex, setSelectedCandidateIndex] =
    React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(
    null,
  );
  const highlightGraphicRef = React.useRef<Graphic | null>(null);
  const moveAmbulanceGraphicRef = React.useRef<Graphic | null>(null);
  const routeGraphicRef = React.useRef<Graphic | null>(null);
  const ambulanceLayerRef = React.useRef<FeatureLayer | null>(null);

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

  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const distanceMeters = (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ): number => {
    const earthRadiusMeters = 6371000;
    const dLat = toRadians(toLat - fromLat);
    const dLng = toRadians(toLng - fromLng);

    const lat1 = toRadians(fromLat);
    const lat2 = toRadians(toLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
  };

  const getAmbulanceId = (
    attributes: { [key: string]: unknown },
    index: number,
  ) => {
    const idCandidates = [
      "ambulance_id",
      "vehicle_id",
      "unit_id",
      "unit",
      "name",
      "callsign",
      "OBJECTID",
      "objectid",
      "GlobalID",
      "globalid",
    ];

    for (const candidate of idCandidates) {
      const matchedKey = Object.keys(attributes).find(
        (key) => key.toLowerCase() === candidate.toLowerCase(),
      );

      if (!matchedKey) continue;
      const value = attributes[matchedKey];
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        return String(value);
      }
    }

    return `ambulance-${index + 1}`;
  };

  const queryLiveAmbulances = async (): Promise<AmbulanceCandidate[]> => {
    const layerFromMap =
      ambulanceLayerRef.current ??
      (jimuMapView?.view?.map.findLayerById(LIVE_AMBULANCE_LAYER_ID) as
        | FeatureLayer
        | undefined) ??
      null;

    const queryLayer =
      layerFromMap ??
      new FeatureLayer({
        url: LIVE_AMBULANCE_LAYER_URL,
        outFields: ["*"],
      });

    const featureSet = await queryLayer.queryFeatures(
      new Query({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true,
        num: 2000,
      }),
    );

    const candidates: AmbulanceCandidate[] = [];
    (featureSet.features ?? []).forEach((feature, index) => {
      const geometry = feature.geometry as
        | { latitude?: number; longitude?: number; x?: number; y?: number }
        | undefined;

      const lat = Number(geometry?.latitude ?? geometry?.y);
      const lng = Number(geometry?.longitude ?? geometry?.x);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const attributes = (feature.attributes ?? {}) as Record<string, unknown>;
      candidates.push({
        id: getAmbulanceId(attributes, index),
        lat,
        lng,
      });
    });

    return candidates;
  };

  const highlightAmbulanceToMove = (lat: number, lng: number) => {
    if (!jimuMapView?.view) return;

    if (moveAmbulanceGraphicRef.current) {
      jimuMapView.view.graphics.remove(moveAmbulanceGraphicRef.current);
      moveAmbulanceGraphicRef.current = null;
    }

    const fromPoint = new Point({
      longitude: lng,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });

    const moveGraphic = new Graphic({
      geometry: fromPoint,
      symbol: {
        type: "simple-marker",
        style: "diamond",
        color: [33, 150, 243, 0.95],
        size: 12,
        outline: {
          color: [255, 255, 255, 1],
          width: 2,
        },
      },
      attributes: {
        label: "Suggested ambulance to move",
      },
    });

    jimuMapView.view.graphics.add(moveGraphic);
    moveAmbulanceGraphicRef.current = moveGraphic;
  };

  const drawBasicRoute = (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ) => {
    if (!jimuMapView?.view) return;

    if (routeGraphicRef.current) {
      jimuMapView.view.graphics.remove(routeGraphicRef.current);
      routeGraphicRef.current = null;
    }

    const line = new Polyline({
      paths: [
        [fromLng, fromLat],
        [toLng, toLat],
      ],
      spatialReference: { wkid: 4326 },
    });

    const routeGraphic = new Graphic({
      geometry: line,
      symbol: {
        type: "simple-line",
        color: [0, 188, 212, 0.95],
        width: 3,
        style: "short-dot",
      },
      attributes: {
        label: "Suggested repositioning route",
      },
    });

    jimuMapView.view.graphics.add(routeGraphic);
    routeGraphicRef.current = routeGraphic;
  };

  const suggestAmbulanceToMove = async (
    targetLat: number,
    targetLng: number,
  ): Promise<AmbulanceMoveSuggestion | null> => {
    const ambulances = await queryLiveAmbulances();
    if (ambulances.length === 0) return null;

    if (ambulances.length === 1) {
      const single = ambulances[0];
      return {
        ambulanceId: single.id,
        fromLat: single.lat,
        fromLng: single.lng,
        toLat: targetLat,
        toLng: targetLng,
        moveDistanceKm:
          distanceMeters(single.lat, single.lng, targetLat, targetLng) / 1000,
        nearestNeighborDistanceKm: 0,
        rationale:
          "Only one live ambulance is available, so it is selected by default.",
      };
    }

    const scored = ambulances.map((candidate) => {
      let nearestNeighborMeters = Number.POSITIVE_INFINITY;

      ambulances.forEach((other) => {
        if (other.id === candidate.id) return;
        const spacing = distanceMeters(
          candidate.lat,
          candidate.lng,
          other.lat,
          other.lng,
        );
        if (spacing < nearestNeighborMeters) {
          nearestNeighborMeters = spacing;
        }
      });

      const moveMeters = distanceMeters(
        candidate.lat,
        candidate.lng,
        targetLat,
        targetLng,
      );

      return {
        ...candidate,
        nearestNeighborMeters,
        moveMeters,
      };
    });

    scored.sort((a, b) => {
      if (a.nearestNeighborMeters !== b.nearestNeighborMeters) {
        return a.nearestNeighborMeters - b.nearestNeighborMeters;
      }
      return a.moveMeters - b.moveMeters;
    });

    const selected = scored[0];
    return {
      ambulanceId: selected.id,
      fromLat: selected.lat,
      fromLng: selected.lng,
      toLat: targetLat,
      toLng: targetLng,
      moveDistanceKm: selected.moveMeters / 1000,
      nearestNeighborDistanceKm: selected.nearestNeighborMeters / 1000,
      rationale:
        "Selected ambulance has the smallest nearest-neighbor gap at its current position, which minimizes local coverage loss; tie-breaker favors shorter relocation distance.",
    };
  };

  const clearMoveAndRouteGraphics = () => {
    if (!jimuMapView?.view) return;

    if (moveAmbulanceGraphicRef.current) {
      jimuMapView.view.graphics.remove(moveAmbulanceGraphicRef.current);
      moveAmbulanceGraphicRef.current = null;
    }

    if (routeGraphicRef.current) {
      jimuMapView.view.graphics.remove(routeGraphicRef.current);
      routeGraphicRef.current = null;
    }
  };

  const applyCandidateSelection = async (candidate: StagingCandidate) => {
    await zoomAndHighlight(candidate.lat, candidate.lng);

    const suggestedAmbulance = await suggestAmbulanceToMove(
      candidate.lat,
      candidate.lng,
    );

    setMoveSuggestion(suggestedAmbulance);

    if (suggestedAmbulance) {
      highlightAmbulanceToMove(
        suggestedAmbulance.fromLat,
        suggestedAmbulance.fromLng,
      );
      drawBasicRoute(
        suggestedAmbulance.fromLat,
        suggestedAmbulance.fromLng,
        suggestedAmbulance.toLat,
        suggestedAmbulance.toLng,
      );
      return;
    }

    clearMoveAndRouteGraphics();
  };

  const handleSelectCandidate = async (index: number) => {
    const candidate = topCandidates[index];
    if (!candidate) return;

    setSelectedCandidateIndex(index);

    try {
      await applyCandidateSelection(candidate);
    } catch (selectionError) {
      setMoveSuggestion(null);
      clearMoveAndRouteGraphics();
      console.error(
        "Unable to apply selected staging candidate:",
        selectionError,
      );
    }
  };

  const handleRunSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);
      setMoveSuggestion(null);
      setTopCandidates([]);
      setSelectedCandidateIndex(0);

      clearMoveAndRouteGraphics();

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

      const targetTime = resolveForecastTargetTime(
        props.config?.forecastWindow,
      );
      const targetTimeISO = targetTime.toISOString();
      const [stagingResult, candidates] = await Promise.all([
        runStagingPipeline(targetTimeISO),
        getTopStagingCandidates(targetTimeISO, 3),
      ]);

      setResult(stagingResult);
      setTopCandidates(candidates);

      const firstCandidate: StagingCandidate = candidates[0] ?? {
        locationId: stagingResult.locationId,
        lat: stagingResult.lat,
        lng: stagingResult.lng,
        predictedScore: stagingResult.predictedScore,
      };
      setSelectedCandidateIndex(0);

      await applyCandidateSelection(firstCandidate);
    } catch (err) {
      const errorMessage = toErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addAmbulanceOverlay = React.useCallback(() => {
    if (!jimuMapView?.view) return;

    const existingLayer = jimuMapView.view.map.findLayerById(
      LIVE_AMBULANCE_LAYER_ID,
    ) as FeatureLayer | undefined;

    if (existingLayer) {
      ambulanceLayerRef.current = existingLayer;
      return;
    }

    const layer = new FeatureLayer({
      url: LIVE_AMBULANCE_LAYER_URL,
      id: LIVE_AMBULANCE_LAYER_ID,
      title: "Live Ambulances",
      visible: true,
      outFields: ["*"],
    });

    jimuMapView.view.map.add(layer);
    ambulanceLayerRef.current = layer;
  }, [jimuMapView]);

  const removeAmbulanceOverlay = React.useCallback(() => {
    if (!jimuMapView?.view) {
      ambulanceLayerRef.current = null;
      return;
    }

    const liveLayer =
      ambulanceLayerRef.current ??
      (jimuMapView.view.map.findLayerById(
        LIVE_AMBULANCE_LAYER_ID,
      ) as FeatureLayer | null);

    if (!liveLayer) return;

    jimuMapView.view.map.remove(liveLayer);
    ambulanceLayerRef.current = null;
  }, [jimuMapView]);

  React.useEffect(() => {
    addAmbulanceOverlay();

    return () => {
      removeAmbulanceOverlay();
    };
  }, [addAmbulanceOverlay, removeAmbulanceOverlay]);

  React.useEffect(() => {
    return () => {
      if (!jimuMapView?.view) return;

      if (highlightGraphicRef.current) {
        jimuMapView.view.graphics.remove(highlightGraphicRef.current);
        highlightGraphicRef.current = null;
      }

      if (moveAmbulanceGraphicRef.current) {
        jimuMapView.view.graphics.remove(moveAmbulanceGraphicRef.current);
        moveAmbulanceGraphicRef.current = null;
      }

      if (routeGraphicRef.current) {
        jimuMapView.view.graphics.remove(routeGraphicRef.current);
        routeGraphicRef.current = null;
      }
    };
  }, [jimuMapView]);

  return (
    <div className="widget-starter jimu-widget">
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />

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

      {loading && (
        <p>Running feature, weather, AI, and unit move selection...</p>
      )}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && result && (
        <div className="mt-3">
          {topCandidates.length > 0 && (
            <div>
              <p>
                <strong>Top Staging Suggestions:</strong>
              </p>
              <div className="mb-2">
                <Button
                  size="sm"
                  type="secondary"
                  disabled={selectedCandidateIndex <= 0}
                  onClick={() => {
                    void handleSelectCandidate(selectedCandidateIndex - 1);
                  }}
                >
                  Back
                </Button>{" "}
                <Button
                  size="sm"
                  type="secondary"
                  disabled={selectedCandidateIndex >= topCandidates.length - 1}
                  onClick={() => {
                    void handleSelectCandidate(selectedCandidateIndex + 1);
                  }}
                >
                  Next
                </Button>
              </div>
              <div className="mb-2">
                {topCandidates.map((candidate, index) => (
                  <Button
                    key={`${candidate.locationId}-${index}`}
                    size="sm"
                    type={
                      index === selectedCandidateIndex ? "primary" : "secondary"
                    }
                    onClick={() => {
                      void handleSelectCandidate(index);
                    }}
                    className="mr-2 mb-2"
                  >
                    #{index + 1} ID {candidate.locationId} (
                    {candidate.predictedScore.toFixed(1)})
                  </Button>
                ))}
              </div>
            </div>
          )}

          {topCandidates[selectedCandidateIndex] && (
            <p>
              <strong>Selected Staging Candidate:</strong> #
              {selectedCandidateIndex + 1} ID{" "}
              {topCandidates[selectedCandidateIndex].locationId}
            </p>
          )}

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
          {moveSuggestion && (
            <>
              <p>
                <strong>Suggested Ambulance To Move:</strong>{" "}
                {moveSuggestion.ambulanceId}
              </p>
              <p>
                <strong>Current Location:</strong>{" "}
                {moveSuggestion.fromLat.toFixed(6)},{" "}
                {moveSuggestion.fromLng.toFixed(6)}
              </p>
              <p>
                <strong>Move Distance:</strong>{" "}
                {moveSuggestion.moveDistanceKm.toFixed(2)} km
              </p>
              <p>
                <strong>
                  Coverage Loss Score Input (Nearest Neighbor Gap):
                </strong>{" "}
                {moveSuggestion.nearestNeighborDistanceKm.toFixed(2)} km
              </p>
              <p>
                <strong>Selection Logic:</strong> {moveSuggestion.rationale}
              </p>
            </>
          )}
          {!moveSuggestion && (
            <p>
              <strong>Suggested Ambulance To Move:</strong> No live ambulance
              location candidates were found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Widget;
