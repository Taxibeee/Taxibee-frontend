import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid2,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAdminQueries } from '../../hooks';
import { sidebarItemsAdmin } from './AdminSidebar';
import { DashboardLayout } from '../../components';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import { Driver } from '../../api/adminApi';

const AdminDriversPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  const { useAllDrivers, useUpdateDriversTable } = useAdminQueries();
  const { data, isLoading, isError } = useAllDrivers();
  const updateDriversMutation = useUpdateDriversTable();

  const handleUpdateDrivers = () => {
    updateDriversMutation.mutate();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDriverDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const filteredDrivers = data?.data.filter(driver => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      driver.full_name.toLowerCase().includes(term) ||
      driver.email.toLowerCase().includes(term) ||
      driver.phone.toLowerCase().includes(term) ||
      (driver.exact_debnr && driver.exact_debnr.toLowerCase().includes(term))
    );
  });

  return (
    <DashboardLayout menuItems={sidebarItemsAdmin}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Drivers Management
        </Typography>

        <Grid2 container spacing={3} sx={{ mb: 3 }}>
          <Grid2 item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search drivers by name, email, or phone..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateDrivers}
              startIcon={updateDriversMutation.isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              disabled={updateDriversMutation.isLoading}
              sx={{ height: '100%' }}
            >
              {updateDriversMutation.isLoading ? 'Updating...' : 'Update Drivers from API'}
            </Button>
          </Grid2>
        </Grid2>

        {updateDriversMutation.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to update drivers: {updateDriversMutation.error as string}
          </Alert>
        )}

        {updateDriversMutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Drivers successfully updated!
          </Alert>
        )}

        <Card elevation={2}>
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Alert severity="error">Failed to load drivers data.</Alert>
            ) : !filteredDrivers || filteredDrivers.length === 0 ? (
              <Alert severity="info">
                {searchTerm ? 'No drivers match your search criteria.' : 'No drivers available.'}
              </Alert>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver Name</TableCell>
                      <TableCell>Contact Info</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Terminal</TableCell>
                      <TableCell>ID Numbers</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.bolt_driver_uuid}>
                        <TableCell>{driver.full_name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalPhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">{driver.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2">{driver.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={driver.state}
                            color={driver.state === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                          {driver.inactivity_reason && (
                            <Tooltip title={`Inactive: ${driver.inactivity_reason}`}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" color="warning" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>{driver.today_terminal_name || 'Not assigned'}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            TaxiBee: {driver.taxibee_id}
                          </Typography>
                          {driver.exact_debnr && (
                            <Typography variant="body2">
                              Exact: {driver.exact_debnr}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDriverDetails(driver)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Driver Details Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          {selectedDriver && (
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
              <Grid2 item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Personal Information</Typography>
                <Typography variant="body1">Name: {selectedDriver.full_name}</Typography>
                <Typography variant="body1">Phone: {selectedDriver.phone}</Typography>
                <Typography variant="body1">Email: {selectedDriver.email}</Typography>
                <Typography variant="body1">Status: {selectedDriver.state}</Typography>
                {selectedDriver.inactivity_reason && (
                  <Typography variant="body1">Inactivity Reason: {selectedDriver.inactivity_reason}</Typography>
                )}
              </Grid2>
              <Grid2 item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">System Information</Typography>
                <Typography variant="body1">TaxiBee ID: {selectedDriver.taxibee_id}</Typography>
                <Typography variant="body1">Bolt Driver UUID: {selectedDriver.bolt_driver_uuid}</Typography>
                <Typography variant="body1">Bolt Partner UUID: {selectedDriver.bolt_partner_uuid}</Typography>
                <Typography variant="body1">Company ID: {selectedDriver.company_id}</Typography>
                <Typography variant="body1">Chauffeurs Kaartnr: {selectedDriver.chauffeurskaartnr || 'N/A'}</Typography>
                <Typography variant="body1">Exact Debnr: {selectedDriver.exact_debnr || 'N/A'}</Typography>
                <Typography variant="body1">MyPOS Operator Code: {selectedDriver.mypos_operator_code || 'N/A'}</Typography>
                <Typography variant="body1">Today's Terminal: {selectedDriver.today_terminal_name || 'Not assigned'}</Typography>
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDriversPage;