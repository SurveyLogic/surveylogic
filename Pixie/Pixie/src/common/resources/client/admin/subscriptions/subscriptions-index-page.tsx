import React, {Fragment} from 'react';
import {DataTablePage} from '../../datatable/page/data-table-page';
import {IconButton} from '../../ui/buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {ColumnConfig} from '../../datatable/column-config';
import {Trans} from '../../i18n/trans';
import {DeleteSelectedItemsAction} from '../../datatable/page/delete-selected-items-action';
import {DataTableEmptyStateMessage} from '../../datatable/page/data-table-emty-state-message';
import {SubscriptionIndexPageFilters} from './subscription-index-page-filters';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {DataTableAddItemButton} from '../../datatable/data-table-add-item-button';
import subscriptionsSvg from './subscriptions.svg';
import {NameWithAvatar} from '../../datatable/column-templates/name-with-avatar';
import {Subscription} from '../../billing/subscription';
import {CloseIcon} from '../../icons/material/Close';
import {FormattedDate} from '../../i18n/formatted-date';
import {UpdateSubscriptionDialog} from './update-subscription-dialog';
import {CreateSubscriptionDialog} from './create-subscription-dialog';
import {useCancelSubscription} from '../../billing/billing-page/requests/use-cancel-subscription';
import {PauseIcon} from '../../icons/material/Pause';
import {queryClient} from '../../http/query-client';
import {DatatableDataQueryKey} from '../../datatable/requests/paginated-resources';
import {Tooltip} from '../../ui/tooltip/tooltip';
import {useResumeSubscription} from '../../billing/billing-page/requests/use-resume-subscription';
import {PlayArrowIcon} from '../../icons/material/PlayArrow';
import {ConfirmationDialog} from '../../ui/overlays/dialog/confirmation-dialog';
import {Chip} from '../../ui/forms/input-field/chip-field/chip';

const endpoint = 'billing/subscriptions';

const columnConfig: ColumnConfig<Subscription>[] = [
  {
    key: 'usr_id',
    allowsSorting: true,
    width: 'flex-3 min-w-200',
    visibleInMode: 'all',
    header: () => <Trans message="Customer" />,
    body: subscriptions => (
      <NameWithAvatar
        image={subscriptions.user!.avatar}
        label={subscriptions.user!.display_name}
        description={subscriptions.user!.email}
      />
    ),
  },
  {
    key: 'status',
    width: 'w-100 flex-shrink-0',
    header: () => <Trans message="Status" />,
    body: subscription => {
      if (subscription.valid) {
        return (
          <Chip size="xs" color="positive" radius="rounded" className="w-max">
            <Trans message="Active" />
          </Chip>
        );
      }
      return (
        <Chip size="xs" radius="rounded" className="w-max">
          <Trans message="Cancelled" />
        </Chip>
      );
    },
  },
  {
    key: 'product_id',
    allowsSorting: true,
    header: () => <Trans message="Plan" />,
    body: subscription => subscription.product?.name,
  },
  {
    key: 'gateway',
    allowsSorting: true,
    header: () => <Trans message="Gateway" />,
    body: subscription => (
      <span className="capitalize">{subscription.gateway_name}</span>
    ),
  },
  {
    key: 'renews_at',
    allowsSorting: true,
    header: () => <Trans message="Renews at" />,
    body: subscription => <FormattedDate date={subscription.renews_at} />,
  },
  {
    key: 'ends_at',
    allowsSorting: true,
    header: () => <Trans message="Ends at" />,
    body: subscription => <FormattedDate date={subscription.ends_at} />,
  },
  {
    key: 'created_at',
    allowsSorting: true,
    header: () => <Trans message="Created at" />,
    body: subscription => <FormattedDate date={subscription.created_at} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    visibleInMode: 'all',
    width: 'w-128 flex-shrink-0',
    body: subscription => {
      return <SubscriptionActions subscription={subscription} />;
    },
  },
];

export function SubscriptionsIndexPage() {
  return (
    <DataTablePage
      endpoint={endpoint}
      title={<Trans message="Subscriptions" />}
      columns={columnConfig}
      filters={SubscriptionIndexPageFilters}
      actions={<PageActions />}
      enableSelection={false}
      selectedActions={<DeleteSelectedItemsAction />}
      queryParams={{with: 'product'}}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={subscriptionsSvg}
          title={<Trans message="No subscriptions have been created yet" />}
          filteringTitle={<Trans message="No matching subscriptions" />}
        />
      }
    />
  );
}

