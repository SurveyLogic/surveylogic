import {DateFormatter, parseAbsoluteToLocal} from '@internationalized/date';
import memoize from 'nano-memoize';
import {ChartType} from 'chart.js';
import {
  FormattedDatasetItem,
  FormattedReportData,
} from './formatted-dataset-item';
import {
  DatasetItem,
  RangedDatasetGranularity,
  ReportMetric,
} from '../../admin/analytics/report-metric';
import {shallowEqual} from '../../utils/shallow-equal';

interface Options {
  localeCode: string;
  shareFirstDatasetLabels?: boolean;
}

type FormattedDatasetLabels = Omit<FormattedDatasetItem, 'value'>;

export function formatReportData(
  report: ReportMetric | undefined,
  {localeCode = 'en', shareFirstDatasetLabels = true}: Options
): FormattedReportData {
  if (!report) return {datasets: []};

  const firstDatasetLabels: FormattedDatasetLabels[] = [];

  return {
    ...report,
    datasets: report.datasets.map((dataset, datasetIndex) => {
      const data = dataset.data.map((datasetItem, itemIndex) => {
        let label: FormattedDatasetLabels;
        // when there are multiple datasets, we'll need to use labels from the first dataset, so charts are
        // overlapped over one another, otherwise they will be side by side, if labels in all datasets are not identical.
        if (datasetIndex === 0 || !shareFirstDatasetLabels) {
          label = generateDatasetLabels(
            datasetItem,
            report.granularity,
            localeCode
          );
          firstDatasetLabels[itemIndex] = label;
        } else {
          label = firstDatasetLabels[itemIndex];
        }
        return {
          ...label,
          value: datasetItem.value,
        };
      });

      return {...dataset, data};
    }),
  };
}

function generateDatasetLabels<T extends ChartType = ChartType>(
  datum: DatasetItem,
  granularity: RangedDatasetGranularity | undefined,
  locale: string
): FormattedDatasetLabels {
  if (datum.label != null) {
    return {label: datum.label};
  }

  if (!datum.date) {
    return {label: ''};
  }

  return generateTimeLabels(datum, granularity, locale);
}

function generateTimeLabels(
  {date: isoDate, endDate: isoEndDate, value}: DatasetItem,
  granularity: RangedDatasetGranularity | undefined = 'day',
  locale: string
): Omit<FormattedDatasetItem, 'value'> {
  const date = parseAbsoluteToLocal(isoDate).toDate();
  const endDate = isoEndDate ? parseAbsoluteToLocal(isoEndDate).toDate() : null;

  switch (granularity) {
    case 'minute':
      return {
        label: getFormatter(locale, {
          second: '2-digit',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          second: '2-digit',
        }).format(date),
      };
    case 'hour':
      return {
        label: getFormatter(locale, {
          hour: 'numeric',
          minute: 'numeric',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          month: 'short',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date),
      };
    case 'day':
      return {
        label: getFormatter(locale, {
          day: '2-digit',
          weekday: 'short',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          day: '2-digit',
          weekday: 'short',
          month: 'short',
        }).format(date),
      };
    case 'week':
      return {
        label: getFormatter(locale, {
          month: 'short',
          day: '2-digit',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).formatRange(date, endDate as Date),
      };
    case 'month':
      return {
        label: getFormatter(locale, {
          month: 'short',
          year: 'numeric',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          month: 'long',
          year: 'numeric',
        }).format(date),
      };
    case 'year':
      return {
        label: getFormatter(locale, {
          year: 'numeric',
        }).format(date),
        tooltipTitle: getFormatter(locale, {
          year: 'numeric',
        }).format(date),
      };
  }
}

const getFormatter = memoize(
  (locale, options: Intl.DateTimeFormatOptions) => {
    return new DateFormatter(locale, options);
  },
  {
    equals: (a, b) => {
      return shallowEqual(a, b);
    },
    callTimeout: undefined as any,
  }
);
