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

// Import dashboard components for the main dashboard
import SummaryCards from '../../components/admin/SummaryCards';
import WeeklyAnalyticsTable from '../../components/admin/WeeklyAnalyticsTable'; 
import RevenueByMethodChart from '../../components/admin/RevenueByMethodChart'; 
import TopDriversTable from '../../components/admin/TopDriversTable';

// Placeholder for Contacts page
const ContactsPage = () => (
  <Box p={3}>
    <h1>Contacts</h1>
    <p>This page is under construction. The endpoint for the contacts page is not yet implemented.</p>
  </Box>
);

interface AdminDashboardProps {
  selectedPage: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ selectedPage }) => {
  // Render the appropriate content based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </Typography>

            <SummaryCards />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <WeeklyAnalyticsTable />
              </Box>
              <Box sx={{ flex: 1 }}>
                <RevenueByMethodChart />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TopDriversTable />
              </Box>
            </Box>
          </Box>
        );
      case 'orders':
        return <AdminOrdersPage />;
      case 'live-status':
        return <AdminLiveStatusPage />;
      case 'drivers':
        return <AdminDriversPage />;
      case 'transactions':
        return <AdminTransactionsPage />;
      case 'exact-file':
        return <AdminExactFilePage />;
      case 'contacts':
        return <ContactsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <DashboardLayout menuItems={sidebarItemsAdmin}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;