import {CropzoneRefs} from './cropzone-refs';
import {state} from '../../../../state/utils';
import {InteractableRect} from '@common/ui/interactions/interactable-event';

export function drawCropzone(rect: InteractableRect, refs: CropzoneRefs) {
  if (refs.innerZone !== null) {
    refs = refs as NonNullable<CropzoneRefs>;
    drawInnerZone(rect, refs);
    drawMask(rect, refs);
    drawLines(rect, refs);
  }
}

function drawInnerZone(
  rect: InteractableRect,
  refs: NonNullable<CropzoneRefs>
) {
  refs.innerZone!.style.width = `${rect.width}px`;
  refs.innerZone!.style.height = `${rect.height}px`;
  refs.innerZone!.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
}

function drawMask(rect: InteractableRect, refs: CropzoneRefs) {
  const contWidth = state().canvasSize.width;
  const contHeight = state().canvasSize.height;

  // top
  refs.maskTop!.style.height = `${rect.top}px`;
  refs.maskTop!.style.width = `${contWidth}px`;
  // left
  refs.maskLeft!.style.top = `${rect.top}px`;
  refs.maskLeft!.style.height = `${rect.height}px`;
  refs.maskLeft!.style.width = `${rect.left}px`;
  // right
  const rightLeft = rect.left + rect.width;
  refs.maskRight!.style.left = `${rightLeft}px`;
  refs.maskRight!.style.top = `${rect.top}px`;
  refs.maskRight!.style.height = `${rect.height}px`;
  refs.maskRight!.style.width = `${contWidth - rightLeft}px`;
  // bottom
  refs.maskBottom!.style.height = `${contHeight - (rect.top + rect.height)}px`;
  refs.maskBottom!.style.width = `${contWidth}px`;
}

function drawLines(rect: InteractableRect, refs: CropzoneRefs) {
  const horSpace = (rect.width - 2) / 3;
  refs.lineVer1!.style.height = `${rect.height}px`;
  refs.lineVer1!.style.transform = `translate(${horSpace}px, 0)`;
  refs.lineVer2!.style.height = `${rect.height}px`;
  refs.lineVer2!.style.transform = `translate(${horSpace * 2}px, 0)`;
  const verSpace = (rect.height - 2) / 3;
  refs.lineHor1!.style.width = `${rect.width}px`;
  refs.lineHor1!.style.transform = `translate(0, ${verSpace}px)`;
  refs.lineHor2!.style.width = `${rect.width}px`;
  refs.lineHor2!.style.transform = `translate(0, ${verSpace * 2}px)`;
}
