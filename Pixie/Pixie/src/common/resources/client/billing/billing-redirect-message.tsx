import {MessageDescriptor} from '../i18n/message-descriptor';
import {Link, To} from 'react-router-dom';
import {AnimatePresence, m} from 'framer-motion';
import {TaskAltIcon} from '../icons/material/TaskAlt';
import {ErrorIcon} from '../icons/material/Error';
import {Trans} from '../i18n/trans';
import {Button} from '../ui/buttons/button';
import {Skeleton} from '../ui/skeleton/skeleton';
import {opacityAnimation} from '../ui/animation/opacity-animation';

export interface BillingRedirectMessageConfig {
  message: MessageDescriptor;
  status: 'success' | 'error';
  link: To;
  buttonLabel: MessageDescriptor;
}

interface BillingRedirectMessageProps {
  config?: BillingRedirectMessageConfig;
}
export function BillingRedirectMessage({config}: BillingRedirectMessageProps) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <div className="mt-80">
        {config ? (
          <m.div
            className="text-center"
            key="payment-status"
            {...opacityAnimation}
          >
            {config.status === 'success' ? (
              <TaskAltIcon className="text-positive text-6xl" />
            ) : (
              <ErrorIcon className="text-danger text-6xl" />
            )}
            <div className="text-2xl font-semibold mt-30">
              <Trans {...config.message} />
            </div>
            <Button
              variant="flat"
              color="primary"
              className="w-full mt-30"
              size="md"
              elementType={Link}
              to={config.link}
            >
              <Trans {...config.buttonLabel} />
            </Button>
          </m.div>
        ) : (
          <LoadingSkeleton key="loading-skeleton" />
        )}
      </div>
    </AnimatePresence>
  );
}

function LoadingSkeleton() {
  return (
    <m.div
      className="text-center max-w-280"
      key="loading-skeleton"
      {...opacityAnimation}
    >
      <Skeleton size="w-50 h-50" variant="rect" />
      <Skeleton className="text-2xl mt-30" />
      <Skeleton size="h-42" className="mt-30" />
    </m.div>
  );
}
