import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Tabs, Tab, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';

// Import layout
import DashboardLayout from '../../components/layout/DashboardLayout';

// Import dashboard components
import SummaryCards from '../../components/admin/SummaryCards';
import WeeklyAnalyticsTable from '../../components/admin/WeeklyAnalyticsTable';
import RevenueByMethodChart from '../../components/admin/RevenueByMethodChart';
import DriverStatusList from '../../components/admin/DriverStatusList';
import TopDriversTable from '../../components/admin/TopDriversTable';

// Interface for menu items
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for selected tab
  const [tabValue, setTabValue] = useState(0);
  
  // Define menu items for the dashboard
  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Drivers', icon: <LocalTaxiIcon />, path: '/admin/drivers' },
    { text: 'Orders', icon: <ReceiptIcon />, path: '/admin/orders' },
    { text: 'Transactions', icon: <AttachMoneyIcon />, path: '/admin/transactions' },
    { text: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
  ];

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
      {/* Dashboard Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Driver Status" />
          <Tab label="Revenue Analysis" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Summary Cards */}
          <SummaryCards />

          {/* Daily Analytics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <WeeklyAnalyticsTable />
            </Grid>
            <Grid item xs={12} md={6}>
              <RevenueByMethodChart />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Driver Status Tab */}
      {tabValue === 1 && (
        <Box>
          <DriverStatusList />
        </Box>
      )}

      {/* Revenue Analysis Tab */}
      {tabValue === 2 && (
        <Box>
          <TopDriversTable />

          {/* Unaccounted Transactions Notice */}
          <Card elevation={2} sx={{ mt: 3, backgroundColor: '#fff9c4' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon color="warning" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">Unaccounted Transactions</Typography>
                <Typography variant="body2">
                  There may be transactions that need to be assigned to specific drivers.
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/admin/transactions')}
                >
                  Review Transactions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;