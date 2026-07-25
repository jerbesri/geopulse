import { DataSourceTypes, type KnowledgeGraphSublayerDataSource } from 'jimu-core';
import { AbstractArcGISQueriableDataSource } from '../base-classes/abstract-arcgis-queriable-data-source';
import type { GeometryType } from '@esri/arcgis-rest-feature-service';
export declare class KnowledgeGraphSublayerDataSourceImpl extends AbstractArcGISQueriableDataSource implements KnowledgeGraphSublayerDataSource {
    type: DataSourceTypes.KnowledgeGraphSublayer;
    constructor(options: any);
    protected jsAPILayerQueryObjectIds(query: __esri.Query | __esri.QueryProperties, layer?: __esri.KnowledgeGraphSublayer | __esri.FeatureLayer): Promise<Array<number | string>>;
    protected jsAPILayerQueryFeatures(query: __esri.Query | __esri.QueryProperties, layer?: __esri.KnowledgeGraphSublayer | __esri.FeatureLayer): Promise<__esri.FeatureSet>;
    protected jsAPILayerQueryFeatureCount(query: __esri.Query | __esri.QueryProperties, layer?: __esri.KnowledgeGraphSublayer | __esri.FeatureLayer): Promise<number>;
    protected jsAPILayerQueryExtent(query: __esri.Query | __esri.QueryProperties, layer?: __esri.KnowledgeGraphSublayer | __esri.FeatureLayer): Promise<{
        count: number;
        extent: __esri.Extent;
    }>;
    getGeometryType(): GeometryType;
    getPopupInfoFields(): string[];
    private getReferenceLayerOrTable;
    private isKnowledgeGraphParentDataSource;
    private getParentDataSourceForLayerCreation;
    private findLayerOrTableBySource;
    createJSAPILayerByDataSource(dataSource?: KnowledgeGraphSublayerDataSource, useDataSourceQueryParams?: boolean, throwError?: boolean): Promise<__esri.KnowledgeGraphSublayer | __esri.FeatureLayer>;
    ready(): Promise<any>;
}
