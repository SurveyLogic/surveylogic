import {useRole} from '../requests/use-role';
import {FullPageLoader} from '../../../ui/progress/full-page-loader';
import {Role} from '../../../auth/role';
import {Trans} from '../../../i18n/trans';
import {useForm} from 'react-hook-form';
import {Tabs} from '../../../ui/tabs/tabs';
import {Tab} from '../../../ui/tabs/tab';
import {TabList} from '../../../ui/tabs/tab-list';
import {TabPanel, TabPanels} from '../../../ui/tabs/tab-panels';
import {useUpdateRole} from '../requests/use-update-role';
import {CrupdateResourceLayout} from '../../crupdate-resource-layout';
import {CrupdateRolePageSettingsPanel} from './crupdate-role-settings-panel';
import {EditRolePageUsersPanel} from './edit-role-page-users-panel';

export function EditRolePage() {
  const query = useRole();

  if (query.status !== 'success') {
    return <FullPageLoader />;
  }

  return <PageContent role={query.data.role} />;
}

interface PageContentProps {
  role: Role;
}
function PageContent({role}: PageContentProps) {
  const form = useForm<Role>({defaultValues: role});
  const updateRole = useUpdateRole();

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        updateRole.mutate(values);
      }}
      title={<Trans message="Edit “:name“ role" values={{name: role.name}} />}
      isLoading={updateRole.isLoading}
    >
      <Tabs isLazy>
        <TabList>
          <Tab>
            <Trans message="Settings" />
          </Tab>
          <Tab>
            <Trans message="Users" />
          </Tab>
        </TabList>
        <TabPanels className="pt-20">
          <TabPanel>
            <CrupdateRolePageSettingsPanel isInternal={role.internal} />
          </TabPanel>
          <TabPanel>
            <EditRolePageUsersPanel role={role} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </CrupdateResourceLayout>
  );
}
