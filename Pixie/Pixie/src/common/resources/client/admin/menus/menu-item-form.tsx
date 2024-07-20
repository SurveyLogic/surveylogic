import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../i18n/trans';
import {useValueLists} from '../../http/value-lists';
import {useTrans} from '../../i18n/use-trans';
import {FormChipField} from '../../ui/forms/input-field/chip-field/form-chip-field';
import {Item} from '../../ui/forms/listbox/item';
import {Fragment, useEffect, useMemo} from 'react';
import {
  buildPermissionList,
  prettyName,
} from '../../auth/ui/permission-selector';
import {Section} from '../../ui/forms/listbox/section';
import {useFormContext} from 'react-hook-form';
import {MenuItemConfig} from '../../core/settings/settings';
import {FormSelect, Option} from '../../ui/forms/select/select';
import {useAvailableRoutes} from '../appearance/sections/menus/hooks/available-routes';
import {FormComboBox} from '../../ui/forms/combobox/form-combobox';
import {ButtonBaseProps} from '../../ui/buttons/button-base';
import {createSvgIconFromTree, IconTree} from '../../icons/create-svg-icon';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {IconPickerDialog} from '../../ui/icon-picker/icon-picker-dialog';
import {message} from '../../i18n/message';
import {usePrevious} from '../../utils/hooks/use-previous';

interface NameProps {
  prefixName: (name: string) => string;
}

interface MenuItemFormProps {
  formPathPrefix?: string;
  hideRoleAndPermissionFields?: boolean;
}
export function MenuItemForm({
  formPathPrefix,
  hideRoleAndPermissionFields,
}: MenuItemFormProps) {
  const {trans} = useTrans();
  const prefixName = (name: string): string => {
    return formPathPrefix ? `${formPathPrefix}.${name}` : name;
  };

  return (
    <Fragment>
      <FormTextField
        className="mb-20"
        name={prefixName('label')}
        label={<Trans message="Label" />}
        placeholder={trans(message('No label...'))}
        startAppend={<IconDialogTrigger prefixName={prefixName} />}
      />
      <DestinationSelector prefixName={prefixName} />
      {!hideRoleAndPermissionFields && (
        <Fragment>
          <RoleSelector prefixName={prefixName} />
          <PermissionSelector prefixName={prefixName} />
        </Fragment>
      )}
      <TargetSelect prefixName={prefixName} />
    </Fragment>
  );
}

interface IconDialogTriggerProps extends ButtonBaseProps, NameProps {}
function IconDialogTrigger({
  prefixName,
  ...buttonProps
}: IconDialogTriggerProps) {
  const {watch, setValue} = useFormContext<MenuItemConfig>();
  const fieldName = prefixName('icon') as 'icon';
  const watchedItemIcon = watch(fieldName);
  const Icon = watchedItemIcon && createSvgIconFromTree(watchedItemIcon);
  return (
    <DialogTrigger
      type="modal"
      onClose={(iconTree?: IconTree[] | null) => {
        // null will be set explicitly if icon is cleared via icon picker
        if (iconTree || iconTree === null) {
          setValue(fieldName, iconTree, {
            shouldDirty: true,
          });
        }
      }}
    >
      <IconButton
        className="text-muted icon-sm"
        variant="outline"
        size="md"
        {...buttonProps}
      >
        {Icon ? <Icon /> : <EditIcon />}
      </IconButton>
      <IconPickerDialog />
    </DialogTrigger>
  );
}

