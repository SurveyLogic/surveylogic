import {useForm} from 'react-hook-form';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../i18n/trans';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Form} from '../../ui/forms/form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {SectionHelper} from '../../ui/section-helper';

interface FormValue {
  key: string;
  value: string;
}

export function NewTranslationDialog() {
  const {formId, close} = useDialogContext();
  const form = useForm<FormValue>();

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Add translation" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={values => {
            close(values);
          }}
        >
          <SectionHelper
            className="mb-30"
            title={
              <Trans message="Add a new translation, if it does not exist already." />
            }
            description={
              <Trans message="This should only need to be done for things like custom menu items." />
            }
          />
          <FormTextField
            inputElementType="textarea"
            rows={2}
            autoFocus
            name="key"
            label={<Trans message="Translation key" />}
            className="mb-30"
            required
          />
          <FormTextField
            inputElementType="textarea"
            rows={2}
            name="value"
            label={<Trans message="Translation value" />}
            required
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={close}>
          <Trans message="Cancel" />
        </Button>
        <Button variant="flat" color="primary" type="submit" form={formId}>
          <Trans message="Add" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
