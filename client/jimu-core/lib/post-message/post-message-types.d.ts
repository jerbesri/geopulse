export declare enum PostMessageType {
    ArcgisAuthRequestCredential = "arcgis:auth:requestCredential",
    ArcgisAuthCredential = "arcgis:auth:credential",
    ExbPageChange = "exb:pageChange",
    ExbViewChange = "exb:viewChange",
    ExbWindowOpen = "exb:windowOpen",
    ExbWindowClose = "exb:windowClose",
    ExbDataRecordsSelectionChange = "exb:dataRecordsSelectionChange",
    ExbDataSourcesFilterChange = "exb:dataSourcesFilterChange",
    ExbRecordsCreate = "exb:recordsCreate",
    ExbRecordsUpdate = "exb:recordsUpdate",
    ExbRecordsRemove = "exb:recordsRemove",
    ExbExtentChange = "exb:extentChange"
}
export declare enum ListenMessageType {
    ArcgisAuthRequestCredential = "arcgis:auth:requestCredential",
    ArcgisAuthCredential = "arcgis:auth:credential",
    ExbChangePage = "exb:changePage",
    ExbChangeView = "exb:changeView",
    ExbOpenWindow = "exb:openWindow",
    ExbCloseWindow = "exb:closeWindow",
    ExbSelectRecords = "exb:selectRecords",
    ExbFilterDataSource = "exb:filterDataSource",
    ExbChangeExtent = "exb:changeExtent",
    ExbZoomTo = "exb:zoomTo",
    ExbPanTo = "exb:panTo"
}
export interface ArcgisAuthRequestCredentialMessage {
    type: PostMessageType.ArcgisAuthRequestCredential;
}
export interface ArcgisAuthCredentialMessage {
    type: PostMessageType.ArcgisAuthCredential;
    credential: {
        token: string;
        userId: string;
        server: string;
        ssl: boolean;
        expires: number;
    };
}
export interface PageChangePostMessage {
    type: PostMessageType.ExbPageChange;
    pageId: string;
}
export interface ViewChangePostMessage {
    type: PostMessageType.ExbViewChange;
    views: Array<{
        sectionId: string;
        viewId: string;
    }>;
}
export interface WindowOpenPostMessage {
    type: PostMessageType.ExbWindowOpen;
    windowId: string;
}
export interface WindowClosePostMessage {
    type: PostMessageType.ExbWindowClose;
    windowId: string;
}
export interface DataRecordsSelectionChangePostMessage {
    type: PostMessageType.ExbDataRecordsSelectionChange;
    selection: {
        dataSourceId: string;
        recordIds: Array<string | number>;
    };
}
export interface DataSourcesFilterChangePostMessage {
    type: PostMessageType.ExbDataSourcesFilterChange;
    filter: {
        dataSourceId: string;
        where?: string;
        objectIds?: Array<string | number>;
        geometry?: object;
    };
}
export interface RecordsCreatePostMessage {
    type: PostMessageType.ExbRecordsCreate;
    records: Array<{
        dataSourceId: string;
        recordIds: Array<string | number>;
    }>;
}
export interface RecordsUpdatePostMessage {
    type: PostMessageType.ExbRecordsUpdate;
    records: Array<{
        dataSourceId: string;
        recordIds: Array<string | number>;
    }>;
}
export interface RecordsRemovePostMessage {
    type: PostMessageType.ExbRecordsRemove;
    records: Array<{
        dataSourceId: string;
        recordIds: Array<string | number>;
    }>;
}
export interface ExtentChangePostMessage {
    type: PostMessageType.ExbExtentChange;
    mapWidgetId: string;
    extent: object;
    viewpoint: object;
}
export interface ChangePageListenMessage {
    type: ListenMessageType.ExbChangePage;
    pageId: string;
}
export interface ChangeViewListenMessage {
    type: ListenMessageType.ExbChangeView;
    views: Array<{
        sectionId: string;
        viewId: string;
    }>;
}
export interface OpenWindowListenMessage {
    type: ListenMessageType.ExbOpenWindow;
    windowId: string;
}
export interface CloseWindowListenMessage {
    type: ListenMessageType.ExbCloseWindow;
    windowId: string;
}
export interface SelectRecordsListenMessage {
    type: ListenMessageType.ExbSelectRecords;
    selection: {
        dataSourceId: string;
        recordIds: Array<string | number>;
    };
}
export interface FilterDataSourceListenMessage {
    type: ListenMessageType.ExbFilterDataSource;
    filter: {
        dataSourceId: string;
        where?: string;
        geometry?: object;
    };
}
export interface ChangeExtentListenMessage {
    type: ListenMessageType.ExbChangeExtent;
    mapWidgetId: string;
    extent?: object;
    viewpoint?: object;
}
export interface ZoomToListenMessage {
    type: ListenMessageType.ExbZoomTo;
    mapWidgetId: string;
    geometry: object;
    scale?: number;
}
export interface PanToListenMessage {
    type: ListenMessageType.ExbPanTo;
    mapWidgetId: string;
    geometry: object;
}
export type PostMessage = ArcgisAuthRequestCredentialMessage | ArcgisAuthCredentialMessage | PageChangePostMessage | ViewChangePostMessage | WindowOpenPostMessage | WindowClosePostMessage | DataRecordsSelectionChangePostMessage | DataSourcesFilterChangePostMessage | RecordsCreatePostMessage | RecordsUpdatePostMessage | RecordsRemovePostMessage | ExtentChangePostMessage;
export type ListenMessage = ChangePageListenMessage | ChangeViewListenMessage | OpenWindowListenMessage | CloseWindowListenMessage | SelectRecordsListenMessage | FilterDataSourceListenMessage | ChangeExtentListenMessage | ZoomToListenMessage | PanToListenMessage;
