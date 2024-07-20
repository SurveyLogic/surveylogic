import {useForm} from 'react-hook-form';
import React, {ReactNode} from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@common/i18n/trans';
import {PageStatus} from '@common/http/page-status';
import {useChannel} from '@common/channels/requests/use-channel';
import {Channel} from '@common/channels/channel';
import {
  UpdateChannelPayload,
  useUpdateChannel,
} from '@common/admin/channels/requests/use-update-channel';

interface Props {
  children: ReactNode;
}
export function EditChannelPageLayout({children}: Props) {
  const query = useChannel(undefined, {
    normalizeContent: true,
    forAdmin: true,
  });
  if (query.data) {
    return <PageContent channel={query.data.channel}>{children}</PageContent>;
  }
  return <PageStatus query={query} />;
}

interface PageContentProps {
  channel: Channel;
  children: ReactNode;
}
function PageContent({channel, children}: PageContentProps) {
  const form = useForm<UpdateChannelPayload>({
    defaultValues: {
      ...channel,
    },
  });
  const updateChannel = useUpdateChannel(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        updateChannel.mutate(values);
      }}
      title={
        <Trans message="Edit “:name“ channel" values={{name: channel.name}} />
      }
      isLoading={updateChannel.isLoading}
    >
      {children}
    </CrupdateResourceLayout>
  );
}
