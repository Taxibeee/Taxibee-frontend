import React from 'react';
import { Box, Typography } from '@mui/material';

// Import Layout
import { DashboardLayout } from '../../components';

// Import sidebar items
import { sidebarItemsAdmin } from './AdminSidebar';

// Import admin pages from the pages directory
import AdminOrdersPage from './AdminOrdersPage';
import AdminDriversPage from './AdminDriversPage';
import AdminLiveStatusPage from './AdminLiveStatusPage';
import AdminTransactionsPage from './AdminTransactionsPage';
import AdminExactFilePage from './AdminExactFilePage';
import AdminContactsPage from './AdminContactsPage';

// Import dashboard components for the main dashboard
import SummaryCards from '../../components/admin/SummaryCards';
import WeeklyAnalyticsCharts from '../../components/admin/WeeklyAnalyticsCharts'; 
import RevenueByMethodChart from '../../components/admin/RevenueByMethodChart'; 
import TopDriversTable from '../../components/admin/TopDriversTable';

import { useTranslation } from 'react-i18next';

interface AdminDashboardProps {
  selectedPage: string;
}

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ selectedPage }) => {

  const { t } = useTranslation();

  const provideTranslatedText = ({ items }: { items: SidebarItem[] }): SidebarItem[] => {
    return items.map((item: SidebarItem) => {
      return {
        ...item,
        text: t(item.text),
      };
    })
  }

  // Render the appropriate content based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminSidebar.dashboard')}
            </Typography>

            <SummaryCards />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 4 }}>
                <WeeklyAnalyticsCharts />
              </Box>
              <Box sx={{ flex: 2 }}>
                <RevenueByMethodChart />
              </Box>


              <Box sx={{ flex: 4 }}>
                <TopDriversTable />
              </Box>
              </Box>
          </Box>
        );
      case 'orders':
        return (<Box>
          <Typography variant="h3" gutterBottom>
              {t('adminSidebar.orders')}
            </Typography>
        <AdminOrdersPage />
        </Box>
      );
      case 'live-status':
        return (<Box>
          <Typography variant="h3" gutterBottom>
              {t('adminSidebar.liveStatus')}
            </Typography>
        <AdminLiveStatusPage />
        </Box>
      );
      case 'drivers':
        return <AdminDriversPage />;
      case 'transactions':
        return <AdminTransactionsPage />;
      case 'exact-file':
        return <AdminExactFilePage />;
      case 'contacts':
        return <Box>
          <Typography variant="h3" gutterBottom>
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </Typography>
          <AdminContactsPage /> 
        </Box>
      default:
        return <div>{t('adminDashboard.pageNotFound')}</div>;
    }
  };

  return (
    <DashboardLayout menuItems={provideTranslatedText({ items: sidebarItemsAdmin })}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
