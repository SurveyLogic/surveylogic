import React, {useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useLocaleWithLines} from './use-locale-with-lines';
import {Trans} from '../../i18n/trans';
import {IconButton} from '../../ui/buttons/icon-button';
import {Button} from '../../ui/buttons/button';
import {Breadcrumb} from '../../ui/breadcrumbs/breadcrumb';
import {BreadcrumbItem} from '../../ui/breadcrumbs/breadcrumb-item';
import {TextField} from '../../ui/forms/input-field/text-field/text-field';
import {useTrans} from '../../i18n/use-trans';
import {SearchIcon} from '../../icons/material/Search';
import {CloseIcon} from '../../icons/material/Close';
import {AddIcon} from '../../icons/material/Add';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {NewTranslationDialog} from './new-translation-dialog';
import {useUpdateLocalization} from './update-localization';
import {Localization} from '../../i18n/localization';
import {FullPageLoader} from '../../ui/progress/full-page-loader';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useNavigate} from '../../utils/hooks/use-navigate';

type Lines = Record<string, string>;

export function TranslationManagementPage() {
  const {localeId} = useParams();

  const {data, isLoading} = useLocaleWithLines(localeId!);
  const localization = data?.localization;

  if (isLoading || !localization) {
    return <FullPageLoader />;
  }

  return <Form localization={localization} />;
}

interface FormProps {
  localization: Localization;
}
function Form({localization}: FormProps) {
  const [lines, setLines] = useState<Lines>(localization.lines || {});

  const navigate = useNavigate();
  const updateLocalization = useUpdateLocalization();
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <form
      className="p-14 md:p-24 flex flex-col h-full"
      onSubmit={e => {
        e.preventDefault();
        updateLocalization.mutate(
          {id: localization.id, lines},
          {
            onSuccess: () => {
              navigate('/admin/localizations');
            },
          }
        );
      }}
    >
      <Header
        localization={localization}
        setLines={setLines}
        lines={lines}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={updateLocalization.isLoading}
      />
      <LinesList lines={lines} setLines={setLines} searchQuery={searchQuery} />
    </form>
  );
}

interface HeaderProps {
  localization: Localization;
  lines: Lines;
  setLines: (lines: Lines) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isLoading: boolean;
}
function Header({
  localization,
  searchQuery,
  setSearchQuery,
  isLoading,
  lines,
  setLines,
}: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobileMediaQuery();
  const {trans} = useTrans();

  return (
    <div className="flex-shrink-0">
      <Breadcrumb size="lg" className="mb-16">
        <BreadcrumbItem
          onSelected={() => {
            navigate('/admin/localizations');
          }}
        >
          <Trans message="Localizations" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Trans
            message=":locale translations"
            values={{locale: localization.name}}
          />
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="mb-24 flex items-center gap-32 md:gap-12">
        <div className="max-w-440 flex-auto">
          <TextField
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            startAdornment={<SearchIcon />}
            placeholder={trans({message: 'Type to search...'})}
          />
        </div>
        <DialogTrigger
          type="modal"
          onClose={newTranslation => {
            if (newTranslation) {
              const newLines = {...lines};
              newLines[newTranslation.key] = newTranslation.value;
              setLines(newLines);
            }
          }}
        >
          {!isMobile && (
            <Button
              className="ml-auto"
              variant="outline"
              color="primary"
              startIcon={<AddIcon />}
            >
              <Trans message="Add new" />
            </Button>
          )}
          <NewTranslationDialog />
        </DialogTrigger>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          disabled={isLoading}
        >
          {isMobile ? (
            <Trans message="Save" />
          ) : (
            <Trans message="Save translations" />
          )}
        </Button>
      </div>
    </div>
  );
}

interface LinesListProps {
  searchQuery?: string;
  lines: Lines;
  setLines: (lines: Lines) => void;
}
function LinesList({searchQuery, lines, setLines}: LinesListProps) {
  const filteredLines = useMemo(() => {
    return Object.entries(lines).filter(([id, translation]) => {
      const lowerCaseQuery = searchQuery?.toLowerCase();
      return (
        !lowerCaseQuery ||
        id?.toLowerCase().includes(lowerCaseQuery) ||
        translation?.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [lines, searchQuery]);

  const ref = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredLines.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 123,
  });

  return (
    <div className="flex-auto overflow-y-auto" ref={ref}>
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualItem => {
          const [id, translation] = filteredLines[virtualItem.index];
          return (
            <div
              key={id}
              className="w-full absolute top-0 left-0"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="rounded border mb-10 md:mr-10">
                <div className="flex items-center gap-24 justify-between px-10 py-2 border-b">
                  <label
                    className="text-xs font-semibold flex-auto"
                    htmlFor={id}
                  >
                    {id}
                  </label>
                  <IconButton
                    size="xs"
                    className="text-muted"
                    onClick={() => {
                      const newLines = {...lines};
                      delete newLines[id];
                      setLines(newLines);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
                <div>
                  <textarea
                    id={id}
                    name={id}
                    defaultValue={translation}
                    className="w-full bg-inherit block rounded resize-none outline-none focus-visible:ring-2 p-10 text-sm"
                    rows={2}
                    onChange={e => {
                      const newLines = {...lines};
                      newLines[id] = e.target.value;
                      setLines(newLines);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
