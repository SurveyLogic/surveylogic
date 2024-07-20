import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {memo} from 'react';
import clsx from 'clsx';

type DangerousHtml = {__html: string} | undefined;

interface Props {
  src: string;
  className?: string;
  height?: string | false;
}
export const SvgImage = memo(({src, className, height = 'h-full'}: Props) => {
  const {data: svgString} = useSvgImageContent(src);
  // render container even if image is not loaded yet, so there's
  // no layout shift if height is provided via className
  return (
    <div
      className={clsx(
        'inline-block bg-no-repeat svg-image-container',
        height,
        className
      )}
      dangerouslySetInnerHTML={svgString}
    />
  );
});

function useSvgImageContent(src: string) {
  return useQuery(['svgImage', src], () => fetchSvgImageContent(src), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!src,
  });
}

function fetchSvgImageContent(src: string): Promise<DangerousHtml> {
  return axios
    .get(src, {
      responseType: 'text',
    })
    .then(response => {
      return {__html: response.data};
    });
}
