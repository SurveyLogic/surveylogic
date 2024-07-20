import {SettingsPanel} from '../../settings-panel';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {ExternalLink} from '../../../../ui/buttons/external-link';
import {SectionHelper} from '../../../../ui/section-helper';
import {SettingsSeparator} from '../../settings-separator';
import {Trans} from '../../../../i18n/trans';
import {OutgoingMailGroup} from './outgoing-mail-group';
import {IncomingMailGroup} from './incoming-mail-group';
import {useSettings} from '../../../../core/settings/use-settings';

export function MailSettings() {
  return (
    <SettingsPanel
      title={<Trans message="Mail settings" />}
      description={
        <Trans message="Change incoming and outgoing email handlers, email credentials and other related settings." />
      }
    >
      <FormTextField
        id="outgoing-emails"
        className="mb-30"
        type="email"
        name="server.mail_from_address"
        label={<Trans message="From address" />}
        description={
          <Trans message="All outgoing application emails will be sent from this email address." />
        }
        required
      />
      <ContactAddressSection />
      <FormTextField
        className="mb-30"
        name="server.mail_from_name"
        label={<Trans message="From name" />}
        description={
          <Trans message="All outgoing application emails will be sent using this name." />
        }
        required
      />
      <SectionHelper
        color="warning"
        description={
          <Trans message="Your selected mail method must be authorized to send emails using this address and name." />
        }
      />
      <SettingsSeparator />
      <IncomingMailGroup />
      <OutgoingMailGroup />
    </SettingsPanel>
  );
}

function ContactAddressSection() {
  const {base_url} = useSettings();
  const contactPageUrl = `${base_url}/contact`;
  const link = (
    <ExternalLink href={contactPageUrl}>{contactPageUrl}</ExternalLink>
  );
  return (
    <FormTextField
      className="mb-30"
      type="email"
      name="client.mail.contact_page_address"
      label={<Trans message="Contact page address" />}
      description={
        <Trans
          values={{
            contactPageUrl: link,
          }}
          message="Where emails from :contactPageUrl page should be sent to."
        />
      }
    />
  );
}
