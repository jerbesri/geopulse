import { type IMAppResourceList, type AppConfig, AjaxState } from 'jimu-core';
import type { IGetItemResourceOptions, IItemResourceResponse } from '@esri/arcgis-rest-portal';
import type { IRequestOptions, ArcGISIdentityManager } from '@esri/arcgis-rest-request';
import type { AppInfo } from '../service/type';
import type { BlobToResourceMap, ImageResourceItemInfo, ImageResourceList, ResourceItemInfo } from '../app-resource-manager';
export interface AppResourceInfo {
    access: string;
    created: number;
    resource: string;
    size: number;
}
export interface AppResourceInfoList {
    resources: AppResourceInfo[];
    nextStart?: number;
    num?: number;
    start?: number;
    total?: number;
}
export declare function getAppId(): string;
export declare function getSession(): ArcGISIdentityManager;
export declare function getAppInfo(appInfo: AppInfo): Promise<AppInfo>;
export declare function getPortalUrlWithFull(appId: string): string;
export declare function getResourcePrefix(resourceItemInfo: ResourceItemInfo, isDraft?: boolean): string;
export declare function getAppResourceList(): IMAppResourceList;
export declare function getAllResourceUrlsInConfig(config: object): string[];
export declare function uploadResource(file: File | Blob, fileName: string, resourcesPrefix: string, owner: string): Promise<IItemResourceResponse>;
export declare function addResource(file: File | Blob, fileName: string, resourcesPrefix: string, owner: string): Promise<IItemResourceResponse>;
export declare function updateResource(file: File | Blob, fileName: string, resourcesPrefix: string, owner: string): Promise<IItemResourceResponse>;
export declare function removeResource(resource: string, owner: string): Promise<{
    success: boolean;
}>;
export declare function fetchAppResource(appId: string, option?: IGetItemResourceOptions): Promise<any>;
export declare function fetchAppResourceInfoList(appId: string, option?: IRequestOptions): Promise<AppResourceInfoList>;
export declare function getResourceUrlFromResource(resource: string): string;
export declare function getResourceFromResourceUrl(resourceUrl: string): string;
export declare const fullReplaceBlobUrl: (value?: string, blobToResourceMap?: BlobToResourceMap) => {
    newValue: string;
    replaceIds: any[];
};
export declare function replaceBlobAndMatchResource(appConfig: AppConfig, blobToResourceMap: BlobToResourceMap): {
    configSourceMap: {};
    fullMatchString: string;
};
export declare function formatRelatedImageResources(imageResourceList: ImageResourceList, relatedImageResourceList: ImageResourceItemInfo[]): any;
export declare function checkResourcesUploadStatus(checkResources: string[], resourceMap: {
    [resourceKey: string]: ResourceItemInfo;
}): Promise<AjaxState>;
