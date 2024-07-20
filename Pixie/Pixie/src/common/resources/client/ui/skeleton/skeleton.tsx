import clsx from 'clsx';

interface SkeletonProps {
  variant?: 'avatar' | 'text' | 'rect' | 'icon';
  animation?: 'pulsate' | 'wave';
  className?: string;
  size?: string;
  display?: string;
  radius?: string;
}
export function Skeleton({
  variant = 'text',
  animation = 'wave',
  size,
  className,
  display = 'inline-flex',
  radius = 'rounded',
}: SkeletonProps) {
  return (
    <span
      className={clsx(
        'overflow-hidden relative bg-fg-base/4 bg-no-repeat will-change-transform',
        radius,
        skeletonSize({variant, size}),
        display,
        variant !== 'text' && 'leading-none',
        variant === 'text' && 'align-middle before:content-[\\00a0]',
        variant === 'avatar' && 'mr-10 flex-shrink-0',
        variant === 'icon' && 'mx-8 flex-shrink-0',
        animation === 'wave' ? 'skeleton-wave' : 'skeleton-pulsate',
        className
      )}
      aria-busy
      aria-live="polite"
    >
      &zwnj;
    </span>
  );
}

interface SkeletonSizeProps {
  variant: SkeletonProps['variant'];
  size: SkeletonProps['size'];
}
function skeletonSize({variant, size}: SkeletonSizeProps): string | undefined {
  if (size) {
    return size;
  }

  switch (variant) {
    case 'avatar':
      return 'h-40 w-40';
    case 'icon':
      return 'h-24 h-24';
    case 'rect':
      return 'h-full w-full';
    default:
      return 'w-full';
  }
}
