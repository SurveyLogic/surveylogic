import React from 'react';
import { CropzoneRefs } from './ui/cropzone/cropzone-refs';
import { InteractableRect } from '@common/ui/interactions/interactable-event';
export declare class CropTool {
    private refs;
    apply(box: Omit<InteractableRect, 'angle'>): Promise<void>;
    drawZone(rect: InteractableRect): void;
    resetCropzone(aspectRatioStr: string | null): void;
    registerRefs(refs: React.MutableRefObject<CropzoneRefs>): void;
}
