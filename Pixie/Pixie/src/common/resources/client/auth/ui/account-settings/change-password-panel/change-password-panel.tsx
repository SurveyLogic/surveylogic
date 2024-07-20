import {useForm} from 'react-hook-form';
import {useId} from 'react';
import {Form} from '@common/ui/forms/form';
import {AccountSettingsPanel} from '@common/auth/ui/account-settings/account-settings-panel';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {UpdatePasswordPayload, useUpdatePassword} from './use-update-password';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {AccountSettingsId} from '@common/auth/ui/account-settings/account-settings-sidenav';

export function ChangePasswordPanel() {
  const form = useForm<UpdatePasswordPayload>();
  const formId = useId();
  const updatePassword = useUpdatePassword(form);
  return (
    <AccountSettingsPanel
      id={AccountSettingsId.Password}
      title={<Trans message="Update password" />}
      actions={
        <Button
          type="submit"
          form={formId}
          variant="flat"
          color="primary"
          disabled={!form.formState.isValid || updatePassword.isLoading}
        >
          <Trans message="Update password" />
        </Button>
      }
    >
      <Form
        form={form}
        id={formId}
        onSubmit={newValues => {
          updatePassword.mutate(newValues, {
            onSuccess: () => {
              form.reset();
            },
          });
        }}
      >
        <FormTextField
          className="mb-24"
          name="current_password"
          label={<Trans message="Current password" />}
          type="password"
          autoComplete="current-password"
          required
        />
        <FormTextField
          className="mb-24"
          name="password"
          label={<Trans message="New password" />}
          type="password"
          autoComplete="new-password"
          required
        />
        <FormTextField
          name="password_confirmation"
          label={<Trans message="Confirm password" />}
          type="password"
          autoComplete="new-password"
          required
        />
      </Form>
    </AccountSettingsPanel>
  );
}
