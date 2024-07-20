import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';
import {Fragment} from 'react';
import {FormSwitch} from '@common/ui/forms/toggle/switch';
import {ConnectDomainStepProps} from '@common/custom-domains/datatable/connect-domain-dialog/connect-domain-step';

export function HostStep({stepper}: ConnectDomainStepProps) {
  return (
    <Fragment>
      <FormTextField
        autoFocus
        name="host"
        required
        maxLength={100}
        label={<Trans message="Host" />}
        placeholder="https://example.com"
        description={
          <Trans message="Enter the exact domain name you want your items to be accessible with. It can be a subdomain (example.yourdomain.com) or root domain (yourdomain.com)." />
        }
      />
      {stepper.showGlobalField && (
        <FormSwitch
          className="mt-24 border-t pt-24"
          name="global"
          description={
            <Trans message="Whether all users should be able to select this domain." />
          }
        >
          <Trans message="Global" />
        </FormSwitch>
      )}
    </Fragment>
  );
}
