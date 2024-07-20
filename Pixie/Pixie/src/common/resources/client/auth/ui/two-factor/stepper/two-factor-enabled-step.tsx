import {User} from '@common/auth/user';
import {useDisableTwoFactor} from '@common/auth/ui/two-factor/requests/use-disable-two-factor';
import {useRegenerateTwoFactorCodes} from '@common/auth/ui/two-factor/requests/use-regenerate-two-factor-codes';
import {Fragment} from 'react';
import {queryClient} from '@common/http/query-client';
import {Trans} from '@common/i18n/trans';
import {TwoFactorStepperLayout} from '@common/auth/ui/two-factor/stepper/two-factor-stepper-layout';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {usePasswordConfirmedAction} from '@common/auth/ui/confirm-password/use-password-confirmed-action';
import {Button} from '@common/ui/buttons/button';

interface Props {
  user: User;
  onDisabled: () => void;
}
export function TwoFactorEnabledStep({user, onDisabled}: Props) {
  const disableTwoFactor = useDisableTwoFactor();
  const regenerateCodes = useRegenerateTwoFactorCodes();
  const {withConfirmedPassword, isLoading: confirmPasswordIsLoading} =
    usePasswordConfirmedAction();
  const isLoading =
    disableTwoFactor.isLoading ||
    regenerateCodes.isLoading ||
    confirmPasswordIsLoading;

  const actions = (
    <Fragment>
      <Button
        type="button"
        onClick={() =>
          withConfirmedPassword(() => {
            regenerateCodes.mutate(undefined, {
              onSuccess: () => {
                queryClient.invalidateQueries(['users']);
              },
            });
          })
        }
        variant="outline"
        disabled={isLoading}
        className="mr-12"
      >
        <Trans message="Regenerate recovery codes" />
      </Button>
      <Button
        type="submit"
        variant="flat"
        color="danger"
        disabled={isLoading}
        onClick={() => {
          withConfirmedPassword(() => {
            disableTwoFactor.mutate(undefined, {
              onSuccess: () => {
                toast(message('Two factor authentication has been disabled.'));
                onDisabled();
              },
            });
          });
        }}
      >
        <Trans message="Disable" />
      </Button>
    </Fragment>
  );

  return (
    <TwoFactorStepperLayout
      title={<Trans message="You have enabled two factor authentication." />}
      description={
        <Trans message="Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost." />
      }
      actions={actions}
    >
      <div className="bg-alt p-14 font-mono text-sm mb-16 rounded">
        {user.two_factor_recovery_codes?.map(code => (
          <div className="mb-4" key={code}>
            {code}
          </div>
        ))}
      </div>
    </TwoFactorStepperLayout>
  );
}
