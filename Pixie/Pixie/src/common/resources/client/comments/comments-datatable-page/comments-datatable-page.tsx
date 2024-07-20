import React, {useCallback, useState} from 'react';
import {Trans} from '@common/i18n/trans';
import clsx from 'clsx';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {DataTableHeader} from '@common/datatable/data-table-header';
import {CommentsDatatableFilters} from '@common/comments/comments-datatable-page/comments-datatable-filters';
import {useBackendFilterUrlParams} from '@common/datatable/filters/backend-filter-url-params';
import {
  GetDatatableDataParams,
  useDatatableData,
} from '@common/datatable/requests/paginated-resources';
import {Comment} from '@common/comments/comment';
import {FilterList} from '@common/datatable/filters/filter-list/filter-list';
import {SelectedStateDatatableHeader} from '@common/datatable/selected-state-datatable-header';
import {AnimatePresence} from 'framer-motion';
import {DeleteCommentsButton} from '@common/comments/comments-datatable-page/delete-comments-button';
import {CommentDatatableItem} from '@common/comments/comments-datatable-page/comment-datatable-item';
import {DataTablePaginationFooter} from '@common/datatable/data-table-pagination-footer';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import publicDiscussionsImage from './public-discussion.svg';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';

export function CommentsDatatablePage() {
  const {encodedFilters} = useBackendFilterUrlParams(CommentsDatatableFilters);
  const [params, setParams] = useState<GetDatatableDataParams>({perPage: 15});
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const query = useDatatableData<Comment>(
    'comment',
    {
      ...params,
      with: 'commentable',
      filters: encodedFilters,
    },
    {
      onSuccess: () => {
        setSelectedComments([]);
      },
    }
  );

  const toggleComment = useCallback(
    (id: number) => {
      const newValues = [...selectedComments];
      if (!newValues.includes(id)) {
        newValues.push(id);
      } else {
        const index = newValues.indexOf(id);
        newValues.splice(index, 1);
      }
      setSelectedComments(newValues);
    },
    [selectedComments, setSelectedComments]
  );

  const isFiltering = !!(params.query || params.filters || encodedFilters);
  const pagination = query.data?.pagination;

  return (
    <div className="p-12 md:p-24">
      <div className={clsx('mb-16')}>
        <StaticPageTitle>
          <Trans message="Comments" />
        </StaticPageTitle>
        <h1 className="text-3xl font-light">
          <Trans message="Comments" />
        </h1>
      </div>
      <div>
        <AnimatePresence initial={false} mode="wait">
          {selectedComments.length ? (
            <SelectedStateDatatableHeader
              selectedItemsCount={selectedComments.length}
              actions={
                <DeleteCommentsButton
                  size="sm"
                  variant="flat"
                  commentIds={selectedComments}
                />
              }
              key="selected"
            />
          ) : (
            <DataTableHeader
              filters={CommentsDatatableFilters}
              searchValue={params.query}
              onSearchChange={query => setParams({...params, query})}
              key="default"
            />
          )}
        </AnimatePresence>
        <FilterList className="mb-14" filters={CommentsDatatableFilters} />

        {query.isLoading ? (
          <FullPageLoader className="min-h-200" />
        ) : (
          <div className="border-x border-t rounded">
            {pagination?.data.map(comment => (
              <CommentDatatableItem
                key={comment.id}
                comment={comment}
                isSelected={selectedComments.includes(comment.id)}
                onToggle={() => toggleComment(comment.id)}
              />
            ))}
          </div>
        )}

        {(query.isFetched || query.isPreviousData) &&
        !pagination?.data.length ? (
          <DataTableEmptyStateMessage
            className="pt-50"
            isFiltering={isFiltering}
            image={publicDiscussionsImage}
            title={<Trans message="No comments have been created yet" />}
            filteringTitle={<Trans message="No matching comments" />}
          />
        ) : undefined}

        <DataTablePaginationFooter
          className="mt-10"
          query={query}
          onPageChange={page => setParams({...params, page})}
          onPerPageChange={perPage => setParams({...params, perPage})}
        />
      </div>
    </div>
  );
}
