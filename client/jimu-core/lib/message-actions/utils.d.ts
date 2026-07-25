import { JimuFieldType } from '../types/common';
import { type SqlExpression } from '../types/sql-expression';
import type { ImmutableObject } from '../../index';
import type { FieldSchema } from '../../lib/types/app-config';
import type { DataSource, DataRecord } from '../data-sources';
export declare const MAX_TOTAL_COUNT = 1000;
/**
 * @ignore
 */
export declare function formatValue(value: any, type: string): string | number;
/**
 * @ignore
 */
export declare function getSqlExpressionWidthMessageFieldValues(messageFieldValues: string[], actionField: ImmutableObject<FieldSchema>, actionDataSource: DataSource, useCaseSensitive?: boolean): SqlExpression;
export declare function checkIsExecuteFilteringChangeMessage(messageDsId: string, id: string): Promise<boolean>;
export declare function getIdFieldOfDs(ds: DataSource): string | string[];
export declare function getSQLForAutoBoundDs(ds: DataSource, records: DataRecord[], useCaseSensitive?: boolean): SqlExpression;
export declare function getMessageFieldValues(records: DataRecord[], messageFieldName: string, actionFieldType: JimuFieldType, isIdField?: boolean): string[];
export declare function queryAllRecords(q: any, ds: DataSource): Promise<any>;
export declare function isMainDataSourceId(dataSourceId: string): boolean;
export declare function getMainDataSourceId(dataSourceId: string): string;
