import {useControlledState} from '@react-stately/utils';
import React, {Fragment, useState} from 'react';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import clsx from 'clsx';
import {produce} from 'immer';
import {Permission, PermissionRestriction} from '../permission';
import {useValueLists} from '../../http/value-lists';
import {ucFirst} from '../../utils/string/uc-first';
import {Accordion, AccordionItem} from '../../ui/accordion/accordion';
import {List, ListItem} from '../../ui/list/list';
import {Switch} from '../../ui/forms/toggle/switch';
import {TextField} from '../../ui/forms/input-field/text-field/text-field';
import {DoneAllIcon} from '../../icons/material/DoneAll';
import {Trans} from '../../i18n/trans';

interface PermissionSelectorProps {
  value?: Permission[];
  onChange?: (value: Permission[]) => void;
  valueListKey?: 'permissions' | 'workspacePermissions';
}
export const PermissionSelector = React.forwardRef<
  HTMLDivElement,
  PermissionSelectorProps
>(({valueListKey = 'permissions', ...props}, ref) => {
  const {data} = useValueLists([valueListKey]);
  const permissions = data?.permissions || data?.workspacePermissions;

  const [value, setValue] = useControlledState(props.value, [], props.onChange);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!permissions) return null;

  const groupedPermissions = buildPermissionList(
    permissions,
    value,
    showAdvanced
  );

  const onRestrictionChange = (newPermission: Permission) => {
    const newValue = [...value];
    const index = newValue.findIndex(p => p.id === newPermission.id);
    if (index > -1) {
      newValue.splice(index, 1, newPermission);
    }
    setValue(newValue);
  };

  return (
    <Fragment>
      <Accordion variant="outline" ref={ref}>
        {groupedPermissions.map(({groupName, items, anyChecked}) => (
          <AccordionItem
            label={<Trans message={prettyName(groupName)} />}
            key={groupName}
            startIcon={anyChecked ? <DoneAllIcon size="sm" /> : undefined}
          >
            <List>
              {items.map(permission => {
                const index = value.findIndex(v => v.id === permission.id);
                const isChecked = index > -1;

                return (
                  <div key={permission.id}>
                    <ListItem
                      onSelected={() => {
                        if (isChecked) {
                          const newValue = [...value];
                          newValue.splice(index, 1);
                          setValue(newValue);
                        } else {
                          setValue([...value, permission]);
                        }
                      }}
                      endSection={
                        <Switch
                          tabIndex={-1}
                          checked={isChecked}
                          onChange={() => {}}
                        />
                      }
                      description={<Trans message={permission.description} />}
                    >
                      <Trans
                        message={permission.display_name || permission.name}
                      />
                    </ListItem>
                    {isChecked && (
                      <Restrictions
                        permission={permission}
                        onChange={onRestrictionChange}
                      />
                    )}
                  </div>
                );
              })}
            </List>
          </AccordionItem>
        ))}
      </Accordion>
      <Switch
        className="mt-30"
        checked={showAdvanced}
        onChange={e => {
          setShowAdvanced(e.target.checked);
        }}
      >
        <Trans message="Show advanced permissions" />
      </Switch>
    </Fragment>
  );
});

interface RestrictionsProps {
  permission: Permission;
  onChange?: (newPermission: Permission) => void;
}
function Restrictions({permission, onChange}: RestrictionsProps) {
  if (!permission?.restrictions?.length) return null;

  const setRestrictionValue = (
    name: string,
    value: PermissionRestriction['value']
  ) => {
    const nextState = produce(permission, draftState => {
      const restriction = draftState.restrictions.find(r => r.name === name);
      if (restriction) {
        restriction.value = value;
      }
    });
    onChange?.(nextState);
  };

  return (
    <div className="px-40 py-20">
      {permission.restrictions.map((restriction, index) => {
        const isLast = index === permission.restrictions.length - 1;

        const name = <Trans message={prettyName(restriction.name)} />;
        const description = restriction.description ? (
          <Trans message={restriction.description} />
        ) : undefined;

        if (restriction.type === 'bool') {
          return (
            <Switch
              description={description}
              key={restriction.name}
              className={clsx(!isLast && 'mb-30')}
              checked={Boolean(restriction.value)}
              onChange={e => {
                setRestrictionValue(restriction.name, e.target.checked);
              }}
            >
              {name}
            </Switch>
          );
        }

        return (
          <TextField
            size="sm"
            label={name}
            description={description}
            type="number"
            key={restriction.name}
            className={clsx(!isLast && 'mb-30')}
            value={(restriction.value as string) || ''}
            onChange={e => {
              setRestrictionValue(
                restriction.name,
                e.target.value === '' ? undefined : parseInt(e.target.value)
              );
            }}
          />
        );
      })}
    </div>
  );
}

export type FormChipFieldProps = PermissionSelectorProps & {
  name: string;
};
export function FormPermissionSelector(props: FormChipFieldProps) {
  const {
    field: {onChange, value = [], ref},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<PermissionSelectorProps> = {
    onChange,
    value,
  };

  return <PermissionSelector ref={ref} {...mergeProps(formProps, props)} />;
}

export const prettyName = (name: string) => {
  return ucFirst(name.replace('_', ' '));
};

interface PermissionGroup {
  groupName: string;
  anyChecked: boolean;
  items: Permission[];
}

// merge "restrictions" from selected value into all permissions to make
// it easier to bind restriction values to form inputs
export function buildPermissionList(
  allPermissions: Permission[],
  selectedPermissions: Permission[],
  showAdvanced: boolean
) {
  const groupedPermissions: PermissionGroup[] = [];

  allPermissions.forEach(permission => {
    const index = selectedPermissions.findIndex(p => p.id === permission.id);
    if (!showAdvanced && permission.advanced) return;

    let group: PermissionGroup | undefined = groupedPermissions.find(
      g => g.groupName === permission.group
    );
    if (!group) {
      group = {groupName: permission.group, anyChecked: false, items: []};
      groupedPermissions.push(group);
    }

    if (index > -1) {
      const mergedPermission = {
        ...permission,
        restrictions: mergeRestrictions(
          permission.restrictions,
          selectedPermissions[index].restrictions
        ),
      };
      group.anyChecked = true;
      group.items.push(mergedPermission);
    } else {
      group.items.push(permission);
    }
  });

  return groupedPermissions;
}

function mergeRestrictions(
  allRestrictions: PermissionRestriction[],
  selectedRestrictions: PermissionRestriction[]
): PermissionRestriction[] {
  return allRestrictions?.map(restriction => {
    const selected = selectedRestrictions.find(
      r => r.name === restriction.name
    );
    if (selected) {
      return {...restriction, value: selected.value};
    } else {
      return restriction;
    }
  });
}
