import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../store/hooks';

interface PasswordChangeDialogProps {
  open: boolean;
  onClose: () => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ open, onClose }) => {
  const { updatePassword, error, loading } = useAuth();
  
  // Local state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null); // Clear error when user types
    setSuccess(false); // Clear success message
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters long');
      return;
    }

    try {
      await updatePassword(passwordData.oldPassword, passwordData.newPassword);
      setSuccess(true);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      // Error is handled by the updatePassword function and stored in the redux state
      console.error('Failed to update password:', err);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    // Reset state
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setLocalError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your current password and a new password.
        </DialogContentText>
        
        {/* Error Alert */}
        {(error || localError) && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error || localError}
          </Alert>
        )}
        
        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            Password changed successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            id="oldPassword"
            name="oldPassword"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.oldPassword}
            onChange={handleChange}
            disabled={loading || success}
          />
          <TextField
            id="newPassword"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={handleChange}
            disabled={loading || success}
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            disabled={loading || success}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || success}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog;