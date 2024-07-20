// find the highest percentage decrease between monthly and yearly prices of specified products
import {Product} from '../product';
import {findBestPrice} from './find-best-price';
import {Fragment, memo} from 'react';
import {Trans} from '../../i18n/trans';

interface UpsellLabelProps {
  products?: Product[];
}
export const UpsellLabel = memo(({products}: UpsellLabelProps) => {
  const upsellPercentage = calcHighestUpsellPercentage(products);

  if (upsellPercentage <= 0) {
    return null;
  }

  return (
    <Fragment>
      <span className="text-positive-darker font-medium">
        {' '}
        (
        <Trans
          message="Save up to :percentage%"
          values={{percentage: upsellPercentage}}
        />
        )
      </span>
    </Fragment>
  );
});

function calcHighestUpsellPercentage(products?: Product[]) {
  if (!products?.length) return 0;

  const decreases = products.map(product => {
    const monthly = findBestPrice('monthly', product.prices);
    const yearly = findBestPrice('yearly', product.prices);

    if (!monthly || !yearly) return 0;

    // monthly plan per year amount
    const monthlyAmount = monthly.amount * 12;
    const yearlyAmount = yearly.amount;

    const savingsPercentage = Math.round(
      ((monthlyAmount - yearlyAmount) / monthlyAmount) * 100
    );

    if (savingsPercentage > 0 && savingsPercentage <= 200) {
      return savingsPercentage;
    }

    return 0;
  });

  return Math.max(Math.max(...decreases), 0);
}
