import {Trans} from '../../../i18n/trans';
import {Button} from '../../../ui/buttons/button';
import {Link} from 'react-router-dom';
import {StripeElementsForm} from '../../checkout/stripe/stripe-elements-form';
import {useSettings} from '../../../core/settings/use-settings';

const previousUrl = '/billing';

export function ChangePaymentMethodPage() {
  const {base_url} = useSettings();

  return (
    <div className="max-w-[464px]">
      <StripeElementsForm
        type="setupIntent"
        submitLabel={<Trans message="Change" />}
        returnUrl={`${base_url}/billing/change-payment-method/done`}
      />
      <Button
        variant="outline"
        className="w-full mt-16"
        size="md"
        to={previousUrl}
        elementType={Link}
        type="button"
      >
        <Trans message="Go back" />
      </Button>
    </div>
  );
}
