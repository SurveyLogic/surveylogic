import {ICircleOptions, IObjectOptions, IRectOptions} from 'fabric/fabric-impl';

export interface PathOptions extends IObjectOptions {
  path: string | undefined;
}

export interface BasicShape {
  name: string;
  type: string;
  options?: IObjectOptions | IRectOptions | PathOptions | ICircleOptions;
}

export const defaultShapes: BasicShape[] = [
  {
    name: 'circle',
    type: 'Circle',
  },
  {
    name: 'square',
    type: 'Rect',
    options: {
      lockUniScaling: false,
    },
  },
  {
    name: 'triangle',
    type: 'Triangle',
  },
  {
    name: 'ellipse',
    type: 'Ellipse',
    options: {
      lockUniScaling: false,
    },
  },
  {
    name: 'Arrow #1',
    type: 'Path',
    options: {
      path: 'M 294.9 16.4 l 15.7 42.2 c -171.4 70.3 -294 242.3 -289.1 437.4 l 14.7 -1 c 9.1 -0.6 18.1 -1.2 27.1 -1.9 l 14.7 -1 c -4.3 -170.1 102.5 -320 252 -381.3 l 15.7 42.2 c 34.7 -40.5 83.1 -76.6 144.8 -99.8 c -58.1 -26.2 -124.9 -39.6 -195.6 -36.8 z',
    },
  },
  {
    name: 'Arrow #2',
    type: 'Path',
    options: {
      path: 'M 16 248.4 v 14.9 h 447.5 l -93.2 82.5 l 11.9 10.5 l 113.8 -100.2 l -113.6 -100.4 l -11.8 10.5 l 92.9 82.2 z',
    },
  },
  {
    name: 'Arrow #3',
    type: 'Path',
    options: {
      path: 'M 496 256 l -118.6 -66 v 40.8 h -361.4 v 50.4 h 361.4 v 40.8 l 118.6 -66 z',
    },
  },
  {
    name: 'Line',
    type: 'Path',
    options: {
      path: 'M 16 256 h 480',
      strokeWidth: 10,
      stroke: '#000',
      padding: 10,
    },
  },
  {
    name: 'Star',
    type: 'Path',
    options: {
      path: 'M 256 406.3 l 148.3 78 l -28.3 -165.2 l 120 -117 l -165.8 -24.1 l -74.2 -150.3 l -74.2 150.3 l -165.8 24.1 l 120 117 l -28.3 165.2 z',
    },
  },
  {
    name: 'Polygon',
    type: 'Path',
    options: {
      path: 'M 256 19.6 l 156.6 57.1 l 83.4 144.3 l -28.9 164.2 l -127.7 107.2 h -166.8 l -127.7 -107.2 l -28.9 -164.2 l 83.4 -144.3 z',
    },
  },
  {
    name: 'Badge',
    type: 'Path',
    options: {
      path: 'M 257.3 16.2 s -148 58.2 -204.4 81.4 c 0 75.7 -16.8 303.5 204.4 398.2 c 218.7 -94.6 201.9 -322.4 201.9 -398.2 c -62.1 -23.6 -201.9 -81.4 -201.9 -81.4 z',
    },
  },
];
