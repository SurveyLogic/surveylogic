import React, {ReactNode, Suspense, useState} from 'react';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {Trans} from '../i18n/trans';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {ProgressCircle} from '../ui/progress/progress-circle';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {DialogFooter} from '../ui/overlays/dialog/dialog-footer';
import {Button} from '../ui/buttons/button';

const AceEditor = React.lazy(() => import('./ace-editor'));

interface TextEditorSourcecodeDialogProps {
  defaultValue: string;
  mode?: 'css' | 'html';
  title: ReactNode;
}
export function AceDialog({
  defaultValue,
  mode = 'html',
  title,
}: TextEditorSourcecodeDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState<boolean>(true);

  return (
    <Dialog size="fullscreen" className="h-full w-full">
      <DialogHeader>{title}</DialogHeader>
      <DialogBody className="relative flex-auto" padding="p-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-400">
              <ProgressCircle
                aria-label="Loading editor..."
                isIndeterminate
                size="md"
              />
            </div>
          }
        >
          <AceEditor
            mode={mode}
            onChange={newValue => {
              setValue(newValue);
            }}
            defaultValue={value || ''}
            onIsValidChange={setIsValid}
          />
        </Suspense>
      </DialogBody>
      <Footer isValid={isValid} value={value} />
    </Dialog>
  );
}

interface FooterProps {
  isValid: boolean;
  value?: string;
}
function Footer({isValid, value}: FooterProps) {
  const {close} = useDialogContext();
  return (
    <DialogFooter dividerTop>
      <Button onClick={() => close()}>
        <Trans message="Cancel" />
      </Button>
      <Button
        disabled={!isValid}
        variant="flat"
        color="primary"
        onClick={() => {
          close(value);
        }}
      >
        <Trans message="Save" />
      </Button>
    </DialogFooter>
  );
}
