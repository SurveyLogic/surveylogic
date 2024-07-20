import {RefObject, useEffect, useRef} from 'react';

export interface AutoFocusProps {
  autoFocus?: boolean;
  autoSelectText?: boolean;
  disabled?: boolean;
}
export function useAutoFocus(
  {autoFocus, autoSelectText}: AutoFocusProps,
  ref: RefObject<HTMLElement>
) {
  const autoFocusRef = useRef(autoFocus);

  useEffect(() => {
    if (autoFocusRef.current && ref.current) {
      ref.current?.focus();
      if (autoSelectText && ref.current.nodeName.toLowerCase() === 'input') {
        requestAnimationFrame(() => {
          (ref.current as HTMLInputElement).select();
        });
      }
    }
    autoFocusRef.current = false;
  }, [ref, autoSelectText]);
}
