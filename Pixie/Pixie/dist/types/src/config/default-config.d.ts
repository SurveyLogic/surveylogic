import React, { ComponentType } from 'react';
import { ToolName } from '../tools/tool-name';
import { EditorMode } from './editor-mode';
import { MenubarPosition, NavPosition } from '../ui/navbar/nav-position';
import { SampleImage } from '../tools/sample-image';
import { BasicShape } from './default-shapes';
import { StickerCategory } from './default-stickers';
import type { Frame } from '../tools/frame/frame';
import type { FontFaceConfig } from '@common/ui/font-picker/font-face-config';
import type { Pixie } from '../pixie';
import { ObjectName } from '../objects/object-name';
import { MessageDescriptor } from '@common/i18n/message-descriptor';
import { ButtonColor, ButtonVariant } from '@common/ui/buttons/get-shared-button-style';
import { IconTree } from '@common/icons/create-svg-icon';
export declare const PIXIE_VERSION: string;
export interface NavItem {
    /**
     * unique identifier for this navigation item.
     */
    name: string;
    /**
     * Action to perform when this nav item is clicked. Either name of panel to open or custom function.
     */
    action: Function | ToolName;
    /**
     * Name or url of icon for this navigation item.
     */
    icon: React.ComponentType;
}
export interface ToolbarItemConfig {
    /**
     * Type for this toolbar item.
     */
    type: 'button' | 'zoomWidget' | 'undoWidget' | 'image';
    /**
     * Url for image when toolbar item type is set to "image".
     */
    src?: string;
    /**
     * Icon that should be shown for this item.
     */
    icon?: ComponentType | IconTree[];
    /**
     * Label that should be shown for this item.
     */
    label?: string | MessageDescriptor;
    /**
     * Style for the item when type is set to "button".
     */
    buttonVariant?: ButtonVariant;
    /**
     * Color for the item when type is set to "button".
     */
    buttonColor?: ButtonColor;
    /**
     * Action that should be performed when user clicks on this item.
     */
    action?: (editor: Pixie) => void;
    /**
     * On which side of the menubar should this item be shown.
     */
    align?: 'left' | 'center' | 'right';
    /**
     * Menubar items will be sorted based on position. Items with lower position will appear first.
     */
    position?: number;
    /**
     * Whether this toolbar item should only show on mobile.
     */
    mobileOnly?: boolean;
    /**
     * Whether this toolbar item should only show on desktop.
     */
    desktopOnly?: boolean;
    /**
     * List of dropdown menu items that will be shown when this button is clicked.
     */
    menuItems?: {
        label: string;
        action: (editor: Pixie) => void;
    }[];
}
export interface ObjectDefaults {
    /**
     * Default object background color.
     */
    fill?: string;
    /**
     * Whether object can be erased using eraser tool.
     */
    erasable?: boolean;
    /**
     * Default align for text added via pixie.
     */
    textAlign?: 'initial' | 'left' | 'center' | 'right' | 'justify' | 'justify-left' | 'justify-center' | 'justify-right';
    /**
     * Whether text should have an underline.
     */
    underline?: boolean;
    /**
     * Whether text should have a strikethrough line.
     */
    linethrough?: boolean;
    /**
     * Default font style for text added via pixie.
     */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /**
     * Default font family for text added via pixie.
     */
    fontFamily?: string;
    /**
     * Default font size for text added via pixie.
     */
    fontSize?: number;
    /**
     * Default font weight text added via pixie.
     */
    fontWeight?: 'bold' | 'normal' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    /**
     * Text border color.
     */
    stroke?: string;
    /**
     * Default object width. Will be 1/4 of canvas size if not specified.
     */
    width?: number;
    /**
     * Default object width. Will be 1/4 of canvas size if not specified.
     */
    height?: number;
}
export interface ObjectControlConfig {
    hideTopLeft?: boolean;
    hideTopRight?: boolean;
    hideBottomRight?: boolean;
    hideBottomLeft?: boolean;
    hideRotatingPoint?: boolean;
    hideFloatingControls?: boolean;
    unlockAspectRatio?: boolean;
    lockMovement?: boolean;
}
export interface PixieTheme {
    name: string;
    isDark?: boolean;
    colors: Record<string, string>;
}
export interface PixieConfig {
    /**
     * Selector for the container into which pixie should be loaded.
     */
    selector: string;
    /**
     * Image or pixie state that should be loaded into editor with initial load.
     * Will accept url or image/state data.
     */
    image?: string;
    /**
     * Pixie state to load into the editor.
     */
    state?: string;
    /**
     * Opens new empty canvas at specified size. Alternative to "image" and "state".
     */
    blankCanvasSize?: {
        width: number;
        height: number;
    };
    /**
     * Whether images loaded into pixie will be hosted on another domain from where pixie is hosted.
     */
    crossOrigin?: boolean;
    /**
     * Adds specified text as watermark on downloaded or exported image.
     */
    watermarkText?: string;
    /**
     * Maximum memory pixie will use when applying filters.
     * https://support.vebto.com/help-center/articles/10/45/164/filter-texture-size
     */
    textureSize?: number;
    /**
     * From where should pixie assets be loaded.
     * https://support.vebto.com/help-center/articles/10/45/150/specifying-base-url
     */
    baseUrl?: string;
    ui?: {
        /**
         * Tool that should be activated when editor is opened initially.
         */
        defaultTool?: ToolName;
        /**
         * Whether pixie is currently visible.
         */
        visible?: boolean;
        /**
         * Theme that is currently active.
         */
        activeTheme?: string;
        /**
         * List of available themes.
         */
        themes?: PixieTheme[];
        /**
         * Whether inline or overlay (modal) mode should be used.
         */
        mode?: EditorMode;
        /**
         * If true, editor will always show as overlay on mobile, regardless of specified "mode".
         */
        forceOverlayModeOnMobile?: boolean;
        /**
         * Whether user should be able to close editor while in overlay mode.
         */
        allowEditorClose?: boolean;
        /**
         * When user clicks on "done" button, show panel where image format, name and quality can be selected before download.
         */
        showExportPanel?: boolean;
        /**
         * Preset colors that will be shown in pixie color widgets.
         */
        colorPresets?: {
            /**
             * Lists of colors in hex or rgba format.
             */
            items: string[];
            /**
             * Whether default pixie colors should be overwritten with specified ones.
             */
            replaceDefault?: boolean;
        };
        /**
         * Navigation bar configuration.
         */
        nav?: {
            /**
             * At which predefined position should navigation bar be displayed.
             */
            position?: NavPosition;
            /**
             * Whether specified navigation items should replace default ones.
             */
            replaceDefault?: boolean;
            /**
             * What Items should be shown in the navigation bar.
             */
            items?: NavItem[];
        };
        /**
         * If no image or state is provided via configuration, this panel can be opened to allow
         * user to select from sample images, upload new image, or enter blank canvas size.
         */
        openImageDialog?: {
            /**
             * Whether this panel should be shown.
             */
            show: boolean;
            /**
             * Sample images that user should be able to pick from.
             */
            sampleImages?: SampleImage[];
        };
        /**
         * Menubar appearance and items configuration.
         */
        menubar?: {
            /**
             * Where should menubar appear.
             */
            position?: MenubarPosition;
            /**
             * Items to show in the menubar.
             */
            items?: ToolbarItemConfig[];
        };
    };
    /**
     * Currently active language for the editor.
     */
    activeLanguage?: string;
    /**
     * List of available translations.
     */
    languages?: {
        [key: string]: Record<string, string>;
    };
    /**
     * On "save" button click pixie will automatically send image data to specified url.
     */
    saveUrl?: string;
    /**
     * Called when image is saved via save button, export panel or pixie API.
     */
    onSave?: Function;
    /**
     * Called when pixie editor is fully loaded.
     */
    onLoad?: Function;
    /**
     * Called when editor is closed (via pixie API or close button click)
     */
    onClose?: Function;
    /**
     * Called when editor is opened (via pixie API or custom open button)
     */
    onOpen?: Function;
    /**
     * Called whenever a new file (image or state) is opened via file picker.
     */
    onFileOpen?: Function;
    /**
     * Called when main image is loaded (or changed) in the editor.
     */
    onMainImageLoaded?: Function;
    tools?: {
        /**
         * Filter tool configuration.
         */
        filter?: {
            /**
             * Whether specified filters should replace default ones.
             */
            replaceDefault?: boolean;
            /**
             * Filters that should be shown in filter panel.
             */
            items: string[];
        };
        /**
         * Resize tool configuration.
         */
        resize?: {
            /**
             * Minimum width user should be able to resize image to.
             */
            minWidth?: number;
            /**
             * Maximum width user should be able to resize image to.
             */
            maxWidth?: number;
            /**
             * Minimum height user should be able to resize image to.
             */
            minHeight?: number;
            /**
             * Maximum height user should be able to resize image to.
             */
            maxHeight?: number;
        };
        crop?: {
            /**
             * Initial aspect ratio for cropzone.
             */
            defaultRatio?: string;
            /**
             * Whether user should be able to resize cropzone to any aspect ratio.
             */
            allowCustomRatio?: boolean;
            /**
             * Whether built-in cropzone aspect ratios should be overwritten with specified ones.
             */
            replaceDefaultPresets?: boolean;
            /**
             * Custom cropzone aspect ratios.
             */
            presets?: {
                ratio: string | null;
                name?: string;
            }[];
            /**
             * Cropzone appearance and functionality configuration.
             */
            cropzone?: ObjectControlConfig;
        };
        /**
         * Draw tool configuration.
         */
        draw?: {
            /**
             * Whether default brush sizes should be replaced.
             */
            replaceDefaultBrushSizes?: boolean;
            /**
             * Whether default brush types should be replaced.
             */
            replaceDefaultBrushTypes?: boolean;
            /**
             * Brush sizes that user should be able to pick from.
             */
            brushSizes: number[];
            /**
             * Brush types that user should be able to pick from.
             */
            brushTypes: string[];
        };
        text?: {
            /**
             * Whether default fonts should be replaced with specified custom ones.
             */
            replaceDefaultItems?: boolean;
            /**
             * Text that should be added by default when clicking on "add text" button.
             */
            defaultText?: string;
            /**
             * Custom fonts that should be shown in font picker.
             */
            items?: FontFaceConfig[];
            /**
             * Padding between text and edit box, when text is selected.
             */
            controlsPadding?: number;
        };
        frame?: {
            /**
             * Whether default frames should be replaced with specified custom ones.
             */
            replaceDefault?: boolean;
            /**
             * Custom frames that user should be able to add to the image.
             */
            items?: Frame[];
        };
        shapes?: {
            /**
             * Whether default shapes should be replaced with specified custom ones.
             */
            replaceDefault?: boolean;
            /**
             * Custom shapes that user should be able to add to the image.
             */
            items?: BasicShape[];
        };
        stickers?: {
            /**
             * Whether default sticker categories should be replaced with specified custom ones.
             */
            replaceDefault?: boolean;
            /**
             * Custom sticker categories and their stickers that should appear in stickers panel.
             */
            items?: StickerCategory[];
        };
        import?: {
            /**
             * File extensions user should be able to select when opening new image.
             */
            validImgExtensions?: string[];
            /**
             * Maximum file size when opening new image or state file.
             */
            maxFileSize?: number;
            /**
             * Whether new image overlays should be automatically resized to fit available canvas space.
             */
            fitOverlayToScreen?: boolean;
            /**
             * When user drags image from desktop onto pixie, should that image be opened as background or overlay.
             */
            openDroppedImageAsBackground?: boolean;
        };
        export?: {
            /**
             * Which format should images be downloaded in by default.
             */
            defaultFormat: 'png' | 'jpeg' | 'json';
            /**
             * What compression level should be applied to downloaded images. 0 to 1.
             */
            defaultQuality: number;
            /**
             * Default file name for downloaded images.
             */
            defaultName: string;
        };
        zoom?: {
            /**
             * Whether user should be able to manually zoom in and out via toolbar buttons.
             */
            allowUserZoom?: boolean;
            /**
             * Whether new image should be automatically zoomed, so it fits into available screen space.
             */
            fitImageToScreen?: boolean;
        };
    };
    /**
     * Default styles and behaviour for various objects in pixie.
     */
    objectDefaults?: {
        /**
         * Styles and behaviour for all objects.
         */
        global?: ObjectDefaults;
        /**
         * Styles and behaviour for new basic shapes (circle, triangle etc.)
         */
        [ObjectName.Shape]?: ObjectDefaults;
        /**
         * Styles and behaviour for new stickers.
         */
        [ObjectName.Sticker]?: ObjectDefaults;
        /**
         * Styles and behaviour for text added to image via pixie.
         */
        [ObjectName.Text]?: ObjectDefaults;
    };
    /**
     * Visibility and behaviour of object controls.
     */
    objectControls?: {
        /**
         * Object controls and behaviour for all objects.
         */
        global?: ObjectControlConfig;
        /**
         * Object controls and behaviour for new basic shapes (circle, triangle etc.)
         */
        [ObjectName.Shape]?: ObjectControlConfig;
        /**
         * Object controls and behaviour for new stickers.
         */
        [ObjectName.Sticker]?: ObjectControlConfig;
        /**
         * Object controls and behaviour for text added to image via pixie.
         */
        [ObjectName.Text]?: ObjectControlConfig;
    };
    sentryDsn?: string;
}
export declare const DEFAULT_CONFIG: PixieConfig;
