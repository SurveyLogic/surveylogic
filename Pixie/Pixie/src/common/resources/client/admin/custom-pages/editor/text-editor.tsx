import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Underline} from '@tiptap/extension-underline';
import {Link as LinkExtension} from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import React, {useEffect, useState} from 'react';
import {Superscript} from '@tiptap/extension-superscript';
import {Subscript} from '@tiptap/extension-subscript';
import {Color} from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import {TextAlign} from '@tiptap/extension-text-align';
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight';
import clsx from 'clsx';
import {FormProvider, useForm, useFormContext} from 'react-hook-form';
import {BackgroundColor} from '@common/text-editor/extensions/background-color';
import {Indent} from '@common/text-editor/extensions/indent';
import {Embed} from '@common/text-editor/extensions/embed';
import {lowlight} from '../../../text-editor/lowlight';
import {InfoBlock} from '@common/text-editor/extensions/info-block';
import {CustomPage} from '@common/admin/custom-pages/custom-page';
import {CrupdatePagePayload} from './requests/crupdate-page';
import {EditIcon} from '@common/icons/material/Edit';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useTrans} from '@common/i18n/use-trans';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {StickyHeader} from '@common/admin/custom-pages/editor/text-editor-sticky-header';

interface TextEditorProps {
  page?: CustomPage;
  allowSlugEditing?: boolean;
  endpoint?: string;
}
export default function TextEditor({
  page,
  allowSlugEditing = true,
  endpoint,
}: TextEditorProps) {
  const form = useForm<CrupdatePagePayload>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      LinkExtension,
      Image,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      BackgroundColor,
      Indent,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      InfoBlock,
      Embed,
    ],
    onFocus: () => {},
    content: page?.body,
  });

  // destroy editor
  useEffect(() => {
    if (editor) {
      return () => {
        editor.destroy();
      };
    }
  }, [editor]);

  // reset form values
  useEffect(() => {
    form.reset(page);
  }, [page, form]);

  if (!editor) return null;

  return (
    <FileUploadProvider>
      <FormProvider {...form}>
        <StickyHeader
          editor={editor}
          page={page}
          allowSlugEditing={allowSlugEditing}
          endpoint={endpoint}
        />
        <div className="mx-20" data-testid="text-editor">
          <div className="prose dark:prose-invert mx-auto flex-auto">
            <Title />
            <EditorContent editor={editor} />
          </div>
        </div>
      </FormProvider>
    </FileUploadProvider>
  );
}

function Title() {
  const [editingTitle, setEditingTitle] = useState(false);
  const {trans} = useTrans();
  const form = useFormContext<CrupdatePagePayload>();
  const watchedTitle = form.watch('title');

  const titlePlaceholder = trans({message: 'Title'});

  if (editingTitle) {
    return (
      <FormTextField
        placeholder={titlePlaceholder}
        autoFocus
        className="mb-30"
        onBlur={() => {
          setEditingTitle(false);
        }}
        name="title"
        required
      />
    );
  }
  return (
    <h1
      tabIndex={0}
      onClick={() => {
        setEditingTitle(true);
      }}
      onFocus={() => {
        setEditingTitle(true);
      }}
      className={clsx(
        'hover:bg-primary/focus rounded cursor-pointer',
        !watchedTitle && 'text-muted'
      )}
    >
      {watchedTitle || titlePlaceholder}
      <EditIcon className="icon-sm mx-8 mt-8 align-top text-muted" />
    </h1>
  );
}
