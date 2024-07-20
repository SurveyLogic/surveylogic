import {queryClient} from '@common/http/query-client';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {ButtonVariant} from '@common/ui/buttons/get-shared-button-style';
import {ButtonSize} from '@common/ui/buttons/button-size';
import {useRestoreComments} from '@common/comments/requests/use-restore-comments';

interface Props {
  commentIds: number[];
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export function RestoreCommentsButton({
  commentIds,
  variant = 'outline',
  size = 'xs',
}: Props) {
  const restoreComments = useRestoreComments();
  return (
    <Button
      variant={variant}
      size={size}
      className="mr-10"
      disabled={restoreComments.isLoading}
      color="primary"
      onClick={() => {
        restoreComments.mutate(
          {commentIds},
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['comment']);
            },
          }
        );
      }}
    >
      <Trans message="Restore" />
    </Button>
  );
}
