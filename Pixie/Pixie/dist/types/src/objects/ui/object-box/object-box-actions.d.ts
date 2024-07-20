import { RefObject } from 'react';
import { InteractableEvent, InteractableRect } from '@common/ui/interactions/interactable-event';
export declare function rotateActiveObj(e: {
    rect: InteractableRect;
    prevRect?: InteractableRect;
}): void;
export declare function moveActiveObj(e: {
    rect: InteractableRect;
    prevRect?: InteractableRect;
}): void;
export declare function resizeActiveObj(e: InteractableEvent): void;
export declare function syncBoxPositionWithActiveObj(boxRef: RefObject<HTMLElement>, floatingControlsRef: RefObject<HTMLElement>): void;
export declare function enableTextEditing(): void;
