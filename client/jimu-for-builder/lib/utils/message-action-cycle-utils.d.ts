import { type IMAppConfig } from 'jimu-core';
export declare function checkCycle(appConfig: IMAppConfig, messageConfigId: string, actionId: string, notUpdateMessageActionsByTable?: boolean): boolean;
export declare function checkCycleForTable(appConfig: IMAppConfig, tableWidgetId: string): boolean;
