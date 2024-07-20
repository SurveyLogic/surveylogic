import {useForm} from 'react-hook-form';
import React from 'react';
import clsx from 'clsx';
import {Form} from '../../ui/forms/form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '../../ui/overlays/dialog/dialog-footer';
import {Button} from '../../ui/buttons/button';
import {IconButton} from '../../ui/buttons/icon-button';
import {LinkIcon} from '../../icons/material/Link';
import {MenubarButtonProps} from './menubar-button-props';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {FormSelect, Option} from '../../ui/forms/select/select';
import {useDialogContext} from '../../ui/overlays/dialog/dialog-context';
import {Dialog} from '../../ui/overlays/dialog/dialog';
import {DialogHeader} from '../../ui/overlays/dialog/dialog-header';
import {DialogBody} from '../../ui/overlays/dialog/dialog-body';
import {Trans} from '../../i18n/trans';

interface FormValue {
  href: string;
  target?: string;
  text?: string;
}

export function LinkButton({editor, size}: MenubarButtonProps) {
  return (
    <DialogTrigger type="modal">
      <IconButton
        size={size}
        radius="rounded"
        className={clsx('flex-shrink-0')}
      >
        <LinkIcon />
      </IconButton>
      <LinkDialog editor={editor} />
    </DialogTrigger>
  );
}

function LinkDialog({editor}: MenubarButtonProps) {
  const previousUrl = editor.getAttributes('link').href;
  const previousText = editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    ''
  );
  const form = useForm<FormValue>({
    defaultValues: {href: previousUrl, text: previousText},
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
            // no selection, insert new link with specified text
            if (editor.state.selection.empty && value.text) {
              editor.commands.insertContent(
                `<a href="${value.href}" target="${value.target}">${value.text}</a>`
              );
            } else if (!editor.state.selection.empty) {
              // no href provided, remove link from selection
              if (!value.href) {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .unsetLink()
                  .run();
              } else {
                // add link to selection
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .setLink({href: value.href, target: value.target})
                  .run();
              }
            }
            close();
          }}
        >
          <FormTextField
            name="href"
            label={<Trans message="URL" />}
            autoFocus
            type="url"
            className="mb-20"
          />
          <FormTextField
            name="text"
            label={<Trans message="Text to display" />}
            className="mb-20"
          />
          <FormSelect
            selectionMode="single"
            name="target"
            label={<Trans message="Open link in..." />}
          >
            <Option value="_self">
              <Trans message="Current window" />
            </Option>
            <Option value="_blank">
              <Trans message="New window" />
            </Option>
          </FormSelect>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={close} variant="text">
          <Trans message="Cancel" />
        </Button>
        <Button type="submit" form={formId} variant="flat" color="primary">
          <Trans message="Save" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
