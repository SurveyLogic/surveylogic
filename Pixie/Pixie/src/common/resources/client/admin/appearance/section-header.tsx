import {Link, useLocation} from 'react-router-dom';
import clsx from 'clsx';
import {Fragment, useEffect, useState} from 'react';
import {IconButton} from '../../ui/buttons/icon-button';
import {KeyboardArrowLeftIcon} from '../../icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '../../icons/material/KeyboardArrowRight';
import {Trans} from '../../i18n/trans';
import {MixedText} from '../../i18n/mixed-text';
import {useFormContext} from 'react-hook-form';
import {appearanceState, AppearanceValues} from './appearance-store';
import {AppearanceEditorBreadcrumbItem} from './types/appearance-editor-section';
import {message} from '../../i18n/message';

export function SectionHeader() {
  const {pathname} = useLocation();
  const {getValues} = useFormContext<AppearanceValues>();
  const [breadcrumb, setBreadcrumb] = useState<
    AppearanceEditorBreadcrumbItem[] | null
  >(null);

  useEffect(() => {
    const [, , sectionName] = pathname.split('/').filter(p => !!p);
    if (sectionName) {
      const section = appearanceState().config?.sections[sectionName];
      if (section) {
        setBreadcrumb([
          {
            label: message('Appearance'),
            location: '',
          },
          ...section.buildBreadcrumb(pathname, getValues()),
        ]);
        // bail, so breadcrumb is not cleared below
        return;
      }
    }
    setBreadcrumb(null);
  }, [pathname, getValues]);

  // not need to show section header if already at root
  if (!breadcrumb || breadcrumb.length < 2) {
    return null;
  }

  return (
    <div className="flex items-center border-b h-60 flex-shrink-0">
      <IconButton
        iconSize="md"
        radius="rounded-none"
        className="text-muted h-full w-50 flex-shrink-0"
        elementType={Link}
        to={`/admin/appearance/${breadcrumb[breadcrumb.length - 2].location}`}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <div className="border-l p-10 min-w-0">
        <div className="text-xs text-muted">
          <Trans message="Customizing" />
        </div>
        <div className="flex items-center gap-4 text-sm mt-2">
          {breadcrumb.map((item, index) => {
            const isLast = breadcrumb.length - 1 === index;
            const isFirst = index === 0;
            const label = <MixedText value={item.label} />;

            if (isFirst) {
              return null;
            }

            return (
              <Fragment key={index}>
                <div
                  className={clsx(
                    'whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0',
                    isLast && 'text-primary',
                    // don't overflow ellipses last item
                    isLast ? 'flex-shrink-0' : 'flex-auto'
                  )}
                >
                  {label}
                </div>
                {!isLast && (
                  <KeyboardArrowRightIcon className="icon-sm text-muted flex-shrink-0" />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
