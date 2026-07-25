import { BrowserSizeMode } from '../../types/common';
import type { A11yLandmarks } from '../../types/app-config';
/**
 * For body element.
 * Add it when keyboard nav mode.
 * Remove it when mouse nav mode.
 */
export declare const KEYBOARD_NAV_CLASS = "jimu-keyboard-nav";
export declare const INTERACTIVE_CLASS = "jimu-interactive-node";
export declare const WIDGET_PREFIX_FOR_A11Y_SKIP = "jimu-widget-a11y-";
export declare function isKeyboardMode(): boolean;
/**
 * Focus on the element in keyboard mode
 * @param element the interactive element, or an object with a focus method.
 * @param forceFocus Focus the element ignoring the keyboardMode. Default: false.
 */
export declare function focusElementInKeyboardMode<T extends HTMLElement | {
    focus: () => void;
}>(element: T, forceFocus?: boolean): void;
export declare function FocusVisibility(props: any): import("@emotion/react/jsx-runtime").JSX.Element;
export declare function getA11yProps(widgetId: string, label: string, a11yLabel: string, a11yLandmark: A11yLandmarks, addToA11ySkip: boolean): any;
/**
 * Get all widget ids in the page root containers.
 */
export declare function getWidgetIdsInRootContainers(appConfig: any, browserSizeMode: BrowserSizeMode, currentPageId: string, getContentsInLayout: any): string[];
/**
 * Get all skipTo ids in the page, including header, footer and widgets in body with `addToA11ySkip` enabled.
 */
export declare function getPageSkipToIds(appConfig: any, browserSizeMode: BrowserSizeMode, currentPageId: string): string[];
