import {useState} from 'react';
import {ConnectDomainStep} from '@common/custom-domains/datatable/connect-domain-dialog/connect-domain-step';
import {DomainValidationErrorResponse} from '@common/custom-domains/datatable/connect-domain-dialog/connect-domain-dialog';
import {
  AuthorizeDomainConnectPayload,
  useAuthorizeDomainConnect,
} from '@common/custom-domains/datatable/requests/use-authorize-domain-connect';
import {useForm} from 'react-hook-form';
import {AxiosError} from 'axios';
import {useValidateDomainDns} from '@common/custom-domains/datatable/requests/use-validate-domain-dns';
import {useConnectDomain} from '@common/custom-domains/datatable/requests/use-connect-domain';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';

interface ConnectDomainStepperState {
  isLoading: boolean;
  currentStep: ConnectDomainStep;
  host: string;
  serverIp: string;
  validationFailReason?: DomainValidationErrorResponse['failReason'];
}

interface StepHandlerResult {
  status: 'success' | 'error';
  newState?: Partial<ConnectDomainStepperState>;
}

interface UseConnectDomainStepperProps {
  showGlobalField?: boolean;
}
export function useConnectDomainStepper({
  showGlobalField,
}: UseConnectDomainStepperProps) {
  const {close} = useDialogContext();
  const form = useForm<AuthorizeDomainConnectPayload>();
  const authorizeDomainConnect = useAuthorizeDomainConnect(form);
  const validateDns = useValidateDomainDns();
  const connectDomain = useConnectDomain();

  const [state, setState] = useState<ConnectDomainStepperState>({
    isLoading: false,
    currentStep: ConnectDomainStep.Host,
    host: '',
    serverIp: '',
  });

  const startLoading = () => {
    setState({
      ...state,
      isLoading: true,
    });
  };

  const handleDomainValidation = (): Promise<StepHandlerResult> => {
    return new Promise(resolve => {
      validateDns.mutate(
        {host: state.host},
        {
          onSuccess: () => {
            resolve({
              status: 'success',
              newState: {validationFailReason: undefined},
            });
          },
          onError: err => {
            resolve({
              status: 'error',
              newState: {
                validationFailReason: (
                  err as AxiosError<DomainValidationErrorResponse>
                ).response?.data.failReason,
              },
            });
          },
        }
      );
    });
  };

  const handleDomainAuthorization = (): Promise<StepHandlerResult> => {
    return new Promise(resolve => {
      authorizeDomainConnect.mutate(form.getValues(), {
        onSuccess: response => {
          resolve({
            status: 'success',
            newState: {
              host: form.getValues().host,
              serverIp: response.serverIp,
            },
          });
        },
        onError: () => {
          resolve({status: 'error'});
        },
      });
    });
  };

  const hasPreviousStep = state.currentStep !== ConnectDomainStep.Host;

  const goToPreviousStep = () => {
    if (!hasPreviousStep || state.isLoading) return;

    if (state.currentStep === ConnectDomainStep.Info) {
      setState({
        ...state,
        currentStep: ConnectDomainStep.Host,
      });
    } else if (state.currentStep === ConnectDomainStep.ValidationFailed) {
      setState({
        ...state,
        currentStep: ConnectDomainStep.Info,
      });
    }
  };

  const goToNextStep = async () => {
    if (state.currentStep === ConnectDomainStep.Host) {
      startLoading();
      const result = await handleDomainAuthorization();
      setState({
        ...state,
        ...result.newState,
        isLoading: false,
        currentStep:
          result.status === 'success'
            ? ConnectDomainStep.Info
            : ConnectDomainStep.Host,
      });
    } else if (
      state.currentStep === ConnectDomainStep.Info ||
      state.currentStep === ConnectDomainStep.ValidationFailed
    ) {
      startLoading();
      const validationResult = await handleDomainValidation();
      const nextStep =
        validationResult.status === 'success'
          ? ConnectDomainStep.Finalize
          : ConnectDomainStep.ValidationFailed;
      setState({
        ...state,
        ...validationResult.newState,
        isLoading: false,
        currentStep: nextStep,
      });
      if (nextStep === ConnectDomainStep.Finalize) {
        connectDomain.mutate(form.getValues(), {
          onSettled: () => {
            close();
          },
        });
      }
    }
  };

  return {
    form,
    state,
    goToNextStep,
    hasPreviousStep,
    goToPreviousStep,
    showGlobalField,
  };
}
