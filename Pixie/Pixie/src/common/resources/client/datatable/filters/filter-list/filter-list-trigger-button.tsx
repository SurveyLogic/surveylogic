import {BackendFilter, FilterControlType} from '../backend-filter';
import {ComponentPropsWithRef, forwardRef, ReactNode} from 'react';
import {Button} from '../../../ui/buttons/button';
import {KeyboardArrowDownIcon} from '../../../icons/material/KeyboardArrowDown';
import {Trans} from '../../../i18n/trans';
import clsx from 'clsx';

interface TriggerButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'color'> {
  isInactive?: boolean;
  filter: BackendFilter;
  children?: ReactNode;
}
export const FilterListTriggerButton = forwardRef<
  HTMLButtonElement,
  TriggerButtonProps
>((props, ref) => {
  // pass through all props from menu trigger and dialog trigger to button
  const {isInactive, filter, ...domProps} = props;

  if (isInactive) {
    return <InactiveFilterButton filter={filter} {...domProps} ref={ref} />;
  }

  return <ActiveFilterButton filter={filter} {...domProps} ref={ref} />;
});

interface InactiveFilterButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'color'> {
  filter: BackendFilter;
}
export const InactiveFilterButton = forwardRef<
  HTMLButtonElement,
  InactiveFilterButtonProps
>(({filter, ...domProps}, ref) => {
  return (
    <Button
      variant="outline"
      size="xs"
      color="paper"
      radius="rounded-md"
      border="border"
      ref={ref}
      endIcon={<KeyboardArrowDownIcon />}
      {...domProps}
    >
      <Trans {...filter.label} />
    </Button>
  );
});

export const ActiveFilterButton = forwardRef<
  HTMLButtonElement,
  InactiveFilterButtonProps
>(({filter, children, ...domProps}, ref) => {
  const isBoolean = filter.type === FilterControlType.BooleanToggle;
  return (
    <Button
      variant="outline"
      size="xs"
      color="primary"
      radius="rounded-r-md"
      border="border-y border-r"
      endIcon={!isBoolean && <KeyboardArrowDownIcon />}
      ref={ref}
      {...domProps}
    >
      <span
        className={clsx(
          !isBoolean && 'border-r border-r-primary-light mr-8 pr-8'
        )}
      >
        <Trans {...filter.label} />
      </span>
      {children}
    </Button>
  );
});
