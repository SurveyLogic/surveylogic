import {AppearanceButton} from '../../appearance-button';
import {DialogTrigger} from '../../../../ui/overlays/dialog/dialog-trigger';
import {Trans} from '../../../../i18n/trans';
import {useFormContext} from 'react-hook-form';
import {appearanceState, AppearanceValues} from '../../appearance-store';
import {AceDialog} from '../../../../ace-editor/ace-dialog';
import {Fragment} from 'react';

export function CustomCodeSection() {
  return (
    <Fragment>
      <CustomCodeDialogTrigger mode="css" />
      <CustomCodeDialogTrigger mode="html" />
    </Fragment>
  );
}

interface CustomCodeDialogTriggerProps {
  mode: 'html' | 'css';
}
function CustomCodeDialogTrigger({mode}: CustomCodeDialogTriggerProps) {
  const {getValues} = useFormContext<AppearanceValues>();
  const {setValue} = useFormContext<AppearanceValues>();

  const title =
    mode === 'html' ? (
      <Trans message="Custom HTML & JavaScript" />
    ) : (
      <Trans message="Custom CSS" />
    );

  return (
    <DialogTrigger
      type="modal"
      onClose={newValue => {
        if (newValue != null) {
          setValue(`appearance.custom_code.${mode}`, newValue, {
            shouldDirty: true,
          });
          appearanceState().preview.setCustomCode(mode, newValue);
        }
      }}
    >
      <AppearanceButton>{title}</AppearanceButton>
      <AceDialog
        title={title}
        defaultValue={getValues(`appearance.custom_code.${mode}`) || ''}
        mode={mode}
      />
    </DialogTrigger>
  );
}
