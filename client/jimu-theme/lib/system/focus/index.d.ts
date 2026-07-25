export interface Focus {
    /**
     * Indicates whether to enable mouse focus ring.
     * @default false
     */
    mouseFocusVisible: boolean;
}
export declare function createFocus(options?: Partial<Focus>): Focus;
