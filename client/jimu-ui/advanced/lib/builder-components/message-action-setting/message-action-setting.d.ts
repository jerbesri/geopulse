/** @jsx jsx */
import { React, type ImmutableObject, type MessageJson, type IMMessageJson, type IMMessageActionJson, type IMThemeVariables, type SerializedStyles, type MessageAction } from 'jimu-core';
import { type Route } from './router-shell';
import type { TargetJson } from './types/type';
interface Props {
    pageId?: string;
    widgetId?: string;
    dataSourceId?: string;
    theme: IMThemeVariables;
    messageConfigs: ImmutableObject<{
        [messageConfigId: string]: MessageJson;
    }>;
    isInDataSetting?: boolean;
    formatMessage: (id: string, values?: {
        [key: string]: any;
    }) => string;
}
interface States {
    currentTriggeredMessage?: IMMessageJson;
    currentTriggeredTarget?: TargetJson;
    currentTriggeredAction?: IMMessageActionJson;
    panelRoutes: Route[];
    disableActionSetting?: boolean;
}
export declare class MessageActionList extends React.PureComponent<Props, States> {
    modalStyle: SerializedStyles;
    messageActionStyle: SerializedStyles;
    sidePopperTrigger: React.RefObject<HTMLDivElement>;
    popperFocusNode: React.RefObject<HTMLElement>;
    constructor(props: any);
    componentDidUpdate(preProps: Props): void;
    resetState: () => void;
    getMessageOwner: () => {
        messageOwnerKey: "widgetId" | "dataSourceId";
        messageOwnerId: string;
    };
    getMessageOwnerFromMessage: (message: IMMessageJson) => {
        messageOwnerKey: "widgetId" | "dataSourceId";
        messageOwnerId: string;
    };
    updateLocalState: (newProps: Props, oldProps: Props) => void;
    getMessages: () => IMMessageJson[];
    onShowMessageChooseList: () => void;
    onMessageRemoved: (message: IMMessageJson) => void;
    onMessageChanged: (message: IMMessageJson) => void;
    onShowTargetChooseList: (message: IMMessageJson) => void;
    onShowActionSettingPage: (message: IMMessageJson, action: IMMessageActionJson, disableActionSetting?: boolean) => void;
    backForwardPanel: () => void;
    closePanel: () => void;
    onMessageChooseListSelected: (message: IMMessageJson) => void;
    onTargetChooseListSelected: (targetJson: TargetJson) => void;
    onActionChooseListSelected: (message: IMMessageJson, actionItem: IMMessageActionJson, action: MessageAction) => void;
    onUpdateAction: (message: IMMessageJson, action: IMMessageActionJson, isClosePanel: boolean) => void;
    render(): import("@emotion/react/jsx-runtime").JSX.Element;
}
export {};
