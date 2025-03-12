import React, { useState } from 'react';
import { Box, Grid2 } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate, useLocation } from 'react-router-dom';

// Import layout
import DashboardLayout, { SidebarItem } from '../../components/layout/DashboardLayout';

// Import dashboard components
import DriverWelcomeCard from '../../components/driver/DriverWelcomeCard';
import DriverStatsCards from '../../components/driver/DriverStatsCards';
import DriverPerformanceList from '../../components/driver/DriverPerformanceList';
import RecentOrdersList from '../../components/driver/RecentOrdersList';
import OrdersTable from '../../components/driver/OrdersTable';

const DriverDashboard: React.FC = () => {
  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define menu items for the dashboard (simplified to just 2 items)
  const menuItems: SidebarItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/driver/dashboard' },
    { text: 'My Orders', icon: <ReceiptIcon />, path: '/driver/orders' },
  ];

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  // Determine which content to render based on the path
  const renderContent = () => {
    if (location.pathname === '/driver/orders') {
      return (
        <Box>
          <OrdersTable 
            period={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </Box>
      );
    }
    
    // Default dashboard view
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
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} md={6}>
            <DriverPerformanceList period={selectedPeriod} />
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <RecentOrdersList 
              period={selectedPeriod}
              onViewAllClick={() => navigate('/driver/orders')}
            />
          </Grid2>
        </Grid2>
      </Box>
    );
  };

  return (
    <DashboardLayout title="Driver Dashboard" menuItems={menuItems}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default DriverDashboard;
