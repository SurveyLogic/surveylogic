import {useNavigate, useParams} from 'react-router-dom';
import {Fragment, useEffect, useState} from 'react';
import {appearanceState, AppearanceValues} from '../../appearance-store';
import {AppearanceButton} from '../../appearance-button';
import {ColorIcon} from './color-icon';
import {CssTheme} from '../../../../ui/themes/css-theme';
import {colorToThemeValue} from '../../../../ui/themes/utils/color-to-theme-value';
import {themeValueToHex} from '../../../../ui/themes/utils/theme-value-to-hex';
import {ThemeSettingsDialogTrigger} from './theme-settings-dialog-trigger';
import {ThemeMoreOptionsButton} from './theme-more-options-button';
import {ColorPickerDialog} from '../../../../ui/color-picker/color-picker-dialog';
import {DialogTrigger} from '../../../../ui/overlays/dialog/dialog-trigger';
import {useFormContext} from 'react-hook-form';

export function ThemeEditor() {
  const navigate = useNavigate();
  const {themeIndex} = useParams();
  const {getValues} = useFormContext<AppearanceValues>();

  const theme = getValues(`appearance.themes.all.${+themeIndex!}`);

  // go to theme list, if theme can't be found
  useEffect(() => {
    if (!theme) {
      navigate('/admin/appearance/themes');
    }
  }, [navigate, theme]);

  // select theme in preview on initial render
  useEffect(() => {
    if (theme?.id) {
      appearanceState().preview.setActiveTheme(theme.id);
    }
  }, [theme?.id]);

  if (!theme) return null;

  return (
    <Fragment>
      <div className="mb-20 flex items-center gap-10 justify-between">
        <ThemeSettingsDialogTrigger />
        <ThemeMoreOptionsButton />
      </div>
      <div>
        {Object.entries(theme.colors)
          .filter(([name]) => !name.endsWith('opacity'))
          .map(([name, value]) => (
            <ColorPickerTrigger
              key={name}
              colorName={name}
              initialThemeValue={value}
              theme={theme}
            />
          ))}
      </div>
    </Fragment>
  );
}

interface ColorPickerTriggerProps {
  theme: CssTheme;
  colorName: string;
  initialThemeValue: string;
}
function ColorPickerTrigger({
  theme,
  colorName,
  initialThemeValue,
}: ColorPickerTriggerProps) {
  const {setValue} = useFormContext<AppearanceValues>();
  const {themeIndex} = useParams();
  const [selectedThemeValue, setSelectedThemeValue] =
    useState<string>(initialThemeValue);

  // set color as css variable in preview and on button preview, but not in appearance values
  // this way color change can be canceled when color picker is closed and applied explicitly via apply button
  const selectThemeValue = (themeValue: string) => {
    setSelectedThemeValue(themeValue);
    appearanceState().preview.setThemeColor(colorName, themeValue);
  };

  useEffect(() => {
    // need to update the color here so changes via "reset colors" button are reflected
    setSelectedThemeValue(initialThemeValue);
  }, [initialThemeValue]);

  const initialThemeValueHex = themeValueToHex(initialThemeValue);

  return (
    <DialogTrigger
      currentValue={initialThemeValueHex}
      type="popover"
      placement="right"
      offset={10}
      onClose={newColor => {
        if (newColor && newColor !== initialThemeValueHex) {
          setValue(
            `appearance.themes.all.${+themeIndex!}.colors.${colorName}`,
            selectedThemeValue,
            {shouldDirty: true}
          );
          setValue('appearance.themes.selectedThemeId', theme.id);
        } else {
          // reset to initial value, if apply button was not clicked
          selectThemeValue(initialThemeValue);
        }
      }}
    >
      <AppearanceButton
        className="capitalize"
        startIcon={
          <ColorIcon
            viewBox="0 0 48 48"
            className="icon-lg"
            style={{fill: `rgb(${selectedThemeValue})`}}
          />
        }
      >
        {colorName.replace('--be-', '').replace('-', ' ')}
      </AppearanceButton>
      <ColorPickerDialog
        defaultValue={initialThemeValueHex}
        onChange={color => {
          selectThemeValue(colorToThemeValue(color));
        }}
      />
    </DialogTrigger>
  );
}
