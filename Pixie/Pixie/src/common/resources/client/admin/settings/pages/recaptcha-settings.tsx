import {useFormContext} from 'react-hook-form';
import {useContext} from 'react';
import {SettingsPanel} from '../settings-panel';
import {SettingsErrorGroup} from '../settings-error-group';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {FormSwitch} from '@common/ui/forms/toggle/switch';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Trans} from '@common/i18n/trans';

export function RecaptchaSettings() {
  const {settings} = useContext(SiteConfigContext);
  return (
    <SettingsPanel
      title={<Trans message="Recaptcha" />}
      description={
        <Trans message="Configure google recaptcha integration and credentials." />
      }
    >
      {settings?.showRecaptchaLinkSwitch && (
        <FormSwitch
          className="mb-30"
          name="client.recaptcha.enable.link_creation"
          description={
            <Trans message="Enable recaptcha integration when creating links from homepage or user dashboard." />
          }
        >
          <Trans message="Link creation" />
        </FormSwitch>
      )}
      <FormSwitch
        className="mb-30"
        name="client.recaptcha.enable.contact"
        description={
          <Trans
            message={'Enable recaptcha integration for "contact us" page.'}
          />
        }
      >
        <Trans message="Contact page" />
      </FormSwitch>
      <FormSwitch
        className="mb-30"
        name="client.recaptcha.enable.register"
        description={
          <Trans message="Enable recaptcha integration for registration page." />
        }
      >
        <Trans message="Registration page" />
      </FormSwitch>
      <RecaptchaSection />
    </SettingsPanel>
  );
}

function RecaptchaSection() {
  const {clearErrors} = useFormContext();
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="recaptcha_group"
    >
      {isInvalid => {
        return (
          <>
            <FormTextField
              className="mb-30"
              onChange={() => {
                clearErrors();
              }}
              invalid={isInvalid}
              name="client.recaptcha.site_key"
              label={<Trans message="Recaptcha v3 site key" />}
            />
            <FormTextField
              onChange={() => {
                clearErrors();
              }}
              invalid={isInvalid}
              name="client.recaptcha.secret_key"
              label={<Trans message="Recaptcha v3 secret key" />}
            />
          </>
        );
      }}
    </SettingsErrorGroup>
  );
}
