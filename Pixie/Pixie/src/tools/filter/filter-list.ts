import {IAllFilters} from 'fabric/fabric-impl';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

export interface FilterConfig {
  name: string;
  fabricType?: string;
  uses?: keyof IAllFilters;
  options?: FilterOptions;
  initialConfig?: {[key: string]: any};
  matrix?: number[];
  apply?: Function;
}

export interface FilterOptions {
  [key: string]: SliderOptions | SelectOptions | ColorOptions;
}

interface SliderOptions {
  type: 'slider';
  current: number;
  min: number;
  max: number;
  step?: number;
}

interface SelectOptions {
  type: 'select';
  current: string;
  available: {key: string}[];
}

interface ColorOptions {
  type: 'colorPicker';
  current: string;
}

export const filterList: FilterConfig[] = [
  {name: 'grayscale'},
  {name: 'blackWhite', fabricType: 'blackwhite'},
  {
    name: 'sharpen',
    uses: 'Convolute',
    matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  },
  {name: 'invert'},
  {name: 'vintage'},
  {name: 'polaroid'},
  {name: 'kodachrome'},
  {name: 'technicolor'},
  {name: 'brownie'},
  {name: 'sepia'},
  {
    name: 'removeColor',
    fabricType: 'removecolor',
    options: {
      distance: {type: 'slider', current: 0.1, min: 0, max: 1, step: 0.01},
      color: {current: '#fff', type: 'colorPicker'},
    },
  },
  {
    name: 'brightness',
    options: {
      brightness: {type: 'slider', current: 0.1, min: -1, max: 1, step: 0.1},
    },
  },
  {
    name: 'gamma',
    options: {
      red: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
      green: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
      blue: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
    },
    apply: (filter: any) => {
      filter.gamma = [filter.red, filter.green, filter.blue];
    },
  },
  {
    name: 'noise',
    options: {
      noise: {type: 'slider', current: 40, min: 1, max: 600},
    },
  },
  {
    name: 'pixelate',
    options: {
      blocksize: {type: 'slider', min: 1, max: 40, current: 6},
    },
  },
  {
    name: 'blur',
    uses: 'Convolute',
    matrix: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
  },
  {
    name: 'emboss',
    uses: 'Convolute',
    matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
  },
  {
    name: 'blendColor',
    fabricType: 'blendcolor',
    options: {
      alpha: {type: 'slider', current: 0.5, min: 0.1, max: 1, step: 0.1},
      mode: {
        current: 'add',
        type: 'select',
        available: [
          {key: 'add'},
          {key: 'multiply'},
          {key: 'subtract'},
          {key: 'diff'},
          {key: 'screen'},
          {key: 'lighten'},
          {key: 'darken'},
        ],
      },
      color: {type: 'colorPicker', current: '#FF4081'},
    },
  },
];

export const filterNameMessages: Record<string, MessageDescriptor> = {
  grayscale: message('grayscale'),
  blackWhite: message('Black & White'),
  sharpen: message('Sharpen'),
  invert: message('Invert'),
  vintage: message('Vintage'),
  polaroid: message('Polaroid'),
  kodachrome: message('Kodachrome'),
  technicolor: message('Technicolor'),
  brownie: message('Brownie'),
  sepia: message('Sepia'),
  removeColor: message('Remove Color'),
  brightness: message('Brightness'),
  gamma: message('Gamma'),
  noise: message('Noise'),
  pixelate: message('Pixelate'),
  blur: message('Blur'),
  emboss: message('Emboss'),
  blendColor: message('Blend Color'),
};

export const filterOptionMessages: Record<string, MessageDescriptor> = {
  distance: message('distance'),
  color: message('color'),
  brightness: message('brightness'),
  red: message('red'),
  green: message('green'),
  blue: message('blue'),
  noise: message('noise'),
  blocksize: message('blocksize'),
  mode: message('mode'),
  alpha: message('alpha'),
};
