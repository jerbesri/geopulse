import { AbstractMessageAction, MessageType, type Message, type MessageDescription } from '../message/message-base-types';
import type { UseDataSource } from '../../lib/types/app-config';
import type { ImmutableObject } from 'seamless-immutable';
interface Config {
    useAllData?: boolean;
    useDataSources?: UseDataSource[];
}
export type IMConfig = ImmutableObject<Config>;
export default class Action extends AbstractMessageAction {
    name: string;
    filterMessageDescription(messageDescription: MessageDescription): boolean;
    filterMessage(message: Message): boolean;
    getSettingComponentUri(messageType: MessageType, messageWidgetId?: string): string;
    private getExecuteDataSourceIds;
    onExecute(message: Message, actionConfig?: IMConfig): Promise<boolean>;
}
export {};
