import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../i18n/trans';
import React, {Fragment, ReactNode} from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {Accordion, AccordionItem} from '../../../ui/accordion/accordion';
import {FormattedPrice} from '../../../i18n/formatted-price';
import {FormPermissionSelector} from '../../../auth/ui/permission-selector';
import {PriceForm} from './price-form';
import {Button} from '../../../ui/buttons/button';
import {AddIcon} from '../../../icons/material/Add';
import {IconButton} from '../../../ui/buttons/icon-button';
import {CloseIcon} from '../../../icons/material/Close';
import {CreateProductPayload} from '../requests/use-create-product';
import {FormSwitch} from '../../../ui/forms/toggle/switch';
import {FormSelect} from '../../../ui/forms/select/select';
import {Item} from '../../../ui/forms/listbox/item';
import {FormFileSizeField} from '../../../ui/forms/input-field/file-size-field';
import {Link} from 'react-router-dom';
import {LinkStyle} from '../../../ui/buttons/external-link';

export function CrupdatePlanForm() {
  return (
    <Fragment>
      <FormTextField
        name="name"
        label={<Trans message="Name" />}
        className="mb-20"
        required
        autoFocus
      />
      <FormTextField
        name="description"
        label={<Trans message="Description" />}
        className="mb-20"
        inputElementType="textarea"
        rows={4}
      />
      <FormSelect
        name="position"
        selectionMode="single"
        label={<Trans message="Position in pricing table" />}
        className="mb-20"
      >
        <Item value={0}>
          <Trans message="First" />
        </Item>
        <Item value={1}>
          <Trans message="Second" />
        </Item>
        <Item value={2}>
          <Trans message="Third" />
        </Item>
        <Item value={3}>
          <Trans message="Fourth" />
        </Item>
        <Item value={4}>
          <Trans message="Fifth" />
        </Item>
      </FormSelect>
      <FormFileSizeField
        className="mb-30"
        name="available_space"
        label={<Trans message="Allowed storage space" />}
        description={
          <Trans
            values={{
              a: parts => (
                <Link
                  className={LinkStyle}
                  target="_blank"
                  to="/admin/settings/uploading"
                >
                  {parts}
                </Link>
              ),
            }}
            message="Total storage space all user uploads are allowed to take up."
          />
        }
      />
      <FormSwitch
        name="recommended"
        className="mb-20"
        description={
          <Trans message="Plan will be displayed more prominently on pricing page." />
        }
      >
        <Trans message="Recommend" />
      </FormSwitch>
      <FormSwitch
        name="hidden"
        className="mb-20"
        description={
          <Trans message="Plan will not be shown on pricing or upgrade pages." />
        }
      >
        <Trans message="Hidden" />
      </FormSwitch>
      <FormSwitch
        name="free"
        className="mb-20"
        description={
          <Trans message="Will be assigned to all users, if they are not subscribed already." />
        }
      >
        <Trans message="Free" />
      </FormSwitch>
      <Header>
        <Trans message="Feature list" />
      </Header>
      <FeatureListForm />
      <PricingListForm />
      <Header>
        <Trans message="Permissions" />
      </Header>
      <FormPermissionSelector name="permissions" />
    </Fragment>
  );
}

interface HeaderProps {
  children: ReactNode;
}
function Header({children}: HeaderProps) {
  return <h2 className="mt-40 mb-20 text-base font-semibold">{children}</h2>;
}

function FeatureListForm() {
  const {fields, append, remove} = useFieldArray<CreateProductPayload>({
    name: 'feature_list',
  });
  return (
    <div>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex gap-10 mb-10">
            <FormTextField
              name={`feature_list.${index}.value`}
              size="sm"
              className="flex-auto"
            />
            <IconButton
              size="sm"
              color="primary"
              className="flex-shrink-0"
              onClick={() => {
                remove(index);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        );
      })}
      <Button
        variant="text"
        color="primary"
        startIcon={<AddIcon />}
        size="xs"
        onClick={() => {
          append({value: ''});
        }}
      >
        <Trans message="Add another line" />
      </Button>
    </div>
  );
}

function PricingListForm() {
  const {
    watch,
    formState: {errors},
  } = useFormContext<CreateProductPayload>();
  const {fields, append, remove} = useFieldArray<
    CreateProductPayload,
    'prices',
    'key'
  >({
    name: 'prices',
    keyName: 'key',
  });

  // if plan is marked as free, hide pricing form
  if (watch('free')) {
    return null;
  }

  return (
    <Fragment>
      <Header>
        <Trans message="Pricing" />
      </Header>
      {errors.prices?.message && (
        <div className="text-sm text-danger mb-20">{errors.prices.message}</div>
      )}
      <Accordion variant="outline" className="mb-10">
        {fields.map((field, index) => (
          <AccordionItem
            label={<FormattedPrice price={field} />}
            key={field.key}
          >
            <PriceForm
              index={index}
              onRemovePrice={() => {
                remove(index);
              }}
            />
          </AccordionItem>
        ))}
      </Accordion>
      <Button
        variant="text"
        color="primary"
        startIcon={<AddIcon />}
        size="xs"
        onClick={() => {
          append({
            currency: 'USD',
            amount: 1,
            interval_count: 1,
            interval: 'month',
          });
        }}
      >
        <Trans message="Add another price" />
      </Button>
    </Fragment>
  );
}
