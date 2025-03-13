// src/components/layout/Sidebar.tsx
import React from 'react';
import { 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { SidebarItem } from './DashboardLayout';
import logo from '../../assets/F5-04.png';

// Define drawer width - make sure this matches your DashboardLayout
const drawerWidth = 240;

interface SidebarProps {
  menuItems: SidebarItem[];
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  open, 
  onClose, 
  onNavigate,
  isMobile
}) => {

  // Sidebar content - shared between mobile and desktop versions
  const sidebarContent = (
    <Box
      sx={{
        mt: isMobile ? 2: -6, // Adjust the margin top if needed
        }}
      >
      {!isMobile && <Toolbar />} {/* This provides space at the top for the AppBar in desktop mode */}
      {!isMobile && <Box sx={{ display: 'flex', justifyContent: 'center', mt: -5, mb: -4 }}>
        <img src={logo} alt="React" width={200} height={100} />
      </Box>}
      <List sx={{ p: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                onNavigate(item.path);
                if (isMobile) {
                  onClose();
                }
              }}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {item.icon && (
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.text} slotProps={{
                primary: {
                  sx: {
                    fontSize: '0.875rem',
                    fontFamily: '"Comic Sans MS", "Comic Sans"'
                  }
                }
              }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // For mobile, we just return the content directly since it's rendered inside a Dialog
  if (isMobile) {
    return <Box sx={{ width: '100%' }}>{sidebarContent}</Box>;
  }

  // For desktop, we use the Drawer component with positioning to account for the AppBar
  return (
    <Box component="nav">
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            paddingTop: 0, // AppBar will be above this
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;