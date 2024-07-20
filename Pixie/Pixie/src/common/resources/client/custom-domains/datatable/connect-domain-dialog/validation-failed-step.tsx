import {useSettings} from '@common/core/settings/use-settings';
import {Trans} from '@common/i18n/trans';
import {Fragment, ReactNode} from 'react';
import {ConnectDomainStepProps} from '@common/custom-domains/datatable/connect-domain-dialog/connect-domain-step';
import {useAuth} from '@common/auth/use-auth';
import {isSubdomain} from '@common/custom-domains/datatable/connect-domain-dialog/is-subdomain';
import {WarningIcon} from '@common/icons/material/Warning';
import {useValidateDomainDns} from '@common/custom-domains/datatable/requests/use-validate-domain-dns';
import {DomainProgressIndicator} from '@common/custom-domains/datatable/connect-domain-dialog/domain-progress-indicator';

export function ValidationFailedStep({
  stepper: {
    goToNextStep,
    state: {host, serverIp, isLoading, validationFailReason},
  },
}: ConnectDomainStepProps) {
  const validateDns = useValidateDomainDns();
  const {base_url} = useSettings();
  const {hasPermission} = useAuth();
  const subdomain = isSubdomain(host);
  const record = subdomain ? 'CNAME' : 'A';
  const location = subdomain ? base_url : serverIp;

  if (isLoading) {
    return <DomainProgressIndicator />;
  }

  const errorMessage =
    validationFailReason === 'serverNotConfigured' && hasPermission('admin') ? (
      <ErrorMessage>
        <Trans
          message="DNS records for the domain are setup, however it seems that your server is not configured to handle requests from “:host“"
          values={{host: location}}
        />
      </ErrorMessage>
    ) : (
      <ErrorMessage>
        <Trans
          message="The domain is missing :record record pointing to :location or the changes haven't propagated yet."
          values={{record, location}}
        />
      </ErrorMessage>
    );

  return (
    <Fragment>
      {errorMessage}
      <div className="whitespace-nowrap text-xs text-muted mt-10">
        <Trans
          message="You can wait and try again later, or <b>refresh</b>"
          values={{
            b: (text: string) => (
              <button
                disabled={isLoading}
                type="button"
                className="text-primary underline"
                onClick={() => {
                  goToNextStep();
                }}
              >
                {text}
              </button>
            ),
          }}
        />
      </div>
    </Fragment>
  );
}

interface ErrorMessageProps {
  children: ReactNode;
}
function ErrorMessage({children}: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-12 text-base p-12 rounded bg-warning/15 text-warning font-medium">
      <WarningIcon size="lg" />
      {children}
    </div>
  );
}
