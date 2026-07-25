import * as React from 'react';
import { type ImmutableArray } from 'seamless-immutable';
import type { UseDataSource } from '../../types/app-config';
import { type IMArcadeContentConfig, type ArcadeContent, type IMArcadeContent, ArcadeContentCapability, type ArcadeIcon } from '../../types/arcade-content';
import type { ComponentExtraProps } from '../utils';
export interface ArcadeContentResolvedResult {
    success: boolean;
    arcadeContent: IMArcadeContent;
}
export interface ArcadeContentResolverComponentProps {
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
     * The Arcade content config that need to be resolved.
     */
    config: IMArcadeContentConfig;
    /**
     * This callback will be called when the parsed Arcade content changes.
     */
    onChange: (arcadeContent: IMArcadeContent, success?: boolean) => void;
    /**
     * @ignore
     * This callback will be called when the component starts parsing Arcade content.
     */
    onLoading?: () => void;
    /**
     * @ignore
     * This callback will be called when the component finishes parsing Arcade content.
     */
    onLoaded?: (arcadeContentResolvedResult: ArcadeContentResolvedResult) => void;
}
type FinalArcadeContentResolverComponentProps = ArcadeContentResolverComponentProps & ComponentExtraProps;
export declare function getArcadeContentByRawArcadeResult(rawArcadeResult: any, capabilities: ArcadeContentCapability[], icons: ImmutableArray<ArcadeIcon>): ArcadeContent;
/**
 * The component is used to resolve Arcade content.
 *
 * ```ts
 * import { ArcadeContentResolverComponent } from 'jimu-core'
 * ```
 */
export declare const ArcadeContentResolverComponent: React.FC<import("react-intl").WithIntlProps<FinalArcadeContentResolverComponentProps>> & {
    WrappedComponent: React.ComponentType<FinalArcadeContentResolverComponentProps>;
};
export {};
