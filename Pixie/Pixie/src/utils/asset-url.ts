import {state} from '../state/utils';
import {isAbsoluteUrl} from '@common/utils/urls/is-absolute-url';

export function assetUrl(uri?: string): string {
  if (!uri) return '';
  if (isAbsoluteUrl(uri)) {
    return uri;
  }
  const baseUrl = state().config.baseUrl ? `${state().config.baseUrl}/` : '';
  return `${baseUrl}${uri}`;
}
