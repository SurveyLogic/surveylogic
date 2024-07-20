import React from 'react';
import clsx from 'clsx';
import {ButtonBase} from '../buttons/button-base';

type Props = {
  onChange?: (e: string) => void;
  value?: string;
  colors: string[];
};
export function ColorSwatch({onChange, value, colors}: Props) {
  const presetButtons = colors.map(color => {
    const isSelected = value === color;
    return (
      <ButtonBase
        key={color}
        onClick={() => {
          onChange?.(color);
        }}
        className={clsx(
          'relative block flex-shrink-0 w-26 h-26 border rounded',
          isSelected && 'shadow-md'
        )}
        style={{backgroundColor: color}}
      >
        {isSelected && (
          <span className="absolute inset-0 m-auto rounded-full w-8 h-8 bg-white" />
        )}
      </ButtonBase>
    );
  });

  return <div className="flex flex-wrap gap-6">{presetButtons}</div>;
}
