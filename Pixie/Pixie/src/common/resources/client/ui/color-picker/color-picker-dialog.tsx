import {useState} from 'react';
import {ColorPicker} from './color-picker';
import {DialogFooter} from '../overlays/dialog/dialog-footer';
import {Button} from '../buttons/button';
import {useDialogContext} from '../overlays/dialog/dialog-context';
import {Dialog} from '../overlays/dialog/dialog';
import {Trans} from '../../i18n/trans';

interface ColorPickerDialogProps {
  defaultValue?: string;
  onChange?: (color: string) => void;
  hideFooter?: boolean;
  showInput?: boolean;
}
export function ColorPickerDialog({
  defaultValue,
  onChange,
  hideFooter = false,
  showInput = true,
}: ColorPickerDialogProps) {
  const {close} = useDialogContext();
  const [value, setValue] = useState(defaultValue || '');
  // todo: remove this once pixie and bedrive are refactored to use dialogTrigger currentValue (use "currentValue" for defaultValue as well)
  //const initialValue = useRef(defaultValue);

  return (
    <Dialog size="2xs">
      <ColorPicker
        showInput={showInput}
        defaultValue={value}
        onChange={newValue => {
          setValue(newValue);
          onChange?.(newValue);
        }}
      />
      {!hideFooter && (
        <DialogFooter dividerTop>
          <Button
            variant="text"
            size="xs"
            onClick={() => {
              close();
            }}
          >
            <Trans message="Cancel" />
          </Button>
          <Button
            variant="flat"
            color="primary"
            size="xs"
            onClick={() => {
              close(value);
            }}
          >
            <Trans message="Apply" />
          </Button>
        </DialogFooter>
      )}
    </Dialog>
  );
}
