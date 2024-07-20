import {useState} from 'react';
import {User} from '@common/auth/user';
import {TwoFactorDisabledStep} from '@common/auth/ui/two-factor/stepper/two-factor-disabled-step';
import {TwoFactorConfirmationStep} from '@common/auth/ui/two-factor/stepper/two-factor-confirmation-step';
import {TwoFactorEnabledStep} from '@common/auth/ui/two-factor/stepper/two-factor-enabled-step';

enum Status {
  Disabled,
  WaitingForConfirmation,
  Enabled,
}

interface Props {
  user: User;
}
export function TwoFactorStepper({user}: Props) {
  const [status, setStatus] = useState<Status>(getStatus(user));
  switch (status) {
    case Status.Disabled:
      return (
        <TwoFactorDisabledStep
          onEnabled={() => setStatus(Status.WaitingForConfirmation)}
        />
      );
    case Status.WaitingForConfirmation:
      return (
        <TwoFactorConfirmationStep
          onCancel={() => {
            setStatus(Status.Disabled);
          }}
          onConfirmed={() => {
            setStatus(Status.Enabled);
          }}
        />
      );
    case Status.Enabled:
      return (
        <TwoFactorEnabledStep
          user={user}
          onDisabled={() => setStatus(Status.Disabled)}
        />
      );
  }
}

function getStatus(user: User): Status {
  if (user.two_factor_confirmed_at) {
    return Status.Enabled;
  } else if (user.two_factor_recovery_codes) {
    return Status.WaitingForConfirmation;
  }
  return Status.Disabled;
}
