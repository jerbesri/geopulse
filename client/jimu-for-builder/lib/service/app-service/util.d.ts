import { type AppCreationInfo, type AppConfig, type IMAppConfig, SystemErrorCode } from 'jimu-core';
import type { IItemAdd, ICreateItemResponse } from '@esri/arcgis-rest-portal';
import { type AppInfo, SearchType, PublishStatus, type TransferAppResponse, type TransferAppParams, type AppInfoItemForNewApp } from '../type';
import type { ArcGISIdentityManager } from '@esri/arcgis-rest-request';
export declare const TEMPLATE_KEY_IN_TYPE_KEYWORDS = "template";
export declare const VIEWER_COPIABLE = "Viewer Copyable";
export declare const LAST_EDITOR_IN_TYPE_KEYWORDS_PREFIX = "lastEditor:";
export declare function handleSessionExpiredAuthError(error: any): void;
export declare function getNewAppTitleWithIndex(title: string, isCopy?: boolean, type?: string): Promise<string>;
interface Options {
    originAppInfo: AppInfo;
    folder: string;
    title?: string;
    name?: string;
    updateAppVersion?: boolean;
    removeFaviconInConfig?: boolean;
    isDuplicateApp?: boolean;
    deleteThumbnail?: boolean;
    appInfoItemForNewApp?: AppInfoItemForNewApp;
    retainsAppSummary?: boolean;
    updateTemplate?: boolean;
}
export declare function copyAppByAPI(option: Options): Promise<any>;
export declare function toCreateAppByDefaultTemplate(appInfo: AppCreationInfo, folderId?: string): Promise<ICreateItemResponse>;
export declare function createAppByDefaultTemplateCallBack(defaultAppConfigs: AppConfig, item: ICreateItemResponse, webmapId?: string, websceneId?: string): Promise<AppInfo>;
export declare function getCreateAppParamsByAppId(templateId: string): Promise<AppInfo>;
export declare function createApp(appInfo: IItemAdd, folderId?: string): Promise<ICreateItemResponse>;
export declare function updateItemDataInApp(newAppId: any): Promise<boolean>;
export declare function updateTypeKeywords(typeKeywords: string[], appConfigVersion: string): string[];
export declare function updateLastEditorInTypeKeywords(typeKeywords?: string[], username?: string): string[];
interface UpdateAppInfoOptions {
    appInfo: AppInfo;
    isUpdateVersion?: boolean;
    appInfoItemForNewApp?: AppInfoItemForNewApp;
    retainsAppSummary?: boolean;
    updateTemplate?: boolean;
}
export declare function updateAppInfoOfNewApp(options: UpdateAppInfoOptions): Promise<string>;
export declare function initAppInfoAndItemDataOfNewItem(options: UpdateAppInfoOptions): Promise<boolean>;
interface UpdateAppConfigOfOptions {
    newAppId: string;
    originalAppInfo: AppInfo;
    useDraftConfig?: boolean;
    updateAppConfigVersion?: boolean;
    isRemoveFaviconInConfig?: boolean;
    updateTemplate?: boolean;
}
export declare function updateAppConfigOfNewItem(options: UpdateAppConfigOfOptions): Promise<string>;
interface InitializedAppConfigOptions {
    originalAppConfig: AppConfig;
    originalAppInfo: AppInfo;
    newAppId: string;
    isRemoveFaviconInConfig?: boolean;
    updateAppConfigVersion?: boolean;
    unlockLayout?: boolean;
    updateTemplate?: boolean;
}
export declare function getInitializedAppConfigForNewApp(option: InitializedAppConfigOptions): Promise<AppConfig>;
export declare function updateThumbnail(newAppId: any, originalAppInfo: AppInfo, thumbnail: any): Promise<boolean>;
export declare function updateThumbnailForSaveAsApp(originAppInfo: AppInfo, newAppInfo: AppInfo, thumbnailFiles?: any): Promise<any>;
export declare function getNewTypeKeywordsWhenSaveApp(appInfo?: AppInfo, updateVersion?: boolean, template?: string): string[];
export declare function updateEditorAndModifiedInTypeKeywords(typeKeywords?: string[], template?: string, username?: string): string[];
export declare function updateModifiedInTypeKeywords(typeKeywords?: string[], template?: string, username?: string): string[];
export declare function getPublishStatus(appItem?: AppInfo): PublishStatus;
export declare function getNewTypeKeywordsItemWithAppTemplate(template: string): string;
export declare function initTypeKeywordsOfNewItem(typeKeywords?: string[], newAppType?: string, isUpdateVersion?: boolean, template?: string): string[];
export declare function getPreviewUrl(appInfo: AppInfo): string;
export declare function initAppConfigPortalUrl(appConfig: any, originalAppInfo: AppInfo): any;
export declare function replaceConfigWithNewAppID(newAppId: any, originalAppId: any, config: any): Promise<AppConfig>;
export declare function getConfigFromPortalItemResource(appID: string): Promise<AppConfig>;
export declare function optimizeWidgetsConfig(appConfig: AppConfig, appInfo: AppInfo): AppConfig;
export declare function replaceExbVersionInAppConfig(appConfig: IMAppConfig): IMAppConfig;
interface InitAppConfigOfNewAppOptions {
    appConfig: AppConfig;
    originalAppInfo?: AppInfo;
    updateAppConfigVersion?: boolean;
    isRemoveFaviconInConfig?: boolean;
    unlockLayout?: boolean;
    updateTemplate?: boolean;
}
export declare function initAppConfigOfNewApp(options: InitAppConfigOfNewAppOptions): AppConfig;
export declare function optimizeTextWidgetConfig(config: {
    text: string;
    placeholder?: string;
}, appInfo: AppInfo): {
    text: string;
    placeholder?: string;
};
export declare function getAppConfigInResources(appId: string): Promise<AppConfig>;
export declare function checkIsNeedUpdateViewerCopiable(newAppInfo: AppInfo): Promise<boolean>;
export declare function isUpdateDataSourcesPortalUrl(dataSourcesPortalUrl: string): boolean;
export declare function getMaxIndex(appList: any[], name: string): number;
/**
 * Update the history labels in draft app config, then return the draft app config
 * @param draftAppConfig
 * @param publishedAppConfig
 */
export declare function updateHistoryLabels(draftAppConfig: AppConfig, publishedAppConfig: AppConfig): AppConfig;
/**
 * Deep clone. But only clone two levels.
 * And param must be Object.
 */
export declare function cloneObj(obj: any): any;
export declare function getSessionBySearchType(searchType: SearchType): ArcGISIdentityManager;
export declare function transferAppToFullModeDirectly(appInfo: AppInfo): Promise<TransferAppResponse>;
export declare function transferAppToNewFullModeApp(params: TransferAppParams): Promise<TransferAppResponse>;
export declare function checkIsAppWebExperienceItem(item: AppInfo): boolean;
interface CanBeDuplicatedResult {
    canDuplicate: boolean;
    message?: string;
    code?: SystemErrorCode;
}
export declare function checkIsAppCanBeDuplicate(appInfo: AppInfo): Promise<CanBeDuplicatedResult>;
export {};