function DestinationSelector({prefixName}: NameProps) {
  const form = useFormContext<MenuItemConfig>();
  const currentType = form.watch(prefixName('type') as 'type');
  const previousType = usePrevious(currentType);
  const {data} = useValueLists(['menuItemCategories']);
  const categories = data?.menuItemCategories || [];
  const selectedCategory = categories.find(c => c.type === currentType);
  const {trans} = useTrans();
  const routeItems = useAvailableRoutes();

  // clear "action" field when "type" field changes
  useEffect(() => {
    if (previousType && previousType !== currentType) {
      form.setValue(prefixName('action') as 'action', '');
    }
  }, [currentType, previousType, form, prefixName]);

  return (
    <Fragment>
      <FormSelect
        className="mb-20"
        name={prefixName('type')}
        selectionMode="single"
        label={<Trans message="Type" />}
      >
        <Option value="link">
          <Trans message="Custom link" />
        </Option>
        <Option value="route">
          <Trans message="Site page" />
        </Option>
        {categories.map(category => (
          <Option key={category.type} value={category.type}>
            {category.name}
          </Option>
        ))}
      </FormSelect>
      {currentType === 'link' && (
        <FormTextField
          className="mb-20"
          required
          type="url"
          name={prefixName('action')}
          placeholder={trans({message: 'Enter a url...'})}
          label={<Trans message="Url" />}
        />
      )}
      {currentType === 'route' && (
        <FormComboBox
          className="mb-20"
          required
          items={routeItems}
          name={prefixName('action')}
          openMenuOnFocus
          label={<Trans message="Page" />}
        >
          {item => (
            <Item value={item.id} key={item.id}>
              {item.label}
            </Item>
          )}
        </FormComboBox>
      )}
      {selectedCategory && (
        <FormComboBox
          className="mb-20"
          required
          items={selectedCategory.items}
          name={prefixName('action')}
          openMenuOnFocus
          label={<Trans message={selectedCategory.name} />}
        >
          {item => (
            <Item value={item.action}>
              <Trans message={item.label} />
            </Item>
          )}
        </FormComboBox>
      )}
    </Fragment>
  );
}

function RoleSelector({prefixName}: NameProps) {
  const {data} = useValueLists(['roles', 'permissions']);
  const roles = data?.roles || [];
  const {trans} = useTrans();

  return (
    <FormChipField
      className="mb-20"
      placeholder={trans({message: 'Add role...'})}
      label={<Trans message="Only show if user has role" />}
      name={prefixName('roles')}
      chipSize="sm"
      suggestions={roles}
      valueKey="id"
      displayWith={c => roles.find(r => r.id === c.id)?.name}
    >
      {role => (
        <Item value={role.id} key={role.id} capitalizeFirst>
          <Trans message={role.name} />
        </Item>
      )}
    </FormChipField>
  );
}

function PermissionSelector({prefixName}: NameProps) {
  const {data} = useValueLists(['roles', 'permissions']);
  const {trans} = useTrans();

  const groupedPermissions = useMemo(() => {
    return buildPermissionList(data?.permissions || [], [], false);
  }, [data?.permissions]);

  return (
    <FormChipField
      label={<Trans message="Only show if user has permissions" />}
      placeholder={trans({message: 'Add permission...'})}
      chipSize="sm"
      suggestions={groupedPermissions}
      name={prefixName('permissions')}
      valueKey="name"
    >
      {({groupName, items}) => (
        <Section label={prettyName(groupName)} key={groupName}>
          {items.map(permission => (
            <Item
              key={permission.name}
              value={permission.name}
              description={<Trans message={permission.description} />}
            >
              <Trans message={permission.display_name || permission.name} />
            </Item>
          ))}
        </Section>
      )}
    </FormChipField>
  );
}

function TargetSelect({prefixName}: NameProps) {
  const form = useFormContext<MenuItemConfig>();
  const watchedType = form.watch(prefixName('type') as 'type');

  // routes and pages can only be "_self"
  if (watchedType !== 'link') {
    return null;
  }

  return (
    <FormSelect
      className="mt-20"
      selectionMode="single"
      name={prefixName('target')}
      label={<Trans message="Open link in" />}
    >
      <Option value="_self">
        <Trans message="Same window" />
      </Option>
      <Option value="_blank">
        <Trans message="New window" />
      </Option>
    </FormSelect>
  );
}
