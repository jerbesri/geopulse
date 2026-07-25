export type TranslationRestrictedSurface = 'controller' | 'grid' | 'placeholder-add-widget' | 'language-switcher-dropdown' | 'text-edit';
type TranslationRestrictionState = {
    builder?: {
        isConfiguringTranslations?: boolean;
    };
} | null | undefined;
export declare const isTranslationModeActiveInState: (state: TranslationRestrictionState) => boolean;
export declare const isTranslationEditingRestrictedInState: (state: TranslationRestrictionState, surface: TranslationRestrictedSurface, isExpressMode?: boolean) => boolean;
export {};
