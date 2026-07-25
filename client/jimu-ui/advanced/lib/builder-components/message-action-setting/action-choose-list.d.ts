/** @jsx jsx */
import { React, type IMThemeVariables, type IMMessageJson, type IMMessageActionJson, type MessageAction } from 'jimu-core';
import type { TargetJson } from './types/type';
interface Props {
    theme: IMThemeVariables;
    message?: IMMessageJson;
    target?: TargetJson;
    messageOwnerId?: string;
    onSelected?: (messageJson: IMMessageJson, actionItem: IMMessageActionJson, action: MessageAction) => void;
    formatMessage: (id: string) => string;
}
export declare const ActionChooseList: React.ForwardRefExoticComponent<Pick<Props, "message" | "target" | "formatMessage" | "onSelected" | "messageOwnerId"> & {
    theme?: IMThemeVariables;
}>;
export {};
