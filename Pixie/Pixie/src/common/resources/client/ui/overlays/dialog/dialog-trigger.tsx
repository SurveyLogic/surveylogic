import React, {
  cloneElement,
  Fragment,
  HTMLProps,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useId,
  useMemo,
  useRef,
} from 'react';
import {AnimatePresence} from 'framer-motion';
import {useControlledState} from '@react-stately/utils';
import {Options as OffsetOptions} from '@floating-ui/core/src/middleware/offset';
import {mergeProps, mergeRefs, useLayoutEffect} from '@react-aria/utils';
import {useFloatingPosition} from '../floating-position';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {DialogContext, DialogContextValue} from './dialog-context';
import {Popover} from '../popover';
import {Tray} from '../tray';
import {Modal} from '../modal';
import {createPortal} from 'react-dom';
import {createEventHandler} from '@common/utils/dom/create-event-handler';
import {Placement, VirtualElement} from '@floating-ui/react-dom';
import {rootEl} from '@common/core/root-el';
import {pointToVirtualElement} from '@common/ui/navigation/menu/context-menu';

type PopoverProps = {
  type: 'popover';
  placement?: Placement;
  offset?: OffsetOptions;
};
type ModalProps = {
  type: 'modal' | 'tray';
};
type Props<T = any> = (PopoverProps | ModalProps) & {
  children: ReactNode;
  disableInitialTransition?: boolean;
  onClose?: (value?: T) => void;
  isDismissable?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultIsOpen?: boolean;
  triggerRef?: RefObject<HTMLElement> | RefObject<VirtualElement>;
  moveFocusToDialog?: boolean;
  returnFocusToTrigger?: boolean;
  triggerOnHover?: boolean;
  triggerOnContextMenu?: boolean;
  currentValue?: T;
};
export function DialogTrigger(props: Props) {
  let {
    children,
    type,
    disableInitialTransition,
    onClose,
    isDismissable = true,
    moveFocusToDialog = true,
    returnFocusToTrigger = true,
    triggerOnHover = false,
    currentValue,
    triggerOnContextMenu = false,
  } = props;
  // for context menu we will set triggerRef to VirtualElement in "onContextMenu" event.
  // If dialog is not triggered on context menu, leave triggerRef null (unless it's passed in via props)
  // otherwise it will prevent dialog from opening in "popover" mode.
  const contextMenuTriggerRef = useRef<VirtualElement | null>(null);
  const triggerRef =
    triggerOnContextMenu && !props.triggerRef
      ? contextMenuTriggerRef
      : props.triggerRef;
  const initialValueRef = useRef(currentValue);
  const [isOpen, setIsOpen] = useControlledState(
    props.isOpen,
    props.defaultIsOpen,
    props.onOpenChange
  );

  const {dialogTrigger, dialog} = extractChildren(children);

  // On small devices, show a modal or tray instead of a popover.
  const isMobile = useIsMobileMediaQuery();
  if (isMobile && type === 'popover') {
    type = 'modal';
  }

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {x, y, reference, floating, strategy, refs} = useFloatingPosition({
    ...props,
    disablePositioning: type === 'modal',
  });

  const floatingStyle =
    type === 'popover'
      ? {
          position: strategy,
          top: y ?? '',
          left: x ?? '',
        }
      : {};

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const formId = `${id}-form`;

  const close = useCallback(
    (value?: any) => {
      // initial value can be used to restore state to what it was before opening the dialog, for example in color picker
      onClose?.(value ?? initialValueRef.current);
      setIsOpen(false);
    },
    [onClose, setIsOpen]
  );

  const open = useCallback(() => {
    setIsOpen(true);
    // set current value that is active at the time of opening dialog
    initialValueRef.current = currentValue;
  }, [currentValue, setIsOpen]);

  // position dropdown relative to provided ref, not the trigger
  useLayoutEffect(() => {
    if (triggerRef?.current && refs.reference.current !== triggerRef.current) {
      reference(triggerRef.current);
    }
  }, [reference, triggerRef?.current, refs]);

  const dialogProps = useMemo(() => {
    return {
      'aria-labelledby': labelId,
      'aria-describedby': descriptionId,
    };
  }, [labelId, descriptionId]);

  let Overlay: typeof Modal | typeof Tray | typeof Popover;
  if (type === 'modal') {
    Overlay = Modal;
  } else if (type === 'tray') {
    Overlay = Tray;
  } else {
    Overlay = Popover;
  }

  const contextValue: DialogContextValue = useMemo(() => {
    return {
      dialogProps,
      type,
      labelId,
      descriptionId,
      isDismissable,
      close,
      formId,
    };
  }, [close, descriptionId, dialogProps, formId, labelId, type, isDismissable]);

  triggerOnHover = triggerOnHover && type === 'popover';

  const handleTriggerHover: HTMLProps<HTMLElement> = {
    onPointerEnter: createEventHandler((e: React.PointerEvent) => {
      open();
    }),
    onPointerLeave: createEventHandler((e: React.PointerEvent) => {
      hoverTimeoutRef.current = setTimeout(() => {
        close();
      }, 150);
    }),
  };

  const handleFloatingHover: HTMLProps<HTMLElement> = {
    onPointerEnter: createEventHandler((e: React.PointerEvent) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    }),
    onPointerLeave: createEventHandler((e: React.PointerEvent) => {
      close();
    }),
  };

  const handleTriggerContextMenu: HTMLProps<HTMLElement> = {
    onContextMenu: createEventHandler((e: React.MouseEvent) => {
      e.preventDefault();
      contextMenuTriggerRef.current = pointToVirtualElement(
        {x: e.clientX, y: e.clientY},
        e.currentTarget
      );
      open();
    }),
  };

  const handleTriggerClick: HTMLProps<HTMLElement> = {
    onClick: createEventHandler((e: React.MouseEvent) => {
      // prevent propagating to parent, in case floating element
      // is attached to input field and button is inside the field
      e.stopPropagation();
      if (isOpen) {
        close();
      } else {
        open();
      }
    }),
  };

  return (
    <Fragment>
      {dialogTrigger &&
        cloneElement(
          dialogTrigger,
          mergeProps(
            {
              // make sure ref specified on trigger element is not overwritten
              ...(!triggerRef && !triggerOnContextMenu ? {ref: reference} : {}),
              ...(!triggerOnContextMenu ? handleTriggerClick : {}),
              ...(triggerOnHover ? handleTriggerHover : {}),
              ...(triggerOnContextMenu ? handleTriggerContextMenu : {}),
            },
            {
              ...dialogTrigger.props,
            }
          )
        )}
      {rootEl &&
        createPortal(
          <AnimatePresence initial={!disableInitialTransition}>
            {isOpen && (
              <DialogContext.Provider value={contextValue}>
                <Overlay
                  {...(triggerOnHover ? handleFloatingHover : {})}
                  ref={floating}
                  triggerRef={refs.reference}
                  style={floatingStyle}
                  restoreFocus={returnFocusToTrigger}
                  autoFocus={moveFocusToDialog}
                  isOpen={isOpen}
                  onClose={close}
                  isDismissable={isDismissable}
                  isContextMenu={triggerOnContextMenu}
                >
                  {dialog}
                </Overlay>
              </DialogContext.Provider>
            )}
          </AnimatePresence>,
          rootEl
        )}
    </Fragment>
  );
}

function extractChildren(rawChildren: ReactNode) {
  const children = React.Children.toArray(rawChildren);

  // trigger and dialog passed as children
  if (children && children.length === 2) {
    return {
      dialogTrigger: children[0] as ReactElement,
      dialog: children[1] as ReactElement,
    };
  }

  // only dialog passed as child
  return {dialog: children[0] as ReactElement};
}
