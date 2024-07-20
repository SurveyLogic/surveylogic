import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../i18n/trans';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {CrupdateTagForm} from './crupdate-tag-form';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {useForm} from 'react-hook-form';
import {Tag} from '../../tags/tag';
import {UpdateTagPayload, useUpdateTag} from './requests/use-update-tag';

interface UpdateTagDialogProps {
  tag: Tag;
}
export function UpdateTagDialog({tag}: UpdateTagDialogProps) {
  const {close, formId} = useDialogContext();
  const form = useForm<UpdateTagPayload>({
    defaultValues: {
      id: tag.id,
      name: tag.name,
      display_name: tag.display_name,
      type: tag.type,
    },
  });
  const updateTag = useUpdateTag(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Update “:name“ tag" values={{name: tag.name}} />
      </DialogHeader>
      <DialogBody>
        <CrupdateTagForm
          formId={formId}
          form={form as any}
          onSubmit={values => {
            updateTag.mutate(values as UpdateTagPayload, {
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
          disabled={updateTag.isLoading}
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
