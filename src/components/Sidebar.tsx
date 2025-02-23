import React, { useEffect } from "react";
import { SidebarItem } from "../views/AdminView";
import { 
  Box, 
  Dialog, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from "@mui/material";
import { useAdminContext } from "../contexts/AdminContextProvider";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { sidebar: isOpen, setSidebar } = useAdminContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add this useEffect to handle screen size changes
  useEffect(() => {
    if (!isMobile) {
      setSidebar(true); // Always show sidebar on desktop
    }
  }, [isMobile, setSidebar]);

  const handleClose = () => {
    if (isMobile) {
      setSidebar(false);
    }
  };

  const SidebarContent = () => (
    <List sx={{ width: '100%', maxWidth: 280 }}>
      {items.map(item => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton
            onClick={() => {
              item.customFunc();
              if (isMobile) {
                handleClose();
              }
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              borderRadius: 1,
              mb: 0.5,
            }}
          >
            {item.icon && (
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={item.title}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  if (isMobile) {
    return (
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
      >
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Menu
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ 
          p: 2, 
          height: '100%', 
          backgroundColor: 'background.default'
        }}>
          <SidebarContent />
        </Box>
      </Dialog>
    );
  }

  // Desktop version
  return isOpen ? (
    <Box sx={{ 
      height: '100vh',
      width: '20vw',
      borderRight: '1px solid',
      borderColor: 'divider',
      p: 2,
      backgroundColor: '#090B0F',
      color: 'white'
    }}>
      <SidebarContent />
    </Box>
  ) : null;
};

export default Sidebar;
