import type { IMWidgetJson, MessageActionJson, AppConfig } from './types/app-config';
import type { Message, DummyMessageAction, MessageAction, RegisterMessageActionOptions } from './message/message-base-types';
import type { BaseVersionManager } from './version-manager';
/**
 * The `MessageManager` is used to manage message and message action.
 * When you need to publish a message in widget, you can use `MessageManager.getInstance().publishMessage()`.
 */
export declare class MessageManager {
    private static readonly ActionExecutionNotificationDelay;
    private static readonly ActionExecutionNotificationMinDuration;
    private static readonly SupportedExecutionNotificationActions;
    static instance: MessageManager;
    static getInstance(): MessageManager;
    private actions;
    private actionClassPromises;
    private notificationApiPromise;
    private readonly executedActionsCache;
    private clearActionCacheTimer;
    private shouldCacheExecutedActions;
    private resetActionCacheClearTimer;
    private shouldSkipClearActionCache;
    private clearExecutedActionCache;
    /**
     * Clear executed action cache explicitly.
     * Widgets can call this when they need to force next background-trigger action execution.
     * When a widget selects records or filters a data source but does not publish
     * 'Record selection changes' / 'Data filtering changes', the cache should be cleared to avoid
     * a previously cached action being skipped and not executed again.
     */
    clearActionCache(): void;
    getActions(): MessageAction[];
    getWidgetActions(widgetId: string): MessageAction[];
    getAction(widgetId: string, actionName: string): MessageAction;
    destroyWidgetActions(widgetId: string): void;
    destroySectionActions(sectionId: string): void;
    registerWidgetActions(widgetJson: IMWidgetJson, appConfig?: AppConfig): Promise<any>;
    registerSectionActions(sectionId: string, appConfig?: AppConfig): Promise<any>;
    registerAction(options: RegisterMessageActionOptions): Promise<MessageAction>;
    upgradeActionConfig(actionJson: MessageActionJson, versionManager: BaseVersionManager, widgetVersion: string): Promise<void>;
    loadActionClass(options: RegisterMessageActionOptions): Promise<typeof DummyMessageAction>;
    private loadDependency;
    /**
     * Publish a message: the registered message actions that match will be executed.
     * @param message The message to be published.
     */
    publishMessage(message: Message): Promise<void>;
    /**
     * Open the widget if it's in a widget controller
     */
    private openWidget;
    private exeAction;
    private shouldShowExecutionNotification;
    private executeActionWithNotification;
    private shouldShowNotificationAfterDelay;
    private showActionExecutionNotification;
    private keepActionExecutionNotificationVisible;
    private closeActionExecutionNotification;
    private getNotificationApi;
    private delay;
    private getActionExecutionNotificationDescription;
    private executeAction;
}
/** @ignore */
export default MessageManager;
