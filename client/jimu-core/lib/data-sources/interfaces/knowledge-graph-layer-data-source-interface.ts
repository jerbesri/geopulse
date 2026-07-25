import type { AbstractArcGISLayerFolderDataSource, DataSourceTypes } from './common-data-source-interface'

export interface KnowledgeGraphLayerDataSource extends AbstractArcGISLayerFolderDataSource {
  type: DataSourceTypes.KnowledgeGraphLayer
}
