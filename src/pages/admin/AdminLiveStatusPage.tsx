import React from 'react';
import { Typography, Box } from '@mui/material';
import { DashboardLayout } from '../../components';
import { sidebarItemsAdmin } from './AdminSidebar';
import DriverStatusList from '../../components/admin/DriverStatusList';

const AdminLiveStatusPage: React.FC = () => {
    return (
        <DashboardLayout menuItems = {sidebarItemsAdmin}>
            <Box>
                <Typography variant="h4" sx={{ mb: 3 }} >Live Driver Status</Typography>
                <DriverStatusList />
            </Box>
        </DashboardLayout>
    )
}

export default AdminLiveStatusPage;