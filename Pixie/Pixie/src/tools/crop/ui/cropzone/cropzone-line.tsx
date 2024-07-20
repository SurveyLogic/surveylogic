import {MutableRefObject} from 'react';
import clsx from 'clsx';
import {CropzoneRefs} from './cropzone-refs';

type Props = {
  name: 'lineVer1' | 'lineVer2' | 'lineHor1' | 'lineHor2';
  refs: MutableRefObject<CropzoneRefs>;
};

export function Line({name, refs}: Props) {
  const className = clsx(
    'cropzone-transition pointer-events-none absolute left-0 top-0 bg-white/50',
    name.startsWith('lineHor') ? 'h-px' : 'w-px'
  );
  return (
    <div
      className={className}
      ref={el => {
        refs.current[name] = el;
      }}
    />
  );
}
