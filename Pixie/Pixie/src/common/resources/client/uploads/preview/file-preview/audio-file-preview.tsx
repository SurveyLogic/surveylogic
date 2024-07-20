import {FilePreviewProps} from './file-preview-props';
import {DefaultFilePreview} from './default-file-preview';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';
import {useEffect, useRef, useState} from 'react';

export function AudioFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {previewUrl} = useFileEntryUrls(entry);
  const ref = useRef<HTMLAudioElement>(null);
  const [mediaInvalid, setMediaInvalid] = useState(false);

  useEffect(() => {
    setMediaInvalid(!ref.current?.canPlayType(entry.mime));
  }, [entry]);

  if (mediaInvalid || !previewUrl) {
    return <DefaultFilePreview {...props} />;
  }

  return (
    <audio
      className={className}
      ref={ref}
      controls
      controlsList="nodownload noremoteplayback"
      autoPlay
    >
      <source
        src={previewUrl}
        type={entry.mime}
        onError={() => {
          setMediaInvalid(true);
        }}
      />
    </audio>
  );
}
