import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {Form} from '@common/ui/forms/form';
import {useForm} from 'react-hook-form';
import {
  BanUserPayload,
  useBanUser,
} from '@common/admin/users/requests/use-ban-user';
import {FormDatePicker} from '@common/ui/forms/input-field/date/date-picker/date-picker';
import {User} from '@common/auth/user';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import {FormSwitch} from '@common/ui/forms/toggle/switch';

interface Props {
  user: User;
}
export function BanUserDialog({user}: Props) {
  const {trans} = useTrans();
  const {close, formId} = useDialogContext();
  const form = useForm<BanUserPayload>({
    defaultValues: {
      permanent: true,
    },
  });
  const isPermanent = form.watch('permanent');
  const banUser = useBanUser(form, user.id);
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Suspend “:name“" values={{name: user.display_name}} />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values =>
            banUser.mutate(values, {onSuccess: () => close()})
          }
        >
          <FormDatePicker
            name="ban_until"
            label={<Trans message="Suspend until" />}
            disabled={isPermanent}
          />
          <FormSwitch name="permanent" className="mt-12">
            <Trans message="Permanent" />
          </FormSwitch>
          <FormTextField
            className="mt-24"
            name="comment"
            inputElementType="textarea"
            maxLength={250}
            label={<Trans message="Reason" />}
            placeholder={trans(message('Optional'))}
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          form={formId}
          variant="flat"
          color="primary"
          type="submit"
          disabled={banUser.isLoading}
        >
          <Trans message="Suspend" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
