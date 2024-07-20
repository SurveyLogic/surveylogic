import {useFormContext} from 'react-hook-form';
import {AdminSettings} from '../../admin-settings';
import {ComponentType, Fragment} from 'react';
import {MailgunCredentials} from './mailgun-credentials';
import {SmtpCredentials} from './smtp-credentials';
import {SesCredentials} from './ses-credentials';
import {PostmarkCredentials} from './postmark-credentials';
import {GmailCredentials} from './gmail-credentials';
import {SettingsErrorGroup} from '../../settings-error-group';
import {FormSelect, Option} from '../../../../ui/forms/select/select';
import {Trans} from '../../../../i18n/trans';
import {LearnMoreLink} from '../../learn-more-link';

export function OutgoingMailGroup() {
  const {watch, clearErrors} = useFormContext<AdminSettings>();

  const selectedDrivers = [
    watch('server.mail_driver'),
    watch('client.mail.handler'),
  ];
  const credentialForms: ComponentType<{isInvalid: boolean}>[] = [];

  if (selectedDrivers.includes('mailgun')) {
    credentialForms.push(MailgunCredentials);
  }
  if (selectedDrivers.includes('smtp')) {
    credentialForms.push(SmtpCredentials);
  }
  if (selectedDrivers.includes('ses')) {
    credentialForms.push(SesCredentials);
  }
  if (selectedDrivers.includes('postmark')) {
    credentialForms.push(PostmarkCredentials);
  }
  if (selectedDrivers.includes('gmailApi')) {
    credentialForms.push(GmailCredentials);
  }

  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="mail_group"
    >
      {isInvalid => (
        <Fragment>
          <FormSelect
            onSelectionChange={() => {
              clearErrors();
            }}
            invalid={isInvalid}
            selectionMode="single"
            name="server.mail_driver"
            label={<Trans message="Outgoing mail method" />}
            description={
              <div>
                <Trans message="Which method should be used for sending outgoing application emails (like registration confirmation)" />
                <LearnMoreLink
                  className="mt-8"
                  link="https://support.vebto.com/help-center/articles/42/44/155/incoming-emails"
                />
              </div>
            }
          >
            <Option value="mailgun">Mailgun</Option>
            <Option value="gmailApi">Gmail Api</Option>
            <Option value="smtp">SMTP</Option>
            <Option value="postmark">Postmark</Option>
            <Option value="ses">Ses (Amazon Simple Email Service)</Option>
            <Option value="sendmail">SendMail</Option>
            <Option value="log">Log (Email will be saved to error log)</Option>
          </FormSelect>
          {credentialForms.length ? (
            <div className="mt-30">
              {credentialForms.map((CredentialsForm, index) => (
                <CredentialsForm key={index} isInvalid={isInvalid} />
              ))}
            </div>
          ) : null}
        </Fragment>
      )}
    </SettingsErrorGroup>
  );
}
