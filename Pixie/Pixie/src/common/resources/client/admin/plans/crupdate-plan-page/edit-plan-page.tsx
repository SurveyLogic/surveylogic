import {FullPageLoader} from '../../../ui/progress/full-page-loader';
import {Trans} from '../../../i18n/trans';
import {useForm} from 'react-hook-form';
import {CrupdateResourceLayout} from '../../crupdate-resource-layout';
import {useProduct} from '../requests/use-product';
import {Product} from '../../../billing/product';
import {CrupdatePlanForm} from './crupdate-plan-form';
import {
  UpdateProductPayload,
  useUpdateProduct,
} from '../requests/use-update-product';

export function EditPlanPage() {
  const query = useProduct();

  if (query.status !== 'success') {
    return <FullPageLoader />;
  }

  return <PageContent product={query.data.product} />;
}

interface PageContentProps {
  product: Product;
}
function PageContent({product}: PageContentProps) {
  const form = useForm<UpdateProductPayload>({
    defaultValues: {
      ...product,
      feature_list: product.feature_list.map(f => ({value: f})),
    },
  });
  const updateProduct = useUpdateProduct(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        updateProduct.mutate(values);
      }}
      title={
        <Trans message="Edit “:name“ plan" values={{name: product.name}} />
      }
      isLoading={updateProduct.isLoading}
    >
      <CrupdatePlanForm />
    </CrupdateResourceLayout>
  );
}
