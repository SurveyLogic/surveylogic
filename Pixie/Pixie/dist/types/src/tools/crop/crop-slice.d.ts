import type { StoreSlice } from '../../state/store';
import { ToolSlice } from '../../state/tool-slice';
import { InteractableRect } from '@common/ui/interactions/interactable-event';
export interface CropSlice {
    crop: ToolSlice & {
        zoneRect: InteractableRect | null;
        selectedAspectRatio: string | null;
        straightenAngle: number;
        setCropzoneRect: (rect: InteractableRect) => void;
        setAspectRatio: (ratio: string | null) => void;
        setTransformAngle: (angle: number) => void;
    };
}
export declare const createCropSlice: StoreSlice<CropSlice>;
