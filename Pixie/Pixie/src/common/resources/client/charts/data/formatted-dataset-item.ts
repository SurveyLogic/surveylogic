import {ReportMetric} from '../../admin/analytics/report-metric';

export interface FormattedReportData extends Omit<ReportMetric, 'datasets'> {
  datasets: {label: string; data: FormattedDatasetItem[]}[];
}

export interface FormattedDatasetItem {
  label: string;
  value: number;
  tooltipTitle?: string;
}
