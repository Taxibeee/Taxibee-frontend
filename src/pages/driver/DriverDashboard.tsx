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

  // Determine which content to render based on the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Box>
            {/* Welcome Card */}
            <DriverWelcomeCard
              onDateRangeChange={handleDateRangeChange}
            />

            {/* Summary Cards */}
            <DriverStatsCards startDate={startDate} endDate={endDate} />

            {/* Average Stats and Recent Orders */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <DriverPerformanceList startDate={startDate} endDate={endDate} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <RecentOrdersList
                  startDate={startDate} 
                  endDate={endDate}
                  onViewAllClick={() => (window.location.href = '/driver/orders')}
                />
              </Box>
            </Box>
          </Box>
        );
      case 'orders':
        // return <DriverOrdersPage startDate={startDate} endDate={endDate} onPeriodChange={handlePeriodChange} />;
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
