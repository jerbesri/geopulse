/** @jsx jsx */
import { React, type IMMessageJson, type IMThemeVariables, type SerializedStyles } from 'jimu-core';
export declare enum PathType {
    MessageChoose = "MESSAGECHOOSE",
    TargetChoose = "TARGETCHOOSE",
    ActionChoose = "ACTIONCHOOSE",
    ActionSetting = "ACTIONSETTING"
}
export interface Route {
    pathType: PathType;
    message: IMMessageJson;
}
interface Props {
    Routes?: Route[];
    title: string;
    onBack?: () => void;
    onClose?: () => void;
    hideBackArrow?: boolean;
    formatMessage: (id: string) => string;
    theme: IMThemeVariables;
    children?: React.ReactNode;
}
export default class _RouterShell extends React.PureComponent<Props, unknown> {
    getStyle(theme: IMThemeVariables): SerializedStyles;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
export declare const RouterShell: React.ForwardRefExoticComponent<Pick<Props, "title" | "onClose" | "children" | "onBack" | "formatMessage" | "Routes" | "hideBackArrow"> & {
    theme?: IMThemeVariables;
}>;
export {};
