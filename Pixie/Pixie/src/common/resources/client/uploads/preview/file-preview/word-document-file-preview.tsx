import clsx from 'clsx';
import {useEffect, useRef, useState} from 'react';
import {FilePreviewProps} from './file-preview-props';
import {DefaultFilePreview} from './default-file-preview';
import {ProgressCircle} from '../../../ui/progress/progress-circle';
import {FileEntry} from '../../file-entry';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';
import {useTrans} from '../../../i18n/use-trans';
import {apiClient} from '../../../http/query-client';

export function WordDocumentFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {trans} = useTrans();
  const ref = useRef<HTMLIFrameElement>(null);
  const [showDefault, setShowDefault] = useState(false);
  const timeoutId = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {previewUrl} = useFileEntryUrls(entry);

  useEffect(() => {
    // Google Docs viewer only supports files up to 25MB
    if (!previewUrl) {
      setShowDefault(true);
    } else if (entry.file_size && entry.file_size > 25000000) {
      setShowDefault(true);
    } else if (ref.current) {
      ref.current.onload = () => {
        clearTimeout(timeoutId.current);
        setIsLoading(false);
      };

      buildPreviewUrl(previewUrl, entry).then(url => {
        if (ref.current) {
          ref.current.src = url;
        }
      });

      // if preview iframe is not loaded
      // after 5 seconds, bail and show default preview
      timeoutId.current = setTimeout(() => {
        setShowDefault(true);
      }, 5000);
    }
  }, [entry, previewUrl]);

  if (showDefault) {
    return <DefaultFilePreview {...props} />;
  }

  return (
    <div className={clsx(className, 'w-full h-full')}>
      {isLoading && <ProgressCircle />}
      <iframe
        ref={ref}
        title={trans({
          message: 'Preview for :name',
          values: {name: entry.name},
        })}
        className={clsx('w-full h-full', isLoading && 'hidden')}
      />
    </div>
  );
}

async function buildPreviewUrl(
  urlString: string,
  entry: FileEntry
): Promise<string> {
  const url = new URL(urlString);
  // if we're not trying to preview shareable link we will need to generate
  // preview token, otherwise it won't be publicly accessible
  if (!url.searchParams.has('shareable_link')) {
    const {data} = await apiClient.post(
      `file-entries/${entry.id}/add-preview-token`
    );
    url.searchParams.append('preview_token', data.preview_token);
  }

  return buildOfficeLivePreviewUrl(url);
}

function buildOfficeLivePreviewUrl(url: URL) {
  // https://docs.google.com/gview?embedded=true&url=
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    url.toString()
  )}`;
}
