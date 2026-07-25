/** @jsx jsx */
import { React, type IMMessageJson, type IMMessageActionJson, type IntlShape, type IMThemeVariables } from 'jimu-core';
interface Props {
    message: IMMessageJson;
    isActive?: boolean;
    intl: IntlShape;
    formatMessage: (id: string) => string;
    action: IMMessageActionJson;
    theme: IMThemeVariables;
    onMessageRemoved?: (message: IMMessageJson) => void;
    onMessageChanged?: (message: IMMessageJson) => void;
    onClickAddAction?: (message: IMMessageJson) => void;
    onClickEditAction?: (message: IMMessageJson, action: IMMessageActionJson, disableActionSetting?: boolean) => void;
}
export declare function getActionLabel(action: IMMessageActionJson): string;
export declare const MessageItem: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export {};
