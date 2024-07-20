import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import React, {useEffect} from 'react';
import {useUser} from '../../auth/ui/use-user';
import {UpdateUserPayload, useUpdateUser} from './requests/update-user';
import {Button} from '../../ui/buttons/button';
import {useResendVerificationEmail} from '../../auth/requests/use-resend-verification-email';
import {useUploadAvatar} from '../../auth/ui/account-settings/avatar/upload-avatar';
import {useRemoveAvatar} from '../../auth/ui/account-settings/avatar/remove-avatar';
import {CrupdateUserForm} from './crupdate-user-form';
import {User} from '../../auth/user';
import {Trans} from '../../i18n/trans';
import {FullPageLoader} from '../../ui/progress/full-page-loader';
import {useSettings} from '../../core/settings/use-settings';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {FormImageSelector} from '@common/ui/images/image-selector';
import {queryClient} from '@common/http/query-client';

export function UpdateUserPage() {
  const form = useForm<UpdateUserPayload>();
  const {require_email_confirmation} = useSettings();
  const {userId} = useParams();
  const updateUser = useUpdateUser(form);
  const resendConfirmationEmail = useResendVerificationEmail();
  const {data, isLoading} = useUser(userId!, {
    with: ['subscriptions', 'roles', 'permissions'],
  });

  useEffect(() => {
    if (data?.user && !form.getValues().id) {
      form.reset({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        roles: data.user.roles,
        permissions: data.user.permissions,
        id: data.user.id,
        email_verified_at: Boolean(data.user.email_verified_at),
        available_space: data.user.available_space,
        avatar: data.user.avatar,
      });
    }
  }, [data?.user, form]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  const resendEmailButton = (
    <Button
      size="xs"
      variant="outline"
      color="primary"
      disabled={
        !require_email_confirmation ||
        resendConfirmationEmail.isLoading ||
        data?.user?.email_verified_at != null
      }
      onClick={() => {
        resendConfirmationEmail.mutate({email: data!.user.email});
      }}
    >
      <Trans message="Resend email" />
    </Button>
  );

  return (
    <CrupdateUserForm
      onSubmit={newValues => {
        updateUser.mutate(newValues);
      }}
      form={form}
      title={
        <Trans values={{email: data?.user.email}} message="Edit “:email“" />
      }
      isLoading={updateUser.isLoading}
      avatarManager={
        <AvatarSection
          user={data!.user}
          onChange={() => {
            queryClient.invalidateQueries(['users']);
          }}
        />
      }
      resendEmailButton={resendEmailButton}
    >
      <FormTextField
        className="mb-30"
        name="password"
        type="password"
        label={<Trans message="New password" />}
      />
    </CrupdateUserForm>
  );
}

interface AvatarSectionProps {
  user: User;
  onChange: () => void;
}
function AvatarSection({user, onChange}: AvatarSectionProps) {
  const uploadAvatar = useUploadAvatar({user});
  const removeAvatar = useRemoveAvatar({user});
  return (
    <FileUploadProvider>
      <FormImageSelector
        name="avatar"
        diskPrefix="avatars"
        variant="avatar"
        stretchPreview
        label={<Trans message="Profile image" />}
        previewSize="w-90 h-90"
        showRemoveButton
        onChange={url => {
          if (url) {
            uploadAvatar.mutate({url});
          } else {
            removeAvatar.mutate();
          }
          onChange();
        }}
      />
    </FileUploadProvider>
  );
}
