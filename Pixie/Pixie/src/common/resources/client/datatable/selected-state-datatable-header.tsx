import {Trans} from '@common/i18n/trans';
import React, {ReactNode} from 'react';
import {HeaderLayout} from '@common/datatable/data-table-header';

interface Props {
  actions?: ReactNode;
  selectedItemsCount: number;
}
export function SelectedStateDatatableHeader({
  actions,
  selectedItemsCount,
}: Props) {
  return (
    <HeaderLayout data-testid="datatable-selected-header">
      <div className="mr-auto">
        <Trans
          message="[one 1 item|other :count items] selected"
          values={{count: selectedItemsCount}}
        />
      </div>
      {actions}
    </HeaderLayout>
  );
}
