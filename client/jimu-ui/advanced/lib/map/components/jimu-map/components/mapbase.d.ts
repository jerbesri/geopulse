import { React, ExtentChangeMessage, type MapDataSource, type ImmutableObject } from 'jimu-core';
import type { IMJimuMapConfig, InitialMapState } from '../config';
import { type JimuMapView, type DefaultMapInfo } from 'jimu-arcgis';
import type { JimuMapProps } from '../index';
interface Props {
    isDefaultMap?: boolean;
    baseWidgetProps: JimuMapProps;
    startLoadModules: boolean;
    dataSourceId: string;
    defaultMapInfo?: DefaultMapInfo;
    children?: React.ReactNode;
    mapComponentsLoaded: boolean;
    onViewChanged?: (shareViewPoint: ShareViewPoint) => void;
    onMutableStatePropsChanged?: (dataSourceId: string, propKey: string, value?: any) => void;
    onExtentChanged?: (dataSourceId: string, message: ExtentChangeMessage) => void;
    onMapLoaded?: (dataSourceId: string, mapLoadStatus: MapLoadStatus) => void;
    onJimuMapViewCreated?: (jimuMapView: JimuMapView) => void;
}
export interface ShareViewPoint {
    dataSourceId: string;
    viewpoint: __esri.Viewpoint;
}
export declare enum MapLoadStatus {
    Loading = "LOADING",
    Loadok = "LOADOK",
    LoadError = "LOADERROR"
}
export interface HighLightHandle {
    layerId: string;
    handle: __esri.Handle;
}
interface State {
    dataSourceId: string;
    mapDs?: MapDataSource;
    preMapDs?: MapDataSource;
    isModulesLoaded?: boolean;
    mapLoadStatus?: MapLoadStatus;
    mapBaseJimuMapView: JimuMapView;
    widthBreakpoint: string;
    widgetHeight: number;
}
export default class MapBase extends React.PureComponent<Props, State> {
    mapContainer: HTMLDivElement;
    widgetContainer: React.RefObject<HTMLDivElement>;
    Geometry: typeof __esri.Geometry;
    InitialViewProperties: typeof __esri.InitialViewProperties;
    TileLayer: typeof __esri.TileLayer;
    Basemap: typeof __esri.Basemap;
    Extent: typeof __esri.Extent;
    Viewpoint: typeof __esri.Viewpoint;
    PortalItem: typeof __esri.PortalItem;
    Portal: typeof __esri.Portal;
    WebMap: typeof __esri.WebMap;
    WebScene: typeof __esri.WebScene;
    reactiveUtils: __esri.reactiveUtils;
    view: __esri.MapView | __esri.SceneView;
    mapComponent: HTMLArcgisMapElement | HTMLArcgisSceneElement;
    extentWatch: __esri.WatchHandle;
    watchStationaryHandle: __esri.WatchHandle;
    highLightHandles: {
        [layerId: string]: __esri.Handle;
    };
    mapBaseViewEventHandles: {
        [eventName: string]: __esri.Handle;
    };
    initializingView: boolean;
    constructor(props: any);
    startRenderMap: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    initView(): Promise<void>;
    initMapView(): Promise<void>;
    initSceneView(): Promise<void>;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): {
        dataSourceId: string;
        mapLoadStatus: MapLoadStatus;
    };
    componentWillUnmount(): void;
    destroyMapComponent: () => void;
    generateViewPointFromInitialMapState: (initialMapState: ImmutableObject<InitialMapState>) => __esri.Viewpoint;
    cloneMap: (dataSource: MapDataSource) => __esri.WebMap | __esri.WebScene;
    getInitViewPointForDefaultWebMap: () => __esri.Viewpoint;
    getDefaultWebMap: () => import("esri/WebMap").default;
    createMapView(): Promise<void>;
    createSceneView(): Promise<void>;
    createMapSceneView(mapComponent: HTMLArcgisMapElement | HTMLArcgisSceneElement, map: __esri.WebMap | __esri.WebScene, viewPoint: __esri.Viewpoint): Promise<void>;
    postCreateMapSceneView(mapComponent: HTMLArcgisMapElement | HTMLArcgisSceneElement, view: __esri.MapView | __esri.SceneView): Promise<void>;
    updateView: (config: IMJimuMapConfig) => void;
    bindMapBaseViewEvent: (mapBaseView: __esri.MapView | __esri.SceneView) => void;
    getMapDsId: () => string;
    onDataSourceCreated: (dataSource: MapDataSource) => void;
    onCreateDataSourceFailed: (err: any) => void;
    setViewPoint: (viewPoint: any) => void;
    getMapLoadStatus: () => MapLoadStatus;
    getViewPoint: () => __esri.Viewpoint;
    getViewType: () => string;
    goHome(useAnimation?: boolean): Promise<void>;
    getMapBaseInitViewPoint: () => __esri.Viewpoint;
    formatMessage: (id: string) => string;
    handleDisableWheel: () => void;
    onResize: ({ width, height }: {
        width: any;
        height: any;
    }) => void;
    getMapSwitchForErrorMap: () => import("@emotion/react/jsx-runtime").JSX.Element;
    getStyle(): import("jimu-core").SerializedStyles;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
export {};
