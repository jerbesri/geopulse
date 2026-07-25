import { type IMThemeVariables, type IntlShape, ReactDOMClient } from 'jimu-core';
import { type Editor } from '../../base';
interface ImageResizeOptions {
    modalId?: string;
    theme?: IMThemeVariables;
}
export declare class ImageResize {
    quill: Editor;
    modalId: string;
    root: ReactDOMClient.Root;
    img: HTMLImageElement;
    overlay: HTMLDivElement;
    resizeObserver: ResizeObserver;
    mutationObserver: MutationObserver;
    intl: IntlShape;
    theme: IMThemeVariables;
    constructor(quill: any, options?: ImageResizeOptions);
    handleDoubleClick: (evt: any) => void;
    handleClick: (evt: any) => void;
    showOverlay: () => void;
    updateOverlayPosition: () => void;
    hide: () => void;
    hideOverlay: () => void;
    handleDelete: () => void;
    moveCursor: () => void;
    setUserSelect: (value: any) => void;
    handleShortcut: (evt: any) => void;
}
export {};
