import type { ImmutableObject } from 'jimu-core';
export interface ToolConfig {
    [key: string]: boolean;
}
export interface InitialMapState {
    /**
     * Initial viewpoint of the map.
     */
    viewPoint: __esri.Viewpoint;
    /**
     * @ignore
     */
    viewType: '2d' | '3d';
    /**
     * Initial extent of the map.
     */
    extent: __esri.Extent;
    /**
     * Initial rotation of the map.
     */
    rotation: number;
}
export interface JimuMapConfig {
    /**
     * @ignore
     */
    disableScroll?: boolean;
    /**
     * If true, disables map popups. Default is false (popups enabled).
     */
    disablePopUp?: boolean;
    /**
     * @ignore
     */
    showPopupUponSelection?: boolean;
    /**
     * The id of the map data source to activate initially.
     */
    initialMapDataSourceID?: string;
    /**
     * Configures which map tools are shown. Provide a boolean key-value pair object where true enables the tool.
     * Example (enable all supported tools):
     * `{ canZoom: true, canHome: true, canNavigation: true, canCompass: true, canSearch: true, canLayers: true }`
     */
    toolConfig?: ToolConfig;
    /**
     * Defines the initial map viewpoint.
     */
    initialMapState?: InitialMapState;
    /**
     * @ignore
     */
    canPlaceHolder?: boolean;
    /**
     * @ignore
     */
    placeholderImage?: string;
    /**
     * @ignore
     */
    layoutIndex?: number | 'custom-layout';
    /**
     * @ignore
     */
    selectionHighlightColor?: string;
    /**
     * @ignore
     */
    selectionHighlightHaloColor?: string;
}
export type IMJimuMapConfig = ImmutableObject<JimuMapConfig>;
