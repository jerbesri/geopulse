import type { IMAppConfig } from 'jimu-core';
export declare const startTranslationSession: (snapshot: IMAppConfig) => void;
export declare const hasTranslationSessionSnapshot: () => boolean;
export declare const getTranslationSessionSnapshot: () => IMAppConfig;
export declare const clearTranslationSessionSnapshot: () => void;
export declare const updateTranslationSessionSnapshot: (savedAppConfig: IMAppConfig) => void;
export declare const buildTranslationSessionAppConfig: (currentAppConfig: IMAppConfig) => IMAppConfig;
