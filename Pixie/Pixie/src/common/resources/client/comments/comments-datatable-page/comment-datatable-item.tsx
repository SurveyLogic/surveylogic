import {User} from '@common/auth/user';
import {Comment} from '@common/comments/comment';
import React, {Fragment, useContext, useState} from 'react';
import {Checkbox} from '@common/ui/forms/toggle/checkbox';
import {UserAvatar} from '@common/ui/images/user-avatar';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';
import {queryClient} from '@common/http/query-client';
import {DeleteCommentsButton} from '@common/comments/comments-datatable-page/delete-comments-button';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {useUpdateComment} from '@common/comments/requests/use-update-comment';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@common/ui/buttons/external-link';
import clsx from 'clsx';
import {RestoreCommentsButton} from '@common/comments/comments-datatable-page/restore-comments-button';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';

interface Props {
  comment: Comment;
  isSelected: boolean;
  onToggle: () => void;
}
export function CommentDatatableItem({comment, isSelected, onToggle}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className={clsx('p-14 border-b', comment.deleted && 'bg-danger/6')}>
      {comment.commentable && (
        <CommentableHeader
          isSelected={isSelected}
          onToggle={onToggle}
          commentable={comment.commentable}
        />
      )}
      <div className="flex items-start gap-10 pt-14 md:pl-20">
        <UserAvatar className="flex-shrink-0" user={comment.user} size="md" />
        <div className="flex-auto">
          <CommentHeader comment={comment} />
          {isEditing ? (
            <EditCommentForm
              comment={comment}
              onClose={isSaved => {
                setIsEditing(false);
                if (isSaved) {
                  queryClient.invalidateQueries(['comment']);
                }
              }}
            />
          ) : (
            <Fragment>
              <div className="text-sm my-14">{comment.content}</div>
              <div>
                {comment.deleted ? (
                  <RestoreCommentsButton commentIds={[comment.id]} />
                ) : (
                  <DeleteCommentsButton commentIds={[comment.id]} />
                )}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <Trans message="Edit" />
                </Button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentableHeaderProps {
  isSelected: boolean;
  onToggle: Props['onToggle'];
  commentable: NormalizedModel;
}
function CommentableHeader({
  isSelected,
  onToggle,
  commentable,
}: CommentableHeaderProps) {
  return (
    <div className="flex items-center">
      <div className="mr-14">
        <Checkbox checked={isSelected} onChange={() => onToggle()} />
      </div>
      {commentable.image && (
        <img
          className="w-20 h-20 rounded overflow-hidden object-cover mr-6"
          src={commentable.image}
          alt=""
        />
      )}
      <div className="text-sm mr-4">{commentable.name}</div>
      <div className="text-muted text-xs">({commentable.model_type})</div>
    </div>
  );
}

interface CommentHeaderProps {
  comment: Comment;
}
function CommentHeader({comment}: CommentHeaderProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div>
        {comment.user && (
          <UserDisplayName user={comment.user} show="display_name" />
        )}
      </div>
      <div>&bull;</div>
      <time>
        <FormattedRelativeTime date={comment.created_at} />
      </time>
      {comment.user && (
        <div className="ml-auto hidden md:block">
          {<UserDisplayName user={comment.user} show="email" />}
        </div>
      )}
    </div>
  );
}

interface EditCommentFormProps {
  comment: Comment;
  onClose: (saved: boolean) => void;
}
function EditCommentForm({comment, onClose}: EditCommentFormProps) {
  const [content, setContent] = useState(comment.content);
  const updateComment = useUpdateComment();
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        updateComment.mutate(
          {commentId: comment.id, content},
          {onSuccess: () => onClose(true)}
        );
      }}
    >
      <TextField
        autoFocus
        inputElementType="textarea"
        className="my-14"
        rows={2}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <Button
        size="xs"
        variant="outline"
        color="primary"
        type="submit"
        className="mr-6"
        disabled={updateComment.isLoading}
      >
        <Trans message="Save edit" />
      </Button>
      <Button
        size="xs"
        variant="outline"
        className="mr-6"
        onClick={e => onClose(false)}
        disabled={updateComment.isLoading}
      >
        <Trans message="Cancel" />
      </Button>
    </form>
  );
}

interface UserDisplayNameProps {
  user: User;
  show: 'display_name' | 'email';
}
function UserDisplayName({user, show}: UserDisplayNameProps) {
  const {auth} = useContext(SiteConfigContext);
  if (auth.getUserProfileLink) {
    return (
      <Link
        to={auth.getUserProfileLink(user)}
        className={LinkStyle}
        target="_blank"
      >
        {user[show]}
      </Link>
    );
  }
  return <div className="text-muted">{user[show]}</div>;
}
