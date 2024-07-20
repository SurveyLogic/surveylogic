import {useFocusManager} from '@react-aria/focus';
import {ComponentPropsWithoutRef} from 'react';

export interface LiteralSegment {
  type: 'literal';
  minLength: 1;
  text: string;
}

interface LiteralSegmentProps extends ComponentPropsWithoutRef<'div'> {
  segment: LiteralSegment;
  domProps?: ComponentPropsWithoutRef<'div'>;
}
export function LiteralDateSegment({segment, domProps}: LiteralSegmentProps) {
  const focusManager = useFocusManager();
  return (
    <div
      {...domProps}
      onPointerDown={e => {
        if (e.pointerType === 'mouse') {
          e.preventDefault();
          const res = focusManager.focusNext({from: e.target as HTMLElement});
          if (!res) {
            focusManager.focusPrevious({from: e.target as HTMLElement});
          }
        }
      }}
      aria-hidden
      className="min-w-4 cursor-default select-none"
    >
      {segment.text}
    </div>
  );
}
