import {AnimatePresence, m} from 'framer-motion';
import {Fragment} from 'react';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {useProducts} from '@common/billing/pricing-table/use-products';
import {Product} from '@common/billing/product';
import {
  findBestPrice,
  UpsellBillingCycle,
} from '@common/billing/pricing-table/find-best-price';
import {useAuth} from '@common/auth/use-auth';
import clsx from 'clsx';
import {Chip} from '@common/ui/forms/input-field/chip-field/chip';
import {Trans} from '@common/i18n/trans';
import {FormattedPrice} from '@common/i18n/formatted-price';
import {Button} from '@common/ui/buttons/button';
import {Link} from 'react-router-dom';
import {setInLocalStorage} from '@common/utils/hooks/local-storage';
import {ProductFeatureList} from '@common/billing/pricing-table/product-feature-list';

interface PricingTableProps {
  selectedCycle: UpsellBillingCycle;
  className?: string;
}
export function PricingTable({selectedCycle, className}: PricingTableProps) {
  const query = useProducts();
  return (
    <div
      className={clsx(
        'flex flex-col md:flex-row items-center gap-24 pb-20 overflow-x-auto overflow-y-visible',
        className
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {query.data ? (
          <PlanList
            key="plan-list"
            plans={query.data.products}
            selectedPeriod={selectedCycle}
          />
        ) : (
          <SkeletonLoader key="skeleton-loader" />
        )}
      </AnimatePresence>
    </div>
  );
}

interface PlanListProps {
  plans: Product[];
  selectedPeriod: UpsellBillingCycle;
}
function PlanList({plans, selectedPeriod}: PlanListProps) {
  const {isLoggedIn, isSubscribed} = useAuth();
  const filteredPlans = plans.filter(plan => !plan.hidden);
  return (
    <Fragment>
      {filteredPlans.map((plan, index) => {
        const isFirst = index === 0;
        const isLast = index === filteredPlans.length - 1;
        const price = findBestPrice(selectedPeriod, plan.prices);

        let upgradeRoute;
        if (!isLoggedIn) {
          upgradeRoute = `/register?redirectFrom=pricing`;
        }
        if (isSubscribed) {
          upgradeRoute = `/change-plan/${plan.id}/${price?.id}/confirm`;
        }
        if (isLoggedIn && !plan.free) {
          upgradeRoute = `/checkout/${plan.id}/${price?.id}`;
        }

        return (
          <m.div
            key={plan.id}
            {...opacityAnimation}
            className={clsx(
              'px-28 rounded-lg w-full md:max-w-350 md:min-w-240 border shadow-lg bg-paper',
              plan.recommended ? 'py-56' : 'py-28',
              isFirst && 'ml-auto',
              isLast && 'mr-auto'
            )}
          >
            <div className="mb-32">
              <Chip
                radius="rounded"
                size="sm"
                className={clsx(
                  'mb-20 w-min',
                  !plan.recommended && 'invisible'
                )}
              >
                <Trans message="Most popular" />
              </Chip>
              <div className="text-xl font-semibold mb-12">
                <Trans message={plan.name} />
              </div>
              <div className="text-sm text-muted">
                <Trans message={plan.description} />
              </div>
            </div>
            <div>
              {price ? (
                <FormattedPrice
                  priceClassName="font-bold text-4xl"
                  periodClassName="text-muted text-xs"
                  variant="separateLine"
                  price={price}
                />
              ) : (
                <div className="font-bold text-4xl">
                  <Trans message="Free" />
                </div>
              )}
              <div className="mt-60">
                <Button
                  variant="flat"
                  color="primary"
                  className="w-full"
                  size="md"
                  elementType={upgradeRoute ? Link : undefined}
                  disabled={!upgradeRoute}
                  onClick={() => {
                    if (isLoggedIn || !price || !plan) return;
                    setInLocalStorage('be.onboarding.selected', {
                      productId: plan.id,
                      priceId: price.id,
                    });
                  }}
                  to={upgradeRoute}
                >
                  <ActionButtonText product={plan} />
                </Button>
              </div>
              <ProductFeatureList product={plan} />
            </div>
          </m.div>
        );
      })}
    </Fragment>
  );
}

interface ActionButtonTextProps {
  product: Product;
}
function ActionButtonText({product}: ActionButtonTextProps) {
  const {isLoggedIn} = useAuth();
  if (product.free && isLoggedIn) {
    return <Trans message="You're on :plan" values={{plan: product.name}} />;
  }
  if (product.free) {
    return <Trans message="Get started" />;
  }
  return <Trans message="Upgrade" />;
}

function SkeletonLoader() {
  return (
    <Fragment>
      <PlanSkeleton key="skeleton-1" />
      <PlanSkeleton key="skeleton-2" />
      <PlanSkeleton key="skeleton-3" />
    </Fragment>
  );
}

function PlanSkeleton() {
  return (
    <m.div
      {...opacityAnimation}
      className="px-28 py-90 rounded-lg border shadow-lg w-full md:max-w-350"
    >
      <Skeleton className="my-10" />
      <Skeleton className="mb-40" />
      <Skeleton className="h-30 mb-40" />
      <Skeleton className="h-40 mb-40" />
      <Skeleton className="mb-20" />
      <Skeleton />
      <Skeleton />
    </m.div>
  );
}
