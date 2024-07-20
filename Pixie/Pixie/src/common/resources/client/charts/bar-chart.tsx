import {BaseChart, BaseChartProps} from './base-chart';
import {ChartData, ChartOptions} from 'chart.js';
import {ChartColors} from './chart-colors';
import {useSelectedLocale} from '../i18n/selected-locale';
import {FormattedDatasetItem} from './data/formatted-dataset-item';
import {useMemo} from 'react';
import {formatReportData} from './data/format-report-data';
import {ReportMetric} from '../admin/analytics/report-metric';
import clsx from 'clsx';

interface BarChartProps extends Omit<BaseChartProps<'bar'>, 'type' | 'data'> {
  direction?: 'horizontal' | 'vertical';
  individualBarColors?: boolean;
  data?: ReportMetric;
}
export function BarChart({
  data,
  direction = 'vertical',
  individualBarColors = false,
  className,
  ...props
}: BarChartProps) {
  const {localeCode} = useSelectedLocale();
  const formattedData: ChartData<'bar', FormattedDatasetItem[]> =
    useMemo(() => {
      const formattedData = formatReportData(data, {localeCode});
      formattedData.datasets = formattedData.datasets.map((dataset, i) => ({
        ...dataset,
        backgroundColor: individualBarColors
          ? ChartColors.map(c => c[1])
          : ChartColors[i][1],
        borderColor: individualBarColors
          ? ChartColors.map(c => c[0])
          : ChartColors[i][0],
        borderWidth: 2,
      }));
      return formattedData;
    }, [data, localeCode, individualBarColors]);

  const isHorizontal = direction === 'horizontal';
  const options: ChartOptions<'bar'> = useMemo(() => {
    return {
      indexAxis: isHorizontal ? 'y' : 'x',
      parsing: {
        xAxisKey: isHorizontal ? 'value' : 'label',
        yAxisKey: isHorizontal ? 'label' : 'value',
      },
    };
  }, [isHorizontal]);

  return (
    <BaseChart
      type="bar"
      className={clsx(className, 'min-w-500')}
      data={formattedData}
      options={options}
      {...props}
    />
  );
}
