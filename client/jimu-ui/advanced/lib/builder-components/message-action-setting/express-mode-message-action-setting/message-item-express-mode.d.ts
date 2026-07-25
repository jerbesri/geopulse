import type { IMThemeVariables, IMMessageJson, IMWidgetJson } from 'jimu-core';
import type { IMPublishMessageItem, FrameWorkTargetJson } from '../types/type';
interface Props {
    widgetId: string;
    theme: IMThemeVariables;
    messages: IMMessageJson[];
    publishMessageItem: IMPublishMessageItem;
    sidePopperTrigger?: any;
}
export type TargetJson = IMWidgetJson | FrameWorkTargetJson;
declare const MessageActionItem: (props: Props) => import("@emotion/react/jsx-runtime").JSX.Element;
export default MessageActionItem;
