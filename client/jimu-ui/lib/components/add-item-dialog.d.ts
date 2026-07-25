/** @jsx jsx */
import { React } from 'jimu-core';
/**
 * The AddItemDialog component props.
 */
export interface AddItemDialogProps {
    defaultName?: string;
    keepOpenAfterConfirm?: boolean;
    /**
     * Custom header title text for the dialog.
     */
    headerTitle?: string;
    /**
     * Custom text for the confirm button.
     */
    confirmButtonText?: string;
    reference: Element;
    /**
     * Be invoked when clicking the cancel button.
     */
    onClose?: () => void;
    /**
     * Be invoked when clicking the ok button.
     */
    onConfirm: (name: string, folderId: string) => Promise<void>;
}
/**
 * The `AddItemDialog` component let users to set item's title and folder.
 *
 * ```ts
 * import { AddItemDialog } from 'jimu-ui'
 * ```
 */
export declare function AddItemDialog(props: AddItemDialogProps): React.JSX.Element;
