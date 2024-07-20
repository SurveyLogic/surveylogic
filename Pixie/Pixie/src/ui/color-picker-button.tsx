import React, {ReactNode, useState} from 'react';
import clsx from 'clsx';
import {ColorPicker} from '@common/ui/color-picker/color-picker';
import {useStore} from '../state/store';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {getInputFieldClassNames} from '@common/ui/forms/input-field/get-input-field-class-names';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {InputSize} from '@common/ui/forms/input-field/input-size';

interface ColorPickerButtonProps {
  label?: ReactNode;
  className?: string;
  value?: string;
  size?: InputSize;
  onChange?: (value: string) => void;
  width?: string;
  ['aria-label']?: string;
}
export function ColorPickerButton(props: ColorPickerButtonProps) {
  const {label, className, value, onChange, size, width = 'w-max'} = props;
  const colors = useStore(s => s.config.ui?.colorPresets?.items) || [];
  const style = getInputFieldClassNames({size});
  const [selectedColor, setSelectedColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const onColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className={clsx(className, width)}>
      {label && <span className={style.label}>{label}</span>}
      <DialogTrigger type="popover" isOpen={isOpen} onOpenChange={setIsOpen}>
        <ButtonBase
          className={clsx(style.input, 'inline-flex items-center')}
          aria-label={props['aria-label']}
        >
          <span
            className="block flex-shrink-0 mr-5 border rounded h-2/4 aspect-square"
            style={{backgroundColor: selectedColor}}
          />
          <ArrowIcon isActive={isOpen} className={style.adornment} />
        </ButtonBase>
        <Dialog size="auto">
          <ColorPicker
            onChange={onColorChange}
            defaultValue={selectedColor}
            colorPresets={colors}
          />
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

type ArrowProps = {
  isActive: boolean;
  className: string;
};

export function ArrowIcon({isActive, className}: ArrowProps) {
  const rotation = isActive ? 'rotate-180' : 'rotate-0';
  return (
    <KeyboardArrowDownIcon
      size="sm"
      className={`transition-transform ml-auto flex-shrink-0 ${rotation} ${className}`}
    />
  );
}
