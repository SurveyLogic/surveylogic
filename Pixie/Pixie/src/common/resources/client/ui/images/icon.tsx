import React from 'react';

type IconProps = {
  name: string;
  className?: string;
};
export function Icon({name, className = 'w-24 h-24'}: IconProps) {
  return (
    <svg className={`fill-current inline-block ${className}`}>
      <use href={`/icons/merged.svg#${name}`} />
    </svg>
  );
}
