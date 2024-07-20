import {BaseSlider} from './base-slider';
import {useSlider, UseSliderProps} from './use-slider';
import {SliderThumb} from './slider-thumb';
import {useTrans} from '../../../i18n/use-trans';
import {message} from '../../../i18n/message';

interface RangeSliderProps
  extends UseSliderProps<{start: number; end: number}> {}
export function RangeSlider(props: RangeSliderProps) {
  const {onChange, onChangeEnd, value, defaultValue, ...otherProps} = props;
  const {trans} = useTrans();

  const baseProps: UseSliderProps = {
    ...otherProps,
    value: value != null ? [value.start, value.end] : undefined,
    defaultValue:
      defaultValue != null
        ? [defaultValue.start, defaultValue.end]
        : // make sure that useSliderState knows we have two handles
          [props.minValue ?? 0, props.maxValue ?? 100],
    onChange(v) {
      onChange?.({start: v[0], end: v[1]});
    },
    onChangeEnd(v) {
      onChangeEnd?.({start: v[0], end: v[1]});
    },
  };

  const slider = useSlider(baseProps);

  return (
    <BaseSlider {...baseProps} slider={slider}>
      <SliderThumb
        ariaLabel={trans(message('minimum'))}
        index={0}
        slider={slider}
      />
      <SliderThumb
        ariaLabel={trans(message('maximum'))}
        index={1}
        slider={slider}
      />
    </BaseSlider>
  );
}
