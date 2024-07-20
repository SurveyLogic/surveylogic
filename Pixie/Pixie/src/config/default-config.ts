import React, {ComponentType} from 'react';
import {ToolName} from '../tools/tool-name';
import {EditorMode} from './editor-mode';
import {MenubarPosition, NavPosition} from '../ui/navbar/nav-position';
import {SampleImage} from '../tools/sample-image';
import {BasicShape, defaultShapes} from './default-shapes';
import {defaultStickers, StickerCategory} from './default-stickers';
import {defaultObjectProps} from './default-object-props';
import {BrushSizes, BrushTypes} from '../tools/draw/draw-defaults';
import {EditorTheme} from './editor-theme';
import type {Frame} from '../tools/frame/frame';
import type {FontFaceConfig} from '@common/ui/font-picker/font-face-config';
import {DEFAULT_THEMES} from './default-themes';
import {DEFAULT_NAV_ITEMS} from './default-nav-items';
import type {Pixie} from '../pixie';
import {FileDownloadIcon} from '@common/icons/material/FileDownload';
import {HistoryIcon} from '@common/icons/material/History';
import {ObjectName} from '../objects/object-name';
import packageConfig from '../../package.json';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';
import {
  ButtonColor,
  ButtonVariant,
} from '@common/ui/buttons/get-shared-button-style';
import {IconTree} from '@common/icons/create-svg-icon';

export const PIXIE_VERSION = packageConfig.version;

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
  menuItems?: {label: string; action: (editor: Pixie) => void}[];
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
  textAlign?:
    | 'initial'
    | 'left'
    | 'center'
    | 'right'
    | 'justify'
    | 'justify-left'
    | 'justify-center'
    | 'justify-right';

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
  fontWeight?:
    | 'bold'
    | 'normal'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;

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
  blankCanvasSize?: {width: number; height: number};

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
      presets?: {ratio: string | null; name?: string}[];

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
      maxFileSize?: number; // in bytes

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

