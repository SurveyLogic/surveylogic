import {FilterPanelProps} from './filter-panel-props';
import {FormNormalizedModelField} from '@common/ui/forms/normalized-model-field';

export function NormalizedModelFilterPanel({filter}: FilterPanelProps) {
  return (
    <FormNormalizedModelField
      name={`${filter.key}.value`}
      className="mb-20"
      modelType={filter.model!}
      openMenuOnFocus
      autoFocus
    />
  );
}
