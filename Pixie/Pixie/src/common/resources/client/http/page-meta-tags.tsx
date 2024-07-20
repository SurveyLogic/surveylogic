import {UseQueryResult} from '@tanstack/react-query';
import {Helmet} from '@common/seo/helmet';
import {DefaultMetaTags} from '@common/seo/default-meta-tags';
import React from 'react';
import {BackendResponse} from '@common/http/backend-response/backend-response';

interface Props {
  query: UseQueryResult<BackendResponse>;
}
export function PageMetaTags({query}: Props) {
  return query.data?.seo ? (
    <Helmet tags={query.data.seo} />
  ) : (
    <DefaultMetaTags />
  );
}
