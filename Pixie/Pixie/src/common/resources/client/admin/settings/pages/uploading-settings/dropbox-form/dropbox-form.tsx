import {Fragment} from 'react';
import {FormTextField} from '../../../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../../../i18n/trans';
import {CredentialFormProps} from '../uploading-settings';
import {Button} from '../../../../../ui/buttons/button';
import {Dialog} from '../../../../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../../../../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../../../../../ui/overlays/dialog/dialog-body';
import {useForm, useFormContext} from 'react-hook-form';
import {Form} from '../../../../../ui/forms/form';
import {DialogTrigger} from '../../../../../ui/overlays/dialog/dialog-trigger';
import {AdminSettings} from '../../../admin-settings';
import {DialogFooter} from '../../../../../ui/overlays/dialog/dialog-footer';
import {useDialogContext} from '../../../../../ui/overlays/dialog/dialog-context';
import {useGenerateDropboxRefreshToken} from './use-generate-dropbox-refresh-token';

export function DropboxForm({isInvalid}: CredentialFormProps) {
  const {watch, setValue} = useFormContext<AdminSettings>();
  const appKey = watch('server.storage_dropbox_app_key');
  const appSecret = watch('server.storage_dropbox_app_secret');

  return (
    <Fragment>
      <FormTextField
        invalid={isInvalid}
        className="mb-20"
        name="server.storage_dropbox_app_key"
        label={<Trans message="Dropbox application key" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-20"
        name="server.storage_dropbox_app_secret"
        label={<Trans message="Dropbox application secret" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-20"
        name="server.storage_dropbox_refresh_token"
        label={<Trans message="Dropbox refresh token" />}
        required
      />
      <DialogTrigger
        type="modal"
        onClose={refreshToken => {
          if (refreshToken) {
            setValue('server.storage_dropbox_refresh_token', refreshToken);
          }
        }}
      >
        <Button
          variant="outline"
          color="primary"
          size="xs"
          disabled={!appKey || !appSecret}
        >
          <Trans message="Get dropbox refresh token" />
        </Button>
        <DropboxRefreshTokenDialog appKey={appKey!} appSecret={appSecret!} />
      </DialogTrigger>
    </Fragment>
  );
}

interface DropboxRefreshTokenDialogProps {
  appKey: string;
  appSecret: string;
}
function DropboxRefreshTokenDialog({
  appKey,
  appSecret,
}: DropboxRefreshTokenDialogProps) {
  const form = useForm<{accessCode: string}>();
  const {formId, close} = useDialogContext();
  const generateRefreshToken = useGenerateDropboxRefreshToken();
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Connected dropbox account" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={data => {
            generateRefreshToken.mutate(
              {
                app_key: appKey,
                app_secret: appSecret,
                access_code: data.accessCode,
              },
              {
                onSuccess: response => {
                  close(response.refreshToken);
                },
              }
            );
          }}
        >
          <div className="mb-20 pb-20 border-b">
            <div className="text-muted text-sm mb-10">
              <Trans message="Click the 'get access code' button to get dropbox access code, then paste it into the field below." />
            </div>
            <Button
              variant="outline"
              color="primary"
              size="xs"
              elementType="a"
              target="_blank"
              href={`https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&token_access_type=offline&response_type=code`}
            >
              <Trans message="Get access code" />
            </Button>
          </div>
          <FormTextField
            name="accessCode"
            label={<Trans message="Dropbox access code" />}
            required
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={() => {
            close();
          }}
        >
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          form={formId}
          type="submit"
          disabled={!appKey || !appSecret || generateRefreshToken.isLoading}
        >
          <Trans message="Connect" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
