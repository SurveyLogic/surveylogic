import React, {useCallback, useEffect, useRef} from 'react';
import {domAnimation, LazyMotion, m, Variants} from 'framer-motion';
import clsx from 'clsx';
import {mergeProps} from '@react-aria/utils';
import {initTools} from '../tools/init-tools';
import {observeSize} from '@common/utils/dom/observe-size';
import {getBoundingClientRect} from '@common/utils/dom/get-bounding-client-rect';
import {ToolbarContainer} from './toolbar/toolbar-container';
import {LoadingIndicator} from './stage/loading-indicator';
import {CanvasWrapper} from './stage/canvas-wrapper';
import {ToolControlsOverlay} from './navbar/tool-controls-overlay';
import {Navbar} from './navbar/navbar';
import {OverlayPanelContainer} from './overlay-panel-container';
import {useStore} from '../state/store';
import {ToastContainer} from '@common/ui/toast/toast-container';
import {state, tools} from '../state/utils';
import {handleCanvasKeydown} from './handle-canvas-keydown';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CloseIcon} from '@common/icons/material/Close';
import {useEditorMode} from './editor-mode';
import {Underlay} from '@common/ui/overlays/underlay';
import {useDroppable} from '@common/ui/interactions/dnd/use-droppable';
import {MixedDraggable} from '@common/ui/interactions/dnd/use-draggable';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {PixieBootstrapDataProvider} from '../pixie-bootstrap-data-provider';

export function ImageEditor() {
  const isVisible = useStore(s => s.config.ui?.visible) ?? true;
  const navPosition = useStore(s => s.config.ui?.nav?.position) ?? 'bottom';
  const menuPosition = useStore(s => s.config.ui?.menubar?.position) ?? 'top';
  const allowEditorClose = useStore(s => s.config.ui?.allowEditorClose) ?? true;
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const stageRef = useRef<HTMLDivElement>(null);
  const {isModal, isMobile} = useEditorMode();

  const onDrop = useCallback(async (target: MixedDraggable) => {
    if (state().activeTool || state().dirty || target.type !== 'nativeFile')
      return;
    const files = (await target.getData()) as UploadedFile[];

    if (!tools().import.fileIsValid(files[0])) {
      return;
    }

    if (state().config.tools?.import?.openDroppedImageAsBackground ?? false) {
      await tools().import.openBackgroundImage(files[0]);
    } else {
      await tools().import.openUploadedFile(files[0]);
    }
  }, []);

  const {droppableProps} = useDroppable({
    id: 'pixie-root',
    ref: stageRef,
    types: ['nativeFile'],
    onDrop: onDrop,
  });

  useEffect(() => {
    // editor already booted
    if (!state().fabric) {
      useStore.setState({canvasRef});
      initTools(canvasRef.current);

      if (state().config.ui?.defaultTool) {
        state().setActiveTool(state().config.ui?.defaultTool!, null);
      }

      tools()
        .canvas.loadInitialContent()
        .then(() => {
          state().config.onLoad?.(state().editor);
        });
    }

    // set initial rects for stage and canvas, and update them on resize
    const unobserveStage = observeSize(stageRef, () => {
      state().setStageSize(getBoundingClientRect(stageRef.current!));
    });
    const unobserveCanvas = observeSize(canvasRef, () => {
      state().setCanvasSize(getBoundingClientRect(canvasRef.current));
    });

    return () => {
      unobserveStage();
      unobserveCanvas();
    };
  }, [stageRef]);

  const variants: Variants = {
    visible: {
      opacity: 1,
      scale: 1,
      display: 'flex',
    },
    hidden: {opacity: 0, transitionEnd: {display: 'none'}},
  };

  const rootClassName = clsx(
    'pixie-root flex flex-col overflow-hidden bg-background text-main no-tap-highlight w-full h-full',
    {
      relative: !isModal,
      'fixed inset-0 w-full h-full z-20': isModal,
      'shadow-lg border rounded-md m-auto max-h-[calc(100vh-90px)] max-w-[calc(100vw-90px)]':
        isModal && !isMobile,
    }
  );

  const showCloseIcon = isModal && isVisible && !isMobile && allowEditorClose;
  const showUnderlay = isModal && isVisible;

  return (
    <LazyMotion features={domAnimation} strict>
      <PixieBootstrapDataProvider>
        {showCloseIcon && (
          <IconButton
            className="z-20 fixed right-2 top-2 text-white"
            size="lg"
            onClick={() => {
              state().editor.close();
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {showUnderlay && <Underlay position="fixed" disableInitialTransition />}
        <m.div
          initial={false}
          variants={variants}
          animate={isVisible ? 'visible' : 'hidden'}
          className={rootClassName}
        >
          {menuPosition === 'top' && <ToolbarContainer />}
          {navPosition === 'top' && <Navbar className="pt-14" />}

          <main
            className="relative flex-auto my-20 overflow-hidden outline-none"
            tabIndex={-1}
            {...mergeProps(droppableProps, {
              onKeyDownCapture: handleCanvasKeydown,
            })}
            ref={stageRef}
          >
            <LoadingIndicator />
            <CanvasWrapper ref={canvasRef} />
          </main>
          <ToolControlsOverlay />
          {navPosition === 'bottom' && <Navbar />}
          {menuPosition === 'bottom' && <ToolbarContainer />}
          <OverlayPanelContainer />
          <ToastContainer />
        </m.div>
      </PixieBootstrapDataProvider>
    </LazyMotion>
  );
}
