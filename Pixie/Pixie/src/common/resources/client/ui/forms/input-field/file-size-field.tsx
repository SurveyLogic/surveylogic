import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import React, {useEffect, useState} from 'react';
import memoize from 'nano-memoize';
import {
  FormTextFieldProps,
  TextField,
  TextFieldProps,
} from './text-field/text-field';
import {prettyBytes} from '../../../uploads/utils/pretty-bytes';
import {Option, Select} from '../select/select';
import {spaceUnits} from '../../../uploads/utils/space-units';
import {
  convertToBytes,
  SpaceUnit,
} from '../../../uploads/utils/convert-to-bytes';

// 99TB
const MaxValue = 108851651149824;

export const FormFileSizeField = React.forwardRef<
  HTMLDivElement,
  FormTextFieldProps
>(({name, ...props}, ref) => {
  const {
    field: {
      onChange: setByteValue,
      onBlur,
      value: byteValue = '',
      ref: inputRef,
    },
    fieldState: {invalid, error},
  } = useController({
    name,
  });

  const [liveValue, setLiveValue] = useState<number | string>('');
  const [unit, setUnit] = useState<SpaceUnit | string>('MB');

  useEffect(() => {
    if (byteValue == null || byteValue === '') {
      setLiveValue('');
      return;
    }
    const {amount, unit: newUnit} = fromBytes({
      bytes: Math.min(byteValue, MaxValue),
    });
    setUnit(newUnit || 'MB');
    setLiveValue(Number.isNaN(amount) ? '' : amount);
  }, [byteValue, unit]);

  const formProps: TextFieldProps = {
    onChange: e => {
      const value = parseInt(e.target.value);
      if (Number.isNaN(value)) {
        setByteValue(value);
      } else {
        const newBytes = convertToBytes(
          parseInt(e.target.value),
          unit as SpaceUnit
        );
        setByteValue(newBytes);
      }
    },
    onBlur,
    value: liveValue,
    invalid,
    errorMessage: error?.message,
    inputRef,
  };

  const unitSelect = (
    <Select
      minWidth="min-w-80"
      selectionMode="single"
      selectedValue={unit}
      disabled={!byteValue}
      onSelectionChange={newUnit => {
        const newBytes = convertToBytes(
          (liveValue || 0) as number,
          newUnit as SpaceUnit
        );
        setByteValue(newBytes);
      }}
    >
      {spaceUnits.slice(0, 5).map(u => (
        <Option value={u} key={u}>
          {u === 'B' ? 'Bytes' : u}
        </Option>
      ))}
    </Select>
  );

  return (
    <TextField
      {...mergeProps(formProps, props)}
      type="number"
      ref={ref}
      endAppend={unitSelect}
    />
  );
});

const fromBytes = memoize(
  ({bytes}: {bytes: number}): {amount: number | string; unit: SpaceUnit} => {
    const pretty = prettyBytes(bytes);
    if (!pretty) return {amount: '', unit: 'MB'};
    let amount = parseInt(pretty.split(' ')[0]);
    // get rid of any punctuation
    amount = Math.round(amount);
    return {amount, unit: pretty.split(' ')[1] as SpaceUnit};
  }
);
