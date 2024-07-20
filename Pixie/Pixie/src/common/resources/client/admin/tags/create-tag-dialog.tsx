import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../i18n/trans';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {CrupdateTagForm} from './crupdate-tag-form';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {useCreateNewTag} from './requests/use-create-new-tag';
import {useContext} from 'react';
import {SiteConfigContext} from '../../core/settings/site-config-context';
import {useForm} from 'react-hook-form';
import {Tag} from '../../tags/tag';

export function CreateTagDialog() {
  const {close, formId} = useDialogContext();
  const {
    tags: {types},
  } = useContext(SiteConfigContext);
  const form = useForm<Partial<Tag>>({
    defaultValues: {
      type: types[0].name,
    },
  });
  const createNewTag = useCreateNewTag(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Add new tag" />
      </DialogHeader>
      <DialogBody>
        <CrupdateTagForm
          formId={formId}
          form={form}
          onSubmit={values => {
            createNewTag.mutate(values, {
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
          disabled={createNewTag.isLoading}
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
