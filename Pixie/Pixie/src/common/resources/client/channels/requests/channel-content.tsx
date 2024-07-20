import React, {Fragment} from 'react';
import {Channel, CHANNEL_MODEL} from '@common/channels/channel';
import {ChannelContentGrid} from '@app/channels/channel-content-grid';
import {ChannelHeading} from '@app/channels/channel-heading';
import {ChannelContentModel} from '@app/admin/channels/channel-content-config';
import {ChannelContentCarousel} from '@app/admin/channels/channel-content-carousel';
import {ChannelContentSlider} from '@common/channels/requests/channel-content-slider';

export interface ChannelContentProps<
  T extends ChannelContentModel = ChannelContentModel
> {
  channel: Channel<T>;
  isNested?: boolean;
}
export function ChannelContent(props: ChannelContentProps) {
  if (!props.channel.content) {
    return null;
  }
  if (props.channel.config.contentModel === CHANNEL_MODEL) {
    return <NestedChannels {...(props as ChannelContentProps<Channel>)} />;
  } else {
    return <ChannelLayout {...props} />;
  }
}

function ChannelLayout(props: ChannelContentProps) {
  const {channel, isNested} = props;
  const layout = isNested ? channel.config.nestedLayout : channel.config.layout;
  switch (layout) {
    case 'grid':
      return <ChannelContentGrid {...props} />;
    case 'carousel':
      return <ChannelContentCarousel {...props} />;
    case 'slider':
      return <ChannelContentSlider {...props} />;
    default:
      return null;
  }
}

function NestedChannels({channel}: ChannelContentProps<Channel>) {
  return (
    <Fragment>
      <ChannelHeading channel={channel} />
      {channel.content?.data.map(nestedChannel => (
        <div key={nestedChannel.id} className="mb-50">
          <ChannelContent channel={nestedChannel} isNested />
        </div>
      ))}
    </Fragment>
  );
}
