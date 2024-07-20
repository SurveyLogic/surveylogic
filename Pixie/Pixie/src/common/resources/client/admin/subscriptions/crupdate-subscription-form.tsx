import {UseFormReturn} from 'react-hook-form';
import {Form} from '../../ui/forms/form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {FormSelect} from '../../ui/forms/select/select';
import {Trans} from '../../i18n/trans';
import {Item} from '../../ui/forms/listbox/item';
import {Subscription} from '../../billing/subscription';
import {FormDatePicker} from '../../ui/forms/input-field/date/date-picker/date-picker';
import {USER_MODEL} from '../../auth/user';
import {useProducts} from '../../billing/pricing-table/use-products';
import {FormattedPrice} from '../../i18n/formatted-price';
import {FormNormalizedModelField} from '../../ui/forms/normalized-model-field';

interface CrupdateSubscriptionForm {
  onSubmit: (values: Partial<Subscription>) => void;
  formId: string;
  form: UseFormReturn<Partial<Subscription>>;
}
export function CrupdateSubscriptionForm({
  form,
  onSubmit,
  formId,
}: CrupdateSubscriptionForm) {
  const query = useProducts();
  // @ts-ignore
  const watchedProductId = form.watch('product_id');
  const selectedProduct = query.data?.products.find(
    p => p.id === watchedProductId
  );

  return (
    <Form id={formId} form={form} onSubmit={onSubmit}>
      <FormNormalizedModelField
        name="user_id"
        className="mb-20"
        modelType={USER_MODEL}
        label={<Trans message="User" />}
        openMenuOnFocus
      />
      <FormSelect
        name="product_id"
        selectionMode="single"
        className="mb-20"
        label={<Trans message="Plan" />}
      >
        {query.data?.products
          .filter(p => !p.free)
          .map(product => (
            <Item key={product.id} value={product.id}>
              <Trans message={product.name} />
            </Item>
          ))}
      </FormSelect>
      {!selectedProduct?.free && (
        <FormSelect
          name="price_id"
          selectionMode="single"
          className="mb-20"
          label={<Trans message="Price" />}
        >
          {selectedProduct?.prices.map(price => (
            <Item key={price.id} value={price.id}>
              <FormattedPrice price={price} />
            </Item>
          ))}
        </FormSelect>
      )}
      <FormTextField
        inputElementType="textarea"
        rows={3}
        name="description"
        label={<Trans message="Description" />}
        className="mb-20"
      />
      <FormDatePicker
        className="mb-20"
        name="renews_at"
        granularity="day"
        label={<Trans message="Renews at" />}
        description={
          <Trans message="This will only change local records. User will continue to be billed on their original cycle on the payment gateway." />
        }
      />
      <FormDatePicker
        className="mb-20"
        name="ends_at"
        granularity="day"
        label={<Trans message="Ends at" />}
        description={
          <Trans message="This will only change local records. User will continue to be billed on their original cycle on the payment gateway." />
        }
      />
    </Form>
  );
}
