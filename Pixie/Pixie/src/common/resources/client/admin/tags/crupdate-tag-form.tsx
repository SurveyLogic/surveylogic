import {Tag} from '../../tags/tag';
import {UseFormReturn} from 'react-hook-form';
import {Form} from '../../ui/forms/form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {FormSelect} from '../../ui/forms/select/select';
import {Trans} from '../../i18n/trans';
import {Item} from '../../ui/forms/listbox/item';
import {useContext} from 'react';
import {SiteConfigContext} from '../../core/settings/site-config-context';

interface CrupdateTagFormProps {
  onSubmit: (values: Partial<Tag>) => void;
  formId: string;
  form: UseFormReturn<Partial<Tag>>;
}
export function CrupdateTagForm({
  form,
  onSubmit,
  formId,
}: CrupdateTagFormProps) {
  const {
    tags: {types},
  } = useContext(SiteConfigContext);
  const watchedType = form.watch('type');
  const isSystem = !!types.find(t => t.name === watchedType && t.system);

  return (
    <Form id={formId} form={form} onSubmit={onSubmit}>
      <FormTextField
        name="name"
        label={<Trans message="Name" />}
        description={<Trans message="Unique tag identifier." />}
        className="mb-20"
        required
        autoFocus
      />
      <FormTextField
        name="display_name"
        label={<Trans message="Display name" />}
        description={<Trans message="User friendly tag name." />}
        className="mb-20"
      />
      <FormSelect name="type" selectionMode="single" disabled={isSystem}>
        {types
          .filter(t => !t.system)
          .map(type => (
            <Item key={type.name} value={type.name}>
              <Trans message={type.name} />
            </Item>
          ))}
      </FormSelect>
    </Form>
  );
}
