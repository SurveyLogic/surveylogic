import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../i18n/trans';
import {FormSelect} from '../../../ui/forms/select/select';
import {Item} from '../../../ui/forms/listbox/item';
import {FilterOperatorNames} from '../filter-operator-names';
import {Fragment} from 'react';
import {FilterPanelProps} from './filter-panel-props';

export function InputFilterPanel({filter}: FilterPanelProps) {
  return (
    <Fragment>
      <FormSelect
        autoFocus
        selectionMode="single"
        name={`${filter.key}.operator`}
        className="mb-14"
        size="sm"
        required
      >
        {filter.operators.map(operator => (
          <Item key={operator} value={operator}>
            {<Trans {...FilterOperatorNames[operator]} />}
          </Item>
        ))}
      </FormSelect>
      <FormTextField
        size="sm"
        name={`${filter.key}.value`}
        type={filter.inputType}
        required
      />
    </Fragment>
  );
}
