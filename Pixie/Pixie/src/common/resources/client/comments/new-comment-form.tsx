import {Commentable} from '@common/comments/commentable';
import {Comment} from '@common/comments/comment';
import {useTrans} from '@common/i18n/use-trans';
import {useAuth} from '@common/auth/use-auth';
import {useCreateComment} from '@common/comments/requests/use-create-comment';
import {RefObject} from 'react';
import clsx from 'clsx';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Avatar} from '@common/ui/images/avatar';
import {message} from '@common/i18n/message';
import {Trans} from '@common/i18n/trans';
import {useObjectRef} from '@react-aria/utils';

export interface NewCommentFormProps {
  commentable: Commentable;
  inReplyTo?: Comment;
  onSuccess?: () => void;
  className?: string;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  // additional data that should be sent to backend when creating comments
  payload?: Record<string, number | string>;
}
export function NewCommentForm({
  commentable,
  inReplyTo,
  onSuccess,
  className,
  autoFocus,
  payload,
  ...props
}: NewCommentFormProps) {
  const {trans} = useTrans();
  const {user} = useAuth();
  const createComment = useCreateComment();
  const inputRef = useObjectRef<HTMLInputElement>(props.inputRef);
  return (
    <form
      className={clsx('py-6', className)}
      onSubmit={e => {
        e.preventDefault();
        if (inputRef.current?.value && !createComment.isLoading) {
          createComment.mutate(
            {
              ...payload,
              commentable,
              content: inputRef.current?.value,
              inReplyTo,
            },
            {
              onSuccess: () => {
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
                onSuccess?.();
              },
            }
          );
        }
      }}
    >
      <TextField
        inputRef={inputRef}
        autoFocus={autoFocus}
        startAdornment={
          <Avatar src={user?.avatar} label={user?.display_name} />
        }
        placeholder={trans(message('Write a reply'))}
        minLength={3}
      />
      <button
        type="submit"
        className="sr-only"
        disabled={createComment.isLoading}
      >
        <Trans message="Submit" />
      </button>
    </form>
  );
}
