/** @jsx jsx */
import { React, type IMThemeVariables, type IMMessageJson, type IntlShape } from 'jimu-core';
interface Props {
    widgetId?: string;
    dataSourceId?: string;
    theme: IMThemeVariables;
    messages?: IMMessageJson[];
    intl: IntlShape;
    onSelected?: (messageJson: IMMessageJson) => void;
    formatMessage: (id: string) => string;
}
export declare const MessageChooseList: React.ForwardRefExoticComponent<Pick<Omit<Props, "intl"> & {
    forwardedRef?: React.Ref<any>;
}, "widgetId" | "forwardedRef" | "dataSourceId" | "formatMessage" | "messages" | "onSelected"> & {
    theme?: IMThemeVariables;
}>;
export {};
