import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from 'react-hook-form';
import {Fragment, useEffect, useMemo, useRef} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {MenuSectionConfig} from '../../types/appearance-editor-config';
import {MenuItemConfig} from '@common/core/settings/settings';
import {
  appearanceState,
  AppearanceValues,
  useAppearanceStore,
} from '../../appearance-store';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Button} from '@common/ui/buttons/button';
import {AddMenuItemDialog} from '@common/admin/appearance/sections/menus/add-menu-item-dialog';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {AddIcon} from '@common/icons/material/Add';
import {DragIndicatorIcon} from '@common/icons/material/DragIndicator';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import {SvgImage} from '@common/ui/images/svg-image/svg-image';
import {DeleteIcon} from '@common/icons/material/Delete';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Option} from '../../../../ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import dropdownMenu from './dropdown-menu.svg';
import {FormChipField} from '@common/ui/forms/input-field/chip-field/form-chip-field';
import {
  useSortable,
  UseSortableProps,
} from '@common/ui/interactions/dnd/use-sortable';
import {IconButton} from '@common/ui/buttons/icon-button';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {useSettings} from '@common/core/settings/use-settings';

export function MenuEditor() {
  const {menuIndex} = useParams();
  const navigate = useNavigate();

  const {getValues} = useFormContext<AppearanceValues>();
  const formPath = `settings.menus.${menuIndex!}` as 'settings.menus.0';
  const menu = getValues(formPath);

  useEffect(() => {
    // go to menu list, if menu can't be found
    if (!menu) {
      navigate('/admin/appearance/menus');
    } else {
      appearanceState().preview.setHighlight(`[data-menu-id="${menu.id}"]`);
    }
  }, [navigate, menu]);

  if (!menu) {
    return null;
  }

  return <MenuEditorSection formPath={formPath} />;
}

interface MenuEditorFormProps {
  formPath: 'settings.menus.0';
}
function MenuEditorSection({formPath}: MenuEditorFormProps) {
  const {
    site: {has_mobile_app},
  } = useSettings();
  const menuSectionConfig = useAppearanceStore(
    s => s.config?.sections.menus.config
  ) as MenuSectionConfig;

  const menuPositions = useMemo(() => {
    const positions = [...menuSectionConfig?.positions];
    if (has_mobile_app) {
      positions.push('mobile-app-about');
    }
    return positions.map(position => ({
      key: position,
      name: position.replaceAll('-', ' '),
    }));
  }, [menuSectionConfig, has_mobile_app]);

  const fieldArray = useFieldArray<
    AppearanceValues,
    `settings.menus.0.items`,
    'key'
  >({
    name: `${formPath}.items`,
    keyName: 'key',
  });

  return (
    <Fragment>
      <div className="mb-30 pb-30 border-b">
        <FormTextField
          name={`${formPath}.name`}
          label={<Trans message="Menu name" />}
          className="mb-20"
          autoFocus
        />
        <FormChipField
          chipSize="sm"
          name={`${formPath}.positions`}
          valueKey="id"
          label={<Trans message="Menu positions" />}
          description={
            <Trans message="Where should this menu appear on the site" />
          }
        >
          {menuPositions.map(item => (
            <Option key={item.key} value={item.key} capitalizeFirst>
              {item.name}
            </Option>
          ))}
        </FormChipField>
      </div>
      <MenuItemsManager fieldArray={fieldArray} />
      <div className="text-right">
        <DeleteMenuTrigger />
      </div>
    </Fragment>
  );
}

interface ItemListProps {
  fieldArray: UseFieldArrayReturn<
    AppearanceValues,
    'settings.menus.0.items',
    'key'
  >;
}
function MenuItemsManager({fieldArray: {append, fields, move}}: ItemListProps) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <div className="flex items-center gap-16 justify-between flex-shrink-0">
        <Trans message="Menu items" />
        <DialogTrigger
          type="popover"
          placement="right"
          offset={20}
          onClose={(menuItemConfig?: MenuItemConfig) => {
            if (menuItemConfig) {
              append({...menuItemConfig});
              navigate(`items/${fields.length}`);
            }
          }}
        >
          <Button
            variant="outline"
            color="primary"
            size="xs"
            startIcon={<AddIcon />}
          >
            <Trans message="Add" />
          </Button>
          <AddMenuItemDialog />
        </DialogTrigger>
      </div>
      <div className="mt-20 flex-shrink-0">
        {fields.map((item, index) => (
          <MenuListItem
            key={item.key}
            item={item}
            items={fields}
            index={index}
            onSortEnd={(oldIndex, newIndex) => {
              move(oldIndex, newIndex);
            }}
          />
        ))}
        {!fields.length ? (
          <IllustratedMessage
            size="xs"
            className="my-40"
            image={<SvgImage src={dropdownMenu} />}
            title={<Trans message="No menu items yet" />}
            description={
              <Trans message="Click “add“ button to start adding links, pages, routes and other items to this menu. " />
            }
          />
        ) : null}
      </div>
    </Fragment>
  );
}

function DeleteMenuTrigger() {
  const navigate = useNavigate();
  const {menuIndex} = useParams();
  const {fields, remove} = useFieldArray<
    AppearanceValues,
    'settings.menus',
    'key'
  >({
    name: 'settings.menus',
    keyName: 'key',
  });
  if (!menuIndex) return null;
  const menu = fields[+menuIndex];

  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          const index = fields.findIndex(m => m.id === menu.id);
          remove(index);
          navigate('/admin/appearance/menus');
        }
      }}
    >
      <Button
        variant="outline"
        color="danger"
        size="xs"
        startIcon={<DeleteIcon />}
      >
        <Trans message="Delete menu" />
      </Button>
      <ConfirmationDialog
        isDanger
        title={<Trans message="Delete menu" />}
        body={
          <Trans
            message="Are you sure you want to delete “:name“?"
            values={{name: menu.name}}
          />
        }
        confirm={<Trans message="Delete" />}
      />
    </DialogTrigger>
  );
}

interface MenuListItemProps {
  item: MenuItemConfig;
  items: FieldArrayWithId[];
  index: number;
  onSortEnd: UseSortableProps['onSortEnd'];
}
function MenuListItem({item, items, index, onSortEnd}: MenuListItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const {sortableProps, dragHandleRef} = useSortable({
    item,
    items,
    type: 'menuEditorSortable',
    ref,
    onSortEnd,
    previewVariant: 'liveSort',
  });

  const Icon = item.icon && createSvgIconFromTree(item.icon);
  const iconOnlyLabel = (
    <div className="text-muted flex items-center gap-4 text-xs">
      {Icon && <Icon size="sm" />}
      (<Trans message="No label..." />)
    </div>
  );

  return (
    <Fragment>
      <AppearanceButton
        elementType={Link}
        to={`items/${index}`}
        ref={ref}
        {...sortableProps}
      >
        <div className="flex items-center gap-10">
          <IconButton ref={dragHandleRef} size="sm">
            <DragIndicatorIcon className="text-muted hover:cursor-move" />
          </IconButton>
          <div>{item.label || iconOnlyLabel}</div>
        </div>
      </AppearanceButton>
    </Fragment>
  );
}
