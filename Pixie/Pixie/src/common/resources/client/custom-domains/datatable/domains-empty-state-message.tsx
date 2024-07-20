import world from '@common/custom-domains/datatable/world.svg';
import {Trans} from '@common/i18n/trans';
import {
  DataTableEmptyStateMessage,
  DataTableEmptyStateMessageProps,
} from '@common/datatable/page/data-table-emty-state-message';
import React from 'react';

export function DomainsEmptyStateMessage(
  props: Partial<DataTableEmptyStateMessageProps>
) {
  return (
    <DataTableEmptyStateMessage
      {...props}
      image={world}
      title={<Trans message="No domains have been connected yet" />}
      filteringTitle={<Trans message="No matching domains" />}
    />
  );
}
