import type { UseDataSource } from '../../types/app-config';
import type { IMState } from '../../types/state';
import type { ImmutableArray } from 'seamless-immutable';
export interface ClearFilterDataSourcesResult {
    resetToken: number;
    clearFilterDataSourceIds: string[];
}
export declare const isQueryCleared: (query: any) => boolean;
/**
 * Check whether the data source filter just transitioned from non-cleared to cleared.
 */
export declare const isDataSourceFilterJustCleared: (dsId: string, widgetId: string, preQuery: any, state?: IMState) => boolean;
/**
 * Get data source ids whose filter changed from non-cleared to cleared for a specific widget.
 */
export declare const getNewlyClearedFilterDataSourceIds: (widgetId: string, useDataSources: ImmutableArray<UseDataSource>, dataSourcesInfo: IMState["dataSourcesInfo"], preDataSourcesInfo: IMState["dataSourcesInfo"]) => string[];
export declare const useClearDataSourceFilters: (widgetId: string, useDataSources?: ImmutableArray<UseDataSource>) => ClearFilterDataSourcesResult;
