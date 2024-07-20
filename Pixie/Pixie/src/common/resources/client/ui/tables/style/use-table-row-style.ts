import clsx from 'clsx';
import {useContext} from 'react';
import {TableContext} from '@common/ui/tables/table-context';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';

interface Props {
  index: number;
  isSelected: boolean;
  isHeader?: boolean;
}
export function useTableRowStyle({index, isSelected, isHeader}: Props) {
  const isDarkMode = useIsDarkMode();
  const isMobile = useIsMobileMediaQuery();
  const {hideBorder, enableSelection, collapseOnMobile} =
    useContext(TableContext);
  const isFirst = index === 0;
  return clsx(
    'flex gap-x-16 break-inside-avoid outline-none border border-transparent',
    isMobile && collapseOnMobile && hideBorder
      ? 'mb-8 pl-8 pr-0 rounded'
      : 'px-16',
    !hideBorder && 'border-b-divider',
    !hideBorder && isFirst && 'border-t-divider',
    isSelected &&
      !isDarkMode &&
      'bg-primary/selected hover:bg-primary/focus focus-visible:bg-primary/focus',
    isSelected &&
      isDarkMode &&
      'bg-selected hover:bg-focus focus-visible:bg-focus',
    !isSelected &&
      !isHeader &&
      enableSelection &&
      'focus-visible:bg-focus hover:bg-hover'
  );
}
