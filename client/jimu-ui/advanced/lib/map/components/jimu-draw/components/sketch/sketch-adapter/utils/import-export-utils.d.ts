import type { IntlShape } from 'jimu-core';
import { type NotificationProps } from 'jimu-ui';
export declare const addImportExportToolsUI: (sketchCustomTools: any[], onExportBtnClickRef: React.RefObject<any>, onImportBtnClickRef: React.RefObject<any>, importExportOption: {
    enableImportFlag: boolean;
    importNls: string;
    enableExportFlag: boolean;
    exportNls: string;
}) => void;
export declare const onExportBtnClick: (getCanvasLayerRef: React.RefObject<() => __esri.GraphicsLayer>, getMeasurementsLayerRef: React.RefObject<() => __esri.FeatureLayer>, enqueueNotificationRef: React.RefObject<(options: NotificationProps) => string>, intl: IntlShape) => void;
export declare const onImportBtnClick: (getCanvasLayerRef: React.RefObject<() => __esri.GraphicsLayer>, getMeasurementsLayerRef: React.RefObject<() => __esri.FeatureLayer>, enqueueNotificationRef: React.RefObject<(options: NotificationProps) => string>, intl: IntlShape, EsriGraphic: typeof __esri.Graphic, mapView: __esri.MapView | __esri.SceneView) => void;
export declare const setDisableForExportItem: (additionalBtsCustomTools: any, graphicsCount: any, sketchRef: __esri.Sketch) => void;
