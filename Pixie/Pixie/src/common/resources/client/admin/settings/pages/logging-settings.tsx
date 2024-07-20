import {useFormContext} from 'react-hook-form';
import {SettingsPanel} from '../settings-panel';
import {SettingsErrorGroup} from '../settings-error-group';
import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {SectionHelper} from '../../../ui/section-helper';
import {ExternalLink} from '../../../ui/buttons/external-link';
import {Trans} from '../../../i18n/trans';

export function LoggingSettings() {
  return (
    <SettingsPanel
      title={<Trans message="Error logging" />}
      description={
        <Trans message="Configure site error logging and related 3rd party integrations." />
      }
    >
      <SentrySection />
      <SectionHelper
        className="mt-30"
        color="positive"
        description={
          <Trans
            values={{
              a: parts => (
                <ExternalLink href="https://sentry.io">{parts}</ExternalLink>
              ),
            }}
            message="<a>Sentry</a> integration provides real-time error tracking and helps identify and fix issues when site is in production."
          />
        }
      />
    </SettingsPanel>
  );
}

function SentrySection() {
  const {clearErrors} = useFormContext();
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="logging_group"
    >
      {isInvalid => {
        return (
          <FormTextField
            onChange={() => {
              clearErrors();
            }}
            invalid={isInvalid}
            name="server.sentry_dsn"
            type="url"
            minLength={30}
            required
            label={<Trans message="Sentry DSN" />}
          />
        );
      }}
    </SettingsErrorGroup>
  );
}
