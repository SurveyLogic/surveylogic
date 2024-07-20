import {m} from 'framer-motion';
import {forwardRef} from 'react';
import {OverlayProps} from './overlay-props';
import {useOverlayViewport} from './use-overlay-viewport';
import {Underlay} from './underlay';
import {FocusScope} from '@react-aria/focus';
import {useObjectRef} from '@react-aria/utils';

export const Tray = forwardRef<HTMLDivElement, OverlayProps>(
  (
    {
      children,
      autoFocus = false,
      restoreFocus = true,
      isDismissable,
      isOpen,
      onClose,
    },
    ref
  ) => {
    const viewPortStyle = useOverlayViewport();
    const objRef = useObjectRef(ref);

    return (
      <div className="isolate z-tray fixed inset-0" style={viewPortStyle}>
        <Underlay
          key="tray-underlay"
          onClick={() => {
            if (isDismissable) {
              onClose();
            }
          }}
        />
        <m.div
          ref={objRef}
          className="absolute bottom-0 left-0 right-0 w-full z-20 rounded-t overflow-hidden max-w-375 max-h-tray mx-auto pb-safe-area"
          role="presentation"
          initial={{opacity: 0, y: '100%'}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: '100%'}}
          transition={{type: 'tween', duration: 0.2}}
        >
          <FocusScope restoreFocus={restoreFocus} autoFocus={autoFocus} contain>
            {children}
          </FocusScope>
        </m.div>
      </div>
    );
  }
);
