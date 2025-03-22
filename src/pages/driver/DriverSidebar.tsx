import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ContactsIcon from '@mui/icons-material/Contacts';

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
  },
  {
    text: 'Contacts',
    icon: <ContactsIcon />,
    path: '/driver/contacts',
  },
];
