import React from 'react';
import {useDialogContext} from './dialog-context';
import {Dialog} from './dialog';
import {DialogBody} from './dialog-body';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CloseIcon} from '@common/icons/material/Close';
import {KeyboardArrowLeftIcon} from '@common/icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '@common/icons/material/KeyboardArrowRight';
import {useControlledState} from '@react-stately/utils';

interface Props {
  image?: string;
  images?: string[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  defaultActiveIndex?: number;
}
export function ImageZoomDialog(props: Props) {
  const {close} = useDialogContext();
  const {image, images} = props;
  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex,
    props.onActiveIndexChange
  );
  const src = image || images?.[activeIndex];

  return (
    <Dialog size="fullscreenTakeover" background="bg-black/80">
      <DialogBody padding="p-0" className="w-full h-full">
        <IconButton
          size="lg"
          color="paper"
          className="absolute top-0 right-0 text-white z-20"
          onClick={() => {
            close();
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="relative p-40 flex items-center justify-center w-full h-full">
          {images?.length ? (
            <IconButton
              size="lg"
              color="paper"
              variant="flat"
              className="absolute my-auto top-0 bottom-0 left-20"
              radius="rounded"
              disabled={activeIndex < 1}
              onClick={() => {
                setActiveIndex(activeIndex - 1);
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : null}
          <img
            src={src}
            alt=""
            className="max-h-full w-auto shadow object-contain"
          />
          {images?.length ? (
            <IconButton
              size="lg"
              color="paper"
              variant="flat"
              className="absolute my-auto top-0 bottom-0 right-20"
              radius="rounded"
              disabled={activeIndex + 1 === images?.length}
              onClick={() => {
                setActiveIndex(activeIndex + 1);
              }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          ) : null}
        </div>
      </DialogBody>
    </Dialog>
  );
}
