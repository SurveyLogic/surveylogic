import {useFormContext} from 'react-hook-form';
import {Product} from '@common/billing/product';
import React, {Fragment, useMemo, useState} from 'react';
import {useValueLists} from '@common/http/value-lists';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';
import {FormComboBox} from '@common/ui/forms/combobox/form-combobox';
import {Item} from '@common/ui/forms/listbox/item';
import {FormSelect, Select} from '@common/ui/forms/select/select';
import {Price} from '@common/billing/price';
import {BillingPeriodPresets} from '@common/admin/plans/crupdate-plan-page/billing-period-presets';
import {Button} from '@common/ui/buttons/button';

interface PriceFormProps {
  index: number;
  onRemovePrice: () => void;
}
export function PriceForm({index, onRemovePrice}: PriceFormProps) {
  const query = useValueLists(['currencies']);
  const currencies = useMemo(() => {
    return query.data?.currencies ? Object.values(query.data.currencies) : [];
  }, [query.data]);
  const {watch, getValues} = useFormContext<Product>();
  const isNewProduct = !watch('id');
  const isNewPrice = watch(`prices.${index}.id`) == null;
  const subscriberCount = watch(`prices.${index}.subscriptions_count`) || 0;

  // select billing period preset based on price "interval" and "interval_count"
  const [billingPeriodPreset, setBillingPeriodPreset] = useState(() => {
    const interval = getValues(`prices.${index}.interval`);
    const intervalCount = getValues(`prices.${index}.interval_count`);
    const preset = BillingPeriodPresets.find(
      p => p.key === `${interval}${intervalCount}`
    );
    return preset ? preset.key : 'custom';
  });

  const allowPriceChanges = isNewProduct || isNewPrice || !subscriberCount;

  return (
    <Fragment>
      {!allowPriceChanges && (
        <p className="text-muted text-sm max-w-500 mb-20">
          <Trans
            message="This price can't modified or deleted, because it has [one 1 subscriber|other :count subscribers]. You can instead add a new price."
            values={{count: subscriberCount}}
          />
        </p>
      )}

      <FormTextField
        required
        disabled={!allowPriceChanges}
        label={<Trans message="Amount" />}
        type="number"
        min={0.1}
        step={0.01}
        name={`prices.${index}.amount`}
        className="mb-20"
      />
      <FormComboBox
        required
        disabled={!allowPriceChanges}
        label={<Trans message="Currency" />}
        name={`prices.${index}.currency`}
        items={currencies}
        selectionMode="single"
        className="mb-20"
      >
        {item => (
          <Item
            value={item.code}
            key={item.code}
          >{`${item.code}: ${item.name}`}</Item>
        )}
      </FormComboBox>
      <BillingPeriodSelect
        disabled={!allowPriceChanges}
        index={index}
        value={billingPeriodPreset}
        onValueChange={setBillingPeriodPreset}
      />
      {billingPeriodPreset === 'custom' && (
        <CustomBillingPeriodField disabled={!allowPriceChanges} index={index} />
      )}
      <div className="text-right">
        <Button
          size="xs"
          variant="outline"
          color="danger"
          disabled={!allowPriceChanges}
          onClick={() => {
            onRemovePrice();
          }}
        >
          <Trans message="Delete price" />
        </Button>
      </div>
    </Fragment>
  );
}

interface BillingPeriodSelectProps {
  index: number;
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
}
function BillingPeriodSelect({
  index,
  value,
  onValueChange,
  disabled,
}: BillingPeriodSelectProps) {
  const {setValue: setFormValue} = useFormContext<Product>();

  return (
    <Select
      label={<Trans message="Billing period" />}
      disabled={disabled}
      className="mb-20"
      selectionMode="single"
      selectedValue={value}
      onSelectionChange={value => {
        onValueChange(value as string);
        if (value === 'custom') {
        } else {
          const preset = BillingPeriodPresets.find(p => p.key === value);
          if (preset) {
            setFormValue(
              `prices.${index}.interval`,
              preset.interval as Price['interval']
            );
            setFormValue(
              `prices.${index}.interval_count`,
              preset.interval_count as number
            );
          }
        }
      }}
    >
      {BillingPeriodPresets.map(preset => (
        <Item key={preset.key} value={preset.key}>
          <Trans {...preset.label} />
        </Item>
      ))}
    </Select>
  );
}

interface CustomBillingPeriodFieldProps {
  index: number;
  disabled: boolean;
}
function CustomBillingPeriodField({
  index,
  disabled,
}: CustomBillingPeriodFieldProps) {
  const {watch} = useFormContext<Product>();
  const interval = watch(`prices.${index}.interval`);
  let maxIntervalCount: number;

  if (interval === 'day') {
    maxIntervalCount = 365;
  } else if (interval === 'week') {
    maxIntervalCount = 52;
  } else {
    maxIntervalCount = 12;
  }

  return (
    <div className="flex border rounded w-min">
      <div className="px-18 flex items-center text-sm">
        <Trans message="Every" />
      </div>
      <FormTextField
        inputShadow="shadow-none"
        inputBorder="border-none"
        className="border-l border-r w-80"
        name={`prices.${index}.interval_count`}
        type="number"
        min={1}
        max={maxIntervalCount}
        disabled={disabled}
        required
      />
      <FormSelect
        inputShadow="shadow-none"
        inputBorder="border-none"
        name={`prices.${index}.interval`}
        selectionMode="single"
        disabled={disabled}
      >
        <Item value="day">
          <Trans message="Days" />
        </Item>
        <Item value="week">
          <Trans message="Weeks" />
        </Item>
        <Item value="month">
          <Trans message="Months" />
        </Item>
      </FormSelect>
    </div>
  );
}
