import { AbstractMessageAction, MessageType, type Message, type MessageDescription } from '../message/message-base-types';
import type { UseDataSource } from '../../lib/types/app-config';
import type { ImmutableObject } from 'seamless-immutable';
import type { DataRecord } from '../data-sources';
import { MessageActionConnectionType } from './types';
interface Config {
    messageUseDataSource: UseDataSource;
    actionUseDataSource: UseDataSource;
    sqlExprObj?: any;
    enabledDataRelationShip?: boolean;
    connectionType?: MessageActionConnectionType;
}
export type IMConfig = ImmutableObject<Config>;
export default class Action extends AbstractMessageAction {
    name: string;
    filterMessageDescription(messageDescription: MessageDescription): boolean;
    filterMessage(message: Message): boolean;
    getSettingComponentUri(messageType: MessageType, messageWidgetId?: string): string;
    onExecuteWithRecords(records: DataRecord[], message: Message, actionConfig?: IMConfig, isAutoBound?: boolean): Promise<boolean>;
    onExecute(message: Message, actionConfig?: IMConfig): Promise<boolean>;
    getInitialMessages(actionConfig?: IMConfig): Message[];
    getOutputMessages(message: Message, actionConfig?: IMConfig): Message[];
}
export {};
