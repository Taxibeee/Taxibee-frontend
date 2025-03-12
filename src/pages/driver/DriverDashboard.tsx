import React, { useState } from 'react';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';

// Import layout
import DashboardLayout from '../../components/layout/DashboardLayout';

// Import dashboard components
import DriverWelcomeCard from '../../components/driver/DriverWelcomeCard';
import DriverStatsCards from '../../components/driver/DriverStatsCards';
import DriverPerformanceList from '../../components/driver/DriverPerformanceList';
import RecentOrdersList from '../../components/driver/RecentOrdersList';
import OrdersTable from '../../components/driver/OrdersTable';

// Interface for menu items
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const DriverDashboard: React.FC = () => {
  // State for selected tab
  const [tabValue, setTabValue] = useState(0);
  
  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  
  // Define menu items for the dashboard
  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/driver/dashboard' },
    { text: 'Earnings', icon: <AttachMoneyIcon />, path: '/driver/earnings' },
    { text: 'Orders', icon: <ReceiptIcon />, path: '/driver/orders' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <DashboardLayout title="Driver Dashboard" menuItems={menuItems}>
      {/* Dashboard Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Earnings" />
          <Tab label="Recent Orders" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Welcome Card */}
          <DriverWelcomeCard 
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />

          {/* Summary Cards */}
          <DriverStatsCards period={selectedPeriod} />

          {/* Average Stats and Recent Orders */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DriverPerformanceList period={selectedPeriod} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentOrdersList 
                period={selectedPeriod}
                onViewAllClick={() => setTabValue(2)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Earnings Tab */}
      {tabValue === 1 && (
        <Box>
          <DriverWelcomeCard 
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
          <DriverStatsCards period={selectedPeriod} />
          <DriverPerformanceList period={selectedPeriod} />
        </Box>
      )}

      {/* Recent Orders Tab */}
      {tabValue === 2 && (
        <Box>
          <OrdersTable 
            period={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </Box>
      )}
    </DashboardLayout>
  );
};

export default DriverDashboard;