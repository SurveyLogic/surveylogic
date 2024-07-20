import React, {ComponentPropsWithoutRef, CSSProperties} from 'react';
import clsx from 'clsx';
import {clamp} from '../../utils/number/clamp';
import {useNumberFormatter} from '../../i18n/use-number-formatter';

export interface ProgressCircleProps extends ComponentPropsWithoutRef<'div'> {
  value?: number;
  minValue?: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg' | string;
  isIndeterminate?: boolean;
  className?: string;
  position?: string;
  trackColor?: string;
  fillColor?: string;
}
export const ProgressCircle = React.forwardRef<
  HTMLDivElement,
  ProgressCircleProps
>((props, ref) => {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    size = 'md',
    isIndeterminate = false,
    className,
    position = 'relative',
    trackColor,
    fillColor = 'border-primary',
    ...domProps
  } = props;

  value = clamp(value, minValue, maxValue);
  const circleSize = getCircleStyle(size);

  const percentage = (value - minValue) / (maxValue - minValue);
  const formatter = useNumberFormatter({style: 'percent'});

  let valueLabel = '';
  if (!isIndeterminate && !valueLabel) {
    valueLabel = formatter.format(percentage);
  }

  const subMask1Style: CSSProperties = {};
  const subMask2Style: CSSProperties = {};
  if (!isIndeterminate) {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    let angle;
    if (percentage > 0 && percentage <= 50) {
      angle = -180 + (percentage / 50) * 180;
      subMask1Style.transform = `rotate(${angle}deg)`;
      subMask2Style.transform = 'rotate(-180deg)';
    } else if (percentage > 50) {
      angle = -180 + ((percentage - 50) / 50) * 180;
      subMask1Style.transform = 'rotate(0deg)';
      subMask2Style.transform = `rotate(${angle}deg)`;
    }
  }

  return (
    <div
      {...domProps}
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuetext={isIndeterminate ? undefined : valueLabel}
      role="progressbar"
      ref={ref}
      className={clsx(
        'progress-circle',
        position,
        circleSize,
        isIndeterminate && 'indeterminate',
        className
      )}
    >
      <div className={clsx(circleSize, trackColor, 'border-4 rounded-full')} />
      <div
        className={clsx(
          'fills absolute w-full h-full top-0 left-0',
          isIndeterminate && 'progress-circle-fills-animate'
        )}
      >
        <FillMask
          circleSize={circleSize}
          subMaskStyle={subMask1Style}
          isIndeterminate={isIndeterminate}
          className="rotate-180"
          fillColor={fillColor}
          subMaskClassName={clsx(
            isIndeterminate && 'progress-circle-fill-submask-1-animate'
          )}
        />
        <FillMask
          circleSize={circleSize}
          subMaskStyle={subMask2Style}
          isIndeterminate={isIndeterminate}
          fillColor={fillColor}
          subMaskClassName={clsx(
            isIndeterminate && 'progress-circle-fill-submask-2-animate'
          )}
        />
      </div>
    </div>
  );
});

interface FillMaskProps {
  className?: string;
  circleSize?: string;
  subMaskStyle: CSSProperties;
  subMaskClassName: string;
  isIndeterminate?: boolean;
  fillColor?: string;
}
function FillMask({
  subMaskStyle,
  subMaskClassName,
  className,
  circleSize,
  isIndeterminate,
  fillColor,
}: FillMaskProps) {
  return (
    <div
      className={clsx(
        'w-1/2 h-full origin-[100%] absolute overflow-hidden',
        className
      )}
    >
      <div
        className={clsx(
          'w-full h-full origin-[100%] overflow-hidden rotate-180',
          !isIndeterminate && 'transition-transform duration-100',
          subMaskClassName
        )}
        style={subMaskStyle}
      >
        <div className={clsx(circleSize, fillColor, 'rounded-full border-4')} />
      </div>
    </div>
  );
}

function getCircleStyle(size: ProgressCircleProps['size']) {
  switch (size) {
    case 'sm':
      return 'w-24 h-24';
    case 'md':
      return 'w-32 h-32';
    case 'lg':
      return 'w-42 h-42';
    default:
      return size;
  }
}
