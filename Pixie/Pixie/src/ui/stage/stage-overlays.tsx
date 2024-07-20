import React from 'react';
import {Cropzone} from '../../tools/crop/ui/cropzone/cropzone';
import {ObjectBox} from '../../objects/ui/object-box/object-box';
import {useStore} from '../../state/store';
import {ToolName} from '../../tools/tool-name';

export function StageOverlays() {
  const cropToolIsActive = useStore(s => s.activeTool === ToolName.CROP);
  const objIsSelected = useStore(s => s.objects.active.id);
  return (
    <div>
      {cropToolIsActive && <Cropzone />}
      {objIsSelected && <ObjectBox />}
    </div>
  );
}
