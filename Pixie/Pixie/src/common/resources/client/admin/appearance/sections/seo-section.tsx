import {useFieldArray} from 'react-hook-form';
import {AppearanceValues} from '../appearance-store';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Fragment} from 'react';
import {Trans} from '@common/i18n/trans';

export function SeoSection() {
  const {fields} = useFieldArray<AppearanceValues, 'appearance.seo'>({
    name: 'appearance.seo',
  });

  return (
    <Fragment>
      {fields.map((field, index) => (
        <FormTextField
          className="mb-20"
          key={field.id}
          name={`appearance.seo.${index}.value`}
          label={<Trans message={field.name} />}
          placeholder={field.defaultValue}
          inputElementType="textarea"
          rows={3}
        />
      ))}
    </Fragment>
  );
}
