import {PaginationResponse} from '@common/http/backend-response/pagination-response';

export const CHANNEL_MODEL = 'channel';

export type ChannelContentItem<T = unknown> = T & {
  channelable_id?: number;
  channelable_order?: number;
};

export interface ChannelConfig {
  autoUpdateMethod?: string;
  disablePagination?: boolean;
  disablePlayback?: boolean;
  connectToGenreViaUrl?: boolean;
  contentModel: string;
  contentType: 'listAll' | 'manual' | 'autoUpdate';
  contentOrder: string;
  layout: string;
  nestedLayout: string;
  hideTitle?: boolean;
  lockSlug?: boolean;
  actions?: {tooltip: string; icon: string; route: string}[];
}

export interface Channel<T = ChannelContentItem> {
  id: number;
  name: string;
  tagline?: string;
  slug: string;
  config: ChannelConfig;
  model_type: 'channel';
  updated_at?: string;
  content?: PaginationResponse<T>;
}
