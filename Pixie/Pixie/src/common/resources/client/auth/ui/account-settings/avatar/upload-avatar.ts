import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {User} from '@common/auth/user';
import {message} from '@common/i18n/message';
import {apiClient} from '@common/http/query-client';
import {getAxiosErrorMessage} from '@common/utils/http/get-axios-error-message';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  user: User;
}

interface Payload {
  file?: UploadedFile;
  url?: string;
}

interface UserProps {
  user: User;
}

function UploadAvatar({file, url}: Payload, user: User): Promise<Response> {
  const payload = new FormData();
  if (file) {
    payload.set('file', file.native);
  } else {
    payload.set('url', url!);
  }
  return apiClient
    .post(`users/${user.id}/avatar`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(r => r.data);
}

export function useUploadAvatar({user}: UserProps) {
  return useMutation((payload: Payload) => UploadAvatar(payload, user), {
    onSuccess: () => {
      toast(message('Uploaded avatar'));
    },
    onError: err => {
      const message = getAxiosErrorMessage(err, 'file');
      if (message) {
        toast.danger(message);
      } else {
        showHttpErrorToast(err);
      }
    },
  });
}
