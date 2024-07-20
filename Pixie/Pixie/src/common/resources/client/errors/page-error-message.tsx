import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import {ErrorIcon} from '@common/icons/material/Error';
import {Trans} from '@common/i18n/trans';

export function PageErrorMessage() {
  return (
    <IllustratedMessage
      className="mt-40"
      image={
        <div>
          <ErrorIcon size="xl" />
        </div>
      }
      imageHeight="h-auto"
      title={<Trans message="There was an issue loading this page" />}
      description={<Trans message="Please try again later" />}
    />
  );
}
