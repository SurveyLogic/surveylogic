import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {useHandleLoginSuccess} from '@common/auth/requests/use-login';

interface Response extends BackendResponse {
  bootstrapData: string;
  two_factor: false;
}

export interface TwoFactorChallengePayload {
  code?: string;
  recovery_code?: string;
}
export function useTwoFactorChallenge(
  form: UseFormReturn<TwoFactorChallengePayload>
) {
  const handleSuccess = useHandleLoginSuccess();
  return useMutation(
    (payload: TwoFactorChallengePayload) => completeChallenge(payload),
    {
      onSuccess: response => {
        handleSuccess(response);
      },
      onError: r => onFormQueryError(r, form),
    }
  );
}

function completeChallenge(
  payload: TwoFactorChallengePayload
): Promise<Response> {
  return apiClient
    .post('auth/two-factor-challenge', payload)
    .then(response => response.data);
}
