import {useForm} from 'react-hook-form';
import {CrupdateResourceLayout} from '../../crupdate-resource-layout';
import {Trans} from '../../../i18n/trans';
import {CrupdateRolePageSettingsPanel} from './crupdate-role-settings-panel';
import {CreateRolePayload, useCreateRole} from '../requests/user-create-role';
import {useNavigate} from '../../../utils/hooks/use-navigate';

export function CreateRolePage() {
  const form = useForm<CreateRolePayload>({defaultValues: {type: 'sitewide'}});
  const createRole = useCreateRole(form);
  const navigate = useNavigate();

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createRole.mutate(values, {
          onSuccess: response => {
            navigate(`/admin/roles/${response.role.id}/edit`);
          },
        });
      }}
      title={<Trans message="Add new role" />}
      isLoading={createRole.isLoading}
    >
      <CrupdateRolePageSettingsPanel />
    </CrupdateResourceLayout>
  );
}
