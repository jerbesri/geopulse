/** @jsx jsx */
import { React, type IMThemeVariables, type IMMessageJson, type IMMessageActionJson } from 'jimu-core';
import type { TargetJson } from './types/type';
interface Props {
    action?: IMMessageActionJson;
    theme: IMThemeVariables;
    message?: IMMessageJson;
    formatMessage: (id: string) => string;
    onSelected?: (targetJson: TargetJson) => void;
}
export declare const TargetChooseList: React.ForwardRefExoticComponent<Pick<Props, "action" | "message" | "formatMessage" | "onSelected"> & {
    theme?: IMThemeVariables;
}>;
export {};
