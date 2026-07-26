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
  runStagingPipelineForCandidate,
  setPipelineConfig,
  type StagingCandidate,
  type StagingPipelineResult,
} from "./staging-pipeline";

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

const formatLocalDateTimeInputValue = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const styles: { [key: string]: React.CSSProperties } = {
  shell: {
    height: "100%",
    padding: "24px",
    background:
      "radial-gradient(circle at top, rgba(90, 90, 90, 0.28), #1C1B1B 60%)",
    color: "#f7f7f7",
    overflow: "auto",
  },
  card: {
    minHeight: "100%",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    background: "linear-gradient(180deg, #3a3a3a 0%, #2f2f2f 100%)",
    boxShadow:
      "0 14px 40px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
    padding: "28px 34px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  heading: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  stage: {
    position: "relative",
    minHeight: "80px",
    borderRadius: "22px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    padding: "22px 64px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "14px",
  },
  stageEmpty: {
    color: "rgba(255, 255, 255, 0.56)",
    fontSize: "0.96rem",
    lineHeight: 1.5,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    minWidth: "46px",
    width: "46px",
    height: "46px",
    borderRadius: "999px",
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.16)",
    color: "#f5f5f5",
    fontSize: "1.5rem",
    lineHeight: 1,
    padding: 0,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  leftNav: {
    left: "12px",
  },
  rightNav: {
    right: "12px",
  },
  pills: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "nowrap",
  },
  primaryButton: {
    width: "auto",
    minWidth: "260px",
    flex: "1 1 auto",
    minHeight: "52px",
    borderRadius: "999px",
    background: "linear-gradient(180deg, #ffffff 0%, #ececec 100%)",
    color: "#111111",
    border: "1px solid rgba(135, 173, 255, 0.65)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
    fontWeight: 600,
  },
  settingsButton: {
    minWidth: "52px",
    width: "52px",
    height: "52px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
    color: "#ffffff",
    fontSize: "1.2rem",
    padding: 0,
    flexShrink: 0,
  },
  settingsPanel: {
    width: "320px",
    flexShrink: 0,
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "12px 14px",
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
  },
  settingsRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  input: {
    width: "100%",
    minHeight: "42px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: "rgba(12, 12, 12, 0.45)",
    color: "#ffffff",
    padding: "10px 12px",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    color: "#ffffff",
  },
  chip: {
    borderRadius: "999px",
    padding: "8px 14px",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#f2f2f2",
    fontSize: "0.86rem",
  },
  chipActive: {
    background: "#f4f4f4",
    color: "#171717",
    border: "1px solid rgba(255, 255, 255, 0.85)",
    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.18)",
  },
  warning: {
    borderRadius: "16px",
    background: "rgba(255, 197, 61, 0.1)",
    border: "1px solid rgba(255, 197, 61, 0.3)",
    color: "#ffe7a1",
    padding: "12px 14px",
    fontSize: "0.92rem",
  },
  error: {
    borderRadius: "16px",
    background: "rgba(255, 84, 84, 0.1)",
    border: "1px solid rgba(255, 84, 84, 0.35)",
    color: "#ffd0d0",
    padding: "12px 14px",
    whiteSpace: "pre-wrap",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "14px",
  },
  metricCard: {
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "rgba(255, 255, 255, 0.58)",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  value: {
    color: "#ffffff",
    fontSize: "1rem",
    lineHeight: 1.45,
  },
  largeValue: {
    color: "#ffffff",
    fontSize: "1.35rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  briefingCard: {
    borderRadius: "22px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

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
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const [selectedLocalDateTime, setSelectedLocalDateTime] = React.useState(() =>
    formatLocalDateTimeInputValue(new Date()),
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(
    null,
  );
  const highlightGraphicRef = React.useRef<Graphic | null>(null);
  const moveAmbulanceGraphicRef = React.useRef<Graphic | null>(null);
  const routeGraphicRef = React.useRef<Graphic | null>(null);
  const ambulanceLayerRef = React.useRef<FeatureLayer | null>(null);
  const resultCacheRef = React.useRef<{ [key: number]: StagingPipelineResult }>(
    {},
  );
  const targetTimeISORef = React.useRef<string>("");

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

  const getSelectedTimestampISO = (): string => {
    const localDate = new Date(selectedLocalDateTime);

    if (Number.isNaN(localDate.getTime())) {
      throw new Error("Select a valid forecast date and time.");
    }

    return localDate.toISOString();
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

      const attributes = (feature.attributes ?? {}) as {
        [key: string]: unknown;
      };
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
      const cachedResult = resultCacheRef.current[index];
      if (cachedResult) {
        setResult(cachedResult);
      } else if (targetTimeISORef.current) {
        const selectedResult = await runStagingPipelineForCandidate(
          targetTimeISORef.current,
          index,
        );
        resultCacheRef.current[index] = selectedResult;
        setResult(selectedResult);
      }

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
      resultCacheRef.current = {};

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

      const selectedTargetTimeISO = getSelectedTimestampISO();
      targetTimeISORef.current = selectedTargetTimeISO;
      const [stagingResult, candidates] = await Promise.all([
        runStagingPipeline(selectedTargetTimeISO),
        getTopStagingCandidates(selectedTargetTimeISO, 3),
      ]);

      setResult(stagingResult);
      resultCacheRef.current[0] = stagingResult;
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
    <div className="widget-starter jimu-widget" style={styles.shell}>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />

      <div style={styles.card}>
        <div>
          <h2 style={styles.heading}>Response Intelligence</h2>
        </div>

        <div style={styles.stage}>
          {topCandidates.length > 0 && (
            <>
              <Button
                size="sm"
                type="secondary"
                style={{
                  ...styles.navButton,
                  ...styles.leftNav,
                  ...(selectedCandidateIndex <= 0
                    ? styles.navButtonDisabled
                    : {}),
                }}
                disabled={selectedCandidateIndex <= 0}
                onClick={() => {
                  void handleSelectCandidate(selectedCandidateIndex - 1);
                }}
              >
                ‹
              </Button>
              <Button
                size="sm"
                type="secondary"
                style={{
                  ...styles.navButton,
                  ...styles.rightNav,
                  ...(selectedCandidateIndex >= topCandidates.length - 1
                    ? styles.navButtonDisabled
                    : {}),
                }}
                disabled={selectedCandidateIndex >= topCandidates.length - 1}
                onClick={() => {
                  void handleSelectCandidate(selectedCandidateIndex + 1);
                }}
              >
                ›
              </Button>

              <div style={styles.pills}>
                {topCandidates.map((candidate, index) => (
                  <Button
                    key={`${candidate.locationId}-${index}`}
                    size="sm"
                    type={
                      index === selectedCandidateIndex ? "primary" : "secondary"
                    }
                    style={{
                      ...styles.chip,
                      ...(index === selectedCandidateIndex
                        ? styles.chipActive
                        : {}),
                    }}
                    onClick={() => {
                      void handleSelectCandidate(index);
                    }}
                  >
                    #{index + 1} · ID {candidate.locationId}
                  </Button>
                ))}
              </div>
            </>
          )}

          {!topCandidates.length && !loading && !result && (
            <div style={styles.stageEmpty}>
              Run suggestions to load the top staging candidates.
            </div>
          )}

          {loading && (
            <div style={styles.stageEmpty}>
              Running feature, weather, AI, and unit move selection...
            </div>
          )}
        </div>

        <div style={styles.controlsRow}>
          <Button
            type="primary"
            onClick={() => {
              void handleRunSuggestions();
            }}
            size="default"
            disabled={loading}
            style={styles.primaryButton}
          >
            {loading ? "Running..." : "Run Staging Suggestions"}
          </Button>
          <Button
            type="secondary"
            size="default"
            style={styles.settingsButton}
            onClick={() => {
              setIsSettingsOpen((open) => !open);
            }}
            aria-label="Toggle forecast time settings"
          >
            ⚙
          </Button>
          {isSettingsOpen && (
            <div style={styles.settingsPanel}>
              <div style={styles.settingsRow}>
                <div style={styles.label}>Forecast Date And Time</div>
                <input
                  type="datetime-local"
                  value={selectedLocalDateTime}
                  onChange={(event) => {
                    setSelectedLocalDateTime(event.target.value);
                  }}
                  style={styles.input}
                />
              </div>
              <Button
                type="secondary"
                size="sm"
                style={styles.secondaryButton}
                onClick={() => {
                  setSelectedLocalDateTime(
                    formatLocalDateTimeInputValue(new Date()),
                  );
                }}
              >
                Use current time
              </Button>
            </div>
          )}
        </div>

        {!props.useMapWidgetIds?.[0] && (
          <div style={styles.warning}>
            Please select a map in widget settings to enable zoom and route
            highlighting.
          </div>
        )}

        {!loading && error && <div style={styles.error}>Error: {error}</div>}

        {!loading && !error && result && (
          <>
            <div style={styles.briefingCard}>
              <div style={styles.label}>Dispatch Briefing</div>
              <div style={styles.value}>{result.aiBriefing}</div>
            </div>
            <div style={styles.sectionGrid}>
              <div style={styles.metricCard}>
                <div style={styles.label}>Selected Staging Candidate</div>
                <div style={styles.largeValue}>
                  #{selectedCandidateIndex + 1} · ID {result.locationId}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Coordinates</div>
                <div style={styles.value}>
                  {result.lat.toFixed(6)}, {result.lng.toFixed(6)}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Predicted Incident Score</div>
                <div style={styles.largeValue}>
                  {result.predictedScore.toFixed(2)}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Historical Matches</div>
                <div style={styles.value}>
                  {result.historicalMatchCount} ({result.historicalLookupMode})
                </div>
              </div>
            </div>

            <div style={styles.sectionGrid}>
              <div style={styles.metricCard}>
                <div style={styles.label}>Weather</div>
                <div style={styles.value}>{result.weatherSummary}</div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Historical Incidents</div>
                <div style={styles.value}>
                  {result.historicalIncidentSummary}
                </div>
              </div>
            </div>

            <div style={styles.sectionGrid}>
              <div style={styles.metricCard}>
                <div style={styles.label}>Suggested Ambulance To Move</div>
                <div style={styles.largeValue}>
                  {moveSuggestion?.ambulanceId ?? "No candidate found"}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Current Location</div>
                <div style={styles.value}>
                  {moveSuggestion
                    ? `${moveSuggestion.fromLat.toFixed(6)}, ${moveSuggestion.fromLng.toFixed(6)}`
                    : "Unavailable"}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Move Distance</div>
                <div style={styles.value}>
                  {moveSuggestion
                    ? `${moveSuggestion.moveDistanceKm.toFixed(2)} km`
                    : "Unavailable"}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.label}>Coverage Gap Heuristic</div>
                <div style={styles.value}>
                  {moveSuggestion
                    ? `${moveSuggestion.nearestNeighborDistanceKm.toFixed(2)} km`
                    : "Unavailable"}
                </div>
              </div>
            </div>

            {moveSuggestion && (
              <div style={styles.briefingCard}>
                <div style={styles.label}>Selection Logic</div>
                <div style={styles.value}>{moveSuggestion.rationale}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Widget;
