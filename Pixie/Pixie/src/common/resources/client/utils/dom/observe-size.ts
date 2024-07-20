import {RefObject} from 'react';

type Callback = (e: {width: number; height: number}) => void;

export function observeSize(
  ref: RefObject<HTMLElement>,
  callback: Callback
): () => void {
  const observer = new ResizeObserver(entries => {
    const rect = entries[0].contentRect;
    callback({width: rect.width, height: rect.height});
  });
  if (ref.current) {
    observer.observe(ref.current);
  }
  return () => {
    if (ref.current) {
      observer.unobserve(ref.current);
    }
  };
}
