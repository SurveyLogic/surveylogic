import {Comment} from '@common/comments/comment';
import {Trans} from '@common/i18n/trans';
import {CommentIcon} from '@common/icons/material/Comment';
import {Commentable} from '@common/comments/commentable';
import {useComments} from '@common/comments/requests/use-comments';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {FormattedNumber} from '@common/i18n/formatted-number';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import {CommentListItem} from '@common/comments/comment-list/comment-list-item';
import {Skeleton} from '@common/ui/skeleton/skeleton';

interface CommentListProps {
  commentable: Commentable;
  canDeleteAllComments?: boolean;
  className?: string;
}
export function CommentList({
  className,
  commentable,
  canDeleteAllComments = false,
}: CommentListProps) {
  const {items, totalItems, ...query} = useComments(commentable);

  if (query.isError) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-8 pb-8 border-b flex items-center gap-8">
        <CommentIcon size="sm" className="text-muted" />
        {query.isInitialLoading ? (
          <Trans message="Loading comments..." />
        ) : (
          <Trans
            message=":count comments"
            values={{count: <FormattedNumber value={totalItems || 0} />}}
          />
        )}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {query.isInitialLoading ? (
          <CommentSkeletons count={4} />
        ) : (
          <CommentListItems
            comments={items}
            canDeleteAllComments={canDeleteAllComments}
            commentable={commentable}
          />
        )}
      </AnimatePresence>
      <InfiniteScrollSentinel query={query} />
    </div>
  );
}

interface CommentListItemsProps {
  comments: Comment[];
  canDeleteAllComments: boolean;
  commentable: Commentable;
}
function CommentListItems({
  comments,
  commentable,
  canDeleteAllComments,
}: CommentListItemsProps) {
  if (!comments.length) {
    return (
      <IllustratedMessage
        className="mt-24"
        size="sm"
        title={<Trans message="Seems a little quiet over here" />}
        description={<Trans message="Be the first to comment" />}
      />
    );
  }

  return (
    <m.div key="comments" {...opacityAnimation}>
      {comments.map(comment => (
        <CommentListItem
          key={comment.id}
          comment={comment}
          commentable={commentable}
          canDelete={canDeleteAllComments}
        />
      ))}
    </m.div>
  );
}

interface CommentSkeletonsProps {
  count: number;
}
export function CommentSkeletons({count}: CommentSkeletonsProps) {
  return (
    <m.div key="loading-skeleton" {...opacityAnimation}>
      {[...new Array(count).keys()].map(index => (
        <div
          key={index}
          className="flex items-start gap-10 py-10 min-h-70 group"
        >
          <Skeleton variant="avatar" />
          <div className="flex-auto max-w-384">
            <Skeleton className="leading-3 max-w-120" />
            <Skeleton className="leading-3" />
          </div>
          <div className="w-64 ml-auto">
            <Skeleton className="leading-3" />
          </div>
        </div>
      ))}
    </m.div>
  );
}
