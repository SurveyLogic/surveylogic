import {AnimatePresence, m} from 'framer-motion';
import {Fragment, ReactNode, useContext, useMemo} from 'react';
import clsx from 'clsx';
import {getPreviewForEntry} from './available-previews';
import {FileEntry} from '../file-entry';
import {FilePreviewContext} from './file-preview-context';
import {IconButton} from '../../ui/buttons/icon-button';
import {ChevronLeftIcon} from '../../icons/material/ChevronLeft';
import {ChevronRightIcon} from '../../icons/material/ChevronRight';
import {FileDownloadIcon} from '../../icons/material/FileDownload';
import {downloadFileFromUrl} from '../utils/download-file-from-url';
import {useFileEntryUrls} from '../hooks/file-entry-urls';
import {Trans} from '../../i18n/trans';
import {Button} from '../../ui/buttons/button';
import {CloseIcon} from '../../icons/material/Close';
import {FileThumbnail} from '../file-type-icon/file-thumbnail';
import {useMediaQuery} from '../../utils/hooks/use-media-query';
import {KeyboardArrowLeftIcon} from '../../icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '../../icons/material/KeyboardArrowRight';
import {useControlledState} from '@react-stately/utils';
import {opacityAnimation} from '../../ui/animation/opacity-animation';

export interface FilePreviewContainerProps {
  entries: FileEntry[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onClose?: () => void;
  showHeader?: boolean;
  headerActionsLeft?: ReactNode;
  className?: string;
  allowDownload?: boolean;
}
export function FilePreviewContainer({
  entries,
  onClose,
  showHeader = true,
  className,
  headerActionsLeft,
  allowDownload = true,
  ...props
}: FilePreviewContainerProps) {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex || 0,
    props.onActiveIndexChange
  );

  const activeEntry = entries[activeIndex];
  const contextValue = useMemo(() => {
    return {entries, activeIndex};
  }, [entries, activeIndex]);
  const Preview = getPreviewForEntry(activeEntry);

  if (!activeEntry) {
    onClose?.();
    return null;
  }

  const canOpenNext = entries.length - 1 > activeIndex;
  const openNext = () => {
    setActiveIndex(activeIndex + 1);
  };
  const canOpenPrevious = activeIndex > 0;
  const openPrevious = () => {
    setActiveIndex(activeIndex - 1);
  };

  return (
    <FilePreviewContext.Provider value={contextValue}>
      {showHeader && (
        <Header
          actionsLeft={headerActionsLeft}
          isMobile={isMobile}
          onClose={onClose}
          onNext={canOpenNext ? openNext : undefined}
          onPrevious={canOpenPrevious ? openPrevious : undefined}
          allowDownload={allowDownload}
        />
      )}
      <div className={clsx('overflow-hidden relative flex-auto', className)}>
        {isMobile && (
          <IconButton
            size="lg"
            className="text-muted absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            disabled={!canOpenPrevious}
            onClick={openPrevious}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        )}
        <AnimatePresence initial={false}>
          <m.div
            className="absolute inset-0 flex items-center justify-center"
            key={activeEntry.id}
            {...opacityAnimation}
          >
            <Preview
              className="max-h-[calc(100%-30px)]"
              entry={activeEntry}
              allowDownload={allowDownload}
            />
          </m.div>
        </AnimatePresence>
        {isMobile && (
          <IconButton
            size="lg"
            className="text-muted absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            disabled={!canOpenNext}
            onClick={openNext}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        )}
      </div>
    </FilePreviewContext.Provider>
  );
}

interface HeaderProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  isMobile: boolean | null;
  actionsLeft?: ReactNode;
  allowDownload?: boolean;
}
function Header({
  onNext,
  onPrevious,
  onClose,
  isMobile,
  actionsLeft,
  allowDownload,
}: HeaderProps) {
  const {entries, activeIndex} = useContext(FilePreviewContext);
  const activeEntry = entries[activeIndex];
  const {downloadUrl} = useFileEntryUrls(activeEntry);

  const desktopDownloadButton = (
    <Button
      startIcon={<FileDownloadIcon />}
      variant="text"
      onClick={() => {
        if (downloadUrl) {
          downloadFileFromUrl(downloadUrl);
        }
      }}
    >
      <Trans message="Download" />
    </Button>
  );

  const mobileDownloadButton = (
    <IconButton
      onClick={() => {
        if (downloadUrl) {
          downloadFileFromUrl(downloadUrl);
        }
      }}
    >
      <FileDownloadIcon />
    </IconButton>
  );

  const downloadButton = isMobile
    ? mobileDownloadButton
    : desktopDownloadButton;

  return (
    <div className="flex items-center justify-between gap-20 bg-paper border-b flex-shrink-0 text-sm min-h-50 px-10 text-muted">
      <div className="flex items-center gap-4 w-1/3 justify-start">
        {actionsLeft}
        {allowDownload ? downloadButton : undefined}
      </div>
      <div className="flex items-center gap-10 w-1/3 justify-center flex-nowrap text-main">
        <FileThumbnail
          file={activeEntry}
          iconClassName="w-16 h-16"
          showImage={false}
        />
        <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
          {activeEntry.name}
        </div>
      </div>
      <div className="w-1/3 flex items-center gap-10 justify-end whitespace-nowrap">
        {!isMobile && (
          <Fragment>
            <IconButton disabled={!onPrevious} onClick={onPrevious}>
              <ChevronLeftIcon />
            </IconButton>
            <div>{activeIndex + 1}</div>
            <div>/</div>
            <div>{entries.length}</div>
            <IconButton disabled={!onNext} onClick={onNext}>
              <ChevronRightIcon />
            </IconButton>
            <div className="bg-divider w-1 h-24 mx-20" />
          </Fragment>
        )}
        <IconButton radius="rounded-none" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}
