import { type DataSource } from 'jimu-core';
/**
 * `JimuTableConstructorOptions` is used in the constructor of the `JimuTable` to initiate a `JimuTable` instance.
 */
export interface JimuTableConstructorOptions {
    /**
     * The unique ID of the JimuTable instance.
     */
    id: string;
    /**
     * The data source ID of the corresponding table.
     */
    tableDataSourceId: string;
    /**
     * The ID of the parent JimuLayerView for the JimuTable. This property is only populated if the table has a parent layer.
     */
    parentJimuLayerViewId: string;
    /**
     * The ID of the corresponding JimuMapView instance.
     */
    jimuMapViewId: string;
    /**
     * The underlying table instance.
     */
    table: __esri.Layer;
}
/**
 * `JimuTable` is the wrapper of the table in ArcGIS Maps SDK for JavaScript. Each `JimuTable` corresponds to a table data source.
 */
export declare class JimuTable {
    /**
     * The unique ID of the JimuTable instance.
     */
    id: string;
    /**
     * The data source ID of the corresponding table.
     * `tableDataSourceId` always has value, but the table data source may not be created.
     */
    tableDataSourceId: string;
    /**
     * The ID of the parent JimuLayerView for the JimuTable. This property is only populated if the table has a parent layer.
     */
    parentJimuLayerViewId: string;
    /**
     * The ID of the corresponding JimuMapView instance.
     */
    jimuMapViewId: string;
    /**
     * The underlying table instance.
     */
    table: __esri.FeatureLayer | __esri.KnowledgeGraphSublayer;
    /**
     * Indicates whether the table is loaded and ready to use.
     */
    isLoaded: boolean;
    constructor(options: JimuTableConstructorOptions);
    /**
     * Return the corresponding data source of the table.
     */
    getTableDataSource(): DataSource;
    /**
     * Create corresponding data source for the table.
     */
    createTableDataSource(): Promise<DataSource>;
}
