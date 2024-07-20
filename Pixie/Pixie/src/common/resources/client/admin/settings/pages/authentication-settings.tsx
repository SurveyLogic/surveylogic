import {useFormContext} from 'react-hook-form';
import {SettingsPanel} from '@common/admin/settings/settings-panel';
import {FormSwitch} from '@common/ui/forms/toggle/switch';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {SettingsErrorGroup} from '@common/admin/settings/settings-error-group';
import {Trans} from '@common/i18n/trans';
import {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useSettings} from '@common/core/settings/use-settings';
import {SettingsSeparator} from '@common/admin/settings/settings-separator';

export function AuthenticationSettings() {
  return (
    <SettingsPanel
      title={<Trans message="Authentication" />}
      description={
        <Trans message="Configure registration, social login and related 3rd party integrations." />
      }
    >
      <EmailConfirmationSection />
      <FormSwitch
        className="mb-24"
        name="client.registration.disable"
        description={
          <Trans message="All registration related functionality (including social login) will be disabled." />
        }
      >
        <Trans message="Disable registration" />
      </FormSwitch>
      <FormSwitch
        className="mb-24"
        name="client.single_device_login"
        description={
          <Trans message="Only allow one device to be logged into user account at the same time." />
        }
      >
        <Trans message="Single device login" />
      </FormSwitch>
      <FormSwitch
        name="client.social.compact_buttons"
        description={
          <Trans message="Use compact design for social login buttons." />
        }
      >
        <Trans message="Compact buttons" />
      </FormSwitch>
      <EnvatoSection />
      <GoogleSection />
      <FacebookSection />
      <TwitterSection />
      <SettingsSeparator />
      <FormTextField
        inputElementType="textarea"
        rows={3}
        className="mt-24"
        name="client.auth.domain_blacklist"
        label={<Trans message="Domain blacklist" />}
        description={
          <Trans message="Comma separated list of domains. Users will not be able to register or login using any email adress from specified domains." />
        }
      />
    </SettingsPanel>
  );
}

function EmailConfirmationSection() {
  const {watch} = useFormContext<AdminSettings>();
  const mailSetup = watch('server.mail_setup');

  return (
    <FormSwitch
      className="mb-30"
      name="client.require_email_confirmation"
      description={
        <Fragment>
          <Trans message="Require newly registered users to validate their email address before being able to login." />
          {!mailSetup && (
            <p className="mt-10 text-danger">
              <Trans
                message="Outgoing mail method needs to be setup before enabling this setting. <a>Fix now</a>"
                values={{
                  a: text => (
                    <Link
                      className="font-bold block underline"
                      to="/admin/settings/mail#outgoing-emails"
                    >
                      {text}
                    </Link>
                  ),
                }}
              />
            </p>
          )}
        </Fragment>
      }
    >
      <Trans message="Require email confirmation" />
    </FormSwitch>
  );
}

function EnvatoSection() {
  const {watch} = useFormContext<AdminSettings>();
  const {envato} = useSettings();
  const envatoLoginEnabled = watch('client.social.envato.enable');

  if (!envato?.enable) return null;

  return (
    <SettingsErrorGroup separatorBottom={false} name="envato_group">
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.envato.enable"
            description={
              <Trans message="Enable logging into the site via envato." />
            }
          >
            <Trans message="Envato login" />
          </FormSwitch>
          {envatoLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_id"
                label={<Trans message="Envato ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_secret"
                label={<Trans message="Envato secret" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.envato_personal_token"
                label={<Trans message="Envato personal token" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function GoogleSection() {
  const {watch} = useFormContext<AdminSettings>();
  const googleLoginEnabled = watch('client.social.google.enable');

  return (
    <SettingsErrorGroup name="google_group">
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.google.enable"
            description={
              <Trans message="Enable logging into the site via google." />
            }
          >
            <Trans message="Google login" />
          </FormSwitch>
          {googleLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.google_id"
                label={<Trans message="Google client ID" />}
                required
              />
              <FormTextField
                className="mt-30"
                name="server.google_secret"
                label={<Trans message="Google client secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function FacebookSection() {
  const {watch} = useFormContext<AdminSettings>();
  const facebookLoginEnabled = watch('client.social.facebook.enable');

  return (
    <SettingsErrorGroup name="facebook_group" separatorTop={false}>
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.facebook.enable"
            description={
              <Trans message="Enable logging into the site via facebook." />
            }
          >
            <Trans message="Facebook login" />
          </FormSwitch>
          {facebookLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.facebook_id"
                label={<Trans message="Facebook app ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.facebook_secret"
                label={<Trans message="Facebook app secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}

function TwitterSection() {
  const {watch} = useFormContext<AdminSettings>();
  const twitterLoginEnabled = watch('client.social.twitter.enable');

  return (
    <SettingsErrorGroup
      name="twitter_group"
      separatorTop={false}
      separatorBottom={false}
    >
      {isInvalid => (
        <>
          <FormSwitch
            invalid={isInvalid}
            name="client.social.twitter.enable"
            description={
              <Trans message="Enable logging into the site via twitter." />
            }
          >
            <Trans message="Twitter login" />
          </FormSwitch>
          {twitterLoginEnabled && (
            <>
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.twitter_id"
                label={<Trans message="Twitter ID" />}
                required
              />
              <FormTextField
                invalid={isInvalid}
                className="mt-30"
                name="server.twitter_secret"
                label={<Trans message="Twitter secret" />}
                required
              />
            </>
          )}
        </>
      )}
    </SettingsErrorGroup>
  );
}
