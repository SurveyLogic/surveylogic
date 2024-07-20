import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {Channel} from '@common/channels/channel';

export interface ChannelContentConfig {
  models: Record<
    string,
    {
      label: MessageDescriptor;
      sortMethods: string[];
      layoutMethods: string[];
      autoUpdateMethods?: string[];
    }
  >;
  sortingMethods: Record<
    string,
    {
      label: MessageDescriptor;
      contentTypes?: Channel['config']['contentType'][];
    }
  >;
  layoutMethods: Record<string, MessageDescriptor>;
  autoUpdateMethods: Record<
    string,
    {
      label: MessageDescriptor;
      localOnly?: boolean;
    }
  >;
}
