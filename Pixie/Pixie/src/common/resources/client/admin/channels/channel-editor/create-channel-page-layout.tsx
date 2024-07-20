import {useForm} from 'react-hook-form';
import React, {ReactNode} from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@common/i18n/trans';
import {EMPTY_PAGINATION_RESPONSE} from '@common/http/backend-response/pagination-response';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {useCreateChannel} from '@common/admin/channels/requests/use-create-channel';

interface Props {
  defaultValues?: Partial<UpdateChannelPayload['config']>;
  children: ReactNode;
}
export function CreateChannelPageLayout({defaultValues, children}: Props) {
  const form = useForm<UpdateChannelPayload>({
    defaultValues: {
      content: EMPTY_PAGINATION_RESPONSE.pagination,
      config: {
        contentType: 'listAll',
        contentOrder: 'created_at:desc',
        carouselWhenNested: true,
        ...defaultValues,
      },
    },
  });
  const createChannel = useCreateChannel(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createChannel.mutate(values);
      }}
      title={<Trans message="Add new channel" />}
      isLoading={createChannel.isLoading}
    >
      {children}
    </CrupdateResourceLayout>
  );
}
