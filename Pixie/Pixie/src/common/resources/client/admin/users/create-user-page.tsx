import {useForm} from 'react-hook-form';
import React from 'react';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {CreateUserPayload, useCreateUser} from './requests/create-user';
import {CrupdateUserForm} from './crupdate-user-form';
import {FileUploadProvider} from '../../uploads/uploader/file-upload-provider';
import {Trans} from '../../i18n/trans';
import {FormImageSelector} from '@common/ui/images/image-selector';

export function CreateUserPage() {
  const form = useForm<CreateUserPayload>();
  const createUser = useCreateUser(form);

  const avatarManager = (
    <FileUploadProvider>
      <FormImageSelector
        name="avatar"
        diskPrefix="avatars"
        variant="avatar"
        stretchPreview
        label={<Trans message="Profile image" />}
        previewSize="w-90 h-90"
        showRemoveButton
      />
    </FileUploadProvider>
  );

  return (
    <CrupdateUserForm
      onSubmit={newValues => {
        createUser.mutate(newValues);
      }}
      form={form}
      title={<Trans message="Add new user" />}
      isLoading={createUser.isLoading}
      avatarManager={avatarManager}
    >
      <FormTextField
        className="mb-30"
        name="email"
        type="email"
        label={<Trans message="Email" />}
      />
      <FormTextField
        className="mb-30"
        name="password"
        type="password"
        label={<Trans message="Password" />}
      />
    </CrupdateUserForm>
  );
}
