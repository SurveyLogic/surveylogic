import {AnimatePresence, m, Target, TargetAndTransition} from 'framer-motion';
import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../buttons/icon-button';
import {CloseIcon} from '../../icons/material/Close';
import {MixedText} from '../../i18n/mixed-text';
import {Button} from '../buttons/button';
import {toastState, useToastStore} from './toast-store';
import {Link} from 'react-router-dom';
import {ErrorOutlineIcon} from '../../icons/material/ErrorOutline';
import {CheckCircleIcon} from '../../icons/material/CheckCircle';
import {ProgressCircle} from '@common/ui/progress/progress-circle';

const initial: Target = {opacity: 0, y: 50, scale: 0.3};
const animate: TargetAndTransition = {opacity: 1, y: 0, scale: 1};
const exit: TargetAndTransition = {
  opacity: 0,
  scale: 0.5,
};

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);

  return (
    <div className="relative pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={clsx(
              'fixed mx-auto p-20 z-toast',
              toast.position === 'bottom-center'
                ? 'left-0 right-0 bottom-0'
                : 'right-0 bottom-0'
            )}
          >
            <m.div
              initial={toast.disableEnterAnimation ? undefined : initial}
              animate={toast.disableEnterAnimation ? undefined : animate}
              exit={toast.disableExitAnimation ? undefined : exit}
              className={clsx(
                'flex items-center gap-10 min-w-288 max-w-500 shadow-lg w-min rounded-lg pl-16 pr-6 py-6 text-sm pointer-events-auto max-h-100 bg-paper text-main bg-paper border mx-auto min-h-50'
              )}
              onPointerEnter={() => toast.timer?.pause()}
              onPointerLeave={() => toast.timer?.resume()}
              role="alert"
              aria-live={toast.type === 'danger' ? 'assertive' : 'polite'}
            >
              {toast.type === 'danger' && (
                <ErrorOutlineIcon
                  className="text-danger flex-shrink-0"
                  size="md"
                />
              )}
              {toast.type === 'loading' && (
                <ProgressCircle
                  size="sm"
                  className="flex-shrink-0"
                  isIndeterminate
                />
              )}
              {toast.type === 'positive' && (
                <CheckCircleIcon
                  className="text-positive flex-shrink-0"
                  size="md"
                />
              )}

              <div
                className="overflow-hidden overflow-ellipsis w-max mr-auto"
                data-testid="toast-message"
              >
                <MixedText value={toast.message} />
              </div>

              {toast.action && (
                <Button
                  variant="text"
                  color="primary"
                  size="sm"
                  className="flex-shrink-0"
                  onFocus={() => toast.timer?.pause()}
                  onBlur={() => toast.timer?.resume()}
                  onClick={() => toastState().remove(toast.id)}
                  elementType={Link}
                  to={toast.action.action}
                >
                  <MixedText value={toast.action.label} />
                </Button>
              )}
              {toast.type !== 'loading' && (
                <IconButton
                  onFocus={() => toast.timer?.pause()}
                  onBlur={() => toast.timer?.resume()}
                  type="button"
                  className="flex-shrink-0"
                  onClick={() => {
                    toastState().remove(toast.id);
                  }}
                  size="sm"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </m.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
