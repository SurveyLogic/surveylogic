import {useFormContext} from 'react-hook-form';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {ReactNode} from 'react';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  config: ChannelContentConfig;
}
export function ContentLayoutFields({config}: Props) {
  return (
    <div className="md:flex items-end my-24 gap-14">
      <LayoutField
        config={config}
        name="config.layout"
        label={<Trans message="Layout" />}
      />
      <LayoutField
        config={config}
        name="config.nestedLayout"
        label={<Trans message="Layout when nested" />}
      />
    </div>
  );
}

interface LayoutFieldProps extends Props {
  name: string;
  label: ReactNode;
}
function LayoutField({config, name, label}: LayoutFieldProps) {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentModel = watch('config.contentModel');
  const modelConfig = config.models[contentModel];

  if (!modelConfig.layoutMethods?.length) {
    return null;
  }

  return (
    <FormSelect
      className="flex-auto w-full"
      selectionMode="single"
      name={name}
      label={label}
    >
      {modelConfig.layoutMethods.map(method => {
        const label = config.layoutMethods[method];
        return (
          <Option key={method} value={method}>
            <Trans {...label} />
          </Option>
        );
      })}
    </FormSelect>
  );
}
