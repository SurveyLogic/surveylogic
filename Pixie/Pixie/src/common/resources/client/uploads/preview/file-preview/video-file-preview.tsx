import {useEffect, useRef, useState} from 'react';
import {FilePreviewProps} from './file-preview-props';
import {DefaultFilePreview} from './default-file-preview';
import {useFileEntryUrls} from '../../hooks/file-entry-urls';

export function VideoFilePreview(props: FilePreviewProps) {
  const {entry, className} = props;
  const {previewUrl} = useFileEntryUrls(entry);
  const ref = useRef<HTMLVideoElement>(null);
  const [mediaInvalid, setMediaInvalid] = useState(false);

  useEffect(() => {
    setMediaInvalid(!ref.current?.canPlayType(entry.mime));
  }, [entry]);

  if (mediaInvalid || !previewUrl) {
    return <DefaultFilePreview {...props} />;
  }

  return (
    <video
      className={className}
      ref={ref}
      controls
      controlsList="nodownload noremoteplayback"
      playsInline
      autoPlay
    >
      <source
        src={previewUrl}
        type={entry.mime}
        onError={() => {
          setMediaInvalid(true);
        }}
      />
    </video>
  );
}
