import React from 'react';

// Import Layout
import { DashboardLayout } from '../../components';

// Import dashboard components
import SummaryCards from '../../components/admin/SummaryCards';
import WeeklyAnalyticsTable from '../../components/admin/WeeklyAnalyticsTable'; 
import RevenueByMethodChart from '../../components/admin/RevenueByMethodChart'; 
import DriverStatusList from '../../components/admin/DriverStatusList';
import TopDriversTable from '../../components/admin/TopDriversTable';   
// import { useNavigate } from 'react-router-dom';


export interface SidebarItem {
    text: string;
    icon: React.ReactNode | null;
    path: string;
}

const sidebarItemsAdmin: SidebarItem[] = [
    {
        text: 'Dashboard',
        icon: null,
        path: '/admin/dashboard',
    },
    {
        text: 'Live Status',
        icon: null,
        path: '/admin/live-status',
    },
    {
        text: 'Recent Orders',
        icon: null,
        path: '/admin/recent-orders',
    },
    {
        text: 'Drivers',
        icon: null,
        path: '/admin/drivers',
    },
    {
        text: 'Transactions',
        icon: null,
        path: '/admin/transactions',
    },
    {
        text: "EXACT FILE",
        icon: null,
        path: '/admin/exact-file',
    },
    {
        text: 'Contacts',
        icon: null,
        path: '/admin/contacts',
    }
];



const AdminDashboard: React.FC = () => {
    // const navigate = useNavigate();


    return (
        <DashboardLayout title='Admin Dashboard' menuItems={ sidebarItemsAdmin}>
            <SummaryCards />
            <WeeklyAnalyticsTable />
            <RevenueByMethodChart />
            <DriverStatusList />
            <TopDriversTable />
        </DashboardLayout>
    )
}

export default AdminDashboard;