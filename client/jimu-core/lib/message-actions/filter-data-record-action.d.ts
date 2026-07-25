import { AbstractMessageAction, MessageType, type Message, type MessageDescription } from '../message/message-base-types';
import type { DataSource, DataRecord } from '../data-sources';
import type { UseDataSource } from '../../lib/types/app-config';
import { type ImmutableObject, type ImmutableArray } from '../../index';
import { type SqlExpression } from '../types/sql-expression';
import { MessageActionConnectionType } from './types';
interface Config {
    messageUseDataSource: UseDataSource;
    actionUseDataSource: UseDataSource;
    sqlExprObj?: any;
    enabledDataRelationShip?: boolean;
    connectionType?: MessageActionConnectionType;
    enableQueryWithCurrentExtent?: boolean;
}
export type IMConfig = ImmutableObject<Config>;
export default class Action extends AbstractMessageAction {
    name: string;
    private lastMessage;
    private lastActionConfig;
    private readonly actionQuerySQLExpression;
    private readonly geometryFilter;
    private getMessageSourceKey;
    filterMessageDescription(messageDescription: MessageDescription): boolean;
    filterMessage(message: Message): boolean;
    getSettingComponentUri(messageType: MessageType, messageWidgetId?: string, messageDataSourceId?: string): string;
    onRemoveListen(messageType: MessageType, messageWidgetId?: string, messageDataSourceId?: string): void;
    concatQuerySqlExpressionOfSameAction: (message: Message, actionUseDataSourceId: string) => SqlExpression;
    getQuerySqlExpressionWidthOtherQuery: (message: Message, actionUseDataSourceId: string, SqlExpression: SqlExpression, isOnlyGetOtherActionQuerySQL?: boolean) => SqlExpression;
    getQueryWhenUseDataRelationShip: (message: Message, actionConfig: IMConfig, actionDataSource: DataSource, records: DataRecord[]) => Promise<{
        where: any;
        returnGeometry: boolean;
        sqlExpression: any;
    }>;
    getQueryWhenNotUseDataRelationShip: (message: Message, actionConfig: IMConfig, actionDataSource: DataSource, records: DataRecord[]) => {
        where: any;
        returnGeometry: boolean;
        sqlExpression: any;
    };
    onExecuteWithRecords(records: DataRecord[], message: Message, actionConfig?: IMConfig): Promise<boolean>;
    onExecuteWithActionConfigItem(message: Message, actionConfig?: IMConfig): Promise<boolean>;
    onExecute(message: Message, actionConfig?: IMConfig | ImmutableArray<Config>): Promise<boolean>;
    getInitialMessages(actionConfig?: IMConfig | ImmutableArray<Config>): Message[];
    getInitialMessageForSingleConfig(actionConfig: IMConfig): Message[];
    getOutputMessages(message: Message, actionConfig?: IMConfig | ImmutableArray<Config>): Message[];
    getOutputMessagesForSingleConfig(message: Message, actionConfig: IMConfig): Message[];
}
export {};
