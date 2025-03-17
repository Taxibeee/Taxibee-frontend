import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactsIcon from '@mui/icons-material/Contacts';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

export interface SidebarItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

export const sidebarItemsAdmin: SidebarItem[] = [
    {
        text: 'adminSidebar.dashboard',
        icon: <DashboardIcon />,
        path: '/admin/dashboard',
    },
    {
        text: 'adminSidebar.orders',
        icon: <ReceiptIcon />,
        path: '/admin/orders',
    },
    {
        text: 'adminSidebar.liveStatus',
        icon: <SignalCellularAltIcon />,
        path: '/admin/live-status',
    },
    {
        text: 'adminSidebar.drivers',
        icon: <PersonIcon />,
        path: '/admin/drivers',
    },
    {
        text: 'adminSidebar.transactions',
        icon: <AttachMoneyIcon />,
        path: '/admin/transactions',
    },
    {
        text: "adminSidebar.exactFile",
        icon: <DescriptionIcon />,
        path: '/admin/exact-file',
    },
    {
        text: 'adminSidebar.contacts',
        icon: <ContactsIcon />,
        path: '/admin/contacts',
    }
];