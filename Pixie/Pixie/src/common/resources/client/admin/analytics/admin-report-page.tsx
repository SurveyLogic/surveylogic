import React, {useState} from 'react';
import {useAdminReport} from './use-admin-report';
import {Trans} from '../../i18n/trans';
import {StaticPageTitle} from '../../seo/static-page-title';
import {AdminHeaderReport} from '@common/admin/analytics/admin-header-report';
import {VisitorsReportCharts} from '@common/admin/analytics/visitors-report-charts';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {DateRangePresets} from '@common/ui/forms/input-field/date/date-range-picker/dialog/date-range-presets';
import {ReportDateSelector} from '@common/admin/analytics/report-date-selector';

export default function AdminReportPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
    // This week
    return DateRangePresets[2].getRangeValue();
  });
  const {isLoading, data} = useAdminReport({dateRange});
  const title = <Trans message="Visitors report" />;

  return (
    <div className="min-h-full gap-12 md:gap-24 p-12 md:p-24 overflow-x-hidden">
      <div className="md:flex items-center justify-between gap-24 mb-24">
        <StaticPageTitle>{title}</StaticPageTitle>
        <h1 className="mb-24 md:mb-0 text-3xl font-light">{title}</h1>
        <ReportDateSelector value={dateRange} onChange={setDateRange} />
      </div>
      <AdminHeaderReport report={data?.headerReport} dateRange={dateRange} />
      <VisitorsReportCharts
        report={data?.visitorsReport}
        isLoading={isLoading}
      />
    </div>
  );
}
