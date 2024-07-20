import {useForm} from 'react-hook-form';
import {FormTextField} from '../ui/forms/input-field/text-field/text-field';
import {Form} from '../ui/forms/form';
import {Button} from '../ui/buttons/button';
import {useCreateWorkspace} from './requests/create-workspace';
import {DialogFooter} from '../ui/overlays/dialog/dialog-footer';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {Trans} from '../i18n/trans';

export function NewWorkspaceDialog() {
  const form = useForm<{name: string}>();
  const {formId, close} = useDialogContext();
  const createWorkspace = useCreateWorkspace(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Create workspace" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={() => {
            createWorkspace.mutate(form.getValues(), {
              onSuccess: response => {
                close(response.workspace.id);
              },
            });
          }}
        >
          <FormTextField
            name="name"
            autoFocus
            label={<Trans message="Workspace name" />}
            minLength={3}
            required
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={close}>
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={createWorkspace.isLoading}
        >
          <Trans message="Create" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
