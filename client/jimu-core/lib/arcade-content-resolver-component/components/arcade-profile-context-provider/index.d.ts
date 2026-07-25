import * as React from 'react';
import { type ImmutableArray } from 'seamless-immutable';
import type { UseDataSource } from '../../../types/app-config';
import { type ArcadeProfileContext } from '../../../types/arcade-content';
import type { ComponentExtraProps } from '../../utils';
export interface ArcadeProfileContextProviderProps {
    usedForArcadeEditor: boolean;
    usedForArcadeField: boolean;
    widgetId: string;
    useDataSources: ImmutableArray<UseDataSource>;
    arcadeField?: string;
    isFromRepeatedDataSourceContext: boolean;
    onProfileContextChange: (profileContext: ArcadeProfileContext, ready: boolean) => void;
    onDirty?: () => void;
}
type FinalArcadeProfileContextProviderProps = ArcadeProfileContextProviderProps & ComponentExtraProps;
export declare const ArcadeProfileContextProvider: React.FC<import("react-intl").WithIntlProps<FinalArcadeProfileContextProviderProps>> & {
    WrappedComponent: React.ComponentType<FinalArcadeProfileContextProviderProps>;
};
export {};
