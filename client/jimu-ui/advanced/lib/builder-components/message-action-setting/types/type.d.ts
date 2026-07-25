import type { ImmutableArray, MessageType, ImmutableObject, IMWidgetJson, IMSectionJson, LayoutItemType } from 'jimu-core';
export interface PublishMessageItem {
    messageType: MessageType;
    messageLabel: string;
}
export type IMPublishMessages = ImmutableArray<PublishMessageItem>;
export type IMPublishMessageItem = ImmutableObject<PublishMessageItem>;
export interface FrameWorkTargetJson {
    label?: string;
    uri?: string;
    name?: string;
    id?: string;
}
export interface PendingListItem {
    id: string;
    itemType: LayoutItemType;
    isFromCurrentSizeMode: any;
}
export interface WidgetsList {
    [key: string]: string[];
}
export declare enum IconType {
    Small = "SMALL",
    Medium = "MEDIUM",
    Large = "LARGE",
    Pending = "PENDING"
}
export interface PendingList {
    pendingListFromOthersSizeMode?: PendingListItem[];
    pendingListFromCurrent: PendingListItem[];
    allPendingList?: PendingListItem[];
}
export type TargetJson = IMWidgetJson | IMSectionJson | FrameWorkTargetJson;
