import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../../i18n/trans';

export interface PostmarkCredentialsProps {
  isInvalid: boolean;
}
export function PostmarkCredentials({isInvalid}: PostmarkCredentialsProps) {
  return (
    <FormTextField
      invalid={isInvalid}
      name="server.postmark_token"
      label={<Trans message="Postmark token" />}
      required
    />
  );
}
