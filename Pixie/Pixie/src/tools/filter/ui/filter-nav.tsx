import {useEffect} from 'react';
import {useStore} from '@app/state/store';
import {FilterButton} from '@app/tools/filter/ui/filter-button';
import {
  ScrollableView,
  ScrollableViewItem,
} from '@app/ui/navbar/scrollable-view';
import {tools} from '@app/state/utils';

export function FilterNav() {
  const filters = useStore(s => s.config.tools?.filter?.items) || [];

  useEffect(() => {
    tools().filter.syncState();
  }, []);

  const filterBtns = filters.map(filter => (
    <ScrollableViewItem key={filter}>
      <FilterButton filter={filter} />
    </ScrollableViewItem>
  ));
  return <ScrollableView>{filterBtns}</ScrollableView>;
}
