import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const UserMenu: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return 'U';

    if (currentUser.role === 'admin' && currentUser.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser.role === 'driver' && currentUser.full_name) {
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
        open={Boolean(menuOpen)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.15))',
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
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>

        <Divider />

        {/* Language Switcher */}
        <MenuItem>
          <LanguageSwitcher />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Typography variant="body2" color="error">
            {t('auth.logout')}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
