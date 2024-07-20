import React, {Fragment} from 'react';
import {fabric} from 'fabric';
import {Pattern} from 'fabric/fabric-impl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {Button} from '@common/ui/buttons/button';
import {DEFAULT_GRADIENTS} from '../../../config/default-gradients';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {defaultObjectProps} from '../../../config/default-object-props';
import {state, tools} from '../../../state/utils';
import {TextureIcon} from '@common/icons/material/Texture';
import {GradientIcon} from '@common/icons/material/Gradient';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {AddPhotoAlternateIcon} from '@common/icons/material/AddPhotoAlternate';
import {assetUrl} from '../../../utils/asset-url';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {useTrans} from '@common/i18n/use-trans';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Trans} from '@common/i18n/trans';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';

interface Props {
  property: 'fill' | 'backgroundColor';
}

export function ColorTabPanel({property}: Props) {
  const {trans} = useTrans();
  const currentColor = useStore(s => s.objects.active.editableProps[property]);

  return (
    <div className="flex items-center justify-center gap-14">
      <ColorPickerButton
        className="flex-shrink-0"
        size="xs"
        aria-label={trans({message: 'Color'})}
        value={
          typeof currentColor === 'string'
            ? currentColor
            : defaultObjectProps.fill
        }
        onChange={newColor => {
          tools().objects.setValues({[property]: newColor});
          state().setDirty(true);
        }}
      />
      <FillSelector type="gradient" property={property} />
      <FillSelector type="texture" property={property} />
    </div>
  );
}

interface FillSelectorProps extends Props {
  type: 'gradient' | 'texture';
}

function FillSelector({type, property}: FillSelectorProps) {
  const startIcon = type === 'texture' ? <TextureIcon /> : <GradientIcon />;
  return (
    <Fragment>
      <DialogTrigger type="popover">
        <Button
          className="flex-shrink-0"
          id={`${type}-panel-trigger`}
          variant="outline"
          size="xs"
          startIcon={startIcon}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <span className="capitalize">
            {type === 'gradient' ? (
              <Trans message="Gradient" />
            ) : (
              <Trans message="Texture" />
            )}
          </span>
        </Button>
        <Dialog size="auto">
          <div className="grid gap-8 grid-cols-5-min-content p-10 bg-paper rounded shadow-md">
            <PreviewButtons property={property} type={type} />
          </div>
        </Dialog>
      </DialogTrigger>
    </Fragment>
  );
}
function PreviewButtons({type, property}: FillSelectorProps) {
  const {close} = useDialogContext();
  const iterator = Array.from(
    Array(type === 'gradient' ? DEFAULT_GRADIENTS.length : 28).keys()
  );

  const previewBtnClass = 'w-56 h-56 bg border shadow-sm hover:scale-110';

  const previewBtns = iterator.map(index => {
    const previewUrl = assetUrl(`images/${type}s/${index}.png`);

    return (
      <ButtonBase
        radius="rounded"
        className={previewBtnClass}
        key={index}
        style={{backgroundImage: `url(${previewUrl})`}}
        aria-label={`Select ${type} #${index}`}
        onClick={async () => {
          close();
          const value =
            type === 'gradient'
              ? new fabric.Gradient(DEFAULT_GRADIENTS[index])
              : await patternFromUrlOrData(previewUrl);
          tools().objects.setValues({[property]: value});
          state().setDirty(true);
        }}
      />
    );
  });

  if (type === 'texture') {
    previewBtns.unshift(
      <UploadButton
        property={property}
        key="upload-btn"
        className={previewBtnClass}
      />
    );
  }

  return <Fragment>{previewBtns}</Fragment>;
}

interface UploadButtonProps extends Props {
  className: string;
}
function UploadButton({className, property}: UploadButtonProps) {
  const {close} = useDialogContext();
  return (
    <ButtonBase
      radius="rounded"
      className={className}
      aria-label="Upload an image"
      onClick={async () => {
        const file = await tools().import.openUploadWindow();
        close();
        if (file) {
          const pattern = await patternFromUrlOrData(await file.data);
          tools().objects.setValues({[property]: pattern});
        }
      }}
    >
      <AddPhotoAlternateIcon className="icon-md" />
    </ButtonBase>
  );
}

function patternFromUrlOrData(data: string): Promise<Pattern> {
  return new Promise(resolve => {
    fabric.util.loadImage(data, img => {
      const pattern = new fabric.Pattern({
        source: img,
        repeat: 'repeat',
      });
      resolve(pattern);
    });
  });
}
