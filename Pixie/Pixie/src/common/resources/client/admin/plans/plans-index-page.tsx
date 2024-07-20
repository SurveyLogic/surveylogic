import React, {Fragment} from 'react';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {FormattedDate} from '../../i18n/formatted-date';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import softwareEngineerSvg from './../tags/software-engineer.svg';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import {Product} from '../../billing/product';
import {NameWithAvatar} from '../../datatable/column-templates/name-with-avatar';
import {Link} from 'react-router-dom';
import {FormattedPrice} from '../../i18n/formatted-price';
import {SyncIcon} from '../../icons/material/Sync';
import {useSyncProducts} from './requests/use-sync-products';
import {Tooltip} from '../../ui/tooltip/tooltip';
import {useDeleteProduct} from './requests/use-delete-product';
import {DeleteIcon} from '../../icons/material/Delete';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {ConfirmationDialog} from '../../ui/overlays/dialog/confirmation-dialog';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {PlansIndexPageFilters} from './plans-index-page-filters';

const columnConfig: ColumnConfig<Product>[] = [
  {
    key: 'name',
    allowsSorting: true,
    visibleInMode: 'all',
    header: () => <Trans message="Name" />,
    body: product => {
      const price = product.prices[0];
      return (
        <NameWithAvatar
          label={product.name}
          description={
            product.free ? (
              <Trans message="Free" />
            ) : (
              <FormattedPrice price={price} />
            )
          }
        />
      );
    },
  },
  {
    key: 'created_at',
    allowsSorting: true,
    maxWidth: 'max-w-100',
    header: () => <Trans message="Created" />,
    body: product => <FormattedDate date={product.created_at} />,
  },
  {
    key: 'updated_at',
    allowsSorting: true,
    maxWidth: 'max-w-100',
    header: () => <Trans message="Last updated" />,
    body: product => <FormattedDate date={product.updated_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    visibleInMode: 'all',
    hideHeader: true,
    align: 'end',
    maxWidth: 'max-w-84',
    body: product => {
      return (
        <Fragment>
          <IconButton
            size="md"
            className="text-muted"
            elementType={Link}
            to={`/admin/plans/${product.id}/edit`}
          >
            <EditIcon />
          </IconButton>
          <DeleteProductButton product={product} />
        </Fragment>
      );
    },
  },
];

export function PlansIndexPage() {
  const navigate = useNavigate();
  return (
    <DataTablePage
      endpoint="billing/products"
      title={<Trans message="Subscription plans" />}
      columns={columnConfig}
      actions={<Actions />}
      enableSelection={false}
      filters={PlansIndexPageFilters}
      onRowAction={item => {
        navigate(`/admin/plans/${item.id}/edit`);
      }}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={softwareEngineerSvg}
          title={<Trans message="No plans have been created yet" />}
          filteringTitle={<Trans message="No matching plans" />}
        />
      }
    />
  );
}

interface DeleteProductButtonProps {
  product: Product;
}
function DeleteProductButton({product}: DeleteProductButtonProps) {
  const deleteProduct = useDeleteProduct();
  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          deleteProduct.mutate({productId: product.id});
        }
      }}
    >
      <Tooltip label={<Trans message="Delete plan" />}>
        <IconButton
          size="md"
          className="text-muted"
          disabled={deleteProduct.isLoading}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        title={<Trans message="Delete plan" />}
        body={<Trans message="Are you sure you want to delete this plan?" />}
        confirm={<Trans message="Delete" />}
      />
    </DialogTrigger>
  );
}

function Actions() {
  const syncPlans = useSyncProducts();
  return (
    <Fragment>
      <Tooltip label={<Trans message="Sync plans with Stripe & PayPal" />}>
        <IconButton
          color="primary"
          variant="outline"
          radius="rounded"
          size="sm"
          disabled={syncPlans.isLoading}
          onClick={() => {
            syncPlans.mutate();
          }}
        >
          <SyncIcon />
        </IconButton>
      </Tooltip>
      <DataTableAddItemButton elementType={Link} to="/admin/plans/new">
        <Trans message="Add new plan" />
      </DataTableAddItemButton>
    </Fragment>
  );
}
