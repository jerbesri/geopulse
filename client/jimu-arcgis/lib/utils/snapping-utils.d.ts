import { type ImmutableArray } from 'jimu-core';
import type { JimuMapView } from '../views/jimu-map-view';
import type { AdvancedSelectItem } from 'jimu-ui';
export declare function getAllSnappingLayerItems(jimuMapViews: JimuMapView[]): AdvancedSelectItem[];
export declare const getSnappingFeatureSourcesCollection: (jimuMapView: JimuMapView, defaultSnapLayers: ImmutableArray<string>) => Promise<import("esri/core/Collection").default<import("esri/views/interactive/snapping/FeatureSnappingLayerSource").default<import("esri/layers/FeatureLayer").default | import("esri/layers/SceneLayer").default | import("esri/layers/support/SubtypeSublayer").default | import("esri/layers/CSVLayer").default | import("esri/layers/GeoJSONLayer").default | import("esri/layers/GraphicsLayer").default | import("esri/layers/WFSLayer").default | import("esri/layers/BuildingSceneLayer").default | import("esri/layers/MapNotesLayer").default>>>;
export declare const useGetTipsForSnappingOptions: (jimuUiDefaultMessages: any, jimuCoreDefaultMessages: any) => import("@emotion/react/jsx-runtime").JSX.Element;
