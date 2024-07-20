import React from 'react';
import {m} from 'framer-motion';
import {ToolName} from '../../tools/tool-name';
import {FilterNav} from '../../tools/filter/ui/filter-nav';
import {ResizeNav} from '../../tools/resize/ui/resize-nav';
import {CropNav} from '../../tools/crop/ui/crop-nav/crop-nav';
import {ShapeNav} from '../../tools/shapes/ui/shape-nav';
import {StickerNav} from '../../tools/shapes/ui/sticker-nav/sticker-nav';
import {FrameNav} from '../../tools/frame/ui/frame-nav';
import {TextNav} from '../../tools/text/ui/text-nav';
import {DrawNav} from '../../tools/draw/ui/draw-nav';
import {CornersNav} from '../../tools/corners/ui/corners-nav';
import {navbarAnimation} from './navbar-animation';

type Props = {
  activeTool: ToolName | null;
};

export function ToolControls({activeTool}: Props) {
  const toolNav = getToolNav(activeTool);

  return (
    <m.div
      className="relative h-full w-full text-sm bg select-none overflow-hidden"
      {...navbarAnimation}
    >
      {toolNav}
    </m.div>
  );
}

function getToolNav(activeTool: ToolName | null) {
  switch (activeTool) {
    case ToolName.FILTER:
      return <FilterNav />;
    case ToolName.RESIZE:
      return <ResizeNav />;
    case ToolName.CROP:
      return <CropNav />;
    case ToolName.DRAW:
      return <DrawNav />;
    case ToolName.TEXT:
      return <TextNav />;
    case ToolName.SHAPES:
      return <ShapeNav />;
    case ToolName.STICKERS:
      return <StickerNav />;
    case ToolName.FRAME:
      return <FrameNav />;
    case ToolName.CORNERS:
      return <CornersNav />;
    default:
      return null;
  }
}
