import {useFormContext} from 'react-hook-form';
import {AdminSettings} from '../../admin-settings';
import {useContext} from 'react';
import {SiteConfigContext} from '../../../../core/settings/site-config-context';
import {FormSelect, Option} from '../../../../ui/forms/select/select';
import {Trans} from '../../../../i18n/trans';
import {LearnMoreLink} from '../../learn-more-link';

export function IncomingMailGroup() {
  const {clearErrors} = useFormContext<AdminSettings>();
  const {settings} = useContext(SiteConfigContext);
  if (!settings?.showIncomingMailMethod) return null;

  return (
    <FormSelect
      onSelectionChange={() => {
        clearErrors();
      }}
      className="my-30"
      selectionMode="single"
      name="client.mail_handler"
      label={<Trans message="Incoming mail method" />}
      description={
        <div>
          <Trans message="Which method should be used to handle incoming application emails." />
          <LearnMoreLink
            className="mt-8"
            link="https://support.vebto.com/help-center/articles/76/configuring-email-provider"
          />
        </div>
      }
    >
      <Option value="mailgun">Mailgun</Option>
      <Option value="gmailApi">Gmail Api</Option>
      <Option value="null">Rest API (Send emails via http API)</Option>
      <Option value="pipe">Pipe (Pipe emails directly)</Option>
    </FormSelect>
  );
}
