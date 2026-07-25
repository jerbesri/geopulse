/** @jsx jsx */
import { React, type ActionSettingProps, type ActionSettingOptions, type IMMessageActionJson, type IMMessageJson } from 'jimu-core';
interface Props {
    action: IMMessageActionJson;
    message: IMMessageJson;
    widgetId: string;
    disableActionSetting: boolean;
    onUpdateAction?: (message: IMMessageJson, action: IMMessageActionJson, isClosePanel: boolean) => void;
    formatMessage: (id: string) => string;
}
interface States {
    settingClass: React.ComponentClass<ActionSettingProps<unknown>>;
    cacheActionJson: IMMessageActionJson;
    isDisableDoneBtn: boolean;
}
export default class ActionSetting extends React.PureComponent<Props, States> {
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(preProps: any): void;
    getActionSettingClass: () => void;
    onSettingChange: (settingOptions: ActionSettingOptions) => void;
    onDisableDoneBtn: (disabled: boolean) => void;
    renderActionSetting: () => import("@emotion/react/jsx-runtime").JSX.Element;
    style(): import("jimu-core").SerializedStyles;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
export {};
