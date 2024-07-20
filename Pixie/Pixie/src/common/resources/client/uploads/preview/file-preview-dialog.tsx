import {
  FilePreviewContainer,
  FilePreviewContainerProps,
} from './file-preview-container';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../ui/overlays/dialog/dialog';

interface Props extends Omit<FilePreviewContainerProps, 'onClose'> {}
export function FilePreviewDialog(props: Props) {
  return (
    <Dialog
      size="fullscreenTakeover"
      background="bg-alt"
      className="flex flex-col"
    >
      <Content {...props} />
    </Dialog>
  );
}

function Content(props: Props) {
  const {close} = useDialogContext();
  return <FilePreviewContainer onClose={close} {...props} />;
}
