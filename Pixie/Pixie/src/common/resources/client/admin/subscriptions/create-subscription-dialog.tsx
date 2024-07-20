import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../i18n/trans';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {useForm} from 'react-hook-form';
import {useCreateSubscription} from './requests/use-create-subscription';
import {Subscription} from '../../billing/subscription';
import {CrupdateSubscriptionForm} from './crupdate-subscription-form';

export function CreateSubscriptionDialog() {
  const {close, formId} = useDialogContext();
  const form = useForm<Partial<Subscription>>({});
  const createSubscription = useCreateSubscription(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Add new subscription" />
      </DialogHeader>
      <DialogBody>
        <CrupdateSubscriptionForm
          formId={formId}
          form={form}
          onSubmit={values => {
            createSubscription.mutate(values, {
              onSuccess: () => {
                close();
              },
            });
          }}
        />
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
          form={formId}
          disabled={createSubscription.isLoading}
          variant="flat"
          color="primary"
          type="submit"
        >
          <Trans message="Save" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
