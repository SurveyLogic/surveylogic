import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';

interface Response extends BackendResponse {}

export interface ConfirmTwoFactorPayload {
  code: string;
}

export function useConfirmTwoFactor(
  form: UseFormReturn<ConfirmTwoFactorPayload>
) {
  return useMutation((payload: ConfirmTwoFactorPayload) => confirm(payload), {
    onError: r => onFormQueryError(r, form),
  });
}

function confirm(payload: ConfirmTwoFactorPayload): Promise<Response> {
  return apiClient
    .post('auth/user/confirmed-two-factor-authentication', payload)
    .then(response => response.data);
}
