// src/components/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  Dialog,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import { TransitionProps } from '@mui/material/transitions';

// Define the sidebar item interface
export interface SidebarItem {
  text: string;
  icon?: React.ReactNode;
  path: string;
}

// Drawer width for desktop view
const drawerWidth = 240;

// Slide transition for the full-screen dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled main content area
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
}));

// StyledAppBar component
const StyledAppBar = styled(AppBar, { 
  shouldForwardProp: (prop) => prop !== 'open' 
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#f9fafb',
  color: 'black',
  boxShadow: 'none',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: SidebarItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  menuItems 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for controlling drawer open/close
  const [open, setOpen] = useState(!isMobile);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    if (isMobile) {
      setDialogOpen(!dialogOpen);
    } else {
      setOpen(!open);
    }
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDialogOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* App Bar - Always full width at the top */}
      <StyledAppBar position="fixed" open={!isMobile && open}>
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
            {""}
          </Typography>
          
          {/* User Menu with avatar */}
          <UserMenu />
        </Toolbar>
      </StyledAppBar>
      
      {isMobile ? (
        // Mobile: Full-screen dialog
        <Dialog
          fullScreen
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative', backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {""}
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>
          {/* Render sidebar content inside dialog */}
          <Sidebar 
            menuItems={menuItems}
            open={true}
            onClose={() => setDialogOpen(false)}
            onNavigate={handleNavigate}
            isMobile={true}
          />
        </Dialog>
      ) : (
        // Desktop: Persistent drawer that starts below the AppBar
        <Sidebar 
          menuItems={menuItems}
          open={open}
          onClose={handleDrawerToggle}
          onNavigate={handleNavigate}
          isMobile={false}
        />
      )}
      
      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* This creates space beneath the AppBar */}
        {children}
      </Main>
    </Box>
  );
};

export default DashboardLayout;