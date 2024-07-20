import React, {useContext, useMemo} from 'react';
import {Link} from 'react-router-dom';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {Trans} from '../../i18n/trans';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import articlesSvg from './articles.svg';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import {CustomPageDatatableFilters} from './custom-page-datatable-filters';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {CustomPageDatatableColumns} from '@common/admin/custom-pages/custom-page-datatable-columns';
import {SiteConfigContext} from '@common/core/settings/site-config-context';

export function CustomPageDatablePage() {
  const config = useContext(SiteConfigContext);
  const filters = useMemo(() => {
    return CustomPageDatatableFilters(config);
  }, [config]);

  return (
    <DataTablePage
      endpoint="custom-pages"
      title={<Trans message="Custom pages" />}
      filters={filters}
      columns={CustomPageDatatableColumns}
      queryParams={{with: 'user'}}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={articlesSvg}
          title={<Trans message="No pages have been created yet" />}
          filteringTitle={<Trans message="No matching pages" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton elementType={Link} to="new">
      <Trans message="New page" />
    </DataTableAddItemButton>
  );
}
