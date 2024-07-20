import {User} from '../auth/user';
import {Price} from './price';
import {Product} from './product';

export interface Subscription {
  id: number;
  price_id: number;
  product_id: number;
  user_id: number;
  on_grace_period?: boolean;
  gateway_name: string;
  gateway_id: string;
  valid?: boolean;
  active?: boolean;
  cancelled?: boolean;
  on_trial?: boolean;
  price?: Price;
  product?: Product;
  trial_ends_at: string;
  ends_at: string;
  updated_at: string;
  created_at: string;
  description: string;
  renews_at: string;
  user?: User;
}
