import {FieldErrors, useForm} from 'react-hook-form';
import {Fragment, ReactNode} from 'react';
import {
  AdminSettingsWithFiles,
  useUpdateAdminSettings,
} from './requests/update-admin-settings';
import {AdminSettings} from './admin-settings';
import {useAdminSettings} from './requests/use-admin-settings';
import {Form} from '../../ui/forms/form';
import {Button} from '../../ui/buttons/button';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {ProgressBar} from '../../ui/progress/progress-bar';
import {Trans} from '../../i18n/trans';

interface Props {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}
export function SettingsPanel({title, description, children}: Props) {
  const {data} = useAdminSettings();

  return (
    <section>
      <div className="mb-40">
        <h2 className="text-xl mb-4">{title}</h2>
        <div className="text-sm text-muted">{description}</div>
      </div>
      {data ? (
        <FormWrapper defaultValues={data}>{children}</FormWrapper>
      ) : (
        <ProgressCircle isIndeterminate aria-label="Loading settings..." />
      )}
    </section>
  );
}

interface FormWrapperProps {
  children: ReactNode;
  defaultValues: AdminSettings;
}
function FormWrapper({children, defaultValues}: FormWrapperProps) {
  const form = useForm<AdminSettingsWithFiles>({defaultValues});
  const updateSettings = useUpdateAdminSettings(form);
  return (
    <Fragment>
      <Form
        form={form}
        onBeforeSubmit={() => {
          // clear group errors, because hook form won't automatically
          // clear errors that are not bound to a specific form field
          const errors = form.formState.errors as FieldErrors<object>;
          const keys = Object.keys(errors).filter(key => {
            return key.endsWith('_group');
          });
          form.clearErrors(keys as any);
        }}
        onSubmit={value => {
          updateSettings.mutate(value);
        }}
      >
        {children}
        <div className="mt-40">
          <Button
            type="submit"
            variant="flat"
            color="primary"
            disabled={updateSettings.isLoading}
          >
            <Trans message="Update" />
          </Button>
        </div>
      </Form>
      {updateSettings.isLoading && (
        <ProgressBar
          size="xs"
          className="absolute -bottom-14 left-30 w-full"
          isIndeterminate
          aria-label="Saving settings..."
        />
      )}
    </Fragment>
  );
}
