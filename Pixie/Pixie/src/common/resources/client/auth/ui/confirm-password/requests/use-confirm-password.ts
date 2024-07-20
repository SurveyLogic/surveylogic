import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '@common/errors/on-form-query-error';

interface Response extends BackendResponse {}

export interface ConfirmPasswordPayload {
  password: string;
}

export function useConfirmPassword(
  form: UseFormReturn<ConfirmPasswordPayload>
) {
  return useMutation((payload: ConfirmPasswordPayload) => confirm(payload), {
    onError: r => onFormQueryError(r, form),
  });
}

function confirm(payload: ConfirmPasswordPayload): Promise<Response> {
  return apiClient
    .post('auth/user/confirm-password', payload)
    .then(response => response.data);
}
