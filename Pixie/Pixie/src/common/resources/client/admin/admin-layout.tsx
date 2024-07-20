import {Outlet} from 'react-router-dom';
import {AdminSidebar} from './admin-sidebar';
import {DashboardLayout} from '../ui/layout/dashboard-layout';
import {DashboardContent} from '../ui/layout/dashboard-content';
import {DashboardSidenav} from '../ui/layout/dashboard-sidenav';
import {DashboardNavbar} from '../ui/layout/dashboard-navbar';

export function AdminLayout() {
  return (
    <DashboardLayout name="admin" leftSidenavCanBeCompact>
      <DashboardNavbar size="sm" color="primary" menuPosition="admin-navbar" />
      <DashboardSidenav position="left" size="sm">
        <AdminSidebar />
      </DashboardSidenav>
      <DashboardContent>
        <div className="bg dark:bg-alt">
          <Outlet />
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
