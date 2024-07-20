import {useFormContext} from 'react-hook-form';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {EMPTY_PAGINATION_RESPONSE} from '@common/http/backend-response/pagination-response';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  config: ChannelContentConfig;
}
export function ContentTypeField({config}: Props) {
  const {setValue} = useFormContext<UpdateChannelPayload>();
  const [modelName, modelConfig] = Object.entries(config.models)[0];
  return (
    <FormSelect
      className="my-24"
      selectionMode="single"
      name="config.contentType"
      label={<Trans message="Content" />}
      onSelectionChange={newValue => {
        setValue('config.contentModel', modelName);
        setValue(
          'config.autoUpdateMethod',
          newValue === 'autoUpdate' ? modelConfig.autoUpdateMethods?.[0] : ''
        );
        setValue('config.contentOrder', modelConfig.sortMethods[0]);
        setValue('config.connectToGenreViaUrl', false);
        // clear content imported by autoUpdate methods
        if (newValue === 'manual') {
          setValue('content', EMPTY_PAGINATION_RESPONSE.pagination);
        }
      }}
    >
      <Option value="listAll">
        <Trans message="List all content of specified type" />
      </Option>
      <Option value="manual">
        <Trans message="Manage content manually" />
      </Option>
      <Option value="autoUpdate">
        <Trans message="Automatically update content with specified method" />
      </Option>
    </FormSelect>
  );
}
