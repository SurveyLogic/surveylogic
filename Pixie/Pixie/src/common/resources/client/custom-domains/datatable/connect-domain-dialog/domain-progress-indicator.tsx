import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {Trans} from '@common/i18n/trans';
import {ReactNode} from 'react';

interface DomainProgressIndicatorProps {
  message?: ReactNode;
}
export function DomainProgressIndicator({
  message = <Trans message="Checking DNS configuration..." />,
}: DomainProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-18 text-base p-12 rounded bg-primary/10 text-primary">
      <ProgressCircle isIndeterminate size="sm" />
      <div>{message}</div>
    </div>
  );
}
