import type { UIComponents } from './index';
export interface RelatedSourceProps {
    label: string;
    count: number;
    isSelected: boolean;
    onSelect: () => void;
    uiComponents: UIComponents;
}
export default function RelatedSource(props: RelatedSourceProps): import("@emotion/react/jsx-runtime").JSX.Element;
