import {useDeleteComments} from '@common/comments/requests/use-delete-comments';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {queryClient} from '@common/http/query-client';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import React from 'react';
import {ButtonVariant} from '@common/ui/buttons/get-shared-button-style';
import {ButtonSize} from '@common/ui/buttons/button-size';

interface DeleteCommentsButtonProps {
  commentIds: number[];
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export function DeleteCommentsButton({
  commentIds,
  variant = 'outline',
  size = 'xs',
}: DeleteCommentsButtonProps) {
  const deleteComments = useDeleteComments();
  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          deleteComments.mutate(
            {commentIds},
            {
              onSuccess: () => {
                queryClient.invalidateQueries(['comment']);
              },
            }
          );
        }
      }}
    >
      <Button
        variant={variant}
        size={size}
        color="danger"
        className="mr-10"
        disabled={deleteComments.isLoading}
      >
        <Trans message="Delete" />
      </Button>
      <ConfirmationDialog
        isDanger
        title={
          <Trans
            message="Delete [one comment|other :count comments]"
            values={{count: commentIds.length}}
          />
        }
        body={
          commentIds.length > 1 ? (
            <Trans message="Are you sure you want to delete selected comments?" />
          ) : (
            <Trans message="Are you sure you want to delete this comment?" />
          )
        }
        confirm={<Trans message="Delete" />}
      />
    </DialogTrigger>
  );
}
