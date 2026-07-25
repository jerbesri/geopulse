import { MessageActionConnectionType } from 'jimu-core';
interface Props {
    connectionType: MessageActionConnectionType;
    onUseLayersRelationship: () => void;
    onSetCustomFields: () => void;
}
declare const ChooseConnectionType: (props: Props) => import("@emotion/react/jsx-runtime").JSX.Element;
export default ChooseConnectionType;
