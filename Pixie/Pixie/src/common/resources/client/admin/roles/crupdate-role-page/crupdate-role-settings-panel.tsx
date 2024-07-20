import {Role} from '../../../auth/role';
import {useTrans} from '../../../i18n/use-trans';
import {useFormContext} from 'react-hook-form';
import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../i18n/trans';
import {message} from '../../../i18n/message';
import {FormSelect} from '../../../ui/forms/select/select';
import {Item} from '../../../ui/forms/listbox/item';
import {FormSwitch} from '../../../ui/forms/toggle/switch';
import {FormPermissionSelector} from '../../../auth/ui/permission-selector';
import {useSettings} from '../../../core/settings/use-settings';

interface CrupdateRolePageSettingsPanelProps {
  isInternal?: boolean;
}
export function CrupdateRolePageSettingsPanel({
  isInternal = false,
}: CrupdateRolePageSettingsPanelProps) {
  const {trans} = useTrans();
  const {workspaces} = useSettings();
  const {watch} = useFormContext<Role>();
  const watchedType = watch('type');

  return (
    <>
      <FormTextField
        label={<Trans message="Name" />}
        name="name"
        className="mb-20"
        required
      />
      <FormTextField
        label={<Trans message="Description" />}
        name="description"
        inputElementType="textarea"
        placeholder={trans(message('Role description...'))}
        rows={4}
        className="mb-20"
      />
      {workspaces.integrated && (
        <FormSelect
          label={<Trans message="Type" />}
          name="type"
          selectionMode="single"
          className="mb-20"
          description={
            <Trans message="Whether this role will be assigned to users globally on the site or only within workspaces." />
          }
        >
          <Item value="sitewide">
            <Trans message="Sitewide" />
          </Item>
          <Item value="workspace">
            <Trans message="Workspace" />
          </Item>
        </FormSelect>
      )}
      {!isInternal && (
        <>
          <FormSwitch
            name="default"
            className="mb-20"
            description={
              <Trans message="Assign this role to new users automatically." />
            }
          >
            <Trans message="Default" />
          </FormSwitch>
          {watchedType === 'sitewide' && (
            <FormSwitch
              name="guests"
              description={
                <Trans message="Assign this role to guests (not logged in users)." />
              }
            >
              <Trans message="Guests" />
            </FormSwitch>
          )}
        </>
      )}
      <h2 className="mb-10 mt-30 text-lg">
        <Trans message="Permissions" />
      </h2>
      <FormPermissionSelector
        name="permissions"
        valueListKey={
          watchedType === 'sitewide' ? 'permissions' : 'workspacePermissions'
        }
      />
    </>
  );
}
