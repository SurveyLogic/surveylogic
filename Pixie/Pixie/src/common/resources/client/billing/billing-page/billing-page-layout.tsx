import {useUser} from '../../auth/ui/use-user';
import {Navbar} from '../../ui/navigation/navbar/navbar';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {useAuth} from '../../auth/use-auth';
import {Outlet} from 'react-router-dom';
import {Footer} from '../../ui/footer/footer';
import {StaticPageTitle} from '../../seo/static-page-title';
import {Trans} from '../../i18n/trans';

export function BillingPageLayout() {
  const {user} = useAuth();
  const query = useUser(user!.id, {
    with: ['subscriptions.product', 'subscriptions.price'],
  });

  return (
    <div className="flex flex-col h-full">
      <StaticPageTitle>
        <Trans message="Billing" />
      </StaticPageTitle>
      <Navbar className="flex-shrink-0" menuPosition="billing-page" />
      <div className="flex-auto overflow-auto flex flex-col">
        <div className="container mx-auto my-24 px-24 flex-auto">
          {query.isLoading ? (
            <ProgressCircle
              className="my-80"
              aria-label="Loading user.."
              isIndeterminate
            />
          ) : (
            <Outlet />
          )}
        </div>
        <Footer className="flex-shrink-0 container mx-auto px-24" />
      </div>
    </div>
  );
}
