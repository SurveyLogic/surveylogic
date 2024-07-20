import {
  cloneElement,
  forwardRef,
  Fragment,
  HTMLAttributes,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import clsx from 'clsx';
import {PopoverAnimation} from '../overlays/popover-animation';
import {useFloatingPosition} from '../overlays/floating-position';
import {createPortal} from 'react-dom';
import {mergeProps} from '@react-aria/utils';
import {Placement} from '@floating-ui/react-dom';
import {Options as OffsetOptions} from '@floating-ui/core/src/middleware/offset';
import {rootEl} from '../../core/root-el';

const TOOLTIP_COOLDOWN = 500;
const tooltips: Record<string, ((immediate?: boolean) => void) | undefined> =
  {};
let globalWarmedUp = false;
let globalWarmUpTimeout: ReturnType<typeof setTimeout> | null = null;
let globalCooldownTimeout: ReturnType<typeof setTimeout> | null = null;

const closeOpenTooltips = (tooltipId: string) => {
  for (const hideTooltipId in tooltips) {
    if (hideTooltipId !== tooltipId) {
      tooltips[hideTooltipId]?.(true);
      delete tooltips[hideTooltipId];
    }
  }
};

interface Props {
  label: ReactNode;
  placement?: Placement;
  children: JSX.Element;
  variant?: 'neutral' | 'positive' | 'danger';
  delay?: number;
  isDisabled?: boolean;
  offset?: OffsetOptions;
}
export const Tooltip = forwardRef<HTMLElement, Props>(
  (
    {
      children,
      label,
      placement = 'top',
      offset = 10,
      variant = 'neutral',
      delay = 1500,
      isDisabled,
      ...domProps
    },
    ref
  ) => {
    const {x, y, reference, floating, strategy, arrowRef, arrowStyle} =
      useFloatingPosition({
        placement,
        offset,
        ref,
        showArrow: true,
      });

    const [isOpen, setIsOpen] = useState(false);
    const tooltipId = useId();
    const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

    const showTooltip = () => {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = undefined;
      closeOpenTooltips(tooltipId);
      tooltips[tooltipId] = hideTooltip;
      globalWarmedUp = true;
      setIsOpen(true);
      if (globalWarmUpTimeout) {
        clearTimeout(globalWarmUpTimeout);
        globalWarmUpTimeout = null;
      }
      if (globalCooldownTimeout) {
        clearTimeout(globalCooldownTimeout);
        globalCooldownTimeout = null;
      }
    };

    const hideTooltip = useCallback(
      (immediate?: boolean) => {
        if (immediate) {
          clearTimeout(closeTimeout.current);
          closeTimeout.current = undefined;
          setIsOpen(false);
        } else if (!closeTimeout.current) {
          closeTimeout.current = setTimeout(() => {
            closeTimeout.current = undefined;
            setIsOpen(false);
          }, TOOLTIP_COOLDOWN);
        }

        if (globalWarmUpTimeout) {
          clearTimeout(globalWarmUpTimeout);
          globalWarmUpTimeout = null;
        }
        if (globalWarmedUp) {
          if (globalCooldownTimeout) {
            clearTimeout(globalCooldownTimeout);
          }
          globalCooldownTimeout = setTimeout(() => {
            delete tooltips[tooltipId];
            globalCooldownTimeout = null;
            globalWarmedUp = false;
          }, TOOLTIP_COOLDOWN);
        }
      },
      [tooltipId]
    );

    const warmupTooltip = () => {
      closeOpenTooltips(tooltipId);
      tooltips[tooltipId] = hideTooltip;
      if (!isOpen && !globalWarmUpTimeout && !globalWarmedUp) {
        globalWarmUpTimeout = setTimeout(() => {
          globalWarmUpTimeout = null;
          globalWarmedUp = true;
          showTooltip();
        }, delay);
      } else if (!isOpen) {
        showTooltip();
      }
    };

    const showTooltipWithWarmup = (immediate?: boolean) => {
      if (!immediate && delay > 0 && !closeTimeout.current) {
        warmupTooltip();
      } else {
        showTooltip();
      }
    };

    // close on unmount
    useEffect(() => {
      return () => {
        clearTimeout(closeTimeout.current);
        const tooltip = tooltips[tooltipId];
        if (tooltip) {
          delete tooltips[tooltipId];
        }
      };
    }, [tooltipId]);

    // close on "escape" key press
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          hideTooltip(true);
        }
      };
      if (isOpen) {
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }
    }, [isOpen, hideTooltip]);

    return (
      <Fragment>
        {cloneElement(
          children,
          // pass dom props down to child element, in case tooltip is wrapped in menu trigger
          mergeProps(
            {
              'aria-describedby': isOpen ? tooltipId : undefined,
              ref: reference,
              onPointerEnter: e => {
                if (e.pointerType === 'mouse') {
                  showTooltipWithWarmup();
                }
              },
              onFocus: e => {
                if (e.target.matches(':focus-visible')) {
                  showTooltipWithWarmup(true);
                }
              },
              onPointerLeave: e => {
                if (e.pointerType === 'mouse') {
                  hideTooltip();
                }
              },
              onPointerDown: () => {
                hideTooltip(true);
              },
              onBlur: () => {
                hideTooltip();
              },
            } as HTMLAttributes<HTMLElement>,
            domProps
          )
        )}
        {rootEl &&
          createPortal(
            <AnimatePresence>
              {isOpen && (
                <m.div
                  {...PopoverAnimation}
                  ref={floating}
                  id={tooltipId}
                  role="tooltip"
                  onPointerEnter={() => {
                    showTooltipWithWarmup(true);
                  }}
                  onPointerLeave={() => {
                    hideTooltip();
                  }}
                  className={clsx(
                    'rounded shadow px-8 py-4 text-xs break-words max-w-240 my-4 z-tooltip text-white',
                    variant === 'positive' && 'bg-positive',
                    variant === 'danger' && 'bg-danger',
                    variant === 'neutral' && 'bg-toast'
                  )}
                  style={{
                    position: strategy,
                    top: y ?? '',
                    left: x ?? '',
                  }}
                >
                  <div
                    ref={arrowRef as Ref<HTMLDivElement>}
                    className="absolute w-8 h-8 rotate-45 bg-inherit"
                    style={arrowStyle}
                  />
                  {label}
                </m.div>
              )}
            </AnimatePresence>,
            rootEl
          )}
      </Fragment>
    );
  }
);
