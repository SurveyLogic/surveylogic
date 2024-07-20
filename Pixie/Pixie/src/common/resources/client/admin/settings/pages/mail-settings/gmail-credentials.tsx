import {useFormContext} from 'react-hook-form';
import {AdminSettings} from '../../admin-settings';
import {useSocialLogin} from '../../../../auth/requests/use-social-login';
import {toast} from '../../../../ui/toast/toast';
import {message} from '../../../../i18n/message';
import {Button} from '../../../../ui/buttons/button';
import {GmailIcon} from './gmail-icon';
import {Trans} from '../../../../i18n/trans';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {Fragment} from 'react';

export function GmailCredentials() {
  const {watch, setValue} = useFormContext<AdminSettings>();
  const {connectSocial} = useSocialLogin();
  const connectedEmail = watch('server.connectedGmailAccount');
  const gmailIsIncoming = watch('client.mail.handler') === 'gmailApi';

  const handleGmailConnect = async () => {
    const e = await connectSocial('secure/settings/mail/gmail/connect');
    if (e?.status === 'SUCCESS') {
      const email = (e.callbackData as any).profile.email;
      setValue('server.connectedGmailAccount', email);
      toast(message('Connected gmail account: :email', {values: {email}}));
    }
  };

  const connectButton = (
    <Button
      variant="outline"
      color="primary"
      startIcon={<GmailIcon />}
      onClick={() => {
        handleGmailConnect();
      }}
    >
      <Trans message="Connect gmail account" />
    </Button>
  );

  const reconnectPanel = (
    <div className="px-14 py-6 rounded bg-alt border flex items-center gap-14 text-sm">
      <GmailIcon size="lg" />
      {connectedEmail}
      <Button
        variant="text"
        color="primary"
        className="ml-auto"
        onClick={() => {
          handleGmailConnect();
        }}
      >
        <Trans message="Reconnect" />
      </Button>
    </div>
  );

  return (
    <Fragment>
      {gmailIsIncoming && (
        <FormTextField
          name="client.gmail.incoming.topicName"
          minLength={10}
          required
          label={<Trans message="Gmail topic name" />}
          description={<Trans message="Google cloud Pub/Sub topic name." />}
          className="mb-30"
        />
      )}
      <div className="text-sm mb-12">
        <Trans message="Gmail account" />
      </div>
      {connectedEmail ? reconnectPanel : connectButton}
    </Fragment>
  );
}
