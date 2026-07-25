import { JimuFieldType, type IMThemeVariables, type IntlShape } from 'jimu-core';
export interface PopupExpressionValidationInfo {
    isValid: boolean;
    errorMsg?: string;
}
export declare const NO_SELECTION_ID = "CLICK_ME_TO_CLEAR_SELECTION";
export declare function getIconFromFieldType(type: JimuFieldType, theme: IMThemeVariables, intl?: IntlShape): {
    icon: any;
    color: string;
    title: string;
};
