import type { UIComponents } from './index';
import type { FeatureDataRecord } from '../../data-sources';
interface Props {
    record: FeatureDataRecord;
    popupTemplate: __esri.PopupTemplate;
    uiComponents: UIComponents;
    isSelected?: boolean;
    onSelect: (id: string | number) => void;
}
export default function FeatureInfo(props: Props): import("@emotion/react/jsx-runtime").JSX.Element;
export {};
