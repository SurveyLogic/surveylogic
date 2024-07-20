import {MutableRefObject} from 'react';
import {CropzoneRefs} from './cropzone-refs';

export enum MaskPosition {
  top = 'maskTop',
  right = 'maskRight',
  bottom = 'maskBottom',
  left = 'maskLeft',
}

type Props = {
  position: MaskPosition;
  refs: MutableRefObject<CropzoneRefs>;
};

export function MaskPart({position, refs}: Props) {
  const className = getClassNameByPosition(position);
  return (
    <div
      className={`cropzone-transition bg-black/50 bottom absolute ${className}`}
      ref={el => (refs.current[position] = el)}
    />
  );
}

function getClassNameByPosition(position: MaskPosition): string {
  switch (position) {
    case MaskPosition.top:
      return 'left-0 top-0';
    case MaskPosition.bottom:
      return 'bottom-0 left-0';
    default:
      return '';
  }
}
