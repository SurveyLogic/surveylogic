export interface SampleImage {
    /**
     * Url to sample image or state file.
     */
    url: string;
    /**
     * Action that should be performed when user clicks on this image.
     */
    action?: Function;
    /**
     * Url to preview image for this sample.
     */
    thumbnail?: string;
}
