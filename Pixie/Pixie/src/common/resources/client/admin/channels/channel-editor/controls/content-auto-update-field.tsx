import {useFormContext} from 'react-hook-form';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {Fragment, ReactNode} from 'react';
import {LearnMoreLink} from '@common/admin/settings/learn-more-link';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  children: ReactNode;
  config: ChannelContentConfig;
}
export function ContentAutoUpdateField({children, config}: Props) {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const modelConfig = config.models[watch('config.contentModel')];

  if (
    watch('config.contentType') !== 'autoUpdate' ||
    !modelConfig.autoUpdateMethods?.length
  ) {
    return null;
  }

  return (
    <div className="md:flex items-end my-24 gap-14">
      <FormSelect
        required
        className="flex-auto"
        selectionMode="single"
        name="config.autoUpdateMethod"
        label={
          <Fragment>
            <Trans message="Auto update method" />
            <InfoDialogTrigger
              body={
                <Fragment>
                  <div className="mb-20">
                    <Trans message="This option will automatically update channel content every 24 hours using the specified method." />
                  </div>
                  <LearnMoreLink link="https://support.vebto.com/help-center/articles/28/31/170/channels" />
                </Fragment>
              }
            />
          </Fragment>
        }
      >
        {modelConfig.autoUpdateMethods.map(method => (
          <Option value={method} key={method}>
            <Trans {...config.autoUpdateMethods[method].label} />
          </Option>
        ))}
      </FormSelect>
      {children}
    </div>
  );
}
