import {SettingsPanel} from '../settings-panel';
import {SettingsSeparator} from '../settings-separator';
import {Trans} from '../../../i18n/trans';
import {FormSwitch} from '../../../ui/forms/toggle/switch';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {AdminSettings} from '../admin-settings';
import React, {Fragment} from 'react';
import {FormSelect} from '../../../ui/forms/select/select';
import {Item} from '../../../ui/forms/listbox/item';
import {MenuItemForm} from '../../menus/menu-item-form';
import {Button} from '../../../ui/buttons/button';
import {AddIcon} from '../../../icons/material/Add';
import {DialogTrigger} from '../../../ui/overlays/dialog/dialog-trigger';
import {AddMenuItemDialog} from '../../appearance/sections/menus/add-menu-item-dialog';
import {Accordion, AccordionItem} from '../../../ui/accordion/accordion';
import {IconButton} from '../../../ui/buttons/icon-button';
import {CloseIcon} from '../../../icons/material/Close';

export function GdprSettings() {
  return (
    <SettingsPanel
      title={<Trans message="GDPR" />}
      description={
        <Trans message="Configure settings related to EU General Data Protection Regulation." />
      }
    >
      <CookieNoticeSection />
      <SettingsSeparator />
      <RegistrationPoliciesSection />
    </SettingsPanel>
  );
}

function CookieNoticeSection() {
  const {watch} = useFormContext<AdminSettings>();
  const noticeEnabled = watch('client.cookie_notice.enable');

  return (
    <div>
      <FormSwitch
        name="client.cookie_notice.enable"
        className="mb-20"
        description={
          <Trans message="Whether cookie notice should be shown automatically to users from EU until it is accepted." />
        }
      >
        <Trans message="Enable cookie notice" />
      </FormSwitch>
      {noticeEnabled && (
        <Fragment>
          <div className="border-b pb-6 mb-20">
            <div className="text-sm font-medium border-b pb-10 mb-20">
              <Trans message="Information button" />
            </div>
            <MenuItemForm
              hideRoleAndPermissionFields
              formPathPrefix="client.cookie_notice.button"
            />
          </div>
          <FormSelect
            name="client.cookie_notice.position"
            selectionMode="single"
            label={<Trans message="Cookie notice position" />}
            className="mb-20"
          >
            <Item value="top">
              <Trans message="Top" />
            </Item>
            <Item value="bottom">
              <Trans message="Bottom" />
            </Item>
          </FormSelect>
        </Fragment>
      )}
    </div>
  );
}

function RegistrationPoliciesSection() {
  const {fields, append, remove} = useFieldArray<
    AdminSettings,
    'client.registration.policies'
  >({
    name: 'client.registration.policies',
  });

  return (
    <Fragment>
      <div className="mb-6 text-sm">
        <Trans message="Registration policies" />
      </div>
      <div className="text-xs text-muted">
        <Trans message="Create policies that will be shown on registration page. User will be required to accept them by toggling a checkbox." />
      </div>
      <Accordion className="mt-16" variant="outline">
        {fields.map((field, index) => (
          <AccordionItem
            key={field.id}
            label={field.label}
            chevronPosition="left"
            endAppend={
              <IconButton
                radius="rounded"
                variant="text"
                color="danger"
                size="sm"
                onClick={() => {
                  remove(index);
                }}
              >
                <CloseIcon />
              </IconButton>
            }
          >
            <MenuItemForm
              hideRoleAndPermissionFields
              formPathPrefix={`client.register_policies.${index}`}
            />
          </AccordionItem>
        ))}
      </Accordion>
      <DialogTrigger
        type="modal"
        onClose={value => {
          if (value) {
            append(value);
          }
        }}
      >
        <Button
          className="mt-12"
          variant="link"
          color="primary"
          startIcon={<AddIcon />}
          size="xs"
        >
          <Trans message="Add another policy" />
        </Button>
        <AddMenuItemDialog title={<Trans message="Add policy" />} />
      </DialogTrigger>
    </Fragment>
  );
}
