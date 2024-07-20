import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient} from '../../http/query-client';
import {VisitorsReportData} from './visitors-report-data';
import {IconTree} from '../../icons/create-svg-icon';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';

const Endpoint = 'admin/reports';

export interface HeaderDatum {
  icon: IconTree[];
  name: string;
  type?: 'number' | 'fileSize';
  currentValue: number;
  previousValue?: number;
  percentageChange?: number;
}

interface FetchAnalyticsReportResponse extends BackendResponse {
  visitorsReport: VisitorsReportData;
  headerReport: HeaderDatum[];
}

interface Payload {
  types?: ('visitors' | 'header')[];
  dateRange?: DateRangeValue;
}
export function useAdminReport(payload: Payload = {}) {
  return useQuery([Endpoint, payload], () => fetchAnalyticsReport(payload), {
    keepPreviousData: true,
  });
}

function fetchAnalyticsReport({
  types,
  dateRange,
}: Payload): Promise<FetchAnalyticsReportResponse> {
  const params: Record<string, any> = {};
  if (types) {
    params.types = types.join(',');
  }
  if (dateRange) {
    params.startDate = dateRange.start.toAbsoluteString();
    params.endDate = dateRange.end.toAbsoluteString();
    params.timezone = dateRange.start.timeZone;
  }
  return apiClient.get(Endpoint, {params}).then(response => response.data);
}
