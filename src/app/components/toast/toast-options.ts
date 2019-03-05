export interface ToastOptions {

    /**
     * Alert type default:success (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning"
     * , "danger", "primary", "secondary", "light", "dark".
    */
    type?: string;


    /**
     * show time in seconds default 4s
     */
    duration?: number;

    /**
     * The icon for the toast. default no icon
     * <i class="iconClass"></i>
     */
    iconClass?: string;

    /**
     * The message for the toast.
     */
    message?: string;

    /**
     * default:false, Whether a backdrop element should be created for a given modal (true by default).
     * Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.
     */
    backdrop?: boolean | 'static';

    /**
     * Function called when a modal will be dismissed.
     * If this function returns false, the modal is not dismissed.
     */
    beforeDismiss?: () => boolean;

    /**
     * default:body
     * An element to which to attach newly opened modal windows.
     */
    container?: string;

    /**
     * Whether to close the modal when escape key is pressed (true by default).
     */
    keyboard?: boolean;

    /**
     * Custom class to append to the modal window
     */
    windowClass?: string;
}
