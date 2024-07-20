import {Price} from '../price';

export type UpsellBillingCycle = 'monthly' | 'yearly';

export function findBestPrice(
  token: UpsellBillingCycle,
  prices: Price[]
): Price | undefined {
  if (token === 'monthly') {
    const match = findMonthlyPrice(prices);
    if (match) return match;
  }

  if (token === 'yearly') {
    const match = findYearlyPrice(prices);
    if (match) return match;
  }

  return prices[0];
}

function findYearlyPrice(prices: Price[]) {
  return prices.find(price => {
    if (price.interval === 'month' && price.interval_count >= 12) {
      return price;
    }
    if (price.interval === 'year' && price.interval_count >= 1) {
      return price;
    }
  });
}

function findMonthlyPrice(prices: Price[]) {
  return prices.find(price => {
    if (price.interval === 'day' && price.interval_count >= 30) {
      return price;
    }
    if (price.interval === 'month' && price.interval_count >= 1) {
      return price;
    }
  });
}
