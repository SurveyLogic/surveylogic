import React from 'react';
import {m} from 'framer-motion';
import {useStore} from '@app/state/store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ToolName} from '@app/tools/tool-name';
import {CropzoneSizeIndicator} from '@app/tools/crop/ui/crop-nav/cropzone-size-indicator';
import {toolbarAnimation, toolbarStyle} from './toolbar-style';
import {state} from '@app/state/utils';
import {Button} from '@common/ui/buttons/button';
import {CloseIcon} from '@common/icons/material/Close';
import {CheckIcon} from '@common/icons/material/Check';
import {useEditorMode} from '../editor-mode';
import {Trans} from '@common/i18n/trans';

export function ActiveToolbar() {
  const activeTool = useStore(s => s.activeTool);
  return (
    <m.div className={toolbarStyle} {...toolbarAnimation}>
      <CancelButton />
      {getToolName(activeTool)}
      <ApplyButton />
    </m.div>
  );
}

function CancelButton() {
  const {isMobile} = useEditorMode();
  const isDirty = useStore(s => s.dirty);
  if (isMobile) {
    return (
      <IconButton
        size="sm"
        onClick={() => {
          state().cancelChanges();
        }}
      >
        <CloseIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="outline"
      size="xs"
      startIcon={<CloseIcon />}
      radius="rounded-full"
      className="min-w-92"
      onClick={() => {
        state().cancelChanges();
      }}
    >
      {isDirty ? <Trans message="Cancel" /> : <Trans message="Close" />}
    </Button>
  );
}

function getToolName(toolName: ToolName | null) {
  if (!toolName) {
    return null;
  }
  const defaultCmp = (
    <div className="capitalize text-sm">
      <Trans message={toolName} />
    </div>
  );
  switch (toolName) {
    case ToolName.CROP: {
      const allowCustom = state().config.tools?.crop?.allowCustomRatio ?? true;
      if (allowCustom) {
        return <CropzoneSizeIndicator />;
      }
      return defaultCmp;
    }
    default:
      return defaultCmp;
  }
}

function ApplyButton() {
  const {isMobile} = useEditorMode();
  const isDirty = useStore(s => s.dirty);
  if (isMobile) {
    return (
      <IconButton
        size="sm"
        disabled={!isDirty}
        onClick={() => {
          state().applyChanges();
        }}
      >
        <CheckIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="flat"
      color="primary"
      size="xs"
      disabled={!isDirty}
      startIcon={<CheckIcon />}
      radius="rounded-full"
      onClick={() => {
        state().applyChanges();
      }}
    >
      <Trans message="Apply" />
    </Button>
  );
}
