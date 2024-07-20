import {LocationDatasetItem, ReportMetric} from './report-metric';

export interface VisitorsReportData {
  browsers: ReportMetric;
  platforms: ReportMetric;
  devices: ReportMetric;
  locations: ReportMetric<LocationDatasetItem>;
  pageViews: ReportMetric;
}
