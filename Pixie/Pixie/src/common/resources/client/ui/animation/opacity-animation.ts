import {HTMLMotionProps} from 'framer-motion';

export const opacityAnimation: HTMLMotionProps<any> = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0},
};
