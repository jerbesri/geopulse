import { React } from 'jimu-core';
import type { StandardComponentProps } from '../types';
/**
 * The `WidgetButton` component props.
 */
export interface WidgetButtonProps extends StandardComponentProps {
    /**
     * The widget's id.
     */
    widgetId: string;
    /**
     * The label of the widget button.
     * If not provided, the widget's default label will be used.
     */
    label?: string;
    /**
     * Click handler of the widget button.
     * This won't be triggered in design mode.
     */
    onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * An optional element that acts as a custom icon.
     * If not provided, the widget's default icon will be used.
     */
    children?: React.ReactElement<any, any>;
}
interface WidgetButtonContextProps {
    showTooltip: boolean;
    isDesignMode: boolean;
}
export declare const WidgetButtonContext: React.Context<WidgetButtonContextProps>;
/**
 * The `WidgetButton` component renders a controller style button for a widget with 'inController' UX design.
 *
 * For example:
 * The Theme Mode Switcher widget uses this component to render its button in the controller button list.
 * When user clicks the button, the widget directly switches between dark/light mode and display corresponding icon.
 *
 * ```ts
 * import { WidgetButton } from 'jimu-ui'
 * ```
 */
export declare const WidgetButton: React.ForwardRefExoticComponent<WidgetButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
