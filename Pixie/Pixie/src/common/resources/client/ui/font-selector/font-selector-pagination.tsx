import {Trans} from '@common/i18n/trans';
import {IconButton} from '@common/ui/buttons/icon-button';
import {KeyboardArrowLeftIcon} from '@common/icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '@common/icons/material/KeyboardArrowRight';
import React from 'react';
import {FontSelectorState} from '@common/ui/font-selector/font-selector-state';

interface FontSelectorPaginationProps {
  state: FontSelectorState;
}
export function FontSelectorPagination({
  state: {currentPage = 0, setCurrentPage, filteredFonts, pages},
}: FontSelectorPaginationProps) {
  const total = filteredFonts?.length || 0;

  return (
    <div className="flex items-center justify-end gap-24 text-sm mt-30 pt-14 border-t">
      {total > 0 && (
        <div>
          <Trans
            message=":from - :to of :total"
            values={{
              from: currentPage * 20 + 1,
              to: Math.min((currentPage + 1) * 20, total),
              total,
            }}
          />
        </div>
      )}
      <div className="text-muted">
        <IconButton
          disabled={currentPage < 1}
          onClick={() => {
            setCurrentPage(Math.max(0, currentPage - 1));
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton
          disabled={currentPage >= pages.length - 1}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
}
