import {Trans} from '@common/i18n/trans';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {KeyboardArrowRightIcon} from '@common/icons/material/KeyboardArrowRight';
import {InfoStep} from '@common/custom-domains/datatable/connect-domain-dialog/info-step';
import {HostStep} from '@common/custom-domains/datatable/connect-domain-dialog/host-step';
import {ConnectDomainStep} from '@common/custom-domains/datatable/connect-domain-dialog/connect-domain-step';
import {BackendErrorResponse} from '@common/errors/backend-error-response';
import {ValidationFailedStep} from '@common/custom-domains/datatable/connect-domain-dialog/validation-failed-step';
import {useConnectDomainStepper} from '@common/custom-domains/datatable/connect-domain-dialog/use-connect-domain-stepper';
import {Form} from '@common/ui/forms/form';
import {FinalizeStep} from '@common/custom-domains/datatable/connect-domain-dialog/finalize-step';
import {KeyboardArrowLeftIcon} from '@common/icons/material/KeyboardArrowLeft';

export interface DomainValidationErrorResponse extends BackendErrorResponse {
  failReason: 'serverNotConfigured' | 'dnsNotSetup';
}

interface ConnectDomainDialogProps {
  showGlobalField?: boolean;
}
export function ConnectDomainDialog({
  showGlobalField,
}: ConnectDomainDialogProps) {
  const {close, formId} = useDialogContext();
  const stepper = useConnectDomainStepper({showGlobalField});
  const StepComponent = getStepComponent(stepper.state.currentStep);

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Connect domain" />
      </DialogHeader>
      <DialogBody>
        <Form
          form={stepper.form}
          id={formId}
          onSubmit={() => {
            stepper.goToNextStep();
          }}
        >
          <StepComponent stepper={stepper} />
        </Form>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button
            variant="text"
            onClick={() => {
              close();
            }}
          >
            <Trans message="Cancel" />
          </Button>
        }
      >
        {stepper.hasPreviousStep && (
          <Button
            startIcon={<KeyboardArrowLeftIcon />}
            color="primary"
            variant="text"
            onClick={() => {
              stepper.goToPreviousStep();
            }}
            disabled={stepper.state.isLoading}
          >
            <Trans message="Previous" />
          </Button>
        )}
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          endIcon={<KeyboardArrowRightIcon />}
          disabled={stepper.state.isLoading}
        >
          <Trans message="Next" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function getStepComponent(step: ConnectDomainStep) {
  switch (step) {
    case ConnectDomainStep.Host:
      return HostStep;
    case ConnectDomainStep.Info:
      return InfoStep;
    case ConnectDomainStep.ValidationFailed:
      return ValidationFailedStep;
    case ConnectDomainStep.Finalize:
      return FinalizeStep;
  }
}
