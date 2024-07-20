import {useCallback, useEffect, useMemo, useState} from 'react';
import {FontSelectorFilterValue} from '@common/ui/font-selector/font-selector-filters';
import {FontConfig, useValueLists} from '@common/http/value-lists';
import {useFilter} from '@common/i18n/use-filter';
import {BrowserSafeFonts} from '@common/ui/font-picker/browser-safe-fonts';
import {chunkArray} from '@common/utils/array/chunk-array';
import {loadFonts} from '@common/ui/font-picker/load-fonts';

export interface FontSelectorState extends UseFontSelectorProps {
  fonts: FontConfig[];
  filteredFonts: FontConfig[];
  pages: FontConfig[][];
  isLoading: boolean;
  filters: FontSelectorFilterValue;
  setFilters: (filters: FontSelectorFilterValue) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export interface UseFontSelectorProps {
  value?: FontConfig;
  onChange: (value: FontConfig) => void;
}
export function useFontSelectorState({
  value,
  onChange,
}: UseFontSelectorProps): FontSelectorState {
  const {data, isLoading} = useValueLists(['googleFonts']);
  const [currentPage, setCurrentPage] = useState(0);

  const [filters, setFilterState] = useState<FontSelectorFilterValue>({
    query: '',
    category: '',
  });
  const {contains} = useFilter({
    sensitivity: 'base',
  });

  const setFilters = useCallback((filters: FontSelectorFilterValue) => {
    setFilterState(filters);
    // reset to first page when searching or changing category
    setCurrentPage(0);
  }, []);

  const allFonts = useMemo(() => {
    return BrowserSafeFonts.concat(data?.googleFonts ?? []);
  }, [data?.googleFonts]);

  const filteredFonts = useMemo(() => {
    return allFonts.filter(font => {
      return (
        contains(font.family, filters.query) &&
        (!filters.category ||
          font.category?.toLowerCase() === filters.category.toLowerCase())
      );
    });
  }, [allFonts, filters, contains]);

  const pages = useMemo(() => {
    return chunkArray(filteredFonts, 20);
  }, [filteredFonts]);
  const fonts = pages[currentPage];

  useEffect(() => {
    const id = 'font-selector';
    if (fonts?.length) {
      loadFonts(fonts, {id});
    }
  }, [fonts, currentPage]);

  return {
    fonts: fonts || [],
    currentPage,
    filteredFonts: filteredFonts || [],
    setCurrentPage,
    isLoading,
    filters,
    setFilters,
    value,
    onChange,
    pages,
  };
}
