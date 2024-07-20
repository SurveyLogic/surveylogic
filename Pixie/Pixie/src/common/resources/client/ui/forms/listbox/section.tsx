import React, {ReactNode, useId} from 'react';
import clsx from 'clsx';

export interface ListboxSectionProps {
  label?: ReactNode;
  children: React.ReactNode;
  index?: number;
}
export function Section({children, label, index}: ListboxSectionProps) {
  const id = useId();

  return (
    <div
      role="group"
      className={clsx(index !== 0 && 'border-t my-4')}
      aria-labelledby={label ? `be-select-${id}` : undefined}
    >
      {label && (
        <div
          className="block uppercase text-muted text-xs px-16 py-10"
          role="presentation"
          id={`be-select-${id}`}
          aria-hidden="true"
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
