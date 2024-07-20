import {Radio} from '../../ui/forms/radio-group/radio';
import {UpsellBillingCycle} from './find-best-price';
import {Trans} from '../../i18n/trans';
import {
  RadioGroup,
  RadioGroupProps,
} from '../../ui/forms/radio-group/radio-group';
import {UpsellLabel} from './upsell-label';
import {Product} from '../product';

interface BillingCycleRadioProps extends Omit<RadioGroupProps, 'children'> {
  selectedCycle: UpsellBillingCycle;
  onChange: (value: UpsellBillingCycle) => void;
  products?: Product[];
}
export function BillingCycleRadio({
  selectedCycle,
  onChange,
  products,
  ...radioGroupProps
}: BillingCycleRadioProps) {
  return (
    <RadioGroup {...radioGroupProps}>
      <Radio
        value="yearly"
        checked={selectedCycle === 'yearly'}
        onChange={e => {
          onChange(e.target.value as UpsellBillingCycle);
        }}
      >
        <Trans message="Annual" />
        <UpsellLabel products={products} />
      </Radio>
      <Radio
        value="monthly"
        checked={selectedCycle === 'monthly'}
        onChange={e => {
          onChange(e.target.value as UpsellBillingCycle);
        }}
      >
        <Trans message="Monthly" />
      </Radio>
    </RadioGroup>
  );
}
