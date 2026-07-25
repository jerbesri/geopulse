import * as React from 'react';
import { type ImmutableArray, type ImmutableObject } from 'seamless-immutable';
import type { UseDataSource } from '../../types/app-config';
import type { ArcadeContentCapability, IMArcadeContentConfigMap } from '../../types/arcade-content';
import { type ArcadeContentResolvedResult } from './arcade-content-resolver-component';
export interface ArcadeContentResolvedResultMap {
    [arcadeId: string]: ArcadeContentResolvedResult;
}
export type IMArcadeContentResolvedResultMap = ImmutableObject<ArcadeContentResolvedResultMap>;
export interface MultipleArcadeContentResolverComponentProps {
    /**
     * Arcade content includes value and styles.
     * If `capabilities` includes `ArcadeContentCapability.Value`, it means that the component can resolves value.
     * If `capabilities` includes `ArcadeContentCapability.Style`, it means that the component can resolves styles.
     * If `capabilities` is null, undefined or an empty array, then it use default value [ArcadeContentCapability.Value, ArcadeContentCapability.Style].
     */
    capabilities: ArcadeContentCapability[];
    /**
     * The id of the widget that uses this component.
     */
    widgetId: string;
    /**
     * Widget's `useDataSources`, the data sources that the widget is using.
     */
    useDataSources: ImmutableArray<UseDataSource>;
    /**
     * Multiple Arcade content configs that need to be resolved.
     */
    configMap: IMArcadeContentConfigMap;
    /**
     * This callback will be called when any parsed Arcade content changes.
     */
    onChange: (arcadeContentResolvedResultMap: IMArcadeContentResolvedResultMap) => void;
    /**
     * @ignore
     * This callback will be called when any child component starts parsing Arcade content.
     */
    onLoading?: () => void;
    /**
     * @ignore
     * This callback will be called when all child components finish parsing Arcade content.
     */
    onLoaded?: (arcadeContentResolvedResultMap: IMArcadeContentResolvedResultMap) => void;
}
declare function MultipleArcadeContentResolverComponentImpl(props: MultipleArcadeContentResolverComponentProps): import("@emotion/react/jsx-runtime").JSX.Element;
/**
 * This component is used to resolve multiple Arcade contents.
 *
 * ```ts
 * import { MultipleArcadeContentResolverComponent } from 'jimu-core'
 * ```
 */
export declare const MultipleArcadeContentResolverComponent: React.MemoExoticComponent<typeof MultipleArcadeContentResolverComponentImpl>;
export {};
