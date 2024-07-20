import {FormattedCurrency} from './formatted-currency';
import React from 'react';
import {Price} from '../billing/price';
import {Trans} from './trans';
import clsx from 'clsx';

interface FormattedPriceProps {
  price?: Omit<Price, 'id'>;
  variant?: 'slash' | 'separateLine';
  className?: string;
  priceClassName?: string;
  periodClassName?: string;
}
export function FormattedPrice({
  price,
  variant = 'slash',
  className,
  priceClassName,
  periodClassName,
}: FormattedPriceProps) {
  if (!price) return null;

  const translatedInterval = <Trans message={price.interval} />;

  return (
    <div className={clsx('flex gap-6 items-center', className)}>
      <div className={priceClassName}>
        <FormattedCurrency
          value={price.amount / (price.interval_count ?? 1)}
          currency={price.currency}
        />
      </div>
      {variant === 'slash' ? (
        <div className={periodClassName}> / {translatedInterval}</div>
      ) : (
        <div className={periodClassName}>
          <Trans message="per" /> <br /> {translatedInterval}
        </div>
      )}
    </div>
  );
}
