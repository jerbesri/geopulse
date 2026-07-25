import type { IntlShape } from 'react-intl';
import { EsriFieldType } from '../types/common';
import type { DateTimeFieldFormatProperties, DateWithTimeFieldFormatProperties, FieldFormatProperties, NumberFieldFormatProperties } from '../types/app-config';
export declare enum VirtualDateType {
    Now = "NOW",
    Min = "MIN",
    Max = "MAX",
    Today = "TODAY",
    Tomorrow = "TOMORROW",
    Yesterday = "YESTERDAY",
    ThisWeek = "THIS_WEEK",
    ThisMonth = "THIS_MONTH",
    ThisQuarter = "THIS_QUARTER",
    ThisYear = "THIS_YEAR"
}
export declare enum TimeUnit {
    Minute = "MINUTE",
    Hour = "HOUR",
    Day = "DAY",
    Week = "WEEK",
    Month = "MONTH",
    Year = "YEAR"
}
/**
 * Default esri date time format, for cookie banner, privacy cases.
 */
export declare const DATE_TIME_DEFAULT_ESRI_FORMAT: FieldFormatProperties;
export declare function formatDateValueByEsriFormat(value: number | Date, esriDateFormat: FieldFormatProperties, fieldEsriType: EsriFieldType, intl: IntlShape): string;
export declare function formatTimeValueByEsriFormat(value: Date, esriDateFormat: FieldFormatProperties, intl: IntlShape): string;
export declare function formatDateValueByIntlFormat(value: number | Date, intl: IntlShape, intlFormats?: Intl.DateTimeFormatOptions): string;
export declare function toDateTimeIntlFormatOptions(dateTimeFieldFormat: DateTimeFieldFormatProperties | DateWithTimeFieldFormatProperties): Intl.DateTimeFormatOptions;
export declare function toTimeOnlyIntlFormatOptions(dateTimeFieldFormat: DateTimeFieldFormatProperties): Intl.DateTimeFormatOptions;
export declare function toNumberIntlFormatOptions(numberFieldFormat: NumberFieldFormatProperties): Intl.NumberFormatOptions;
export declare function getDateTimeFieldFormatOptionsWithTime(fieldFormat: DateTimeFieldFormatProperties): DateTimeFieldFormatProperties | DateWithTimeFieldFormatProperties;
export declare function getDateTimeFieldFormatOptionsWithoutTime(fieldFormat: DateTimeFieldFormatProperties): DateTimeFieldFormatProperties;
export declare function getEsriFormatByDateTimePatterns(dateTimePattern?: string): DateWithTimeFieldFormatProperties;
export declare function isStrictYMDFormat(value: string): boolean;
export declare function isStrictHMSFormat(value: string): boolean;
export declare function convertISOTimeToMinutes(value: string): number | undefined;
export declare function getStrictYMDFormat(date: Date | number): string;
export declare function getDateByStrictYMDFormat(date: string): Date;
export declare function getDateByStrictHMSFormat(time: string): Date;
/**
 * Get real date or date extent by a virtual date.
 * The intl is required to get VirtualDateType.ThisWeek
 * @ignore
 */
export declare function getRealDateByVirtualDate(virtualDate: VirtualDateType, intl?: any): Date | Date[];
export { format } from 'date-fns';
