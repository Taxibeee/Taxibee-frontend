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
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/admin/dashboard',
    },
    {
        text: 'Orders',
        icon: <ReceiptIcon />,
        path: '/admin/orders',
    },
    {
        text: 'Live Status',
        icon: <SignalCellularAltIcon />,
        path: '/admin/live-status',
    },
    {
        text: 'Drivers',
        icon: <PersonIcon />,
        path: '/admin/drivers',
    },
    {
        text: 'Transactions',
        icon: <AttachMoneyIcon />,
        path: '/admin/transactions',
    },
    {
        text: "EXACT FILE",
        icon: <DescriptionIcon />,
        path: '/admin/exact-file',
    },
    {
        text: 'Contacts',
        icon: <ContactsIcon />,
        path: '/admin/contacts',
    }
];