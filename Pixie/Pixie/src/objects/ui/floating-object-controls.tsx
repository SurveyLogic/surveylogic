import {Object} from 'fabric/fabric-impl';
import React from 'react';
import {IconButton} from '@common/ui/buttons/icon-button';
import {useStore} from '../../state/store';
import {CustomDuplicateIcon} from '../../ui/icons/duplicate';
import {CustomFlipIcon} from '../../ui/icons/flip';
import {CustomFrontSortingIcon} from '../../ui/icons/front-sorting';
import {CustomRemoveIcon} from '../../ui/icons/remove';
import {state, tools} from '../../state/utils';

const floatingControlsSize = {
  width: 120,
  height: 30,
};

const controls = [
  {
    name: 'Duplicate',
    icon: CustomDuplicateIcon,
    onClick: () => {
      tools().objects.duplicate();
    },
  },
  {
    name: 'Flip',
    icon: CustomFlipIcon,
    onClick: () => {
      tools().objects.flipHorizontally();
    },
  },
  {
    name: 'Bring to front',
    icon: CustomFrontSortingIcon,
    onClick: () => {
      tools().objects.bringToFront();
    },
  },
  {
    name: 'Delete',
    icon: CustomRemoveIcon,
    onClick: () => {
      tools().objects.delete();
    },
  },
];

export const FloatingObjectControls = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    const isHidden = useStore(s => s.objects.active.isMoving);

    const opacity = isHidden ? 'opacity-0' : 'opacity-100';
    return (
      <div
        ref={ref}
        className={`${opacity} absolute z-obj-box left-0 top-0 flex items-center text-white bg-controls rounded shadow transition-opacity overflow-hidden`}
      >
        {controls.map(control => {
          const Icon = control.icon;
          return (
            <IconButton
              size="sm"
              key={control.name}
              className="w-30 h-30 hover:bg-white/hover"
              radius="rounded-none"
              onClick={control.onClick}
            >
              <Icon />
            </IconButton>
          );
        })}
      </div>
    );
  }
);

export function repositionFloatingControls(
  obj: Object,
  el: HTMLElement | null
) {
  if (!el) return;
  const angle = obj.angle || 0;
  // make sure rotation handle is not covered when it's at the top
  const floatingControlsTopOffset = angle > 168 && angle < 188 ? -30 : -15;
  const canvas = state().canvasSize;
  const stage = state().stageSize;
  const size = floatingControlsSize;

  // margin between canvas el and wrapper el edges
  const canvasTopMargin = canvas.top - stage.top;
  const canvasLeftMargin = canvas.left - stage.left;
  const canvasRightMargin = stage.width - (canvasLeftMargin + canvas.width);
  const canvasBottomMargin = stage.height - (canvasTopMargin + canvas.height);

  // floating controls' max boundaries
  const maxTop = -canvasTopMargin;
  const maxLeft = -(canvas.left - stage.left);
  const maxRight = canvas.width - size.width + canvasRightMargin;
  const maxBottom = canvas.height - size.height + canvasBottomMargin;

  // position floating controls
  const boundingRect = obj.getBoundingRect();
  let floatingTop = boundingRect.top - size.height + floatingControlsTopOffset;
  let floatingLeft =
    boundingRect.left + boundingRect.width / 2 - size.width / 2;

  floatingTop = Math.min(maxBottom, Math.max(maxTop, floatingTop));
  floatingLeft = Math.min(maxRight, Math.max(maxLeft, floatingLeft));

  el.style.transform = `translate(${floatingLeft}px, ${floatingTop}px) rotate(0deg)`;
}
