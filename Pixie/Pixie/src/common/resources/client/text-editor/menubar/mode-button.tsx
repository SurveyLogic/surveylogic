import {Button} from '../../ui/buttons/button';
import {CodeIcon} from '../../icons/material/Code';
import {Trans} from '../../i18n/trans';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {AceDialog} from '../../ace-editor/ace-dialog';
import {Editor} from '@tiptap/react';
import React from 'react';

interface ModeButtonProps {
  editor: Editor;
}
export function ModeButton({editor}: ModeButtonProps) {
  return (
    <DialogTrigger
      type="modal"
      onClose={newValue => {
        if (newValue != null) {
          editor?.commands.setContent(newValue);
        }
      }}
    >
      <Button variant="text" startIcon={<CodeIcon />}>
        <Trans message="Source code" />
      </Button>
      <AceDialog
        title={<Trans message="Source code" />}
        defaultValue={editor.getHTML()}
      />
    </DialogTrigger>
  );
}
