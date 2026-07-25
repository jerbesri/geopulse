import type { ArcGISQueriableDataSource } from './arcgis-queriable-data-source-interface'
import type { DataSourceTypes } from './common-data-source-interface'

export interface KnowledgeGraphSublayerDataSource extends ArcGISQueriableDataSource {
  type: DataSourceTypes.KnowledgeGraphSublayer
}
