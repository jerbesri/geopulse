import { type ImmutableObject, type MessagesJson, MessageType, type IMMessageJson, type IMWidgetJson, type MessageAction, type IMMessageActionJson, type IMSectionJson, type WidgetJson, type ActionSettingOptions } from 'jimu-core';
import { type IMPublishMessages, type FrameWorkTargetJson, IconType } from '../types/type';
type MessageOwnerKey = 'widgetId' | 'dataSourceId';
export declare const getPublishMessages: (widgetId: string, messages?: IMMessageJson[], isFrameworkMessage?: boolean) => IMPublishMessages;
export declare const getTargets: (messageType: MessageType, messageOwnerId: string, useTargetInMessageActionConfig?: boolean, isFrameworkMessage?: boolean, messageOwnerKey?: MessageOwnerKey) => any;
export declare function handleMessageRemoveListen(message: IMMessageJson): void;
export declare function getActionSettingClassUri(action: IMMessageActionJson, messageType: MessageType): string;
export declare const getActions: (target: IMWidgetJson | IMSectionJson | FrameWorkTargetJson, messageOwnerId: string, messageType: MessageType, isFrameworkMessage?: boolean) => MessageAction[];
export declare const getMessages: (allMessageConfigs: ImmutableObject<MessagesJson>, widgetId: any) => IMMessageJson[];
export declare function getWidgetsInPage(pageId: string): string[];
export declare function getMapWidgetInPage(pageId: string): WidgetJson;
interface ActionSettingChangeResult {
    action: IMMessageActionJson;
    message: IMMessageJson;
}
export declare const updateUseDataSourcesWhenActionSettingChange: (settingOptions: ActionSettingOptions, message: IMMessageJson, preActionJson: IMMessageActionJson) => ActionSettingChangeResult;
export declare const getDiffKey: (json1: any, json2: any) => string[];
export declare function checkIsActionChange(action: any, oldAction: any): boolean;
export declare function checkIsWidgetOrSectionInPending(id: string, isSection?: boolean): boolean;
export declare function getIconTypeOfActionItem(widgetId: string, sectionIdOfAction: string): IconType[];
export {};
