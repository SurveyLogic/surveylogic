import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {Commentable} from '@common/comments/commentable';
import {Comment} from '@common/comments/comment';

interface Response extends BackendResponse {
  //
}

export interface CreateCommentPayload {
  commentable: Commentable;
  content: string;
  inReplyTo?: Comment;
}

export function useCreateComment() {
  return useMutation((props: CreateCommentPayload) => createComment(props), {
    onSuccess: (response, props) => {
      toast(message('Comment posted'));
      queryClient.invalidateQueries([
        'comment',
        `${props.commentable.id}-${props.commentable.model_type}`,
      ]);
    },
    onError: err => showHttpErrorToast(err),
  });
}

function createComment({
  commentable,
  content,
  inReplyTo,
  ...other
}: CreateCommentPayload): Promise<Response> {
  const payload = {
    commentable_id: commentable.id,
    commentable_type: commentable.model_type,
    content,
    inReplyTo,
    ...other,
  };
  return apiClient.post('comment', payload).then(r => r.data);
}
