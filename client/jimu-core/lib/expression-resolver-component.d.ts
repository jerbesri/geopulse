import * as React from 'react';
import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import { type IntlShape } from 'react-intl';
import { type IMExpression, type IMAdvancedExpression, type IMExpressionMap } from './types/expression';
import { type DataRecord } from './data-sources';
import type { UseDataSource } from './types/app-config';
import { type RepeatedDataSource } from './repeat-data-source-context';
interface BaseExpressionMap {
    [expressionId: string]: IMExpression;
}
type IMBaseExpressionMap = ImmutableObject<BaseExpressionMap>;
/**
 * If passing in multiple expressions, the changed results will contain multiple `SingleExpressionResolveResult`s.
 */
export interface MultipleExpressionResolveResults {
    [expressionId: string]: SingleExpressionResolveResult;
}
/**
 * Single expression resolve result.
 */
export interface SingleExpressionResolveResult {
    /**
     * Whether the resolve is successful.
     */
    isSuccessful: boolean;
    /**
     * Result value.
     * If succeed, the value is a string of the resolving result.
     * If failed, the value is `ExpressionResolverErrorCode`.
     */
    value: string | ExpressionResolverErrorCode;
}
export interface MultipleOriginExpressionResolveResults {
    [expressionId: string]: SingleOriginExpressionResolveResult;
}
export interface SingleOriginExpressionResolveResult {
    isSuccessful: boolean;
    /**
     * Result value.
     * If succeed, the value is a string of the resolving result.
     * If failed, the value is `ExpressionResolverErrorCode`.
     */
    value: string | number | Date | ExpressionResolverErrorCode;
}
/**
 * The function will be called whenever resolved results change.
 */
export type ResolverRenderFunction = (resolvedResults: MultipleExpressionResolveResults | SingleExpressionResolveResult) => React.ReactNode;
/**
 * If resolving expression fails, the error code will be returned to indicate the reason for the failure.
 */
export declare enum ExpressionResolverErrorCode {
    /**
     * Failed to resolve the expression
     */
    Failed = "RESOLVE_FAILED",
    /**
     * Expression not resolved since some data sources in the expression were not in widget's `useDataSources`.
     */
    NotMatched = "DATA_SOURCES_IN_EXPRESSION_CANNOT_MATCH_DATA_SOURCES_IN_USE"
}
/**
 * The BaseExpressionResolverComponent component props.
 */
export interface BaseExpressionResolverComponentProps {
    /**
     * Expressions that need to be resolved.
     */
    expression: IMBaseExpressionMap | IMExpression;
    /**
     * Id of the widget.
     */
    widgetId: string;
    /**
     * Widget's `useDataSources`, the data sources that the widget is using.
     * If the data source of one expression part is not in the array, this part will not be resolved.
     *
     * Must pass in one of `useDataSources` and `records`.
     */
    useDataSources?: ImmutableArray<UseDataSource>;
    /**
     * If included, it will use these `records` to resolve the expression.
     * If not, it will use `useDataSources` to create the data source instances, then use these data sources to resolve the expression.
     *
     * Must pass in one of `useDataSources` and `records`.
     */
    records?: {
        [dataSourceId: string]: DataRecord[];
    };
    /**
     * If one of children components' rendering depends on the resolved result, you can choose to use this render function.
     */
    children?: ResolverRenderFunction | React.ReactNode;
    /**
     * Whether or not the expression is resolved successfully, the function will be called.
     */
    onChange?: (resolvedResults: MultipleExpressionResolveResults | SingleExpressionResolveResult) => void;
    /**
     * @ignore
     * This callback will be called when the component starts parsing expressions.
     */
    onLoading?: () => void;
    /**
     * @ignore
     * This callback will be called when the component finishes parsing expressions.
     * The results can be either successful or failed.
     */
    onLoaded?: () => void;
    /**
     * @ignore
     * The function will be called whenever the original resolved results change.
     * The original resolved results are the results before formatting.
     */
    onOriginResolveValueChange?: (resolvedResults: MultipleOriginExpressionResolveResults | SingleOriginExpressionResolveResult) => void;
}
interface ExtraProps {
    /**
     * @ignore
     */
    intl: IntlShape;
    /**
     * @ignore
     */
    repeatedDataSource: RepeatedDataSource | RepeatedDataSource[];
}
/**
 * The ExpressionResolverComponent component props.
 */
export interface ExpressionResolverComponentProps extends Omit<BaseExpressionResolverComponentProps, 'expression'> {
    expression: IMExpressionMap | IMExpression | IMAdvancedExpression;
}
/**
 * The component is used to resolve `Expression` and `AdvancedExpression` .
 * In most cases, passing on `useDataSources`, `expression` and `widgetId`, you can get the resolved result in the function `onChange`.
 *
 * ```ts
 * import { ExpressionResolverComponent } from 'jimu-core'
 * ```
 */
export declare const ExpressionResolverComponent: React.FC<import("react-intl").WithIntlProps<Omit<ExpressionResolverComponentProps & ExtraProps, "repeatedDataSource">>> & {
    WrappedComponent: React.ComponentType<Omit<ExpressionResolverComponentProps & ExtraProps, "repeatedDataSource">>;
};
export {};
