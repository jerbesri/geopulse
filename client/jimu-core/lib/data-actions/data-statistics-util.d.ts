import type { IntlShape } from 'react-intl';
import { type StatisticDefinition, type DataRecord, type FeatureLayerDataSource, type SceneLayerDataSource, type DataRecordSet, type KnowledgeGraphSublayerDataSource } from '../data-sources';
import type { FieldFormatProperties } from '../types/app-config';
export type StatResult = {
    [statType in StatisticDefinition['statisticType'] | 'countEmpty']?: number;
};
export declare const statTypes: Array<keyof StatResult>;
export declare const queryFieldStatistics: (ds: FeatureLayerDataSource | SceneLayerDataSource | KnowledgeGraphSublayerDataSource, fieldName: string) => Promise<StatResult>;
export declare const getFieldStatistics: (records: DataRecord[], fieldName: string) => StatResult;
export declare const getStatisticalFields: (dataSet: DataRecordSet) => string[];
export declare const formatStatisticsNumber: (value: number, fieldFormat: FieldFormatProperties, intl: IntlShape) => string;
