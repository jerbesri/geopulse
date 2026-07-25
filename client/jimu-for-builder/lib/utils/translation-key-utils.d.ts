import { type IMAppConfig, type TranslationJson } from 'jimu-core';
export interface KeyValueMap {
    [key: string]: any;
}
export interface GroupedMap {
    [key: string]: KeyValueMap;
}
interface PathSegment {
    value: string | number;
    bracketQuote?: '"' | "'";
}
/**
 * Parse a dotted-and-indexed path string into segments.
 * Example: "a[0].b[1].name" -> ["a", 0, "b", 1, "name"]
 * Also supports quoted object-key notation such as "a['view-1'].b[0]";
 * those segments keep their quote style so the literal translation key can
 * be rebuilt after remapping.
 */
export declare function parsePathSegments(key: string): PathSegment[];
/**
 * Entry point: remap each group in groupedA from oldConfig to newConfig.
 * Only same-level array reorders are supported; cross-level remapping is not attempted.
 */
export declare function remapGroupedKeys(groupedA: GroupedMap, oldConfig: any, newConfig: any): GroupedMap;
/**
 * Update translationJsons in newAppConfig after key values changed from oldAppConfig to newAppConfig.
 * @param oldAppConfig
 * @param newAppConfig
 * @returns Updated newAppConfig with remapped translationJsons
 */
export declare const updateTranslationJsonsAfterKeyValuesChanged: (oldAppConfig: IMAppConfig, newAppConfig: IMAppConfig) => IMAppConfig;
/**
 * Load all config translationJsons for all config translations saved in the appConfig.
 * @param update Whether to update the appConfig in the store after loading translations. Default is false.
 */
export declare const loadAllConfigTranslations: (update?: boolean) => Promise<import("seamless-immutable").ImmutableObject<{
    [locale: string]: TranslationJson;
}>>;
export {};
