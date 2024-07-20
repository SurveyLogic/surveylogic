import {useForm} from 'react-hook-form';
import {useId} from 'react';
import {User} from '../../../user';
import {AccountSettingsPanel} from '../account-settings-panel';
import {Button} from '@common/ui/buttons/button';
import {Form} from '@common/ui/forms/form';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useUpdateAccountDetails} from './update-account-details';
import {Trans} from '@common/i18n/trans';
import {useUploadAvatar} from '../avatar/upload-avatar';
import {useRemoveAvatar} from '../avatar/remove-avatar';
import {FormImageSelector} from '@common/ui/images/image-selector';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {AccountSettingsId} from '@common/auth/ui/account-settings/account-settings-sidenav';

interface Props {
  user: User;
}
export function BasicInfoPanel({user}: Props) {
  const uploadAvatar = useUploadAvatar({user});
  const removeAvatar = useRemoveAvatar({user});
  const formId = useId();
  const form = useForm<Partial<Omit<User, 'subscriptions'>>>({
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      avatar: user.avatar,
    },
  });
  const updateDetails = useUpdateAccountDetails(form);

  return (
    <AccountSettingsPanel
      id={AccountSettingsId.AccountDetails}
      title={<Trans message="Update name and profile image" />}
      actions={
        <Button
          type="submit"
          variant="flat"
          color="primary"
          form={formId}
          disabled={updateDetails.isLoading || !form.formState.isValid}
        >
          <Trans message="Save" />
        </Button>
      }
    >
      <Form
        form={form}
        className="flex flex-col flex-col-reverse md:flex-row items-center gap-40 md:gap-80"
        onSubmit={newDetails => {
          updateDetails.mutate(newDetails);
        }}
        id={formId}
      >
        <div className="flex-auto w-full">
          <FormTextField
            className="mb-24"
            name="first_name"
            label={<Trans message="First name" />}
          />
          <FormTextField
            name="last_name"
            label={<Trans message="Last name" />}
          />
        </div>
        <FileUploadProvider>
          <FormImageSelector
            className="md:mr-80"
            variant="avatar"
            previewSize="w-90 h-90"
            showRemoveButton
            name="avatar"
            diskPrefix="avatars"
            label={<Trans message="Profile image" />}
            onChange={url => {
              if (url) {
                uploadAvatar.mutate({url});
              } else {
                removeAvatar.mutate();
              }
            }}
          />
        </FileUploadProvider>
      </Form>
    </AccountSettingsPanel>
  );
}
