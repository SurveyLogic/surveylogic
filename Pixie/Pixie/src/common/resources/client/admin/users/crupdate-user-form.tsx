import {FieldValues, SubmitHandler, UseFormReturn} from 'react-hook-form';
import clsx from 'clsx';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {useValueLists} from '../../http/value-lists';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {FormSwitch} from '../../ui/forms/toggle/switch';
import {FormFileSizeField} from '../../ui/forms/input-field/file-size-field';
import {LinkStyle} from '../../ui/buttons/external-link';
import {FormPermissionSelector} from '../../auth/ui/permission-selector';
import {Trans} from '../../i18n/trans';
import {FormChipField} from '../../ui/forms/input-field/chip-field/form-chip-field';
import {Item} from '../../ui/forms/listbox/item';
import {CrupdateResourceLayout} from '../crupdate-resource-layout';
import {useSettings} from '../../core/settings/use-settings';

interface Props<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  form: UseFormReturn<T>;
  title: ReactNode;
  isLoading: boolean;
  avatarManager: ReactNode;
  resendEmailButton?: ReactNode;
  children?: ReactNode;
}
export function CrupdateUserForm<T extends FieldValues>({
  onSubmit,
  form,
  title,
  isLoading,
  avatarManager,
  resendEmailButton,
  children,
}: Props<T>) {
  const {require_email_confirmation} = useSettings();
  const {data: valueLists} = useValueLists(['roles', 'permissions']);

  return (
    <CrupdateResourceLayout
      onSubmit={onSubmit}
      form={form}
      title={title}
      isLoading={isLoading}
    >
      <div className="flex items-start gap-40 md:gap-80 mb-40">
        {avatarManager}
        <div className="flex-auto">
          {children}
          <FormTextField
            className="mb-30"
            name="first_name"
            label={<Trans message="First name" />}
          />
          <FormTextField
            name="last_name"
            label={<Trans message="Last name" />}
          />
        </div>
      </div>

      <div className="border-t border-b mb-30 pb-30 pt-30">
        <FormSwitch
          className={clsx(resendEmailButton && 'mb-30')}
          disabled={!require_email_confirmation}
          name="email_verified_at"
          description={
            <Trans message="Whether email address has been confirmed. User will not be able to login until address is confirmed, unless confirmation is disabled from settings page." />
          }
        >
          <Trans message="Email confirmed" />
        </FormSwitch>
        {resendEmailButton}
      </div>
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
            message="Total storage space all user uploads are allowed to take up. If left empty, this value will be inherited from any roles or subscriptions user has, or from 'Available space' setting in <a>Uploading</a> settings page."
          />
        }
      />
      <FormChipField
        className="mb-30"
        name="roles"
        label={<Trans message="Roles" />}
        suggestions={valueLists?.roles}
      >
        {chip => (
          <Item key={chip.id} value={chip.id}>
            {chip.name}
          </Item>
        )}
      </FormChipField>
      <div className="mt-30 pt-30 border-t">
        <div className="text-sm mb-10">
          <Trans message="Permissions" />
        </div>
        <FormPermissionSelector name="permissions" />
      </div>
    </CrupdateResourceLayout>
  );
}
