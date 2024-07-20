import {ComponentType, HTMLAttributes, memo} from 'react';
import {SvgImage} from './svg-image/svg-image';
import {SvgIconProps} from '../../icons/svg-icon';
import {isAbsoluteUrl} from '@common/utils/urls/is-absolute-url';

interface Props extends HTMLAttributes<HTMLElement> {
  src: string | ComponentType<SvgIconProps>;
  className?: string;
}
export const MixedImage = memo(({src, className, ...domProps}: Props) => {
  let type: 'svg' | 'image' | 'icon' | null = null;

  if (!src) {
    type = null;
  } else if (typeof src === 'object') {
    type = 'icon';
  } else if (
    (src as string).endsWith('.svg') &&
    !isAbsoluteUrl(src as string)
  ) {
    type = 'svg';
  } else {
    type = 'image';
  }

  if (type === 'svg') {
    return (
      <SvgImage
        {...domProps}
        className={className}
        src={src as string}
        height={false}
      />
    );
  }

  if (type === 'image') {
    return (
      <img {...domProps} className={className} src={src as string} alt="" />
    );
  }

  if (type === 'icon') {
    const Icon = src;
    return (
      <Icon
        {...(domProps as HTMLAttributes<SVGElement>)}
        className={className}
      />
    );
  }

  return null;
});
