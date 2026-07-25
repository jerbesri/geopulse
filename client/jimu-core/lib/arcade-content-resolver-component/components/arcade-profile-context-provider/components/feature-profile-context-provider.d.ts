import * as React from 'react';
import type { RepeatedDataSource } from '../../../../repeat-data-source-context';
import type { FeatureProfileContext } from '../../../../types/arcade-content';
import { type ComponentExtraProps } from '../../../utils';
export interface FeatureProfileContextProviderProps {
    usedForArcadeEditor: boolean;
    onProfileContextChange: (profileContext: FeatureProfileContext, ready: boolean, repeatedDataSource: RepeatedDataSource) => void;
}
type FinalFeatureProfileContextProviderProps = FeatureProfileContextProviderProps & ComponentExtraProps;
export declare const FeatureProfileContextProvider: React.FC<import("react-intl").WithIntlProps<FinalFeatureProfileContextProviderProps>> & {
    WrappedComponent: React.ComponentType<FinalFeatureProfileContextProviderProps>;
};
export {};
