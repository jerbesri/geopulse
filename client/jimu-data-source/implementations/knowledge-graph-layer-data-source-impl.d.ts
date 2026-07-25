import { DataSourceTypes, type KnowledgeGraphLayerDataSource } from 'jimu-core';
import { AbstractLayerFolderDataSource, type LayerFolderChildDataSourceConstructorOptions } from '../base-classes/abstract-layer-folder-data-source';
export declare class KnowledgeGraphLayerDataSourceImpl extends AbstractLayerFolderDataSource implements KnowledgeGraphLayerDataSource {
    type: DataSourceTypes.KnowledgeGraphLayer;
    layer: __esri.KnowledgeGraphLayer;
    private getChildIdByLayerOrTable;
    private getChildLayerOrTableByChildId;
    createChildDataSourceOptionsById(childDsId: string, jimuChildId: string, childId: string): LayerFolderChildDataSourceConstructorOptions;
    getChildIds(): string[];
    createJSAPILayerByDataSource(dataSource?: KnowledgeGraphLayerDataSource, useDataSourceQueryParams?: boolean, throwError?: boolean): Promise<__esri.KnowledgeGraphLayer>;
    ready(): Promise<void>;
}
