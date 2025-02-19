import React from "react";
import { SidebarItem } from "../pages/Dashboard";
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

  const handleClose = () => {
    setSidebar(false);
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
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500
              }}
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
        TransitionProps={{
          enter: true,
          exit: true,
        }}
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
      height: '100%',
      borderRight: '1px solid',
      borderColor: 'divider',
      p: 2,
      backgroundColor: 'background.paper'
    }}>
      <SidebarContent />
    </Box>
  ) : null;
};

export default Sidebar;
