import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';

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

  const handleWeekChange = (event: SelectChangeEvent<number>) => {
    setWeekOffset(Number(event.target.value));
  };

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
              <DateRangePicker />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>{t('adminDashboard.selectWeek')}</InputLabel>
                <Select
                  value={weekOffset}
                  label={t('adminDashboard.selectWeek')}
                  onChange={handleWeekChange}
                >
                  <MenuItem value={0}>{t('adminDashboard.currentWeek')}</MenuItem>
                  <MenuItem value={-1}>{t('adminDashboard.previousWeek')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <SummaryCards weekOffset={weekOffset} />

            <Box
              sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}
            >
              <Box sx={{ flex: 4 }}>
                <WeeklyAnalyticsCharts weekOffset={weekOffset} />
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
