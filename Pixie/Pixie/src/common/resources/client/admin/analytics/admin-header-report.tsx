import {HeaderDatum} from '@common/admin/analytics/use-admin-report';
import React, {Fragment, ReactElement} from 'react';
import {TrendingUpIcon} from '@common/icons/material/TrendingUp';
import {TrendingDownIcon} from '@common/icons/material/TrendingDown';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {AdminReportPageColGap} from '@common/admin/analytics/visitors-report-charts';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {FormattedDateTimeRange} from '@common/i18n/formatted-date-time-range';
import {FormattedNumber} from '@common/i18n/formatted-number';
import {FormattedBytes} from '@common/uploads/formatted-bytes';
import {TrendingFlatIcon} from '@common/icons/material/TrendingFlat';

interface AdminHeaderReportProps {
  report?: HeaderDatum[];
  dateRange: DateRangeValue;
}
export function AdminHeaderReport({report, dateRange}: AdminHeaderReportProps) {
  const label = (
    <FormattedDateTimeRange start={dateRange.start} end={dateRange.end} />
  );

  return (
    <div
      className={`flex items-center flex-shrink-0 overflow-x-auto h-[97px] ${AdminReportPageColGap}`}
    >
      {report?.map(datum => (
        <ValueMetricItem key={datum.name} datum={datum} />
      ))}
    </div>
  );
}

interface ValueMetricItemProps {
  datum: HeaderDatum;
  label?: ReactElement;
}
function ValueMetricItem({datum, label}: ValueMetricItemProps) {
  const Icon = createSvgIconFromTree(datum.icon);

  return (
    <div
      key={datum.name}
      className="flex items-center flex-auto rounded border p-20 gap-18 h-full whitespace-nowrap"
    >
      <div className="bg-primary-light/20 rounded-lg p-10 flex-shrink-0">
        <Icon size="lg" className="text-primary" />
      </div>
      <div className="flex-auto">
        <div className="flex items-center gap-20 justify-between">
          <div className="text-main text-lg font-bold">
            {datum.type === 'fileSize' ? (
              <FormattedBytes bytes={datum.currentValue} />
            ) : (
              <FormattedNumber value={datum.currentValue} />
            )}
          </div>
          {label && <div className="text-xs text-muted ml-auto">{label}</div>}
        </div>
        <div className="flex items-center gap-20 justify-between">
          <h2 className="text-muted text-sm">{datum.name}</h2>
          {datum.percentageChange != null && (
            <div className="flex items-center gap-10">
              <TrendingIndicator percentage={datum.percentageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TrendingIndicatorProps {
  percentage: number;
}

function TrendingIndicator({percentage}: TrendingIndicatorProps) {
  let icon: ReactElement;
  if (percentage > 0) {
    icon = <TrendingUpIcon size="md" className="text-positive" />;
  } else if (percentage === 0) {
    icon = <TrendingFlatIcon className="text-muted" />;
  } else {
    icon = <TrendingDownIcon className="text-danger" />;
  }

  return (
    <Fragment>
      {icon}
      <div className="text-sm font-semibold text-muted">{percentage}%</div>
    </Fragment>
  );
}
