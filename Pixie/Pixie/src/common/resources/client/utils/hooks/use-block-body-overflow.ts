import {useEffect} from 'react';

export function useBlockBodyOverflow() {
  useEffect(() => {
    document.documentElement.classList.add('no-page-overflow');
    return () => {
      document.documentElement.classList.remove('no-page-overflow');
    };
  }, []);
}
