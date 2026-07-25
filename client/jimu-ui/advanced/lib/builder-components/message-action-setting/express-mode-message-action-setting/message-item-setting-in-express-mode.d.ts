import type { IMMessageJson, MessageAction } from 'jimu-core';
interface Props {
    settingClassUri: string;
    widgetId: string;
    actionId: string;
    action: MessageAction;
    message: IMMessageJson;
    sidePopperTrigger?: any;
    onMessageChanged: (message: IMMessageJson) => void;
    closePanel: () => void;
}
declare const MessageActionItemSetting: (props: Props) => import("@emotion/react/jsx-runtime").JSX.Element;
export default MessageActionItemSetting;
