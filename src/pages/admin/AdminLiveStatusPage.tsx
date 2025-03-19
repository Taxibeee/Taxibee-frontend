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
  Backdrop,
  CircularProgress,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Badge,
  Skeleton,
  Theme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAdminQueries } from '../../hooks';
import { DriverStatus } from '../../types/driver.types';

import { formatPhone } from '../../utils/formatPhone';


interface SearchFieldProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchTerm, handleSearchChange }) => (
  <Box sx={{ display: 'flex', mb: 2 }}>
    <TextField
    variant="outlined"
    placeholder="Search by driver name or phone"
    value={searchTerm}
    onChange={handleSearchChange}
    size="small"
    sx={{ width: '300px' }}
        

  />
    <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
  </Box>
);


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

  const SkeletonLoader = () => {
    return (
      <TableContainer component={Paper} elevation={0}>
    <Table sx={{ minWidth: 650, width: '100%' }}>
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
        {[...Array(9)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                <Skeleton variant="text" width={120} />
              </Box>
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={100} />
            </TableCell>
            <TableCell>
              <Skeleton variant="rounded" width={80} height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={150} />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={16} height={16} sx={{ mr: 1 }} />
                <Skeleton variant="text" width={80} />
              </Box>
            </TableCell>
            <TableCell align="center">
              <Skeleton variant="circular" width={32} height={32} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
    )
  }



  return (
    <Box>
      <Grid2 container spacing={3}>
        {/* Status Summary Cards */}
        <Grid2 item size={{ xs: 12 }}>
          <Grid2 container spacing={2}>
            <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ position:'relative', height: '100px', p: 4}}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" component="div">
                      Total Active
                    </Typography>
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: 30,
                    right: 30,
                  }}>
                    <Badge
                      badgeContent={data?.length || 0}
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}
                    >
                      <PersonIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            
            {/* Waiting Orders Card */}
            <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ position:'relative', height: '100px', p: 4 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" component="div">
                      Waiting Orders
                    </Typography>
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: 30,
                    right: 30,
                  }}>
                    <Badge
                      badgeContent={getDriverCountByStatus('waiting_orders')}
                      color="success"
                      sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}
                    >
                      <PersonIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>

            {/* Has Order Card */}
            <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ position:'relative', height: '100px', p: 4}}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" component="div">
                      Has Order
                    </Typography>
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: 30,
                    right: 30,
                  }}>
                    <Badge
                      badgeContent={getDriverCountByStatus('has_order')}
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}
                    >
                      <PersonIcon fontSize="large" color="action" />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>

          {/* Unknown Status Card */}
          <Grid2 item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ position:'relative', height: '100px', p: 4}}>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8
                  }}
                >
                  <Typography variant="body1" color="text.secondary" component="div">
                    Unknown Status
                  </Typography>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  top: 30,
                  right: 30,
                }}>
                  <Badge
                    badgeContent={getDriverCountByStatus('unknown')}
                    color="default"
                    sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}
                  >
                    <PersonIcon fontSize="large" color="action" />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid2>

          </Grid2>
        </Grid2>

        {/* Main Table Card */}
        <Grid2 item size={{ xs: 12 }}>
          <Card>
            <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              {/* Left side - Search and Filter */}
              <Box display="flex" gap={2} flex={1}>
                <SearchField
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                />
    
                <FormControl size="small" sx={{ width: '200px' }}>
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
              </Box>

              {/* Right side - Update, Auto-refresh, and Refresh */}
              <Box display="flex" gap={2} alignItems="center">
                <FormControl variant="outlined" size="small" sx={{ width: '150px' }}>
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

                <Button
                  variant="contained"
                  startIcon={<RefreshIcon sx={{ fontSize: '20px' }} />}
                  onClick={handleUpdateDrivers}
                  disabled={isUpdating}
                  sx={{
                    backgroundColor: '#fecc04',
                    color: 'black',
                    width: '170px',
                    height: '40px',
                    fontSize: '0.7rem',
                    '&:hover': {
                      backgroundColor: '#e5b803',
                    }
                  }}
                >
                  {isUpdating ? 'Updating...' : 'Update Drivers'}
                </Button>

                <IconButton onClick={handleManualRefresh} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

              
              
              
              <Divider sx={{ mb: 2 }} />

              {isLoading ? (
                <SkeletonLoader />
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
                                <PersonIcon sx={{ mr: 1, color: getStatusColor(driver.current_status) }} />
                                {driver.driver_name}
                              </Box>
                            </TableCell>
                            <TableCell>{formatPhone(driver.phone)}</TableCell>
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
                          <TableCell align="center">
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

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={isUpdating}
      >
        <CircularProgress color="inherit" />
        <Typography variant="caption" component="div">
          Updating drivers...
        </Typography>
      </Backdrop>

    </Box>
  );
};

export default AdminLiveStatusPage;
