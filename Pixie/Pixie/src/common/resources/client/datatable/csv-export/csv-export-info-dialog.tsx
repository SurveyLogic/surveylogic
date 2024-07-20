import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {Button} from '../../ui/buttons/button';
import {Trans} from '../../i18n/trans';

export function CsvExportInfoDialog() {
  const {close} = useDialogContext();
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Csv export" />
      </DialogHeader>
      <DialogBody>
        <Trans
          message="Your request is being processed. We'll email you when the report is ready to download. In
            certain cases, it might take a little longer, depending on the number of items beings
            exported and the volume of activity."
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="flat" color="primary" onClick={close}>
          <Trans message="Got it" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
