import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {Trans} from '@common/i18n/trans';

export function ChartLoadingIndicator() {
  return (
    <div className="flex items-center gap-10 text-sm absolute mx-auto">
      <ProgressCircle isIndeterminate size="sm" />
      <Trans message="Chart loading" />
    </div>
  );
}
