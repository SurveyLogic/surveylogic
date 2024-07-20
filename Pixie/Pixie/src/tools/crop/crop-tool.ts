import React from 'react';
import {drawCropzone} from './ui/cropzone/draw-cropzone';
import {centerWithinBoundary} from '@common/ui/interactions/utils/center-within-boundary';
import {aspectRatioFromStr} from '@common/ui/interactions/utils/calc-new-size-from-aspect-ratio';
import {CropzoneRefs} from './ui/cropzone/cropzone-refs';
import {state, tools} from '../../state/utils';
import {InteractableRect} from '@common/ui/interactions/interactable-event';

export class CropTool {
  private refs: React.MutableRefObject<CropzoneRefs> | null = null;

  apply(box: Omit<InteractableRect, 'angle'>): Promise<void> {
    const frameName = tools().frame.active.config?.name;
    const frameSize = tools().frame.active.currentSizeInPercent;
    tools().frame.active.hide();

    return tools()
      .merge.apply()
      .then(() => {
        tools().canvas.resize(Math.round(box.width), Math.round(box.height), {
          applyZoom: true,
          resizeHelper: true,
        });

        const img = tools().canvas.getMainImage();
        img.cropX = Math.round(box.left);
        img.cropY = Math.round(box.top);
        img.width = Math.round(box.width);
        img.height = Math.round(box.height);
        img.viewportCenter();

        if (frameName) {
          tools().frame.add(frameName, frameSize);
        }

        tools().zoom.fitToScreen();
        tools().canvas.render();
      });
  }

  drawZone(rect: InteractableRect) {
    if (this.refs?.current) {
      state().crop.setCropzoneRect(rect);
      drawCropzone(rect, this.refs.current);
    }
  }

  resetCropzone(aspectRatioStr: string | null) {
    const boundaryRect = state().canvasSize;
    const aspectRatio = aspectRatioFromStr(aspectRatioStr);
    if (!boundaryRect) return;
    state().crop.setAspectRatio(aspectRatioStr);
    const newRect = centerWithinBoundary(boundaryRect, aspectRatio);
    this.drawZone(newRect);
  }

  registerRefs(refs: React.MutableRefObject<CropzoneRefs>) {
    this.refs = refs;
  }
}
