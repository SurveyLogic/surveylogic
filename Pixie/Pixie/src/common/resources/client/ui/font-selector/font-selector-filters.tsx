import {useTrans} from '@common/i18n/use-trans';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '@common/icons/material/Search';
import {message} from '@common/i18n/message';
import {Select} from '@common/ui/forms/select/select';
import {Item} from '@common/ui/forms/listbox/item';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {FontSelectorState} from '@common/ui/font-selector/font-selector-state';

export interface FontSelectorFilterValue {
  query: string;
  category: string;
}

interface FiltersHeaderProps {
  state: FontSelectorState;
}
export function FontSelectorFilters({
  state: {filters, setFilters},
}: FiltersHeaderProps) {
  const {trans} = useTrans();
  return (
    <div className="flex items-center gap-24 mb-24">
      <TextField
        className="flex-auto"
        value={filters.query}
        onChange={e => {
          setFilters({
            ...filters,
            query: e.target.value,
          });
        }}
        startAdornment={<SearchIcon />}
        placeholder={trans(message('Search fonts'))}
      />
      <Select
        className="flex-auto"
        selectionMode="single"
        selectedValue={filters.category}
        onSelectionChange={value => {
          setFilters({
            ...filters,
            category: value as string,
          });
        }}
      >
        <Item value="">
          <Trans message="All categories" />
        </Item>
        <Item value="serif">
          <Trans message="Serif" />
        </Item>
        <Item value="sans-serif">
          <Trans message="Sans serif" />
        </Item>
        <Item value="display">
          <Trans message="Display" />
        </Item>
        <Item value="handwriting">
          <Trans message="Handwriting" />
        </Item>
        <Item value="monospace">
          <Trans message="Monospace" />
        </Item>
      </Select>
    </div>
  );
}
