import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {
  ConfirmPasswordPayload,
  useConfirmPassword,
} from '@common/auth/ui/confirm-password/requests/use-confirm-password';
import {useForm} from 'react-hook-form';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {Form} from '@common/ui/forms/form';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';

export function ConfirmPasswordDialog() {
  const {close, formId} = useDialogContext();
  const form = useForm<ConfirmPasswordPayload>();
  const confirmPassword = useConfirmPassword(form);
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Confirm password" />
      </DialogHeader>
      <DialogBody>
        <p className="text-sm mb-16">
          <Trans message="For your security, please confirm your password to continue." />
        </p>
        <Form
          id={formId}
          form={form}
          onSubmit={values =>
            confirmPassword.mutate(values, {
              onSuccess: () => close(values.password),
            })
          }
        >
          <FormTextField
            name="password"
            label={<Trans message="Password" />}
            type="password"
            required
            autoFocus
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          type="submit"
          variant="flat"
          color="primary"
          form={formId}
          disabled={confirmPassword.isLoading}
        >
          <Trans message="Confirm" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
