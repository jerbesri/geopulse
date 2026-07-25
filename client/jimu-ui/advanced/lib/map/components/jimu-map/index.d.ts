import { React, type UseDataSource, type ImmutableArray, AppMode, ReactRedux, type IntlShape } from 'jimu-core';
import MultiSourceMap from './components/multisourcemap';
import type { JimuMapView, JimuMapViewGroup, JimuMapClass } from 'jimu-arcgis';
import type { InitialMapState, ToolConfig, JimuMapConfig, IMJimuMapConfig } from './config';
export type { InitialMapState, ToolConfig, JimuMapConfig, IMJimuMapConfig };
export interface JimuMapProps {
    /**
     * Unique id for `JimuMap` instance.
     */
    id: string;
    /**
     * Custom class name for `JimuMap` root element.
     */
    className?: string;
    /**
     * WebMap or WebScene data sources to render. Accepts up to two data sources (e.g. one WebMap, one WebScene, or two of either).
     * If this is omitted or set to an empty array, the component will fall back to the organization's default WebMap.
     */
    useDataSources?: ImmutableArray<UseDataSource>;
    /**
     * Configuration options for the map.
     */
    jimuMapConfig?: IMJimuMapConfig;
    /**
     * @ignore
     */
    appMode?: AppMode;
    /**
     * @ignore
     */
    intl?: IntlShape;
    /**
     * Callback fired when the active view's viewpoint changes.
     * @param viewPoint
     */
    onViewPointChanged?: (viewPoint: __esri.Viewpoint) => void;
    /**
     * Callback fired when the extent of the active view changes.
     * @param extent
     */
    onExtentChanged?: (extent: __esri.Extent) => void;
    /**
     * Callback fired when the active `JimuMapView` changes.
     * @param activeView
     */
    onActiveViewChange?: (activeView: JimuMapView) => void;
    /**
     * The `JimuMapViewGroup` is created once the first view is added. Views in the groups may not load after a group is created.
     * @param viewGroup
     */
    onViewGroupCreate?: (viewGroup: JimuMapViewGroup) => void;
    /**
     * Callback fired after an individual `JimuMapView` instance is created.
     * @param jimuMapView
     */
    onJimuMapViewCreated?: (jimuMapView: JimuMapView) => void;
}
interface States {
    startLoadModules: boolean;
    widthBreakpoint: string;
    widgetHeight: number;
    mapComponentsLoaded: boolean;
}
export declare class __JimuMap extends React.PureComponent<JimuMapProps, States> implements JimuMapClass {
    parentContainer: HTMLElement;
    containerRef: React.RefObject<HTMLDivElement>;
    containerClientRect: ClientRect | DOMRect;
    multiSourceMapInstance: MultiSourceMap;
    readonly mapRootClassName: string;
    constructor(props: any);
    startRenderMap: () => void;
    componentDidMount(): void;
    getPlaceHolderImage: () => string;
    fullScreenMap: () => void;
    handleViewGroupCreate: (viewGroup: JimuMapViewGroup) => void;
    handleJimuMapViewCreated: (jimuMapView: JimuMapView) => void;
    switchMap: () => Promise<any>;
    setMultiSourceMapInstance: (instance: MultiSourceMap) => void;
    onResize: ({ width, height }: {
        width: any;
        height: any;
    }) => void;
    getExtraCss(): string;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
    renderContent(): import("@emotion/react/jsx-runtime").JSX.Element;
}
export declare const JimuMap: import("@emotion/styled").StyledComponent<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
    id: string;
    className?: string;
    useDataSources?: ImmutableArray<UseDataSource>;
    jimuMapConfig?: IMJimuMapConfig;
    appMode?: AppMode;
    intl?: IntlShape;
    onViewPointChanged?: (viewPoint: __esri.Viewpoint) => void;
    onExtentChanged?: (extent: __esri.Extent) => void;
    onActiveViewChange?: (activeView: JimuMapView) => void;
    onViewGroupCreate?: (viewGroup: JimuMapViewGroup) => void;
    onJimuMapViewCreated?: (jimuMapView: JimuMapView) => void;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}, {}, {}>;
