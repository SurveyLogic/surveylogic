import {useForm} from 'react-hook-form';
import {CrupdateResourceLayout} from '../../crupdate-resource-layout';
import {Trans} from '../../../i18n/trans';
import {CrupdatePlanForm} from './crupdate-plan-form';
import {
  CreateProductPayload,
  useCreateProduct,
} from '../requests/use-create-product';

export function CreatePlanPage() {
  const form = useForm<CreateProductPayload>({
    defaultValues: {
      free: false,
      recommended: false,
    },
  });
  const createProduct = useCreateProduct(form);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createProduct.mutate(values);
      }}
      title={<Trans message="Create new plan" />}
      isLoading={createProduct.isLoading}
    >
      <CrupdatePlanForm />
    </CrupdateResourceLayout>
  );
}
