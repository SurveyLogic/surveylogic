import clsx from 'clsx';
import {FilePreviewProps} from './file-preview-props';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';
import {useTrans} from '../../../i18n/use-trans';
import {DefaultFilePreview} from './default-file-preview';

export function PdfFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {trans} = useTrans();
  const {previewUrl} = useFileEntryUrls(entry);

  if (!previewUrl) {
    return <DefaultFilePreview {...props} />;
  }

  return (
    <iframe
      title={trans({
        message: 'Preview for :name',
        values: {name: entry.name},
      })}
      className={clsx(className, 'w-full h-full')}
      src={`${previewUrl}#toolbar=0`}
    />
  );
}
