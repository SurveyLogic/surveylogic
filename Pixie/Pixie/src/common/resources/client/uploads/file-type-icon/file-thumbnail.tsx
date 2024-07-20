import clsx from 'clsx';
import {FileTypeIcon} from './file-type-icon';
import {useFileEntryUrls} from '../hooks/file-entry-urls';
import {useTrans} from '../../i18n/use-trans';
import {FileEntry} from '../file-entry';

const TwoMB = 2 * 1024 * 1024;

interface Props {
  file: FileEntry;
  className?: string;
  iconClassName?: string;
  showImage?: boolean;
}
export function FileThumbnail({
  file,
  className,
  iconClassName,
  showImage = true,
}: Props) {
  const {trans} = useTrans();
  const {previewUrl} = useFileEntryUrls(file, {thumbnail: true});

  // don't show images for files larger than 2MB, if thumbnail was not generated to avoid ui lag
  if (file.file_size && file.file_size > TwoMB && !file.thumbnail) {
    showImage = false;
  }

  if (showImage && file.type === 'image' && previewUrl) {
    const alt = trans({
      message: ':fileName thumbnail',
      values: {fileName: file.name},
    });
    return (
      <img
        className={clsx(className, 'object-cover')}
        src={previewUrl}
        alt={alt}
        draggable={false}
      />
    );
  }
  return <FileTypeIcon className={iconClassName} type={file.type} />;
}
