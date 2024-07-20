import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {useNavigate} from '../../utils/hooks/use-navigate';
import {apiClient, queryClient} from '../../http/query-client';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';
import {useAppearanceEditorMode} from '../../admin/appearance/commands/use-appearance-editor-mode';
import {message} from '../../i18n/message';
import {useBootstrapData} from '../../core/bootstrap-data/bootstrap-data-context';

interface Response extends BackendResponse {
  bootstrapData: string;
}

export function useLogout() {
  const navigate = useNavigate();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {setBootstrapData} = useBootstrapData();
  return useMutation(
    () => (isAppearanceEditorActive ? noopLogout() : logout()),
    {
      onSuccess: response => {
        // need to update bootstrap data in order for redirect to login page to work
        setBootstrapData(response.bootstrapData);
        queryClient.clear();
        navigate('/login');

        // need to clear query client and then set bootstrap data again immediately,
        // because there's no way to clear everything except one in react query
        queryClient.clear();
        setBootstrapData(response.bootstrapData);
      },
      onError: err =>
        showHttpErrorToast(
          err,
          isAppearanceEditorActive
            ? message("Can't logout while in appearance editor.")
            : undefined
        ),
    }
  );
}

function logout(): Promise<Response> {
  return apiClient.post('auth/logout').then(r => r.data);
}

function noopLogout() {
  return Promise.reject();
}
