import {Fragment} from 'react';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../../i18n/trans';

export interface MailgunCredentialsProps {
  isInvalid: boolean;
}
export function MailgunCredentials({isInvalid}: MailgunCredentialsProps) {
  return (
    <Fragment>
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.mailgun_domain"
        label={<Trans message="Mailgun domain" />}
        description={
          <Trans message="Usually the domain of your site (site.com)" />
        }
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.mailgun_secret"
        label={<Trans message="Mailgun API key" />}
        description={<Trans message="Should start with `key-`" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        name="server.mailgun_endpoint"
        label={<Trans message="Mailgun endpoint" />}
        description={
          <Trans message="Can be left empty, if your mailgun account is in the US region." />
        }
        placeholder="api.eu.mailgun.net"
      />
    </Fragment>
  );
}
