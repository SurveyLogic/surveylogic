import {useForm, useFormContext} from 'react-hook-form';
import {useEffect} from 'react';
import {TuneIcon} from '../../../../icons/material/Tune';
import {Button} from '../../../../ui/buttons/button';
import {CssTheme} from '../../../../ui/themes/css-theme';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {FormSwitch} from '../../../../ui/forms/toggle/switch';
import {AppearanceValues} from '../../appearance-store';
import {DialogTrigger} from '../../../../ui/overlays/dialog/dialog-trigger';
import {DialogFooter} from '../../../../ui/overlays/dialog/dialog-footer';
import {useDialogContext} from '../../../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../../../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../../../../ui/overlays/dialog/dialog-body';
import {Trans} from '../../../../i18n/trans';
import {Form} from '../../../../ui/forms/form';
import {useParams} from 'react-router-dom';

export function ThemeSettingsDialogTrigger() {
  const {getValues, setValue} = useFormContext<AppearanceValues>();
  const {themeIndex} = useParams();
  const theme = getValues(`appearance.themes.all.${+themeIndex!}`);

  return (
    <DialogTrigger
      type="modal"
      onClose={(value?: CssTheme) => {
        if (!value) return;

        getValues('appearance.themes.all').forEach((currentTheme, index) => {
          // update changed theme
          if (currentTheme.id === value.id) {
            setValue(`appearance.themes.all.${index}`, value, {
              shouldDirty: true,
            });
            return;
          }

          // unset "default_light" and "default_dark" on other themes
          if (value.default_light) {
            setValue(
              `appearance.themes.all.${index}`,
              {...currentTheme, default_light: false},
              {shouldDirty: true}
            );
            return;
          }
          if (value.default_dark) {
            setValue(
              `appearance.themes.all.${index}`,
              {...currentTheme, default_dark: false},
              {shouldDirty: true}
            );
            return;
          }
        });
      }}
    >
      <Button
        size="xs"
        variant="outline"
        color="primary"
        startIcon={<TuneIcon />}
      >
        <Trans message="Settings" />
      </Button>
      <SettingsDialog theme={theme} />
    </DialogTrigger>
  );
}

interface SettingsDialogProps {
  theme: CssTheme;
}
function SettingsDialog({theme}: SettingsDialogProps) {
  const form = useForm<CssTheme>({defaultValues: theme});
  const {close, formId} = useDialogContext();

  useEffect(() => {
    const subscription = form.watch((value, {name}) => {
      // theme can only be set as either light or dark default
      if (name === 'default_light' && value.default_light) {
        form.setValue('default_dark', false);
      }
      if (name === 'default_dark' && value.default_dark) {
        form.setValue('default_light', false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Update settings" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={values => {
            close(values);
          }}
        >
          <FormTextField
            name="name"
            label={<Trans message="Name" />}
            className="mb-30"
            autoFocus
          />
          <FormSwitch
            name="is_dark"
            className="mb-20 pb-20 border-b"
            description={
              <Trans message="Whether this theme has light text on dark background." />
            }
          >
            <Trans message="Dark theme" />
          </FormSwitch>
          <FormSwitch
            name="default_light"
            className="mb-30"
            description={
              <Trans message="When light mode is selected, this theme will be used." />
            }
          >
            <Trans message="Default for light mode" />
          </FormSwitch>
          <FormSwitch
            name="default_dark"
            description={
              <Trans message="When dark mode is selected, this theme will be used." />
            }
          >
            <Trans message="Default for dark mode" />
          </FormSwitch>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={() => {
            close();
          }}
        >
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={!form.formState.isDirty}
        >
          <Trans message="Save" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
