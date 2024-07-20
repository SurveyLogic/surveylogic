import {useParams} from 'react-router-dom';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';
import {SortDescriptor} from '@common/ui/tables/types/sort-descriptor';
import {Channel, ChannelContentItem} from '@common/channels/channel';
import {
  channelEndpoint,
  channelQueryKey,
} from '@common/channels/requests/use-channel';

export function usePaginatedChannelContent<
  T extends ChannelContentItem = ChannelContentItem
>(channel: Channel<T>) {
  const {filter} = useParams();
  const [defaultOrderBy = 'popularity', defaultOrderDir = 'desc'] = (
    channel.config.contentOrder || ''
  ).split(':');
  return useInfiniteData<T>({
    initialPage: channel.content,
    queryKey: channelQueryKey(channel.id, {filter: filter || ''}),
    endpoint: channelEndpoint(channel.id),
    defaultOrderBy,
    defaultOrderDir: defaultOrderDir as SortDescriptor['orderDir'],
    paginate: 'simple',
    queryParams: {
      returnContentOnly: 'true',
      //used for dynamically specifying channel content.
      // In "channel/1/jazz" filter will be "jazz"
      filter: filter || '',
    },
  });
}
