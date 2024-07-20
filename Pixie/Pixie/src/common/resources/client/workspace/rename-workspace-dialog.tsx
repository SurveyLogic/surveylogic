import {useForm} from 'react-hook-form';
import {FormTextField} from '../ui/forms/input-field/text-field/text-field';
import {Form} from '../ui/forms/form';
import {Button} from '../ui/buttons/button';
import {DialogFooter} from '../ui/overlays/dialog/dialog-footer';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {
  UpdateWorkspacePayload,
  useUpdateWorkspace,
} from './requests/update-workspace';
import {Workspace} from './types/workspace';
import {Trans} from '../i18n/trans';

interface Props {
  workspace: Workspace;
}
export function RenameWorkspaceDialog({workspace}: Props) {
  const form = useForm<UpdateWorkspacePayload>({
    defaultValues: {id: workspace.id, name: workspace.name},
  });
  const {formId, close} = useDialogContext();
  const updateWorkspace = useUpdateWorkspace(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Rename workspace" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={() => {
            updateWorkspace.mutate(form.getValues());
          }}
        >
          <FormTextField
            name="name"
            autoFocus
            label={<Trans message="Name" />}
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
          disabled={updateWorkspace.isLoading}
        >
          <Trans message="Rename" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
