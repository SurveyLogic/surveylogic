import {Fragment} from 'react';
import {Breadcrumb} from '../../../ui/breadcrumbs/breadcrumb';
import {useNavigate} from '../../../utils/hooks/use-navigate';
import {BreadcrumbItem} from '../../../ui/breadcrumbs/breadcrumb-item';
import {Trans} from '../../../i18n/trans';
import {Outlet} from 'react-router-dom';

const previousUrl = '/billing';

export function ChangePaymentMethodLayout() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem isLink onSelected={() => navigate(previousUrl)}>
          <Trans message="Billing" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Trans message="Payment method" />
        </BreadcrumbItem>
      </Breadcrumb>
      <h1 className="text-3xl font-bold my-32 md:my-64">
        <Trans message="Change payment method" />
      </h1>
      <Outlet />
    </Fragment>
  );
}
