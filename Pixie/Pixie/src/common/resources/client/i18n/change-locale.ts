import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '../http/backend-response/backend-response';
import {Localization} from './localization';
import {apiClient} from '../http/query-client';
import {showHttpErrorToast} from '../utils/http/show-http-error-toast';
import {useBootstrapData} from '../core/bootstrap-data/bootstrap-data-context';

export interface ChangeLocaleResponse extends BackendResponse {
  locale: Localization;
}

export function useChangeLocale() {
  const {mergeBootstrapData} = useBootstrapData();
  return useMutation((props: {locale?: string}) => changeLocale(props), {
    onSuccess: response => {
      mergeBootstrapData({
        i18n: response.locale,
      });
    },
    onError: err => showHttpErrorToast(err),
  });
}

function changeLocale(props: {locale?: string}): Promise<ChangeLocaleResponse> {
  return apiClient.post(`users/me/locale`, props).then(r => r.data);
}
