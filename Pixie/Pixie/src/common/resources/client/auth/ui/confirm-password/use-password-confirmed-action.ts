import {
  setPasswordConfirmationStatus,
  usePasswordConfirmationStatus,
} from '@common/auth/ui/confirm-password/requests/use-password-confirmation-status';
import {openDialog} from '@common/ui/overlays/store/dialog-store';
import {ConfirmPasswordDialog} from '@common/auth/ui/confirm-password/confirm-password-dialog';
import {useCallback, useRef} from 'react';

interface Props {
  needsPassword?: boolean;
}
export function usePasswordConfirmedAction({needsPassword}: Props = {}) {
  const {data, isLoading} = usePasswordConfirmationStatus();
  const passwordRef = useRef<string>();

  const withConfirmedPassword = useCallback(
    async (action: (password?: string) => void) => {
      if (data?.confirmed && (passwordRef.current || !needsPassword)) {
        action(passwordRef.current);
      } else {
        const password = await openDialog(ConfirmPasswordDialog);
        if (password) {
          passwordRef.current = password;
          setPasswordConfirmationStatus(true);
          action(passwordRef.current);
        }
      }
    },
    [data?.confirmed, needsPassword]
  );

  return {
    isLoading,
    withConfirmedPassword,
  };
}