function PageActions() {
  return (
    <>
      <DialogTrigger type="modal">
        <DataTableAddItemButton>
          <Trans message="Add new subscription" />
        </DataTableAddItemButton>
        <CreateSubscriptionDialog />
      </DialogTrigger>
    </>
  );
}

interface SubscriptionActionsProps {
  subscription: Subscription;
}
function SubscriptionActions({subscription}: SubscriptionActionsProps) {
  return (
    <Fragment>
      <DialogTrigger type="modal">
        <IconButton size="md" className="text-muted">
          <EditIcon />
        </IconButton>
        <UpdateSubscriptionDialog subscription={subscription} />
      </DialogTrigger>
      {subscription.cancelled ? (
        <ResumeSubscriptionButton subscription={subscription} />
      ) : (
        <SuspendSubscriptionButton subscription={subscription} />
      )}
      <CancelSubscriptionButton subscription={subscription} />
    </Fragment>
  );
}

function SuspendSubscriptionButton({subscription}: SubscriptionActionsProps) {
  const cancelSubscription = useCancelSubscription();

  const handleSuspendSubscription = () => {
    cancelSubscription.mutate(
      {subscriptionId: subscription.id},
      {
        onSuccess: () => {
          queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
        },
      }
    );
  };

  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          handleSuspendSubscription();
        }
      }}
    >
      <Tooltip label={<Trans message="Cancel subscription" />}>
        <IconButton
          size="md"
          className="text-muted"
          disabled={cancelSubscription.isLoading}
        >
          <PauseIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        title={<Trans message="Cancel subscription" />}
        body={
          <div>
            <Trans message="Are you sure you want to cancel this subscription?" />
            <div className="font-semibold text-sm mt-10">
              <Trans message="This will put user on grace period until their next scheduled renewal date. Subscription can be renewed until that date by user or from admin area." />
            </div>
          </div>
        }
        confirm={<Trans message="Confirm" />}
      />
    </DialogTrigger>
  );
}

function ResumeSubscriptionButton({subscription}: SubscriptionActionsProps) {
  const resumeSubscription = useResumeSubscription();
  const handleResumeSubscription = () => {
    resumeSubscription.mutate(
      {subscriptionId: subscription.id},
      {
        onSuccess: () => {
          queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
        },
      }
    );
  };

  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          handleResumeSubscription();
        }
      }}
    >
      <Tooltip label={<Trans message="Renew subscription" />}>
        <IconButton
          size="md"
          className="text-muted"
          onClick={handleResumeSubscription}
          disabled={resumeSubscription.isLoading}
        >
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        title={<Trans message="Resume subscription" />}
        body={
          <div>
            <Trans message="Are you sure you want to resume this subscription?" />
            <div className="font-semibold text-sm mt-10">
              <Trans message="This will put user on their original plan and billing cycle." />
            </div>
          </div>
        }
        confirm={<Trans message="Confirm" />}
      />
    </DialogTrigger>
  );
}

function CancelSubscriptionButton({subscription}: SubscriptionActionsProps) {
  const cancelSubscription = useCancelSubscription();

  const handleDeleteSubscription = () => {
    cancelSubscription.mutate(
      {subscriptionId: subscription.id, delete: true},
      {
        onSuccess: () => {
          queryClient.invalidateQueries(DatatableDataQueryKey(endpoint));
        },
      }
    );
  };

  return (
    <DialogTrigger
      type="modal"
      onClose={confirmed => {
        if (confirmed) {
          handleDeleteSubscription();
        }
      }}
    >
      <Tooltip label={<Trans message="Delete subscription" />}>
        <IconButton
          size="md"
          className="text-muted"
          disabled={cancelSubscription.isLoading}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
      <ConfirmationDialog
        isDanger
        title={<Trans message="Delete subscription" />}
        body={
          <div>
            <Trans message="Are you sure you want to delete this subscription?" />
            <div className="font-semibold text-sm mt-10">
              <Trans message="This will permanently delete the subscription and immediately cancel it on billing gateway. Subscription will not be renewable anymore." />
            </div>
          </div>
        }
        confirm={<Trans message="Confirm" />}
      />
    </DialogTrigger>
  );
}
