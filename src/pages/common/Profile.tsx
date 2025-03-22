import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import { UserType, AdminUser, DriverUser } from '../../types/auth.types';
import {
  Box,
  Button,
  TextField,
  Typography,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
} from '@mui/material';
import { CustomAlert } from '../../utils/customAlert';

const Profile: React.FC = () => {
  const { currentUser, updatePassword, error, loading, clearErrors, logout, userRole } = useAuth();

  // State for password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [localError, setLocalError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Type guard functions
  const isAdminUser = (user: UserType): user is AdminUser => {
    return user.role === 'admin';
  };

  const isDriverUser = (user: UserType): user is DriverUser => {
    return user.role === 'driver';
  };

  // Get display name based on user type
  const getDisplayName = (user: UserType): string => {
    if (isAdminUser(user)) {
      return user.name;
    }
    return user.full_name;
  };

  const getUsername = (user: UserType): string => {
    if (isAdminUser(user)) {
      return user.username;
    }
    return user.username;
  };

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Handle input changes for password form
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle password update submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setLocalError('Please fill in all password fields');
      return;
    }

    setLocalError('');
    setSuccess('');

    try {
      const response = await updatePassword(passwordData.oldPassword, passwordData.newPassword);

      setSuccess(response.message || 'Password updated successfully!');

      // Clear form after successful update
      setPasswordData({
        oldPassword: '',
        newPassword: '',
      });
    } catch (err) {
      console.error(err);
      if (!error) {
        setLocalError('Failed to update password');
      }
    }
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    return userRole === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
  };

  // If no user is logged in, show appropriate message
  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view your profile.</Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Profile</Typography>
        <Box>
          <Button component={Link} to={getDashboardLink()} variant="outlined" sx={{ mr: 2 }}>
            Dashboard
          </Button>
          <Button onClick={() => logout()} variant="contained" color="error">
            Logout
          </Button>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onChange={(_: React.SyntheticEvent, newValue: string) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab value="profile" label="Profile Information" />
        <Tab value="security" label="Security Settings" />
      </Tabs>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
              <Typography sx={{ width: 200, fontWeight: 'bold' }}>Name:</Typography>
              <Typography>{getDisplayName(currentUser)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
              <Typography sx={{ width: 200, fontWeight: 'bold' }}>Username:</Typography>
              <Typography>{getUsername(currentUser)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
              <Typography sx={{ width: 200, fontWeight: 'bold' }}>Role:</Typography>
              <Typography>{currentUser.role}</Typography>
            </Box>

            {isAdminUser(currentUser) && (
              <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
                <Typography sx={{ width: 200, fontWeight: 'bold' }}>Email:</Typography>
                <Typography>{currentUser.email}</Typography>
              </Box>
            )}

            {isAdminUser(currentUser) && (
              <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
                <Typography sx={{ width: 200, fontWeight: 'bold' }}>Company ID:</Typography>
                <Typography>{currentUser.company_id}</Typography>
              </Box>
            )}

            {isDriverUser(currentUser) && (
              <>
                <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
                  <Typography sx={{ width: 200, fontWeight: 'bold' }}>Taxibee ID:</Typography>
                  <Typography>{currentUser.taxibee_id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', borderBottom: '1px solid #eee', py: 2 }}>
                  <Typography sx={{ width: 200, fontWeight: 'bold' }}>Bolt Driver UUID:</Typography>
                  <Typography>{currentUser.bolt_driver_uuid}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Update your password
          </Typography>

          {(error || localError) && (
            <CustomAlert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </CustomAlert>
          )}

          {success && (
            <CustomAlert severity="success" sx={{ mb: 2 }}>
              {success}
            </CustomAlert>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField
                type="password"
                label="Current Password"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                fullWidth
              />

              <TextField
                type="password"
                label="New Password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                fullWidth
              />

              <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
                {loading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default Profile;
