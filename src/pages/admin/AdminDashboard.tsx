import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import DateRangePicker from '../../components/input/DateRangePicker';

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
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const endDate7Days = new Date();
  const startDate7Days = new Date();
  startDate7Days.setDate(endDate7Days.getDate() - 7);

  const startDate7DaysString = startDate7Days.toISOString().split('T')[0];
  const endDate7DaysString = endDate7Days.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(startDate7DaysString);
  const [endDate, setEndDate] = useState<string>(endDate7DaysString);

  const handleDateRangeChange = (start: Date, end: Date) => {
    const startDateString = start ? start.toISOString().split('T')[0] : startDate7DaysString;
    const endDateString = end ? end.toISOString().split('T')[0] : endDate7DaysString;

    setStartDate(startDateString);
    setEndDate(endDateString);
  };

  // const handleWeekChange = (event: SelectChangeEvent<number>) => {
  //   setWeekOffset(Number(event.target.value));
  // };

  const provideTranslatedText = ({ items }: { items: SidebarItem[] }): SidebarItem[] => {
    return items.map((item: SidebarItem) => {
      return {
        ...item,
        text: t(item.text),
      };
    });
  };

  // Render the appropriate content based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Typography variant="h3" gutterBottom>
                {t('adminSidebar.dashboard')}
              </Typography>
              <DateRangePicker onSelect={handleDateRangeChange} />
            </Box>
            <SummaryCards startDate={startDate} endDate={endDate} />

            <Box
              sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}
            >
              <Box sx={{ flex: 4 }}>
                <WeeklyAnalyticsCharts startDate={startDate} endDate={endDate} />
              </Box>
              <Box sx={{ flex: 2 }}>
                <RevenueByMethodChart weekOffset={weekOffset} />
              </Box>
              <Box sx={{ flex: 4 }}>
                <TopDriversTable weekOffset={weekOffset} />
              </Box>
            </Box>
          </Box>
        );
      case 'orders':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminSidebar.orders')}
            </Typography>
            <AdminOrdersPage />
          </Box>
        );
      case 'live-status':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminSidebar.liveStatus')}
            </Typography>
            <AdminLiveStatusPage />
          </Box>
        );
      case 'drivers':
        return <AdminDriversPage />;
      case 'transactions':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminSidebar.transactions')}
            </Typography>
            <AdminTransactionsPage />
          </Box>
        );
      case 'exact-file':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminSidebar.exactFile')}
            </Typography>
            <AdminExactFilePage />
          </Box>
        );
      case 'contacts':
        return (
          <Box>
            <Typography variant="h3" gutterBottom>
              {t('adminContactsPage.contacts')}
            </Typography>
            <AdminContactsPage />
          </Box>
        );
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
