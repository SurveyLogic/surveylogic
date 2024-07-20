import {useEffect, useState} from 'react';
import clsx from 'clsx';
import {FilePreviewProps} from './file-preview-props';
import {DefaultFilePreview} from './default-file-preview';
import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {useFileEntryUrls} from '@common/uploads/hooks/file-entry-urls';
import {useTrans} from '@common/i18n/use-trans';
import {Trans} from '@common/i18n/trans';
import {apiClient} from '@common/http/query-client';

const FIVE_MB = 5242880;

export function TextFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {trans} = useTrans();
  const [tooLarge, setTooLarge] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [contents, setContents] = useState<string | null>(null);
  const {previewUrl} = useFileEntryUrls(entry);

  useEffect(() => {
    if (!entry) return;
    if (!previewUrl) {
      setIsFailed(true);
    } else if (entry.file_size! >= FIVE_MB) {
      setTooLarge(true);
      setIsLoading(false);
    } else {
      getFileContents(previewUrl)
        .then(response => {
          setContents(response.data);
        })
        .catch(() => {
          setIsFailed(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [entry, previewUrl]);

  if (isLoading) {
    return (
      <ProgressCircle
        isIndeterminate
        aria-label={trans({message: 'Loading file contents'})}
      />
    );
  }

  if (tooLarge) {
    return (
      <DefaultFilePreview
        {...props}
        message={<Trans message="This file is too large to preview." />}
      />
    );
  }

  if (isFailed) {
    return (
      <DefaultFilePreview
        {...props}
        message={<Trans message="There was an issue previewing this file" />}
      />
    );
  }

  return (
    <pre
      className={clsx(
        'rounded bg-paper p-20 text-sm whitespace-pre-wrap break-words h-full overflow-y-auto w-full',
        className
      )}
    >
      <div className="container mx-auto">{`${contents}`}</div>
    </pre>
  );
}

function getFileContents(src: string) {
  return apiClient.get(src, {
    responseType: 'text',
    // required for s3 presigned url to work
    withCredentials: false,
    headers: {
      Accept: 'text/plain',
    },
  });
}
