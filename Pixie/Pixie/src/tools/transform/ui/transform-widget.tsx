import React, {useRef} from 'react';
import {FlipBtns} from './flip-btns';
import {RotateBtns} from './rotate-btns';
import {state, tools} from '../../../state/utils';
import {useSlider} from '@common/ui/forms/slider/use-slider';

export function TransformWidget() {
  return (
    <div className="flex items-center justify-center gap-16">
      <FlipBtns />
      <StraightenSlider />
      <RotateBtns />
    </div>
  );
}

function StraightenSlider() {
  const svgRef = useRef<SVGSVGElement>(null!);
  const {domProps, groupId, thumbIds, trackRef, getThumbValueLabel} = useSlider(
    {
      minValue: -45,
      maxValue: 45,
      step: 1,
      defaultValue: [state().crop.straightenAngle],
      onChange: (val: number[]) => {
        const newValue = val[0];
        tools().transform.straighten(newValue);
        state().crop.setTransformAngle(newValue);
        state().setDirty(true);
        svgRef.current.style.transform = `translateX(${newValue}px)`;
      },
    }
  );

  return (
    <div
      id={groupId}
      role="group"
      className="flex-auto flex-shrink-0 max-w-320 touch-none isolate"
    >
      <div {...domProps} ref={trackRef} className="h-36 relative">
        <output
          htmlFor={thumbIds[0]}
          aria-live="off"
          className="absolute left-1/2 top-1/2 w-40 text-center bg -translate-x-1/2 -translate-y-1/2 z-10"
        >
          {getThumbValueLabel(0)}°
        </output>
        <FreeTransformTrack ref={svgRef} />
      </div>
    </div>
  );
}

const FreeTransformTrack = React.forwardRef<SVGSVGElement>((props, ref) => {
  const numberOfDots = [...Array(80).keys()];
  const circles = numberOfDots.map(index => {
    return (
      <circle
        key={index}
        cx={2 + index * 10}
        cy="20"
        r={!(index % 5) ? 2 : 0.75}
      />
    );
  });

  return (
    <div className="relative h-full cursor-pointer overflow-hidden">
      <svg
        ref={ref}
        style={{width: numberOfDots.length * 10}}
        className="absolute -left-80 h-full fill-current"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {circles}
      </svg>
    </div>
  );
});
