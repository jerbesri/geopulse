import { type SqlClause, type SqlClauseSet, type DataSource, type IMFieldSchema, type IMSqlExpression, type IMGroupSqlExpression, type IMSqlClause, ClauseType, type SqlExpression, Immutable, type extensionSpec } from 'jimu-core';
/**
 * @ignore
 */
export declare function getClauseArrayByChange(partArray: Array<SqlClause | SqlClauseSet>, clause: SqlClause | SqlClauseSet, id: string): Array<SqlClause | SqlClauseSet>;
/**
 * @ignore
 */
export declare function getCamelCase(name: string): string;
/**
 * @ignore
 * Get ArcGIS SQL for current clause if it's configured as askForValue = true.
 * Only use for CascadeSupportedList
 */
export declare function getCascadeSQL(sqlExprObj: IMSqlExpression, clause: SqlClause, clauseId: string, dataSource: DataSource): string;
/**
 * Get affected SqlExpression for current clause if it's configured as askForValue = true.
 * @ignore
 */
export declare function getCascadeSqlExpression(sqlExprObj: IMSqlExpression, clause: SqlClause, clauseId: string, dataSource: DataSource): SqlExpression;
/**
 * Get all jimu field names from a SQL Expression.
 * The jimu field names should be bound to the data source for widget.
 */
export declare function getJimuFieldNamesBySqlExpression(sqlExprObj: IMSqlExpression): string[];
/**
 * It's used to check whether a sql expression object is valid or not.
 */
export declare function isSqlExpressionValid(sqlExprObj: IMSqlExpression): boolean;
/**
 * get number of clauses which support askForValue or displayLabel to endUser.
 */
export declare function getShownClauseNumberByExpression(sqlExprObj: IMSqlExpression): number;
/**
 * get total number of all configured clauses.
 */
