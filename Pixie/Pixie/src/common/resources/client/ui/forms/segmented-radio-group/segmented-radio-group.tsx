import {Children, cloneElement, forwardRef, isValidElement, useId, useRef} from 'react';
import {RadioGroupProps} from '../radio-group/radio-group';
import {SegmentedRadioProps} from './segmented-radio';
import {ActiveIndicator} from './active-indicator';
import {useControlledState} from '@react-stately/utils';
import clsx from 'clsx';

export interface SegmentedRadioGroupProps
  extends Omit<RadioGroupProps, 'orientation'> {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}
export const SegmentedRadioGroup = forwardRef<
  HTMLFieldSetElement,
  SegmentedRadioGroupProps
>((props, ref) => {
  const {children, size, className} = props;

  const id = useId();
  const name = props.name || id;

  const labelsRef = useRef<Record<string, HTMLLabelElement>>({});
  const [selectedValue, setSelectedValue] = useControlledState(
    props.value,
    props.defaultValue,
    props.onChange
  );

  return (
    <fieldset ref={ref} className={clsx(className, 'w-min')}>
      <div className="flex bg-chip rounded p-4 isolate relative">
        <ActiveIndicator selectedValue={selectedValue} labelsRef={labelsRef} />
        {Children.map(children, (child, index) => {
          if (isValidElement<SegmentedRadioProps>(child)) {
            return cloneElement<SegmentedRadioProps>(child, {
              isFirst: index === 0,
              name,
              size,
              onChange: e => {
                setSelectedValue(e.target.value);
                child.props.onChange?.(e);
              },
              labelRef: el => {
                if (el) {
                  labelsRef.current[child.props.value] = el;
                }
              },
              isSelected: selectedValue === child.props.value,
            });
          }
        })}
      </div>
    </fieldset>
  );
});
