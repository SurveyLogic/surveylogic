import React, {useEffect} from 'react';
import {useStore} from '../../../state/store';
import {aspectToHeight, aspectToWidth} from '../clamp-resize-payload';
import {state} from '../../../state/utils';
import {LockIcon} from '@common/icons/material/Lock';
import {LockOpenIcon} from '@common/icons/material/LockOpen';
import {useTrans} from '@common/i18n/use-trans';
import {Checkbox} from '@common/ui/forms/toggle/checkbox';
import {Trans} from '@common/i18n/trans';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';

export function ResizeNav() {
  const {trans} = useTrans();
  const {
    minWidth = 50,
    minHeight = 50,
    maxHeight = 2400,
    maxWidth = 2400,
  } = useStore(s => s.config.tools?.resize) || {};
  const originalSize = useStore(s => s.original);
  const formVal = useStore(s => s.resize.formValue);

  useEffect(() => {
    state().resize.setFormValue({...originalSize});
  }, [originalSize]);

  useEffect(() => {
    // setting dirty in above useEffect will prevent tool selection after resize
    state().setDirty(true);
  }, []);

  const onWidthChange = (newWidth: number) => {
    const newVal = {...formVal, width: newWidth};
    if (formVal.maintainAspect) {
      newVal.height = aspectToHeight(newWidth, formVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onHeightChange = (newHeight: number) => {
    const newVal = {...formVal, height: newHeight};
    if (newHeight && formVal.maintainAspect) {
      newVal.width = aspectToWidth(newHeight, formVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onAspectChange = (isChecked: boolean) => {
    const newVal = {...formVal, maintainAspect: isChecked};
    if (isChecked) {
      newVal.height = aspectToHeight(newVal.width, newVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    state().applyChanges();
  };

  return (
    <form
      className="flex items-center justify-center gap-16 w-full"
      onSubmit={onSubmit}
    >
      <TextField
        type="number"
        min={minWidth}
        max={maxWidth}
        size="sm"
        className="w-full max-w-112"
        label={<Trans message="Width" />}
        value={formVal.width}
        onChange={e => {
          onWidthChange(e.target.valueAsNumber);
        }}
      />
      <div className="mt-24">
        <Checkbox
          size="md"
          checked={formVal.maintainAspect}
          onChange={e => {
            onAspectChange(!formVal.maintainAspect);
          }}
          aria-label={trans({message: 'Maintain aspect ratio'})}
          checkedIcon={LockIcon}
          icon={LockOpenIcon}
        />
      </div>
      <TextField
        type="number"
        min={minHeight}
        max={maxHeight}
        size="sm"
        className="w-full max-w-112"
        label={<Trans message="Height" />}
        value={formVal.height}
        onChange={e => {
          onHeightChange(e.target.valueAsNumber);
        }}
      />
      <button type="submit" className="hidden">
        <Trans message="Resize" />
      </button>
    </form>
  );
}
