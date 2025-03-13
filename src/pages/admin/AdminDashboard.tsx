import React from 'react';

// Import Layout
import { DashboardLayout } from '../../components';

// Import dashboard components
import SummaryCards from '../../components/admin/SummaryCards';
import WeeklyAnalyticsTable from '../../components/admin/WeeklyAnalyticsTable'; 
import RevenueByMethodChart from '../../components/admin/RevenueByMethodChart'; 
import DriverStatusList from '../../components/admin/DriverStatusList';
import TopDriversTable from '../../components/admin/TopDriversTable';   
import { sidebarItemsAdmin } from './AdminSidebar';


export interface SidebarItem {
    text: string;
    icon: React.ReactNode | null;
    path: string;
}



const AdminDashboard: React.FC = () => {
    // const navigate = useNavigate();


    return (
        <DashboardLayout menuItems={sidebarItemsAdmin}>
            <SummaryCards />
            <WeeklyAnalyticsTable />
            <RevenueByMethodChart />
            <DriverStatusList />
            <TopDriversTable />
        </DashboardLayout>
    )
}

export default AdminDashboard;