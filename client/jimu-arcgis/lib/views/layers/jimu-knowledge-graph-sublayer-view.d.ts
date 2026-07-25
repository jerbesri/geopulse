import type { KnowledgeGraphSublayerDataSource } from 'jimu-core';
import { JimuQueriableLayerView, type JimuQueriableLayerViewOptions } from './jimu-queriable-layer-view';
/**
 * `JimuKnowledgeGraphSublayerView` constructor options.
 */
export interface JimuKnowledgeGraphSublayerViewOptions extends JimuQueriableLayerViewOptions {
    /**
     * The `layer` is the [ArcGIS Maps SDK for JavaScript `KnowledgeGraphSublayer`](https://developers.arcgis.com/javascript/latest/references/core/layers/knowledgeGraph/KnowledgeGraphSublayer/).
     */
    layer: __esri.KnowledgeGraphSublayer;
}
/**
 * `JimuKnowledgeGraphSublayerView` is the wrapper of [`KnowledgeGraphSublayer`](https://developers.arcgis.com/javascript/latest/references/core/layers/knowledgeGraph/KnowledgeGraphSublayer/) and
 * [`KnowledgeGraphSublayerView`](https://developers.arcgis.com/javascript/latest/references/core/views/layers/KnowledgeGraphSublayerView/).
 * It is used to synchronize state with `KnowledgeGraphSublayerDataSource`.
 */
export declare class JimuKnowledgeGraphSublayerView extends JimuQueriableLayerView {
    /**
     * The `layer` is the [ArcGIS Maps SDK for JavaScript `KnowledgeGraphSublayer`](https://developers.arcgis.com/javascript/latest/references/core/layers/knowledgeGraph/KnowledgeGraphSublayer/).
     */
    layer: __esri.KnowledgeGraphSublayer;
    /**
     * The `view` is the [ArcGIS Maps SDK for JavaScript `KnowledgeGraphSublayerView`](https://developers.arcgis.com/javascript/latest/references/core/views/layers/KnowledgeGraphSublayerView/).
     */
    view: __esri.KnowledgeGraphSublayerView;
    constructor(options: JimuKnowledgeGraphSublayerViewOptions);
    getLayerDataSource(): KnowledgeGraphSublayerDataSource;
    createLayerDataSource(): Promise<KnowledgeGraphSublayerDataSource>;
}
