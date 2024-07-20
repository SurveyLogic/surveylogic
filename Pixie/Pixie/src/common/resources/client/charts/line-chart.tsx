import {BaseChart, BaseChartProps} from './base-chart';
import {ReportMetric} from '../admin/analytics/report-metric';
import {useMemo} from 'react';
import {formatReportData} from './data/format-report-data';
import {useSelectedLocale} from '../i18n/selected-locale';
import {ChartData, ChartOptions} from 'chart.js';
import {ChartColors} from './chart-colors';
import {FormattedDatasetItem} from './data/formatted-dataset-item';
import clsx from 'clsx';

const LineChartOptions: ChartOptions<'line'> = {
  parsing: {
    xAxisKey: 'label',
    yAxisKey: 'value',
  },
  datasets: {
    line: {
      fill: 'origin',
      tension: 0.1,
      pointBorderWidth: 4,
      pointHitRadius: 10,
    },
  },
  plugins: {
    tooltip: {
      intersect: false,
      mode: 'index',
    },
  },
};

interface LineChartProps extends Omit<BaseChartProps<'line'>, 'type' | 'data'> {
  data?: ReportMetric;
}
export function LineChart({data, className, ...props}: LineChartProps) {
  const {localeCode} = useSelectedLocale();
  const formattedData: ChartData<'line', FormattedDatasetItem[]> =
    useMemo(() => {
      const formattedData = formatReportData(data, {localeCode});
      formattedData.datasets = formattedData.datasets.map((dataset, i) => ({
        ...dataset,
        backgroundColor: ChartColors[i][1],
        borderColor: ChartColors[i][0],
        pointBackgroundColor: ChartColors[i][0],
      }));
      return formattedData;
    }, [data, localeCode]);

  return (
    <BaseChart
      {...props}
      className={clsx(className, 'min-w-500')}
      data={formattedData}
      type="line"
      options={LineChartOptions}
    />
  );
}