export declare function getTotalClauseNumberByExpression(sqlExprObj: IMSqlExpression): number;
export declare function getSQLExpressionWithoutValues(sqlExprObj: IMSqlExpression): {
    parts: Immutable.ImmutableArray<IMSqlClause | {
        parts: Immutable.ImmutableArray<IMSqlClause>;
        set<K extends keyof SqlClauseSet>(property: K, value: SqlClauseSet[K]): Immutable.ImmutableObject<SqlClauseSet>;
        set<TValue>(property: string, value: TValue): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<K extends keyof SqlClauseSet>(propertyPath: [K], value: SqlClauseSet[K]): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K]>(propertyPath: [K, L], value: SqlClauseSet[K][L]): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L]>(propertyPath: [K, L, M], value: SqlClauseSet[K][L][M]): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M]>(propertyPath: [K, L, M, N], value: SqlClauseSet[K][L][M][N]): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M], O extends keyof SqlClauseSet[K][L][M][N]>(propertyPath: [K, L, M, N, O], value: SqlClauseSet[K][L][M][N][O]): Immutable.ImmutableObject<SqlClauseSet>;
        setIn<TValue>(propertyPath: string[], value: TValue): Immutable.ImmutableObject<SqlClauseSet>;
        getIn<K extends keyof SqlClauseSet>(propertyPath: [K]): Immutable.Immutable<SqlClauseSet[K], {}>;
        getIn<K extends keyof SqlClauseSet>(propertyPath: [K], defaultValue: SqlClauseSet[K]): Immutable.Immutable<SqlClauseSet[K], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K]>(propertyPath: [K, L]): Immutable.Immutable<SqlClauseSet[K][L], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K]>(propertyPath: [K, L], defaultValue: SqlClauseSet[K][L]): Immutable.Immutable<SqlClauseSet[K][L], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L]>(propertyPath: [K, L, M]): Immutable.Immutable<SqlClauseSet[K][L][M], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M]>(propertyPath: [K, L, M, N]): Immutable.Immutable<SqlClauseSet[K][L][M][N], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M]>(propertyPath: [K, L, M, N], defaultValue: SqlClauseSet[K][L][M][N]): Immutable.Immutable<SqlClauseSet[K][L][M][N], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M], O extends keyof SqlClauseSet[K][L][M][N]>(propertyPath: [K, L, M, N, O]): Immutable.Immutable<SqlClauseSet[K][L][M][N][O], {}>;
        getIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M], O extends keyof SqlClauseSet[K][L][M][N]>(propertyPath: [K, L, M, N, O], defaultValue: SqlClauseSet[K][L][M][N][O]): Immutable.Immutable<SqlClauseSet[K][L][M][N][O], {}>;
        getIn(propertyPath: string[]): Immutable.Immutable<any>;
        getIn<TValue>(propertyPath: string[], defaultValue: TValue): Immutable.Immutable<TValue, {}>;
        asMutable(opts?: Immutable.AsMutableOptions<false>): {
            __id?: string;
            type: ClauseType;
            logicalOperator: import("jimu-core").ClauseLogic;
            parts: Immutable.ImmutableArray<SqlClause | SqlClauseSet>;
        };
        asMutable(opts: Immutable.AsMutableOptions<true>): SqlClauseSet;
        asMutable(opts: Immutable.AsMutableOptions): SqlClauseSet | {
            __id?: string;
            type: ClauseType;
            logicalOperator: import("jimu-core").ClauseLogic;
            parts: Immutable.ImmutableArray<SqlClause | SqlClauseSet>;
        };
        merge(part: Immutable.DeepPartial<SqlClauseSet | Immutable.ImmutableObject<SqlClauseSet>>, config?: Immutable.MergeConfig): Immutable.ImmutableObject<SqlClauseSet>;
        update<K extends keyof SqlClauseSet>(property: K, updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        update<TValue>(property: string, updaterFunction: (value: Immutable.Immutable<TValue, {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<K extends keyof SqlClauseSet>(propertyPath: [K], updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K]>(propertyPath: [K, L], updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K][L], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L]>(propertyPath: [K, L, M], updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K][L][M], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M]>(propertyPath: [K, L, M, N], updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K][L][M][N], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<K extends keyof SqlClauseSet, L extends keyof SqlClauseSet[K], M extends keyof SqlClauseSet[K][L], N extends keyof SqlClauseSet[K][L][M], O extends keyof SqlClauseSet[K][L][M][N]>(propertyPath: [K, L, M, N, O], updaterFunction: (value: Immutable.Immutable<SqlClauseSet[K][L][M][N][O], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        updateIn<TValue = any>(propertyPath: string[], updaterFunction: (value: TValue, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlClauseSet>;
        without<K extends keyof SqlClauseSet>(property: K): Immutable.ImmutableObject<SqlClauseSet>;
        without<K extends keyof SqlClauseSet>(...properties: K[]): Immutable.ImmutableObject<SqlClauseSet>;
        without<K extends keyof SqlClauseSet>(filter: (value: SqlClauseSet[K], key: K) => boolean): Immutable.ImmutableObject<SqlClauseSet>;
        replace<S>(valueObj: S, options?: Immutable.ReplaceConfig): Immutable.Immutable<S>;
        __id?: string;
        type: ClauseType;
        logicalOperator: import("jimu-core").ClauseLogic;
    }>;
    set<K extends keyof SqlExpression>(property: K, value: SqlExpression[K]): Immutable.ImmutableObject<SqlExpression>;
    set<TValue>(property: string, value: TValue): Immutable.ImmutableObject<SqlExpression>;
    setIn<K extends keyof SqlExpression>(propertyPath: [K], value: SqlExpression[K]): Immutable.ImmutableObject<SqlExpression>;
    setIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K]>(propertyPath: [K, L], value: SqlExpression[K][L]): Immutable.ImmutableObject<SqlExpression>;
    setIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L]>(propertyPath: [K, L, M], value: SqlExpression[K][L][M]): Immutable.ImmutableObject<SqlExpression>;
    setIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M]>(propertyPath: [K, L, M, N], value: SqlExpression[K][L][M][N]): Immutable.ImmutableObject<SqlExpression>;
    setIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M], O extends keyof SqlExpression[K][L][M][N]>(propertyPath: [K, L, M, N, O], value: SqlExpression[K][L][M][N][O]): Immutable.ImmutableObject<SqlExpression>;
    setIn<TValue>(propertyPath: string[], value: TValue): Immutable.ImmutableObject<SqlExpression>;
    getIn<K extends keyof SqlExpression>(propertyPath: [K]): Immutable.Immutable<SqlExpression[K], {}>;
    getIn<K extends keyof SqlExpression>(propertyPath: [K], defaultValue: SqlExpression[K]): Immutable.Immutable<SqlExpression[K], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K]>(propertyPath: [K, L]): Immutable.Immutable<SqlExpression[K][L], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K]>(propertyPath: [K, L], defaultValue: SqlExpression[K][L]): Immutable.Immutable<SqlExpression[K][L], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L]>(propertyPath: [K, L, M]): Immutable.Immutable<SqlExpression[K][L][M], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M]>(propertyPath: [K, L, M, N]): Immutable.Immutable<SqlExpression[K][L][M][N], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M]>(propertyPath: [K, L, M, N], defaultValue: SqlExpression[K][L][M][N]): Immutable.Immutable<SqlExpression[K][L][M][N], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M], O extends keyof SqlExpression[K][L][M][N]>(propertyPath: [K, L, M, N, O]): Immutable.Immutable<SqlExpression[K][L][M][N][O], {}>;
    getIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M], O extends keyof SqlExpression[K][L][M][N]>(propertyPath: [K, L, M, N, O], defaultValue: SqlExpression[K][L][M][N][O]): Immutable.Immutable<SqlExpression[K][L][M][N][O], {}>;
    getIn(propertyPath: string[]): Immutable.Immutable<any>;
    getIn<TValue>(propertyPath: string[], defaultValue: TValue): Immutable.Immutable<TValue, {}>;
    asMutable(opts?: Immutable.AsMutableOptions<false>): {
        sql: string;
        displaySQL?: string;
        logicalOperator: import("jimu-core").ClauseLogic;
        parts: Immutable.ImmutableArray<SqlClause | SqlClauseSet>;
    };
    asMutable(opts: Immutable.AsMutableOptions<true>): SqlExpression;
    asMutable(opts: Immutable.AsMutableOptions): SqlExpression | {
        sql: string;
        displaySQL?: string;
        logicalOperator: import("jimu-core").ClauseLogic;
        parts: Immutable.ImmutableArray<SqlClause | SqlClauseSet>;
    };
    merge(part: Immutable.DeepPartial<SqlExpression | Immutable.ImmutableObject<SqlExpression>>, config?: Immutable.MergeConfig): Immutable.ImmutableObject<SqlExpression>;
    update<K extends keyof SqlExpression>(property: K, updaterFunction: (value: Immutable.Immutable<SqlExpression[K], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    update<TValue>(property: string, updaterFunction: (value: Immutable.Immutable<TValue, {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<K extends keyof SqlExpression>(propertyPath: [K], updaterFunction: (value: Immutable.Immutable<SqlExpression[K], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K]>(propertyPath: [K, L], updaterFunction: (value: Immutable.Immutable<SqlExpression[K][L], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L]>(propertyPath: [K, L, M], updaterFunction: (value: Immutable.Immutable<SqlExpression[K][L][M], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M]>(propertyPath: [K, L, M, N], updaterFunction: (value: Immutable.Immutable<SqlExpression[K][L][M][N], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<K extends keyof SqlExpression, L extends keyof SqlExpression[K], M extends keyof SqlExpression[K][L], N extends keyof SqlExpression[K][L][M], O extends keyof SqlExpression[K][L][M][N]>(propertyPath: [K, L, M, N, O], updaterFunction: (value: Immutable.Immutable<SqlExpression[K][L][M][N][O], {}>, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    updateIn<TValue = any>(propertyPath: string[], updaterFunction: (value: TValue, ...additionalParameters: any[]) => any, ...additionalArguments: any[]): Immutable.ImmutableObject<SqlExpression>;
    without<K extends keyof SqlExpression>(property: K): Immutable.ImmutableObject<SqlExpression>;
    without<K extends keyof SqlExpression>(...properties: K[]): Immutable.ImmutableObject<SqlExpression>;
    without<K extends keyof SqlExpression>(filter: (value: SqlExpression[K], key: K) => boolean): Immutable.ImmutableObject<SqlExpression>;
    replace<S>(valueObj: S, options?: Immutable.ReplaceConfig): Immutable.Immutable<S>;
    sql: string;
    displaySQL?: string;
    logicalOperator: import("jimu-core").ClauseLogic;
};
export declare function getGroupSQLExpressionWithoutValues(sqlExprObjForGroup: IMGroupSqlExpression): IMGroupSqlExpression;
/**
 * @ignore
 * Get clause label by i18n or custom label.
 */
export declare function getClauseLabel(clause: any, fieldObj: IMFieldSchema, operator: any, ignoreFieldLabel?: boolean): string;
/**
 * @ignore
 */
export declare function getClauseDefaultLabel(clause: any, fieldObj: IMFieldSchema, operator: any, ignoreFieldLabel?: boolean): string;
/**
 * Get translation keys from SQL expression builder component.
 * @param sqlExprObj
 * @param path
 * @returns
 */
export declare function getKeysInSqlExprBuilder(sqlExprObj: IMSqlExpression, path: string, groupKey?: string): extensionSpec.TranslationKey[];
export declare function getClauseKeys(clause: IMSqlClause, clausePath: string, clauseIndex: number, clauseSetIndex?: number, groupKey?: string): extensionSpec.TranslationKey[];
/**
 * @ignore
 */
export declare function updateSQLExpressionByVersion(sqlExpression: IMSqlExpression, version: string, dataSource: DataSource): SqlExpression;
