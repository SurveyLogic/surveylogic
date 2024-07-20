import React from 'react';
import {useStore} from '../../../../state/store';

export function CropzoneSizeIndicator() {
  const width = useStore(s => s.crop.zoneRect?.width) || 1;
  const height = useStore(s => s.crop.zoneRect?.height) || 1;

  return <div className="text-sm">{`${width}x${height}`}</div>;
}
