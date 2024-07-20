import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import clsx from 'clsx';
import {HorizontalRuleIcon} from '../../icons/material/HorizontalRule';
import {PriorityHighIcon} from '../../icons/material/PriorityHigh';
import {WarningIcon} from '../../icons/material/Warning';
import {NoteIcon} from '../../icons/material/Note';
import {MenubarButtonProps} from './menubar-button-props';
import {IconButton} from '../../ui/buttons/icon-button';
import {MoreVertIcon} from '../../icons/material/MoreVert';
import {SmartDisplayIcon} from '../../icons/material/SmartDisplay';
import {Form} from '../../ui/forms/form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../ui/navigation/menu/menu-trigger';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {Trans} from '../../i18n/trans';

export function InsertMenuTrigger({editor, size}: MenubarButtonProps) {
  const [dialog, setDialog] = useState<'embed' | false>(false);
  return (
    <>
      <MenuTrigger
        onItemSelected={key => {
          if (key === 'hr') {
            editor.commands.focus();
            editor.commands.setHorizontalRule();
          } else if (key === 'embed') {
            setDialog('embed');
          } else {
            editor.commands.focus();
            editor.commands.addInfo({type: key as any});
          }
        }}
      >
        <IconButton
          variant="text"
          size={size}
          radius="rounded"
          className={clsx('flex-shrink-0')}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu>
          <MenuItem value="hr" startIcon={<HorizontalRuleIcon />}>
            <Trans message="Horizontal rule" />
          </MenuItem>
          <MenuItem value="embed" startIcon={<SmartDisplayIcon />}>
            <Trans message="Embed" />
          </MenuItem>
          <MenuItem value="important" startIcon={<PriorityHighIcon />}>
            <Trans message="Important" />
          </MenuItem>
          <MenuItem value="warning" startIcon={<WarningIcon />}>
            <Trans message="Warning" />
          </MenuItem>
          <MenuItem value="success" startIcon={<NoteIcon />}>
            <Trans message="Note" />
          </MenuItem>
        </Menu>
      </MenuTrigger>
      <DialogTrigger
        type="modal"
        isOpen={!!dialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <EmbedDialog editor={editor} />
      </DialogTrigger>
    </>
  );
}

function EmbedDialog({editor}: MenubarButtonProps) {
  const previousSrc = editor.getAttributes('embed').src;
  const form = useForm<{src: string}>({
    defaultValues: {src: previousSrc},
  });
  const {formId, close} = useDialogContext();
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Insert link" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={form}
          id={formId}
          onSubmit={value => {
            editor.commands.setEmbed(value);
            close();
          }}
        >
          <FormTextField
            name="src"
            label={<Trans message="Embed URL" />}
            autoFocus
            type="url"
            required
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={close} variant="text">
          <Trans message="Cancel" />
        </Button>
        <Button
          type="submit"
          form={formId}
          disabled={!form.formState.isValid}
          variant="flat"
          color="primary"
        >
          <Trans message="Add" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
