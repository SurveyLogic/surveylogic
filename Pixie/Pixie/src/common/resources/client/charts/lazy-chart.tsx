import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartOptions,
  ChartType,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import {useEffect, useRef} from 'react';
import {BaseChartProps} from './base-chart';
import {FormattedDatasetItem} from './data/formatted-dataset-item';
import deepMerge from 'deepmerge';

Chart.register([
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LineController,
  BarController,
  PolarAreaController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend,
]);

export default function LazyChart({
  type,
  data,
  options,
  hideLegend,
}: Omit<BaseChartProps<any>, 'children'>) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<ChartType, unknown>>();

  useEffect(() => {
    if (ref.current) {
      chartRef.current = new Chart(ref.current, {
        type,
        data,
        options: deepMerge(
          {
            maintainAspectRatio: false,
            animation: {
              duration: 250,
            },
            plugins: {
              legend: {
                position: 'bottom',
                display: !hideLegend,
              },
              tooltip: {
                padding: 16,
                cornerRadius: 4,
                callbacks: {
                  title: ([item]) => {
                    const data = item.raw as FormattedDatasetItem;
                    return data.tooltipTitle ?? item.label;
                  },
                  label: item => {
                    return `  ${item.dataset.label}: ${item.formattedValue}`;
                  },
                },
              },
            },
          },
          options as ChartOptions
        ),
      });
    }

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, type, options, hideLegend]);

  return <canvas ref={ref}></canvas>;
}
