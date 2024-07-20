export type RangedDatasetGranularity =
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export interface ReportMetric<T extends DatasetItem = DatasetItem> {
  labels?: string[];
  granularity?: RangedDatasetGranularity;
  total?: number;
  datasets: {label: string; data: T[]}[];
}

export interface DatasetItem {
  label?: string;
  value: number;
  date: string;
  endDate?: string;
}

export interface LocationDatasetItem extends DatasetItem {
  percentage: number;
  code: string;
}
