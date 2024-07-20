import clsx from 'clsx';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';
import {useTrans} from '../../../i18n/use-trans';
import {FilePreviewProps} from './file-preview-props';
import {DefaultFilePreview} from './default-file-preview';

export function ImageFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {trans} = useTrans();
  const {previewUrl} = useFileEntryUrls(entry);

  if (!previewUrl) {
    return <DefaultFilePreview {...props} />;
  }

  return (
    <img
      className={clsx(className, 'shadow')}
      src={previewUrl}
      alt={trans({
        message: 'Preview for :name',
        values: {name: entry.name},
      })}
    />
  );
}
