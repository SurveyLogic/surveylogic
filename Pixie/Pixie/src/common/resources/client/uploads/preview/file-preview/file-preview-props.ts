import {FileEntry} from '../../file-entry';

export interface FilePreviewProps {
  entry: FileEntry;
  className?: string;
  allowDownload?: boolean;
}
