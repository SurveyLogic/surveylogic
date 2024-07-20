import {DialogTrigger} from '../../../ui/overlays/dialog/dialog-trigger';
import {FilterListTriggerButton} from './filter-list-trigger-button';
import {ReactNode} from 'react';
import {useForm} from 'react-hook-form';
import {FilterItemFormValue} from '../add-filter-dialog';
import {useDialogContext} from '../../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../../ui/overlays/dialog/dialog-header';
import {Trans} from '../../../i18n/trans';
import {DialogBody} from '../../../ui/overlays/dialog/dialog-body';
import {Form} from '../../../ui/forms/form';
import {DialogFooter} from '../../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../../ui/buttons/button';
import {FilterListControlProps} from './filter-list-control';

interface FilterListItemDialogTriggerProps extends FilterListControlProps<any> {
  label: ReactNode;
  panel: ReactNode;
}
export function FilterListItemDialogTrigger(
  props: FilterListItemDialogTriggerProps
) {
  const {onValueChange, isInactive, filter, label} = props;
  return (
    <DialogTrigger
      offset={10}
      type="popover"
      onClose={(value?: FilterItemFormValue) => {
        if (value !== undefined) {
          onValueChange(value);
        }
      }}
    >
      <FilterListTriggerButton isInactive={isInactive} filter={filter}>
        {label}
      </FilterListTriggerButton>
      <FilterListControlDialog {...props} />
    </DialogTrigger>
  );
}

export function FilterListControlDialog({
  filter,
  panel,
  value,
  operator,
}: FilterListItemDialogTriggerProps) {
  const form = useForm<Record<string, FilterItemFormValue>>({
    defaultValues: {
      [filter.key]: {value, operator},
    },
  });
  const {close, formId} = useDialogContext();
  return (
    <Dialog size="xs">
      <DialogHeader>
        <Trans {...filter.label} />
      </DialogHeader>
      <DialogBody padding="px-14 pt-14 pb-4">
        <Form
          form={form}
          id={formId}
          onSubmit={formValue => {
            close(formValue[filter.key]);
          }}
        >
          {filter.description && (
            <div className="text-muted text-xs mb-14">
              <Trans {...filter.description} />
            </div>
          )}
          {panel}
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button
          form={formId}
          type="submit"
          variant="flat"
          color="primary"
          size="xs"
        >
          <Trans message="Apply" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
