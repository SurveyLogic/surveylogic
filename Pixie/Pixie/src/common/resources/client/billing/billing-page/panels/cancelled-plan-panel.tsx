import {useBillingUser} from '../use-billing-user';
import {FormattedDate} from '../../../i18n/formatted-date';
import {BillingPlanPanel} from '../billing-plan-panel';
import {Trans} from '../../../i18n/trans';
import {Chip} from '../../../ui/forms/input-field/chip-field/chip';
import {FormattedPrice} from '../../../i18n/formatted-price';
import {CalendarTodayIcon} from '../../../icons/material/CalendarToday';
import {Button} from '../../../ui/buttons/button';
import {Link} from 'react-router-dom';

export function CancelledPlanPanel() {
  const {subscription} = useBillingUser();
  if (!subscription?.price || !subscription?.product) return null;

  const endingDate = (
    <span className="whitespace-nowrap">
      <FormattedDate preset="long" date={subscription.ends_at} />
    </span>
  );

  return (
    <BillingPlanPanel title={<Trans message="Current plan" />}>
      <div className="flex gap-20 justify-between mt-24">
        <div>
          <Chip
            className="w-min mb-10"
            size="xs"
            radius="rounded"
            color="danger"
          >
            <Trans message="Canceled" />
          </Chip>
          <div className="text-xl font-bold mb-2">
            {subscription.product.name}
          </div>
          <FormattedPrice className="text-xl mb-8" price={subscription.price} />
          <div className="text-base flex items-center gap-8">
            <CalendarTodayIcon size="sm" className="text-muted" />
            <Trans
              message="Your plan will be canceled on :date"
              values={{date: endingDate}}
            />
          </div>
        </div>
        <div className="w-[233px]">
          <Button
            variant="flat"
            color="primary"
            size="md"
            className="w-full mb-12"
            elementType={Link}
            to="/billing/renew"
          >
            <Trans message="Renew plan" />
          </Button>
        </div>
      </div>
    </BillingPlanPanel>
  );
}
