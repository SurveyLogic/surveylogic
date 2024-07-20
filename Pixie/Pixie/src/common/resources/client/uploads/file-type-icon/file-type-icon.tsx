import clsx from 'clsx';
import {DefaultFileIcon} from './icons/default-file-icon';
import {AudioFileIcon} from './icons/audio-file-icon';
import {VideoFileIcon} from './icons/video-file-icon';
import {TextFileIcon} from './icons/text-file-icon';
import {PdfFileIcon} from './icons/pdf-file-icon';
import {ArchiveFileIcon} from './icons/archive-file-icon';
import {FolderFileIcon} from './icons/folder-file-icon';
import {ImageFileIcon} from './icons/image-file-icon';
import {PowerPointFileIcon} from './icons/power-point-file-icon';
import {WordFileIcon} from './icons/word-file-icon';
import {SpreadsheetFileIcon} from './icons/spreadsheet-file-icon';
import {SharedFolderFileIcon} from './icons/shared-folder-file-icon';

interface Props {
  type?: string;
  mime?: string | null;
  className?: string;
}
export function FileTypeIcon({type, mime, className}: Props) {
  if (!type && mime) {
    type = mime.split('/')[0];
  }
  // @ts-ignore
  const Icon = FileTypeIcons[type] || FileTypeIcons.default;
  return (
    <Icon
      className={clsx(className, `${type}-file-color`)}
      viewBox="0 0 64 64"
    />
  );
}

const FileTypeIcons = {
  default: DefaultFileIcon,
  audio: AudioFileIcon,
  video: VideoFileIcon,
  text: TextFileIcon,
  pdf: PdfFileIcon,
  archive: ArchiveFileIcon,
  folder: FolderFileIcon,
  sharedFolder: SharedFolderFileIcon,
  image: ImageFileIcon,
  powerPoint: PowerPointFileIcon,
  word: WordFileIcon,
  spreadsheet: SpreadsheetFileIcon,
};
