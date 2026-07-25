import { React } from 'jimu-core';
import { type StandardComponentProps, type ValidityResult } from 'jimu-ui';
export interface EditableInputProps extends StandardComponentProps {
    size?: 'lg' | 'sm' | 'default';
    'aria-label'?: string;
    placeholder?: string;
    label?: string;
    value?: string | number;
    arrowOffset?: number;
    max?: number;
    labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
    onAcceptValue?: (value: string | number) => void;
    checkValidityOnAccept?: (text: string) => ValidityResult | Promise<ValidityResult>;
    onChange?: (evt: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, value: string | number) => void;
}
export declare const EditableInput: React.FC<EditableInputProps>;
