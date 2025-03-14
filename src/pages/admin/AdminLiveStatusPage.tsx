import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAdminQueries } from '../../hooks';
import { DriverStatus } from '../../api/adminApi';

const AdminLiveStatusPage: React.FC = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute default

  // Fetch live driver status with auto-refresh
  const { useLiveDriverStatus, useUpdateDriversTable } = useAdminQueries();
  const { data, isLoading, isError, refetch } = useLiveDriverStatus(refreshInterval);
  const { mutate: updateDrivers, isPending: isUpdating } = useUpdateDriversTable();

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (event: SelectChangeEvent<number>) => {
    setRefreshInterval(Number(event.target.value));
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    refetch();
  };

  // Handle update drivers table
  const handleUpdateDrivers = () => {
    updateDrivers();
  };

  // Filter drivers based on search term and status filter
  const filteredDrivers = data?.filter(driver => {
    const matchesSearch = 
      driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      driver.current_status === statusFilter;
      
    return matchesSearch && matchesStatus;
  }) || [];

  // Get status color
  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'waiting_orders':
        return 'success';
      case 'has_order':
        return 'primary';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  // Calculate driver count by status
  const getDriverCountByStatus = (status: string): number => {
    return (data || []).filter(driver => driver.current_status === status).length;
  };

  return (
    <Box>
      <Grid2 container spacing={3}>
        {/* Status Summary Cards */}
        <Grid2 item xs={12}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Total Active
                    </Typography>
                    <Badge
                      badgeContent={data?.length || 0}
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 24, minWidth: 24 } }}
                    >
                      <LocalTaxiIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Waiting Orders
                    </Typography>
                    <Badge
                      badgeContent={getDriverCountByStatus('waiting_orders')}
                      color="success"
                      sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 24, minWidth: 24 } }}
                    >
                      <LocalTaxiIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Has Order
                    </Typography>
                    <Badge
                      badgeContent={getDriverCountByStatus('has_order')}
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 24, minWidth: 24 } }}
                    >
                      <LocalTaxiIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            
            <Grid2 item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                      Unknown Status
                    </Typography>
                    <Badge
                      badgeContent={getDriverCountByStatus('unknown')}
                      color="default"
                      sx={{ '& .MuiBadge-badge': { fontSize: 14, height: 24, minWidth: 24 } }}
                    >
                      <LocalTaxiIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Main Table Card */}
        <Grid2 item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Live Driver Status</Typography>
                
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleUpdateDrivers}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Drivers'}
                  </Button>
                  
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="refresh-interval-label">Auto-refresh</InputLabel>
                    <Select
                      labelId="refresh-interval-label"
                      value={refreshInterval}
                      onChange={handleRefreshIntervalChange} 
                      label="Auto-refresh"
                    >
                      <MenuItem value={30000}>Every 30 seconds</MenuItem>
                      <MenuItem value={60000}>Every 1 minute</MenuItem>
                      <MenuItem value={300000}>Every 5 minutes</MenuItem>
                      <MenuItem value={0}>Manual only</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <IconButton onClick={handleManualRefresh} disabled={isLoading}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid2 container spacing={2} mb={2}>
                <Grid2 item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by driver name or phone"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                
                <Grid2 item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">Status Filter</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      label="Status Filter"
                      
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="waiting_orders">Waiting Orders</MenuItem>
                      <MenuItem value="has_order">Has Order</MenuItem>
                      <MenuItem value="unknown">Unknown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>
              
              <Divider sx={{ mb: 2 }} />

              {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : isError ? (
                <Typography color="error">Error loading driver status data. Please try again.</Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Driver</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Current Status</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver: DriverStatus) => (
                          <TableRow key={driver.driver_uuid} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalTaxiIcon sx={{ mr: 1, color: getStatusColor(driver.current_status) }} />
                                {driver.driver_name}
                              </Box>
                            </TableCell>
                            <TableCell>{driver.phone}</TableCell>
                            <TableCell>
                              <Chip
                                label={driver.current_status}
                                color={getStatusColor(driver.current_status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{driver.last_updated || 'Unknown'}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
                                {driver.status_duration || 'Unknown'}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="primary"
                                component="a"
                                href={`tel:${driver.phone}`}
                              >
                                <PhoneIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No drivers match your filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdminLiveStatusPage;
