import {useEffect, useState} from 'react';

export interface UseMediaQueryOptions {
  noSSR?: boolean;
}

export function useMediaQuery(
  query: string,
  {noSSR}: UseMediaQueryOptions = {noSSR: true}
) {
  const supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';
  const [matches, setMatches] = useState(
    noSSR
      ? () => (supportsMatchMedia ? window.matchMedia(query).matches : false)
      : null
  );

  useEffect(() => {
    if (!supportsMatchMedia) {
      return;
    }

    const mq = window.matchMedia(query);
    const onChange = () => {
      setMatches(mq.matches);
    };

    mq.addEventListener('change', onChange);
    if (!noSSR) {
      onChange();
    }

    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, [supportsMatchMedia, query, noSSR]);

  // If in SSR, the media query should never match. Once the page hydrates,
  // this will update and the real value will be returned.
  return typeof window === 'undefined' ? null : matches;
}
