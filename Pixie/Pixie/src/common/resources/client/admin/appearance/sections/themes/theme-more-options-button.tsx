import {Fragment, useState} from 'react';
import {DeleteIcon} from '../../../../icons/material/Delete';
import {ConfirmationDialog} from '../../../../ui/overlays/dialog/confirmation-dialog';
import {IconButton} from '../../../../ui/buttons/icon-button';
import {MoreVertIcon} from '../../../../icons/material/MoreVert';
import {RestartAltIcon} from '../../../../icons/material/RestartAlt';
import {appearanceState, AppearanceValues} from '../../appearance-store';
import {toast} from '../../../../ui/toast/toast';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../../../ui/navigation/menu/menu-trigger';
import {DialogTrigger} from '../../../../ui/overlays/dialog/dialog-trigger';
import {message} from '../../../../i18n/message';
import {Trans} from '../../../../i18n/trans';
import {useNavigate} from '../../../../utils/hooks/use-navigate';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {useParams} from 'react-router-dom';

export function ThemeMoreOptionsButton() {
  const navigate = useNavigate();
  const {themeIndex} = useParams();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const {setValue, getValues} = useFormContext<AppearanceValues>();
  const {fields, remove} = useFieldArray<AppearanceValues>({
    name: 'appearance.themes.all',
  });

  const deleteTheme = () => {
    if (fields.length <= 1) {
      toast.danger(message('At least one theme is required'));
      return;
    }
    if (themeIndex) {
      navigate('/admin/appearance/themes');
      remove(+themeIndex);
      setValue('appearance.themes.selectedThemeId', null);
    }
  };

  return (
    <Fragment>
      <MenuTrigger
        onItemSelected={key => {
          if (key === 'delete') {
            setConfirmDialogOpen(true);
          } else if (key === 'reset') {
            const path =
              `appearance.themes.all.${+themeIndex!}` as 'appearance.themes.all.0';
            const defaultColors = getValues(`${path}.is_dark`)
              ? appearanceState().defaults!.appearance.themes.dark
              : appearanceState().defaults!.appearance.themes.light;

            Object.entries(defaultColors).forEach(([colorName, themeValue]) => {
              appearanceState().preview.setThemeColor(colorName, themeValue);
            });

            setValue(`${path}.colors`, defaultColors, {
              shouldDirty: true,
            });
          }
        }}
      >
        <IconButton size="md" className="text-muted">
          <MoreVertIcon />
        </IconButton>
        <Menu>
          <MenuItem value="reset" startIcon={<RestartAltIcon />}>
            <Trans message="Reset colors" />
          </MenuItem>
          <MenuItem value="delete" startIcon={<DeleteIcon />}>
            <Trans message="Delete" />
          </MenuItem>
        </Menu>
      </MenuTrigger>
      <DialogTrigger
        type="modal"
        isOpen={confirmDialogOpen}
        onClose={isConfirmed => {
          if (isConfirmed) {
            deleteTheme();
          }
          setConfirmDialogOpen(false);
        }}
      >
        <ConfirmationDialog
          isDanger
          title={<Trans message="Delete theme" />}
          body={<Trans message="Are you sure you want to delete this theme?" />}
          confirm={<Trans message="Delete" />}
        />
      </DialogTrigger>
    </Fragment>
  );
}
