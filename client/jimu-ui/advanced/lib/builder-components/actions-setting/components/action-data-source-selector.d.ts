/** @jsx jsx */
import { type DataSourceInfo, type DataSourceJson, type ImmutableObject, type MessageType, type UseDataSource } from 'jimu-core';
interface ActionDataSourceSelectorProps {
    DataSourceSelector: any;
    types: any;
    useDataSources: any;
    onChange: (useDataSources: UseDataSource[]) => void;
    widgetId?: string;
    isMultiple?: boolean;
    closeDataSourceListOnChange?: boolean;
    hideDataView?: boolean;
    sidePopperPosition?: 'left' | 'right';
    hideDs?: (dsJson: DataSourceJson) => boolean;
    enableCycleCheck?: boolean;
    actionName?: string;
    actionId?: string;
    actionConfig?: any;
    messageType?: MessageType;
    messageWidgetId?: string;
    triggerDataSourceId?: string;
    actionWidgetId?: string;
    actionSectionId?: string;
    dataSources?: ImmutableObject<{
        [dsId: string]: DataSourceJson;
    }>;
    dataSourcesInfo?: ImmutableObject<{
        [dsId: string]: DataSourceInfo;
    }>;
}
declare const ActionDataSourceSelector: (props: ActionDataSourceSelectorProps) => import("@emotion/react/jsx-runtime").JSX.Element;
export default ActionDataSourceSelector;
