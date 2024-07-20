import {
  LocationDatasetItem,
  ReportMetric,
} from '@common/admin/analytics/report-metric';
import React, {useMemo, useRef} from 'react';
import {useGoogleGeoChart} from './use-google-geo-chart';
import {ChartLayout, ChartLayoutProps} from '@common/charts/chart-layout';
import {Trans} from '@common/i18n/trans';
import {ChartLoadingIndicator} from '@common/charts/chart-loading-indicator';
import {Button} from '@common/ui/buttons/button';
import {ArrowBackIcon} from '@common/icons/material/ArrowBack';
import clsx from 'clsx';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {FormattedCountryName} from '@common/i18n/formatted-country-name';

interface GeoChartData extends Partial<ChartLayoutProps> {
  data?: ReportMetric<LocationDatasetItem>;
  onCountrySelected?: (countryCode: string | undefined) => void;
  country?: string;
}
export function GeoChart({
  data: metricData,
  isLoading,
  onCountrySelected,
  country,
  ...layoutProps
}: GeoChartData) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const regionInteractivity = !!onCountrySelected;

  // memo data to avoid redrawing chart on rerender
  const initialData = metricData?.datasets[0].data;
  const data = useMemo(() => {
    return initialData || [];
  }, [initialData]);
  useGoogleGeoChart({placeholderRef, data, country, onCountrySelected});

  return (
    <ChartLayout
      {...layoutProps}
      className="min-w-500"
      title={
        <div className="flex items-center">
          <Trans message="Top Locations" />
          {country ? (
            <span className="pl-4">
              ({<FormattedCountryName code={country} />})
            </span>
          ) : null}
          {regionInteractivity && <InfoTrigger />}
        </div>
      }
      contentIsFlex={isLoading}
    >
      {isLoading && <ChartLoadingIndicator />}
      <div className="flex gap-24">
        <div
          ref={placeholderRef}
          className="flex-auto w-[480px] min-h-[340px]"
        />
        <div className="w-[170px]">
          <div className="text-sm max-h-[340px] w-full flex-initial overflow-y-auto">
            {data.map(location => (
              <div
                key={location.label}
                className={clsx(
                  'flex items-center gap-4 mb-4',
                  regionInteractivity && 'cursor-pointer hover:underline'
                )}
                role={regionInteractivity ? 'button' : undefined}
                onClick={() => {
                  onCountrySelected?.(location.code);
                }}
              >
                <div className="max-w-110 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {location.label}
                </div>
                <div>({location.percentage})%</div>
              </div>
            ))}
          </div>
          {country && (
            <Button
              variant="outline"
              size="xs"
              className="mt-14"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                onCountrySelected?.(undefined);
              }}
            >
              <Trans message="Back to countries" />
            </Button>
          )}
        </div>
      </div>
    </ChartLayout>
  );
}

function InfoTrigger() {
  return (
    <InfoDialogTrigger
      title={<Trans message="Zooming in" />}
      body={
        <Trans message="Click on a country inside the map or country list to zoom in and see city data for that country." />
      }
    />
  );
}
