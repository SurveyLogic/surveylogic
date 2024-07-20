import React, {
  cloneElement,
  isValidElement,
  Key,
  ReactElement,
  ReactNode,
  useId,
  useRef,
} from 'react';
import clsx from 'clsx';
import {AnimatePresence, m} from 'framer-motion';
import {useControlledState} from '@react-stately/utils';
import {FocusScope, useFocusManager} from '@react-aria/focus';
import {KeyboardArrowDownIcon} from '../../icons/material/KeyboardArrowDown';

type Props = {
  variant?: 'outline' | 'default' | 'minimal';
  children?: ReactNode;
  mode?: 'single' | 'multiple';
  expandedValues?: Key[];
  defaultExpandedValues?: Key[];
  onExpandedChange?: (key: Key[]) => void;
  className?: string;
};
export const Accordion = React.forwardRef<HTMLDivElement, Props>(
  (
    {variant = 'default', mode = 'single', children, className, ...other},
    ref
  ) => {
    const [expandedValues, setExpandedValues] = useControlledState(
      other.expandedValues,
      other.defaultExpandedValues || [],
      other.onExpandedChange
    );

    return (
      <div
        className={clsx(variant === 'outline' && 'space-y-10', className)}
        ref={ref}
        role="presentation"
      >
        <AnimatePresence>
          <FocusScope>
            {React.Children.map(children, (child, index) => {
              if (!isValidElement<ClonedItemProps>(child)) return null;
              return cloneElement<ClonedItemProps>(child, {
                key: child.key || index,
                value: child.props.value || index,
                mode,
                variant,
                expandedValues,
                setExpandedValues,
              });
            })}
          </FocusScope>
        </AnimatePresence>
      </div>
    );
  }
);

interface AccordionItemProps {
  children: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  value?: Key;
  bodyClassName?: string;
  chevronPosition?: 'left' | 'right';
  startIcon?: ReactElement;
  endAppend?: ReactElement;
  dataTestId?: string;
}
interface ClonedItemProps extends AccordionItemProps {
  variant?: 'outline' | 'default' | 'minimal';
  expandedValues: Key[];
  setExpandedValues: (keys: Key[]) => void;
  mode: 'single' | 'multiple';
  value: Key;
}
export function AccordionItem({
  children,
  label,
  disabled,
  bodyClassName,
  startIcon,
  description,
  endAppend,
  chevronPosition = 'right',
  dataTestId,
  ...other
}: AccordionItemProps) {
  const {expandedValues, setExpandedValues, variant, value, mode} =
    other as ClonedItemProps;
  const ref = useRef<HTMLButtonElement>(null);
  const isExpanded = !disabled && expandedValues.includes(value);
  const focusManager = useFocusManager();
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        focusManager.focusNext();
        break;
      case 'ArrowUp':
        focusManager.focusPrevious();
        break;
      case 'Home':
        focusManager.focusFirst();
        break;
      case 'End':
        focusManager.focusLast();
        break;
    }
  };

  const variants = {
    open: {
      height: 'auto',
      visibility: 'visible',
      transitionEnd: {
        overflow: 'auto',
      },
    },
    closed: {
      height: 0,
      overflow: 'hidden',
      transitionEnd: {
        visibility: 'hidden',
      },
    },
  } as const;

  const toggle = () => {
    const i = expandedValues.indexOf(value);
    if (i > -1) {
      const newKeys = [...expandedValues];
      newKeys.splice(i, 1);
      setExpandedValues(newKeys);
    } else if (mode === 'single') {
      setExpandedValues([value]);
    } else {
      setExpandedValues([...expandedValues, value]);
    }
  };

  const chevron = (
    <div className={clsx(variant === 'minimal' && '')}>
      <KeyboardArrowDownIcon
        aria-hidden="true"
        size="md"
        className={clsx(
          disabled ? 'text-disabled' : 'text-muted',
          isExpanded && 'rotate-180 transition-transform'
        )}
      />
    </div>
  );

  return (
    <div
      className={clsx(
        variant === 'default' && 'border-b',
        variant === 'outline' && 'border rounded',
        disabled && 'text-disabled'
      )}
    >
      <h3
        className={clsx(
          'flex items-center text-sm justify-between w-full',
          disabled && 'pointer-events-none',
          isExpanded && variant !== 'minimal' && 'border-b',
          variant === 'outline'
            ? isExpanded
              ? 'rounded-t'
              : 'rounded'
            : undefined
        )}
      >
        <button
          data-testid={dataTestId}
          disabled={disabled}
          aria-expanded={isExpanded}
          id={buttonId}
          aria-controls={panelId}
          type="button"
          ref={ref}
          onKeyDown={onKeyDown}
          onClick={() => {
            if (!disabled) {
              toggle();
            }
          }}
          className="flex items-center text-left gap-10 flex-auto pl-14 pr-10 py-10 hover:bg-hover outline-none focus-visible:bg-primary/focus"
        >
          {chevronPosition === 'left' && chevron}
          {startIcon &&
            cloneElement(startIcon, {
              size: 'md',
              className: clsx(
                startIcon.props.className,
                disabled ? 'text-disabled' : 'text-muted'
              ),
            })}
          <div className="flex-auto overflow-hidden overflow-ellipsis">
            <div data-testid="accordion-label">{label}</div>
            {description && (
              <div className="text-muted text-xs">{description}</div>
            )}
          </div>
          {chevronPosition === 'right' && chevron}
        </button>
        {endAppend && (
          <div className="flex-shrink-0 text-sm text-muted px-4">
            {endAppend}
          </div>
        )}
      </h3>
      <m.div
        aria-labelledby={id}
        role="region"
        variants={variants}
        transition={{type: 'tween', duration: 0.2}}
        initial={false}
        animate={isExpanded ? 'open' : 'closed'}
      >
        <div className={clsx('p-16', bodyClassName)}>{children}</div>
      </m.div>
    </div>
  );
}
