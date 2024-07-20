import {Image} from 'fabric/fabric-impl';
import {Button} from '@common/ui/buttons/button';
import {fireObjModifiedEvent} from '../../object-modified-event';
import {ImageIcon} from '@common/icons/material/Image';
import {tools} from '@app/state/utils';
import {Trans} from '@common/i18n/trans';

export function ImageTabPanel() {
  return (
    <div className="flex justify-center">
      <Button
        type="button"
        variant="outline"
        size="xs"
        startIcon={<ImageIcon />}
        radius="rounded-full"
        onClick={async () => {
          const file = await tools().import.openUploadWindow();
          if (file) {
            const active = tools().objects.getActive();
            if (active && 'setSrc' in active) {
              const fileData = await file.data;
              (active as Image).setSrc(fileData, () => {
                fireObjModifiedEvent({
                  src: fileData,
                });
                tools().canvas.render();
              });
            }
          }
        }}
      >
        <Trans message="Replace Image" />
      </Button>
    </div>
  );
}
