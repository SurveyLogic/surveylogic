import {SlugEditor, SlugEditorProps} from '@common/ui/slug-editor';
import {useController, useFormContext} from 'react-hook-form';
import {CrupdatePagePayload, useCrupdatePage} from './requests/crupdate-page';
import React, {Fragment, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {useStickySentinel} from '@common/utils/hooks/sticky-sentinel';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {Button} from '@common/ui/buttons/button';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowBackIcon} from '@common/icons/material/ArrowBack';
import {Trans} from '@common/i18n/trans';
import {HistoryButtons} from '@common/text-editor/menubar/history-buttons';
import {ModeButton} from '@common/text-editor/menubar/mode-button';
import {MenuBar} from './menubar';
import {useTrans} from '@common/i18n/use-trans';
import {toast} from '@common/ui/toast/toast';
import {queryClient} from '@common/http/query-client';
import {Editor} from '@tiptap/react';
import {CustomPage} from '../custom-page';

interface StickyHeaderProps {
  editor: Editor;
  page?: CustomPage;
  allowSlugEditing?: boolean;
  endpoint?: string;
}
export function StickyHeader({
  editor,
  page,
  allowSlugEditing = true,
  endpoint,
}: StickyHeaderProps) {
  const {isSticky, sentinelRef} = useStickySentinel();
  const isMobile = useIsMobileMediaQuery();

  return (
    <Fragment>
      <div ref={sentinelRef} />
      <div
        className={clsx(
          'sticky top-0 relative z-10 mb-20 bg-paper',
          isSticky && 'shadow'
        )}
      >
        <div className="px-20 py-10 flex items-center justify-between sm:justify-start gap-20 border-b text-muted">
          {!isMobile && (
            <Fragment>
              <Button
                variant="text"
                size="sm"
                elementType={Link}
                to={page ? '../..' : '..'}
                relative="path"
                startIcon={<ArrowBackIcon />}
                data-testid="text-editor-back-button"
              >
                <Trans message="Back" />
              </Button>
              <FormSlugEditor
                name="slug"
                showLinkIcon={false}
                prefix="pages"
                hideButton={!allowSlugEditing}
              />
            </Fragment>
          )}
          {editor && <HistoryButtons editor={editor} />}
          {!isMobile && <ModeButton editor={editor} />}
          <SaveButton page={page} editor={editor} endpoint={endpoint} />
        </div>
        <MenuBar editor={editor} size="sm" />
      </div>
    </Fragment>
  );
}

interface SaveButtonProps {
  page?: CustomPage;
  editor: Editor;
  endpoint?: string;
}
function SaveButton({page, editor, endpoint}: SaveButtonProps) {
  const crupdatePage = useCrupdatePage(endpoint);
  const navigate = useNavigate();
  const {trans} = useTrans();
  const form = useFormContext();
  const title = form.watch('title');

  return (
    <Button
      variant="flat"
      size="sm"
      color="primary"
      className="min-w-90"
      disabled={crupdatePage.isLoading || !title}
      data-testid="text-editor-save-button"
      onClick={() => {
        crupdatePage.mutate(
          {
            pageId: page?.id,
            payload: {
              ...form.getValues(),
              body: editor?.getHTML(),
            },
          },
          {
            onSuccess: () => {
              const msg = page?.id
                ? trans({message: 'Updated page'})
                : trans({message: 'Created page'});
              toast(msg);
              queryClient.invalidateQueries(['custom-pages']);
              navigate(page ? '../..' : '..', {relative: 'path'});
            },
          }
        );
      }}
    >
      <Trans message="Save" />
    </Button>
  );
}

interface FormSlugEditorProps extends SlugEditorProps {
  name: string;
}

function FormSlugEditor({name, ...other}: FormSlugEditorProps) {
  const {
    field: {onChange, onBlur, value = '', ref},
  } = useController({
    name,
  });
  const manuallyChanged = useRef(false);

  const {watch, setValue} = useFormContext<CrupdatePagePayload>();

  useEffect(() => {
    const subscription = watch((formVal, {name: fieldName}) => {
      // if user has not changed slug manually, set it based on page title field changes
      if (fieldName === 'title' && !manuallyChanged.current) {
        setValue('slug', formVal.title);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <SlugEditor
      className={clsx('mr-auto', !value && 'invisible')}
      onChange={e => {
        manuallyChanged.current = true;
        onChange(e);
      }}
      onInputBlur={onBlur}
      value={value}
      inputRef={ref}
      {...other}
    />
  );
}
