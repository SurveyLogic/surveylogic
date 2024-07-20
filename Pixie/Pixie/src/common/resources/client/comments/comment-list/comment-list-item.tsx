import React, {memo, useContext, useState} from 'react';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Link} from 'react-router-dom';
import {Comment} from '@common/comments/comment';
import {useAuth} from '@common/auth/use-auth';
import {UserAvatar} from '@common/ui/images/user-avatar';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {IconButton} from '@common/ui/buttons/icon-button';
import {DeleteIcon} from '@common/icons/material/Delete';
import {NewCommentForm} from '@common/comments/new-comment-form';
import {User} from '@common/auth/user';
import {Commentable} from '@common/comments/commentable';
import {useDeleteComments} from '@common/comments/requests/use-delete-comments';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {queryClient} from '@common/http/query-client';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {FormattedDuration} from '@common/i18n/formatted-duration';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';

interface CommentListItemProps {
  comment: Comment;
  commentable: Commentable;
  canDelete?: boolean;
}
export function CommentListItem({
  comment,
  commentable,
  // user can delete comment if they have created it, or they have relevant permissions on commentable
  canDelete,
}: CommentListItemProps) {
  const isMobile = useIsMobileMediaQuery();
  const {user, hasPermission} = useAuth();
  const [replyFormVisible, setReplyFormVisible] = useState(false);

  return (
    <div
      style={{paddingLeft: `${comment.depth * 20}px`}}
      onClick={() => {
        if (isMobile) {
          setReplyFormVisible(!replyFormVisible);
        }
      }}
    >
      <div className="flex items-start gap-10 py-10 min-h-70 group">
        <UserAvatar className="flex-shrink-0" user={comment.user} size="lg" />
        {comment.deleted ? (
          <span className="text-muted text-sm italic pt-10">
            <Trans message="This comment has been deleted." />
          </span>
        ) : (
          <div className="text-sm flex-auto">
            <div className="flex items-center gap-4">
              {comment.user && <UserDisplayName user={comment.user} />}
              {comment.position ? (
                <Position
                  commentable={commentable}
                  position={comment.position}
                />
              ) : null}
            </div>
            <div>{comment.content}</div>
          </div>
        )}
        <div className="ml-auto md:min-w-86 flex-shrink-0 text-end">
          <time className="text-muted text-xs">
            <FormattedRelativeTime
              date={comment.created_at}
              style={isMobile ? 'narrow' : 'long'}
            />
          </time>
          {user != null && !comment.deleted && !isMobile && (
            <div className="mt-2 flex items-center gap-6 justify-end invisible group-hover:visible">
              {comment.depth < 5 && hasPermission('comments.create') && (
                <Button
                  variant="outline"
                  size="2xs"
                  onClick={() => setReplyFormVisible(!replyFormVisible)}
                >
                  <Trans message="Reply" />
                </Button>
              )}
              {(comment.user_id === user.id || canDelete) && (
                <DeleteCommentButton comment={comment} />
              )}
            </div>
          )}
        </div>
      </div>
      {replyFormVisible ? (
        <NewCommentForm
          className={!comment?.depth ? 'pl-20' : undefined}
          commentable={commentable}
          inReplyTo={comment}
          autoFocus
          onSuccess={() => {
            setReplyFormVisible(false);
          }}
        />
      ) : null}
    </div>
  );
}

interface PositionProps {
  commentable: Commentable;
  position: number;
}
const Position = memo(({commentable, position}: PositionProps) => {
  if (!commentable.duration) return null;
  const seconds = (position / 100) * (commentable.duration / 1000);
  return (
    <span className="text-muted text-xs">
      <Trans
        message="at :position"
        values={{
          position: <FormattedDuration seconds={seconds} />,
        }}
      />
    </span>
  );
});

interface DeleteCommentsButtonProps {
  comment: Comment;
}
export function DeleteCommentButton({comment}: DeleteCommentsButtonProps) {
  const deleteComments = useDeleteComments();
  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          deleteComments.mutate(
            {commentIds: [comment.id]},
            {
              onSuccess: () => {
                queryClient.invalidateQueries(['comment']);
              },
            }
          );
        }
      }}
    >
      <IconButton
        size="2xs"
        variant="outline"
        radius="rounded"
        disabled={deleteComments.isLoading}
      >
        <DeleteIcon />
      </IconButton>
      <ConfirmationDialog
        isDanger
        title={<Trans message="Delete comment?" />}
        body={<Trans message="Are you sure you want to delete this comment?" />}
        confirm={<Trans message="Delete" />}
      />
    </DialogTrigger>
  );
}

interface UserDisplayNameProps {
  user: User;
}
function UserDisplayName({user}: UserDisplayNameProps) {
  const {auth} = useContext(SiteConfigContext);
  if (auth.getUserProfileLink) {
    return (
      <Link to={auth.getUserProfileLink(user)} className="hover:underline">
        {user.display_name}
      </Link>
    );
  }
  return <div className="text-muted">{user.display_name}</div>;
}
