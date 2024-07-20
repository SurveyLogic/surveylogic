import {useFormContext} from 'react-hook-form';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import React from 'react';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  config: ChannelContentConfig;
}
export function ContentModelField({config}: Props) {
  const {setValue} = useFormContext<UpdateChannelPayload>();
  return (
    <FormSelect
      className="my-24"
      selectionMode="single"
      name="config.contentModel"
      label={<Trans message="Type of content" />}
      onSelectionChange={newValue => {
        const modelConfig = config.models[newValue];
        if (!modelConfig.autoUpdateMethods?.length) {
          setValue('config.contentType', 'manual');
        }
        setValue('config.autoUpdateMethod', modelConfig.autoUpdateMethods?.[0]);
        setValue(
          'config.contentOrder',
          modelConfig.sortMethods[0] || 'channelables.order:asc'
        );
        setValue('config.layout', modelConfig.layoutMethods[0]);
      }}
    >
      {Object.entries(config.models).map(([model, {label}]) => (
        <Option value={model} key={model}>
          <Trans {...label} />
        </Option>
      ))}
    </FormSelect>
  );
}
