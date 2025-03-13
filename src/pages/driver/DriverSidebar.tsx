import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';

export interface SidebarItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

export const sidebarItemsDriver: SidebarItem[] = [
    {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/driver/dashboard',
    },
    {
        text: 'Orders',
        icon: <ReceiptIcon />,
        path: '/driver/orders',
    }
];