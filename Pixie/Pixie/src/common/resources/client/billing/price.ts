export interface Price {
  id: number;
  amount: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  subscriptions_count?: number;
  stripe_id?: string;
  paypal_id?: string;
}
