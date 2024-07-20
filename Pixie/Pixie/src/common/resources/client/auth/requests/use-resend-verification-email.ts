import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {toast} from '../../ui/toast/toast';
import {message} from '../../i18n/message';
import {apiClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  message: string;
}

export interface ResendConfirmEmailPayload {
  email: string;
}

export function useResendVerificationEmail() {
  return useMutation(resendEmail, {
    onSuccess: () => {
      toast(message('Email sent'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function resendEmail(payload: ResendConfirmEmailPayload): Promise<Response> {
  return apiClient
    .post('auth/email/verification-notification', payload)
    .then(response => response.data);
}
