import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import PasswordChangeDialog from '../shared/PasswordChangeDialog';

const UserMenu: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State for user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  // State for dark mode
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true'
  );
  
  // State for password dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    // Note: For full implementation, you'd need to connect this to your theme provider
  };

  // Handle password dialog
  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
    handleMenuClose();
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser?.full_name) {
      return currentUser.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={menuOpen ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {getUserInitials()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">My Profile</Typography>
        </MenuItem>

        <Divider />
        
        <MenuItem>
          <ListItemIcon>
            {darkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit">Dark Mode</Typography>
          <Switch 
            checked={darkMode}
            onChange={handleDarkModeToggle}
            size="small"
            sx={{ ml: 1 }}
          />
        </MenuItem>
        
        <MenuItem onClick={handleOpenPasswordDialog}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Change Password</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Password Change Dialog */}
      <PasswordChangeDialog 
        open={passwordDialogOpen}
        onClose={handleClosePasswordDialog}
      />
    </>
  );
};

export default UserMenu;