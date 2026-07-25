export type IconSize = 's' | 'm' | 'l';
export declare const PreIconSizesMapping: {
    s: number;
    m: number;
    l: number;
};
export declare const getIconsSize: (propSize: IconSize | number | string) => number | string;
export declare const isSVGSrc: (src: any) => boolean;
export declare const isSVGString: (icon: any) => boolean;
export declare const fetchSVGFromSrc: (src: string) => Promise<string>;
export declare const isAutoFlipIcon: (icon: any) => boolean;
