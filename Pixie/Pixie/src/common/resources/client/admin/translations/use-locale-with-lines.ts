import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {Localization} from '../../i18n/localization';
import {apiClient} from '../../http/query-client';

export interface FetchLocaleWithLinesResponse extends BackendResponse {
  localization: Localization;
}

export const getLocalWithLinesQueryKey = (localeId?: number | string) => {
  const key: (string | number)[] = ['getLocaleWithLines'];
  if (localeId != null) {
    key.push(localeId);
  }
  return key;
};

export function useLocaleWithLines(localeId: number | string) {
  return useQuery(
    getLocalWithLinesQueryKey(localeId),
    () => fetchLocaleWithLines(localeId),
    {staleTime: Infinity}
  );
}

function fetchLocaleWithLines(
  localeId: number | string
): Promise<FetchLocaleWithLinesResponse> {
  return apiClient
    .get(`localizations/${localeId}`)
    .then(response => response.data);
}
