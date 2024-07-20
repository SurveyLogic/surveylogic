import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '../backend-filter';
import {FilterListTriggerButton} from './filter-list-trigger-button';
import {Trans} from '../../../i18n/trans';
import {SelectFilterPanel} from '../panels/select-filter-panel';
import {FilterListItemDialogTrigger} from './filter-list-item-dialog-trigger';
import {Avatar} from '../../../ui/images/avatar';
import {NormalizedModelFilterPanel} from '../panels/normalized-model-filter-panel';
import {DateFilterPanel} from '../panels/date-filter-panel';
import {Fragment, Key, ReactNode} from 'react';
import {DateRangePresets} from '../../../ui/forms/input-field/date/date-range-picker/dialog/date-range-presets';
import {FormattedDateTimeRange} from '../../../i18n/formatted-date-time-range';
import {AbsoluteDateRange} from '../../../ui/forms/input-field/date/date-range-picker/form-date-range-picker';
import {InputFilterPanel} from '../panels/input-filter-panel';
import {FilterOperatorNames} from '../filter-operator-names';
import {FilterItemFormValue} from '../add-filter-dialog';
import {useNormalizedModel} from '../../../users/queries/use-normalized-model';
import {Skeleton} from '../../../ui/skeleton/skeleton';

export interface FilterListControlProps<T = unknown> {
  filter: BackendFilter;
  onValueChange: (value: FilterItemFormValue<T>) => void;
  value: T;
  operator?: FilterOperator;
  isInactive?: boolean;
}
export function FilterListControl(props: FilterListControlProps<any>) {
  switch (props.filter.type) {
    case FilterControlType.DatePicker:
      return <DatePickerControl {...props} />;
    case FilterControlType.BooleanToggle:
      return <BooleanToggleControl {...props} />;
    case FilterControlType.Select: {
      return <SelectControl {...props} />;
    }
    case FilterControlType.Input: {
      return <InputControl {...props} />;
    }
    case FilterControlType.SelectModel: {
      return <SelectModelControl {...props} />;
    }
  }
}

function DatePickerControl(
  props: FilterListControlProps<Required<AbsoluteDateRange>>
) {
  const {value, filter} = props;

  let valueLabel: ReactNode;
  if (value.preset !== undefined) {
    valueLabel = <Trans {...DateRangePresets[value.preset].label} />;
  } else {
    valueLabel = (
      <FormattedDateTimeRange
        start={new Date(value.start)}
        end={new Date(value.end)}
        options={{dateStyle: 'medium'}}
      />
    );
  }

  return (
    <FilterListItemDialogTrigger
      {...props}
      label={valueLabel}
      panel={<DateFilterPanel filter={filter} />}
    />
  );
}

function BooleanToggleControl({
  filter,
  isInactive,
  onValueChange,
}: FilterListControlProps<boolean>) {
  return (
    <FilterListTriggerButton
      onClick={() => {
        onValueChange({value: true});
      }}
      filter={filter}
      isInactive={isInactive}
    />
  );
}

function SelectControl(props: FilterListControlProps<Key>) {
  const {filter, value} = props;
  const option = filter.options.find(o => o.key === value);
  return (
    <FilterListItemDialogTrigger
      {...props}
      label={option ? <Trans {...option.label} /> : null}
      panel={<SelectFilterPanel filter={filter} />}
    />
  );
}

function InputControl(props: FilterListControlProps<string>) {
  const {filter, value, operator} = props;

  const operatorLabel = operator ? (
    <Trans {...FilterOperatorNames[operator]} />
  ) : null;

  return (
    <FilterListItemDialogTrigger
      {...props}
      label={
        <Fragment>
          {operatorLabel} {value}
        </Fragment>
      }
      panel={<InputFilterPanel filter={filter} />}
    />
  );
}

function SelectModelControl(props: FilterListControlProps<string>) {
  const {value, filter} = props;
  const {isLoading, data} = useNormalizedModel(filter.model!, value);

  const skeleton = (
    <Fragment>
      <Skeleton variant="avatar" size="w-18 h-18 mr-6" />
      <Skeleton variant="rect" size="w-50" />
    </Fragment>
  );
  const modelPreview = (
    <Fragment>
      <Avatar size="xs" src={data?.model.image} className="mr-6" />
      {data?.model.name}
    </Fragment>
  );

  const label = isLoading || !data ? skeleton : modelPreview;

  return (
    <FilterListItemDialogTrigger
      {...props}
      label={label}
      panel={<NormalizedModelFilterPanel filter={filter} />}
    />
  );
}
