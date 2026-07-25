/** @jsx jsx */
import { React, ReactRedux, type ImmutableArray, type ActionSettingProps, type UseDataSource, MessageType } from 'jimu-core';
interface Config {
    sectionId: string;
    viewId: string;
    defaultView: string;
    resetToDefaultView?: boolean;
    useDataSources?: UseDataSource[];
}
interface StateExtraProps {
    defaultView: string;
    views: ImmutableArray<string>;
}
interface State {
    useCustomData: boolean;
}
declare class _ChangeViewActionSetting extends React.PureComponent<ActionSettingProps<Config> & StateExtraProps, State> {
    constructor(props: any);
    handleViewChange: (_evt: any, viewId: string) => void;
    handleDataChange: (useDataSources: UseDataSource[]) => void;
    handleResetToDefaultViewChange: (evt: any, checked: any) => void;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
declare const _default: ReactRedux.ConnectedComponent<typeof _ChangeViewActionSetting, {
    config?: Config;
    widgetId?: string;
    useDataSources?: UseDataSource[];
    ref?: React.Ref<_ChangeViewActionSetting>;
    key?: React.Key | null | undefined;
    sectionId?: string;
    intl?: import("jimu-core").IntlShape;
    dataSourceId?: string;
    messageType: MessageType;
    actionId: string;
    messageWidgetId: string;
    onSettingChange: import("jimu-core").ActionSettingChangeFunction;
    onDisableDoneBtn?: (isDisable: boolean) => void;
    context?: React.Context<ReactRedux.ReactReduxContextValue<any, import("redux").UnknownAction>>;
    store?: import("redux").Store;
}>;
export default _default;
