import {FormChipField} from '@common/ui/forms/input-field/chip-field/form-chip-field';
import React, {ReactNode, useState} from 'react';
import {Item} from '@common/ui/forms/listbox/item';
import {useNormalizedModels} from '@common/users/queries/use-normalized-models';

interface Props {
  model: string;
  name: string;
  className?: string;
  label?: ReactNode;
  placeholder?: string;
  allowCustomValue?: boolean;
}
export function FormNormalizedModelChipField({
  name,
  label,
  placeholder,
  model,
  className,
  allowCustomValue = false,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const {data, isLoading} = useNormalizedModels(model, {
    query: inputValue,
  });
  return (
    <FormChipField
      className={className}
      name={name}
      label={label}
      isAsync
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      suggestions={data?.results}
      placeholder={placeholder}
      isLoading={isLoading}
      allowCustomValue={allowCustomValue}
    >
      {data?.results.map(result => (
        <Item
          value={result}
          key={result.id}
          startIcon={
            result.image ? (
              <img
                className="rounded-full object-cover w-24 h-24"
                src={result.image}
                alt=""
              />
            ) : undefined
          }
        >
          {result.name}
        </Item>
      ))}
    </FormChipField>
  );
}