export const DEFAULT_CONFIG: PixieConfig = {
  selector: 'pixie-editor',
  textureSize: 4096,
  activeLanguage: 'en',
  ui: {
    visible: true,
    mode: EditorMode.INLINE,
    forceOverlayModeOnMobile: true,
    activeTheme: EditorTheme.LIGHT,
    themes: DEFAULT_THEMES,
    allowEditorClose: true,
    menubar: {
      items: [
        {
          type: 'undoWidget',
          align: 'left',
        },
        {
          type: 'zoomWidget',
          align: 'center',
          desktopOnly: true,
        },
        {
          type: 'button',
          icon: HistoryIcon,
          align: 'right',
          desktopOnly: true,
          action: editor => {
            editor.togglePanel('history');
          },
        },
        {
          type: 'button',
          icon: FileDownloadIcon,
          label: message('Done'),
          align: 'right',
          action: editor => {
            if (editor.state.config.ui?.showExportPanel) {
              editor.state.togglePanel('export', true);
            } else {
              editor.tools.export.save('image');
            }
          },
        },
      ],
    },
    nav: {
      position: NavPosition.BOTTOM,
      items: [...DEFAULT_NAV_ITEMS],
    },
    openImageDialog: {
      show: true,
      sampleImages: [
        {
          url: 'images/samples/sample1.jpg',
          thumbnail: 'images/samples/sample1_thumbnail.jpg',
        },
        {
          url: 'images/samples/sample2.jpg',
          thumbnail: 'images/samples/sample2_thumbnail.jpg',
        },
        {
          url: 'images/samples/sample3.jpg',
          thumbnail: 'images/samples/sample3_thumbnail.jpg',
        },
      ],
    },
    colorPresets: {
      items: [
        'rgb(0,0,0)',
        'rgb(255, 255, 255)',
        'rgb(242, 38, 19)',
        'rgb(249, 105, 14)',
        'rgb(253, 227, 167)',
        'rgb(4, 147, 114)',
        'rgb(30, 139, 195)',
        'rgb(142, 68, 173)',
      ],
    },
  },
  objectDefaults: {
    global: {
      ...defaultObjectProps,
    },
    sticker: {
      fill: undefined,
    },
    text: {
      textAlign: 'initial',
      underline: false,
      linethrough: false,
      fontStyle: 'normal',
      fontFamily: 'Times New Roman',
      fontWeight: 'normal',
      stroke: undefined,
      fontSize: 40,
    },
  },
  tools: {
    filter: {
      items: [
        'grayscale',
        'blackWhite',
        'sharpen',
        'invert',
        'vintage',
        'polaroid',
        'kodachrome',
        'technicolor',
        'brownie',
        'sepia',
        'removeColor',
        'brightness',
        'gamma',
        'noise',
        'pixelate',
        'blur',
        'emboss',
        'blendColor',
      ],
    },
    zoom: {
      allowUserZoom: true,
      fitImageToScreen: true,
    },
    crop: {
      allowCustomRatio: true,
      defaultRatio: '1:1',
      presets: [
        {ratio: null, name: 'Custom'},
        {ratio: '1:1', name: 'Square'},
        {ratio: '4:3'},
        {ratio: '16:9'},
        {ratio: '5:3'},
        {ratio: '5:4'},
        {ratio: '6:4'},
        {ratio: '7:5'},
        {ratio: '10:8'},
      ],
    },
    text: {
      defaultText: 'Double click to edit',
      controlsPadding: 6,
      items: [
        {
          family: 'Roboto',
          src: 'fonts/open-sans-v27-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Fuzzy Bubbles',
          src: 'fonts/fuzzy-bubbles-v3-latin-700.woff2',
          descriptors: {weight: '700'},
        },
        {
          family: 'Aleo Bold',
          src: 'fonts/aleo-v4-latin-ext_latin-700.woff2',
          descriptors: {weight: '700'},
        },
        {
          family: 'Amatic SC',
          src: 'fonts/amatic-sc-v16-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Corinthia Bold',
          src: 'fonts/corinthia-v7-latin-ext_latin-700.woff2',
        },
        {
          family: 'Bungee Inline',
          src: 'fonts/bungee-inline-v6-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Robot Slab Bold',
          src: 'fonts/roboto-slab-v16-latin-ext_latin-500.woff2',
        },
        {
          family: 'Carter One',
          src: 'fonts/carter-one-v12-latin-regular.woff2',
        },
        {
          family: 'Cody Star',
          src: 'fonts/codystar-v10-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Fira Sans',
          src: 'fonts/fira-sans-v11-latin-ext_latin_cyrillic-regular.woff2',
        },
        {
          family: 'Krona One',
          src: 'fonts/krona-one-v9-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Kumar One Outline',
          src: 'fonts/kumar-one-outline-v8-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Lobster Two',
          src: 'fonts/lobster-two-v13-latin-regular.woff2',
        },
        {
          family: 'Molle Italic',
          src: 'fonts/molle-v11-latin-ext_latin-italic.woff2',
        },
        {
          family: 'Monoton',
          src: 'fonts/monoton-v10-latin-regular.woff2',
        },
        {
          family: 'Nixie One',
          src: 'fonts/nixie-one-v11-latin-regular.woff2',
        },
        {
          family: 'Permanent Marker',
          src: 'fonts/permanent-marker-v10-latin-regular.woff2',
        },
        {
          family: 'Sancreek',
          src: 'fonts/sancreek-v13-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Stint Ultra Expanded',
          src: 'fonts/stint-ultra-expanded-v10-latin-regular.woff2',
        },
        {
          family: 'VT323',
          src: 'fonts/vt323-v12-latin-ext_latin-regular.woff2',
        },
        {
          family: 'Trash Hand',
          src: 'fonts/TrashHand.ttf',
        },
      ],
    },
    draw: {
      brushSizes: BrushSizes,
      brushTypes: BrushTypes,
    },
    shapes: {
      items: defaultShapes.slice(),
    },
    stickers: {
      items: defaultStickers,
    },
    import: {
      validImgExtensions: ['png', 'jpg', 'jpeg', 'svg', 'gif'],
      fitOverlayToScreen: true,
      openDroppedImageAsBackground: false,
    },
    export: {
      defaultFormat: 'png',
      defaultQuality: 0.8,
      defaultName: 'image',
    },
    frame: {
      items: [
        {
          name: 'basic',
          mode: 'basic',
          size: {
            min: 1,
            max: 35,
            default: 10,
          },
        },
        {
          name: 'pine',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 15,
          },
        },
        {
          name: 'oak',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 15,
          },
        },
        {
          name: 'rainbow',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 15,
          },
        },
        {
          name: 'grunge1',
          display_name: 'grunge #1',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 15,
          },
        },
        {
          name: 'grunge2',
          display_name: 'grunge #2',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 20,
          },
        },
        {
          name: 'ebony',
          mode: 'stretch',
          size: {
            min: 1,
            max: 35,
            default: 15,
          },
        },
        {
          name: 'art1',
          display_name: 'Art #1',
          mode: 'repeat',
          size: {
            min: 10,
            max: 70,
            default: 55,
          },
        },
        {
          name: 'art2',
          display_name: 'Art #2',
          mode: 'repeat',
          size: {
            min: 10,
            max: 70,
            default: 55,
          },
        },
      ],
    },
  },
};
