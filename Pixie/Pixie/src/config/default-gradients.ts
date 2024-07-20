import {IGradientOptions} from 'fabric/fabric-impl';

export const DEFAULT_GRADIENTS: IGradientOptions[] = [
  {
    type: 'linear',
    coords: {
      x1: -80,
      y1: 0,
      x2: 80,
      y2: 0,
    },
    colorStops: [
      {color: '#ffe47b', offset: 0},
      {color: 'rgb(111,154,211)', offset: 1},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: 0,
      y1: -120,
      x2: 0,
      y2: 120,
    },
    colorStops: [
      {color: '#ff4040', offset: 0},
      {color: '#e6399b', offset: 1},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: -90,
      y1: -90,
      x2: 90,
      y2: 90,
    },
    colorStops: [
      {offset: 0, color: 'rgb(166,111,213)'},
      {offset: 0.5, color: 'rgba(106, 72, 215, 0.5)'},
      {offset: 1, color: '#200772'},
    ],
  },
  {
    type: 'radial',
    coords: {
      r1: 100,
      r2: 10,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
    colorStops: [
      {offset: 0, color: '#FF4F4F'},
      {offset: 1, color: 'rgb(255, 239, 64)'},
    ],
  },
  {
    type: 'radial',
    coords: {
      r1: 100,
      r2: 10,
      x1: 0,
      y1: 0,
      x2: 20,
      y2: 20,
    },
    colorStops: [
      {offset: 0, color: '#ffe47b'},
      {offset: 0.5, color: 'rgb(111,154,211)'},
      {offset: 1, color: 'rgb(166,111,213)'},
    ],
  },
  {
    type: 'radial',
    coords: {
      r1: 50,
      r2: 80,
      x1: 45,
      y1: 45,
      x2: 52,
      y2: 50,
    },
    colorStops: [
      {offset: 0, color: 'rgb(155, 237, 0)'},
      {offset: 1, color: 'rgba(0, 164, 128,0.4)'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: -90,
      y1: -90,
      x2: 90,
      y2: 90,
    },
    colorStops: [
      {offset: 0, color: '#9ecb2d'},
      {offset: 0.5, color: '#72aa00'},
      {offset: 1, color: '#bfd255'},
    ],
  },
  {
    type: 'radial',
    coords: {
      r1: 100,
      r2: 50,
      x1: 30,
      y1: 0,
      x2: 0,
      y2: 0,
    },
    colorStops: [
      {offset: 0, color: '#aebcbf'},
      {offset: 1, color: '#0a0809'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: -80,
      y1: 0,
      x2: 80,
      y2: 0,
    },
    colorStops: [
      {offset: 0, color: '#ffffff'},
      {offset: 1, color: '#f6f6f6'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: 0,
      y1: -120,
      x2: 0,
      y2: 120,
    },
    colorStops: [
      {offset: 0, color: '#fefcea'},
      {offset: 1, color: '#f1da36'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: -90,
      y1: -90,
      x2: 90,
      y2: 90,
    },
    colorStops: [
      {offset: 0, color: 'rgb(166,111,213)'},
      {offset: 0.5, color: 'rgba(106, 72, 215, 0.5)'},
      {offset: 1, color: '#ff1a00'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: 0,
      y1: -120,
      x2: 0,
      y2: 120,
    },
    colorStops: [
      {offset: 0, color: '#b7deed'},
      {offset: 1, color: '#21b4e2'},
    ],
  },
  {
    type: 'linear',
    coords: {
      x1: -80,
      y1: 100,
      x2: 80,
      y2: -100,
    },
    colorStops: [
      {offset: 0, color: '#ffe47b'},
      {offset: 1, color: 'rgb(111,154,211)'},
    ],
  },
];
