import {Trans} from '@common/i18n/trans';
import {DomainProgressIndicator} from '@common/custom-domains/datatable/connect-domain-dialog/domain-progress-indicator';

export function FinalizeStep() {
  return (
    <div>
      <DomainProgressIndicator
        message={<Trans message="Connecting domain..." />}
      />
      <div className="text-muted mt-10 text-xs">
        <Trans message="Don't close this window until domain is connected." />
      </div>
    </div>
  );
}
