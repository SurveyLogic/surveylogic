import {Trans} from '../../i18n/trans';
import {CheckIcon} from '../../icons/material/Check';
import {Product} from '../product';

interface FeatureListProps {
  product: Product;
}

export function ProductFeatureList({product}: FeatureListProps) {
  if (!product.feature_list.length) return null;

  return (
    <div className="border-t pt-24 mt-32">
      <div className="text-sm mb-10 font-semibold">
        <Trans message="What's included" />
      </div>
      {product.feature_list.map(feature => (
        <div key={feature} className="flex items-center gap-10 text-sm py-6">
          <CheckIcon className="text-positive" size="sm" />
          <Trans message={feature} />
        </div>
      ))}
    </div>
  );
}
