import {useForm} from 'react-hook-form';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../i18n/trans';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Form} from '../../ui/forms/form';
import {Localization} from '../../i18n/localization';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {useValueLists} from '../../http/value-lists';
import {Option} from '../../ui/forms/select/select';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {useUpdateLocalization} from './update-localization';
import {FormComboBox} from '../../ui/forms/combobox/form-combobox';

interface UpdateLocalizationDialogProps {
  localization: Localization;
}
export function UpdateLocalizationDialog({
  localization,
}: UpdateLocalizationDialogProps) {
  const {formId, close} = useDialogContext();
  const form = useForm<Partial<Localization>>({
    defaultValues: {
      id: localization.id,
      name: localization.name,
      language: localization.language,
    },
  });

  const {data} = useValueLists(['languages']);
  const languages = data?.languages || [];

  const updateLocalization = useUpdateLocalization(form);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Update localization" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={values => {
            updateLocalization.mutate(values, {onSuccess: close});
          }}
        >
          <FormTextField
            name="name"
            label={<Trans message="Name" />}
            className="mb-30"
            required
          />
          <FormComboBox
            required
            name="language"
            label={<Trans message="Language" />}
            selectionMode="single"
            useOptionLabelAsInputValue
          >
            {languages.map(language => {
              return (
                <Option value={language.code} key={language.code}>
                  {language.name}
                </Option>
              );
            })}
          </FormComboBox>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={close}>
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={updateLocalization.isLoading}
        >
          <Trans message="Save" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
