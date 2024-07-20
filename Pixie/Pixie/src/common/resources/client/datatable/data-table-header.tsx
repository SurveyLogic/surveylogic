import React, {ComponentPropsWithoutRef, ReactNode} from 'react';
import {BackendFilter} from './filters/backend-filter';
import {useTrans} from '../i18n/use-trans';
import {TextField} from '../ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '../icons/material/Search';
import {AddFilterButton} from './filters/add-filter-button';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

interface PageHeaderProps {
  actions?: ReactNode;
  filters?: BackendFilter[];
  searchPlaceholder?: MessageDescriptor;
  searchValue?: string;
  onSearchChange: (value: string) => void;
}
export function DataTableHeader({
  actions,
  filters,
  searchPlaceholder = message('Type to search...'),
  searchValue = '',
  onSearchChange,
}: PageHeaderProps) {
  const {trans} = useTrans();
  return (
    <HeaderLayout>
      <TextField
        inputTestId="datatable-search"
        className="flex-auto max-w-440 mr-auto"
        inputWrapperClassName="mr-24 md:mr-0"
        placeholder={trans(searchPlaceholder)}
        startAdornment={<SearchIcon />}
        value={searchValue}
        onChange={e => {
          onSearchChange(e.target.value);
        }}
      />
      {filters && <AddFilterButton filters={filters} />}
      {actions}
    </HeaderLayout>
  );
}

interface AnimatedHeaderProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
export function HeaderLayout({children, ...domProps}: AnimatedHeaderProps) {
  return (
    <div
      className="mb-24 flex items-center gap-8 md:gap-12 text-muted relative h-42"
      {...domProps}
    >
      {children}
    </div>
  );
}
