import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { sidebarItemsDriver } from './DriverSidebar';

// Import layout
import DashboardLayout from '../../components/layout/DashboardLayout';

// Import dashboard components
import DriverWelcomeCard from '../../components/driver/DriverWelcomeCard';
import DriverStatsCards from '../../components/driver/DriverStatsCards';
import DriverPerformanceList from '../../components/driver/DriverPerformanceList';
import RecentOrdersList from '../../components/driver/RecentOrdersList';

// Import pages
import DriverOrdersPage from './DriverOrdersPage';
import DriverContactsPage from './DriverContactsPage';

interface DriverDashboardProps {
  selectedPage: string;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ selectedPage }) => {
  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  // Determine which content to render based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Box>
            {/* Welcome Card */}
            <DriverWelcomeCard
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />

            {/* Summary Cards */}
            <DriverStatsCards period={selectedPeriod} />

            {/* Average Stats and Recent Orders */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <DriverPerformanceList period={selectedPeriod} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <RecentOrdersList
                  period={selectedPeriod}
                  onViewAllClick={() => (window.location.href = '/driver/orders')}
                />
              </Box>
            </Box>
          </Box>
        );
      case 'orders':
        return <DriverOrdersPage period={selectedPeriod} onPeriodChange={handlePeriodChange} />;
      case 'contacts':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </Typography>
            <DriverContactsPage />
          </Box>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return <DashboardLayout menuItems={sidebarItemsDriver}>{renderContent()}</DashboardLayout>;
};

export default DriverDashboard;
