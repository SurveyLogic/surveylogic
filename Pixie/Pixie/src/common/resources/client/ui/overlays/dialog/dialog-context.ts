import React, {ComponentPropsWithRef, useContext} from 'react';

export type DialogType = 'modal' | 'popover' | 'tray';

export interface DialogContextValue {
  labelId: string;
  descriptionId: string;
  type: DialogType;
  isDismissable?: boolean;
  close: (value?: any) => void;
  formId: string;
  dialogProps: ComponentPropsWithRef<'div'>;
  disableInitialTransition?: boolean;
}

export const DialogContext = React.createContext<DialogContextValue>(null!);

export function useDialogContext() {
  return useContext(DialogContext);
}
