import {useEnableTwoFactor} from '@common/auth/ui/two-factor/requests/use-enable-two-factor';
import {TwoFactorStepperLayout} from '@common/auth/ui/two-factor/stepper/two-factor-stepper-layout';
import {Trans} from '@common/i18n/trans';
import {Button} from '@common/ui/buttons/button';
import {usePasswordConfirmedAction} from '@common/auth/ui/confirm-password/use-password-confirmed-action';

interface Props {
  onEnabled: () => void;
}
export function TwoFactorDisabledStep({onEnabled}: Props) {
  const enableTwoFactor = useEnableTwoFactor();
  const {withConfirmedPassword, isLoading: confirmPasswordIsLoading} =
    usePasswordConfirmedAction();
  const isLoading = enableTwoFactor.isLoading || confirmPasswordIsLoading;

  return (
    <TwoFactorStepperLayout
      title={
        <Trans message="You have not enabled two factor authentication." />
      }
      actions={
        <Button
          type="submit"
          variant="flat"
          color="primary"
          disabled={isLoading}
          onClick={() => {
            withConfirmedPassword(() => {
              enableTwoFactor.mutate(undefined, {
                onSuccess: onEnabled,
              });
            });
          }}
        >
          <Trans message="Enable" />
        </Button>
      }
    />
  );
}
