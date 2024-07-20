import {ReactNode, useContext} from 'react';
import clsx from 'clsx';
import {Button} from '../../../ui/buttons/button';
import {downloadFileFromUrl} from '../../utils/download-file-from-url';
import {FilePreviewContext} from '../file-preview-context';
import {Trans} from '../../../i18n/trans';
import {FilePreviewProps} from './file-preview-props';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';

interface Props extends FilePreviewProps {
  message?: ReactNode;
}
export function DefaultFilePreview({message, className, allowDownload}: Props) {
  const {entries, activeIndex} = useContext(FilePreviewContext);
  const activeEntry = entries[activeIndex];
  const content = message || <Trans message="No file preview available" />;
  const {downloadUrl} = useFileEntryUrls(activeEntry);
  return (
    <div
      className={clsx(
        className,
        'shadow bg-paper max-w-400 w-[calc(100%-40px)] text-center p-40 rounded'
      )}
    >
      <div className="text-lg">{content}</div>
      {allowDownload && (
        <div className="block mt-20 text-center">
          <Button
            variant="flat"
            color="primary"
            onClick={() => {
              if (downloadUrl) {
                downloadFileFromUrl(downloadUrl);
              }
            }}
          >
            <Trans message="Download" />
          </Button>
        </div>
      )}
    </div>
  );
}
