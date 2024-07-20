import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {BackendResponse} from '../../../../http/backend-response/backend-response';
import {toast} from '../../../../ui/toast/toast';
import {AccessToken} from '../../../access-token';
import {onFormQueryError} from '../../../../errors/on-form-query-error';
import {message} from '../../../../i18n/message';
import {apiClient} from '../../../../http/query-client';

interface Response extends BackendResponse {
  token: AccessToken;
  plainTextToken: string;
}

export interface CreateAccessTokenPayload {
  tokenName: string;
}

function createAccessToken(
  payload: CreateAccessTokenPayload
): Promise<Response> {
  return apiClient.post(`access-tokens`, payload).then(r => r.data);
}

export function useCreateAccessToken(
  form: UseFormReturn<CreateAccessTokenPayload>
) {
  return useMutation(
    (props: CreateAccessTokenPayload) => createAccessToken(props),
    {
      onSuccess: () => {
        toast(message('Token create'));
      },
      onError: r => onFormQueryError(r, form),
    }
  );
}
