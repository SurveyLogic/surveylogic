import {MetaTag} from '@common/seo/meta-tag';

export interface BackendResponse {
  status?: string;
  seo?: MetaTag[];
}
