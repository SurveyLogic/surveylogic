import {Commentable} from '@common/comments/commentable';
import {Comment} from '@common/comments/comment';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';

export function commentsQueryKey(commentable: Commentable) {
  return ['comment', `${commentable.id}-${commentable.model_type}`];
}

export function useComments(commentable: Commentable) {
  return useInfiniteData<Comment>({
    queryKey: commentsQueryKey(commentable),
    endpoint: 'commentable/comments',
    //paginate: 'cursor',
    queryParams: {
      commentable_type: commentable.model_type,
      commentable_id: commentable.id,
    },
  });
}
