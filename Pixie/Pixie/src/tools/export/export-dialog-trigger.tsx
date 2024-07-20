import React, {useState} from 'react';
import {useStore} from '@app/state/store';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {state, tools} from '@app/state/utils';
import {Button} from '@common/ui/buttons/button';
import {RadioGroup} from '@common/ui/forms/radio-group/radio-group';
import {Slider} from '@common/ui/forms/slider/slider';
import {Radio} from '@common/ui/forms/radio-group/radio';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';

export function ExportDialogTrigger() {
  const isOpen = useStore(s => s.openPanels.export);
  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={visible => {
        if (!visible) {
          state().togglePanel('export', false);
        }
      }}
      type="modal"
    >
      <ExportDialog />
    </DialogTrigger>
  );
}

function ExportDialog() {
  const [formVal, setFormVal] = useState(() => {
    return {
      filename: state().config.tools?.export?.defaultName || 'image',
      format: state().config.tools?.export?.defaultFormat || 'jpeg',
      quality: state().config.tools?.export?.defaultQuality || 0.8,
    };
  });
  return (
    <Dialog className="text-center max-w-max" size="auto">
      <DialogBody>
        <form
          onSubmit={e => {
            e.preventDefault();
            tools().export.save(
              formVal.filename,
              formVal.format,
              formVal.quality
            );
            state().togglePanel('export', false);
          }}
        >
          <TextField
            required
            size="sm"
            label={<Trans message="Save As" />}
            value={formVal.filename}
            onChange={e => {
              setFormVal({...formVal, filename: e.target.value});
            }}
          />
          <RadioGroup size="sm" className="my-20" aria-label="Image format">
            <Radio
              value="jpeg"
              checked={formVal.format === 'jpeg'}
              onChange={e => {
                setFormVal({...formVal, format: e.target.value as 'jpeg'});
              }}
            >
              JPEG
            </Radio>
            <Radio
              value="png"
              checked={formVal.format === 'png'}
              onChange={e => {
                setFormVal({...formVal, format: e.target.value as 'png'});
              }}
            >
              PNG
            </Radio>
            <Radio
              value="json"
              checked={formVal.format === 'json'}
              onChange={e => {
                setFormVal({...formVal, format: e.target.value as 'json'});
              }}
            >
              JSON
            </Radio>
          </RadioGroup>
          <Slider
            size="sm"
            minValue={0.1}
            step={0.1}
            maxValue={1}
            value={formVal.quality}
            onChange={quality => {
              setFormVal({...formVal, quality});
            }}
            formatOptions={{style: 'percent'}}
            label={<Trans message="Quality" />}
          />
          <Button
            variant="raised"
            color="primary"
            type="submit"
            className="mt-20 w-full"
            size="sm"
          >
            <Trans message="Save" />
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
}
