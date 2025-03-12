// src/components/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import { SidebarItem } from '../../pages/admin/AdminDashboard';

// Drawer width for desktop view
const drawerWidth = 240;

// Styled components for the layout
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: drawerWidth,
  },
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.up('md')]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  },
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  menuItems: SidebarItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  menuItems 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for controlling drawer open/close
  const [open, setOpen] = useState(!isMobile);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          {/* User Menu with avatar */}
          <UserMenu />
        </Toolbar>
      </StyledAppBar>
      
      {/* Sidebar */}
      <Sidebar 
        menuItems={menuItems.map(item => ({ text: item.text, path: item.path }))}
        open={open}
        onClose={handleDrawerToggle}
        onNavigate={handleNavigate}
      />
      
      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* This creates space beneath the AppBar */}
        {children}
      </Main>
    </Box>
  );
};

export default DashboardLayout;