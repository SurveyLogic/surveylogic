import {HTMLMotionProps} from 'framer-motion';

export const toolbarStyle =
  'flex flex-shrink-0 items-center justify-between px-12 py-[9px] w-full h-[54px]';

export const toolbarAnimation: HTMLMotionProps<'div'> = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0, position: 'absolute'},
  transition: {type: 'tween', duration: 0.15},
};
