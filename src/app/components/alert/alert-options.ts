export interface AlertOptions {
    /**
     * The title for the alert.
     */
    title?: string;

    /**
     * The icon for the alert. default no icon
     * <i [class]="iconClass"></i>
     */
    iconClass?: string;

    /**
     * The message for the alert.
     */
    message?: string;

    /**
     * An array of buttons for the alert. See buttons options.
     */
    buttons?: (AlertButton | string)[];

    /**
     * Default 'static' ;Whether a backdrop element should be created for a given modal (true by default).
     * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
     */
    backdrop?: boolean | 'static';

    /**
     * Function called when a modal will be dismissed.
     * If this function returns false, the modal is not dismissed.
     */
    beforeDismiss?: () => boolean;

    /**
     * An element to which to attach newly opened modal windows.
     */
    container?: string;

    /**
     * Whether to close the modal when escape key is pressed (true by default).
     */
    keyboard?: boolean;

    /**
     * Size of a new modal window.
     */
    size?: 'sm' | 'lg';

    /**
     * Custom class to append to the modal window
     */
    windowClass?: string;
}

export interface AlertButton {
    /**
     * The buttons displayed text.
     */
    text?: string;

    /**
     * An additional CSS class for the button.
     */
    cssClass?: string;

    /**
     * Emitted when the button is pressed.
     */
    handler?: (value: any) => boolean | void;
}
