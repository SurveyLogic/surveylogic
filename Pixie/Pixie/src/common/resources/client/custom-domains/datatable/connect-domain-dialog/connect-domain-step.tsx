import {useConnectDomainStepper} from '@common/custom-domains/datatable/connect-domain-dialog/use-connect-domain-stepper';

export enum ConnectDomainStep {
  Host = 1,
  Info = 2,
  ValidationFailed = 3,
  Finalize = 4,
}

export interface ConnectDomainStepProps {
  stepper: ReturnType<typeof useConnectDomainStepper>;
}
