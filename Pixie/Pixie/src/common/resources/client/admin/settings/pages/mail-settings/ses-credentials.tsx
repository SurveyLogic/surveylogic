import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../../i18n/trans';
import {Fragment} from 'react';

export interface SesCredentialsProps {
  isInvalid: boolean;
}
export function SesCredentials({isInvalid}: SesCredentialsProps) {
  return (
    <Fragment>
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.ses_key"
        label={<Trans message="SES key" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.ses_secret"
        label={<Trans message="SES secret" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        name="server.ses_region"
        label={<Trans message="SES region" />}
        placeholder="us-east-1"
        required
      />
    </Fragment>
  );
}
