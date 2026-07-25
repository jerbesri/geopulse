/** @jsx jsx */
import { React, type IMThemeVariables, type IntlShape } from 'jimu-core';
import { type Placement } from 'jimu-ui';
import type { ExpressionBuilderProps } from '../../types';
interface State {
    SidePopper: any;
}
export interface ExpressionBuilderPopupProps extends ExpressionBuilderProps {
    /**
     * Whether to show the popup.
     */
    isOpen: boolean;
    /**
     * Callback when the close icon in header of the popup is clicked.
     */
    onClose: () => void;
    /**
     * See `SidePopper` in jimu-ui/advanced/setting-components for more details.
     */
    trigger?: HTMLElement | HTMLElement[];
    /**
     * See `SidePopper` in jimu-ui/advanced/setting-components for more details.
     */
    backToFocusNode?: HTMLElement;
    /**
     * Optional reference element to anchor a `Popper`. If provided, will use `Popper` instead of `SidePopper`.
     */
    reference?: HTMLElement;
    /**
     * Popper placement when `reference` is provided.
     */
    placement?: Placement;
    /**
     * Optional style for the popup container.
     */
    popupStyle?: React.CSSProperties;
}
interface ExtraProps {
    /**
     * @ignore
     */
    theme: IMThemeVariables;
    /**
     * @ignore
     */
    intl: IntlShape;
}
/**
 * The `ExpressionBuilderPopup` component allows users to build an Expression using a popup.
 *
 * ```ts
 * import { ExpressionBuilderPopup } from 'jimu-ui/advanced/expression-builder'
 * ```
 */
export declare class _ExpressionBuilderPopup extends React.PureComponent<ExpressionBuilderPopupProps & ExtraProps, State> {
    overflowYStyle: React.CSSProperties;
    __unmount: boolean;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
declare const ExpressionBuilderPopup: React.ForwardRefExoticComponent<Pick<Omit<ExpressionBuilderPopupProps & ExtraProps, "intl"> & {
    forwardedRef?: React.Ref<any>;
}, "forwardedRef" | keyof ExpressionBuilderPopupProps> & {
    theme?: IMThemeVariables;
}>;
export default ExpressionBuilderPopup;
