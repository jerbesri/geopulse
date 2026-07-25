import { type MessageDescription, type UseDataSource } from 'jimu-core';
export interface CheckCycleForActionDataSourceOptions {
    triggerMessageDescription: MessageDescription;
    actionId: string;
    actionName: string;
    actionConfig: any;
    actionUseDataSource: UseDataSource;
    actionWidgetId?: string;
    actionSectionId?: string;
}
export declare function checkCycleForActionDataSource(options: CheckCycleForActionDataSourceOptions): boolean;
