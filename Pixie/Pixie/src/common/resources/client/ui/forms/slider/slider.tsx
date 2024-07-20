import {BaseSlider} from './base-slider';
import {useSlider, UseSliderProps} from './use-slider';
import React, {Ref} from 'react';
import {SliderThumb} from './slider-thumb';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';

interface SliderProps extends UseSliderProps<number> {
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler;
}
export function Slider({inputRef, onBlur, ...props}: SliderProps) {
  const {onChange, onChangeEnd, value, defaultValue, ...otherProps} = props;

  const baseProps: UseSliderProps = {
    ...otherProps,
    // Normalize `value: number[]` to `value: number`
    value: value != null ? [value] : undefined,
    defaultValue: defaultValue != null ? [defaultValue] : undefined,
    onChange: (v: number[]): void => {
      onChange?.(v[0]);
    },
    onChangeEnd: (v: number[]): void => {
      onChangeEnd?.(v[0]);
    },
  };

  const slider = useSlider(baseProps);

  return (
    <BaseSlider {...baseProps} slider={slider}>
      <SliderThumb
        fillColor={props.fillColor}
        index={0}
        slider={slider}
        inputRef={inputRef}
        onBlur={onBlur}
      />
    </BaseSlider>
  );
}

export interface FormSliderProps extends SliderProps {
  name: string;
}

export function FormSlider({name, ...props}: FormSliderProps) {
  const {
    field: {onChange, onBlur, value = '', ref},
  } = useController({
    name,
  });

  const formProps: SliderProps = {
    onChange,
    onBlur,
    value: value || '', // avoid issues with "null" value when setting form defaults from backend model
  };

  return <Slider inputRef={ref} {...mergeProps(formProps, props)} />;
}
