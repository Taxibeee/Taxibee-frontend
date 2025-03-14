import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
  Tabs,
  Tab,
  Divider,
  Pagination,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useAdminQueries } from '../../hooks';
import { Driver, Order } from '../../api/adminApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`driver-tabpanel-${index}`}
      aria-labelledby={`driver-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDriversPage: React.FC = () => {
  // State for selected driver and search
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [orderPage, setOrderPage] = useState(1);

  // Fetch all drivers
  const { useAllDrivers, useDriverOrders } = useAdminQueries();
  const { data: driversData, isLoading: driversLoading, isError: driversError } = useAllDrivers();
  
  // Fetch selected driver's orders
  const { data: driverOrdersData, isLoading: ordersLoading } = useDriverOrders(
    selectedDriver?.bolt_driver_uuid || '',
    orderPage,
    10
  );
  
  // Add a refetch trigger when driver changes
  useEffect(() => {
    if (selectedDriver) {
      // This will trigger a refetch when a new driver is selected
      setOrderPage(1);
    }
  }, [selectedDriver?.bolt_driver_uuid]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle driver selection
  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setOrderPage(1); // Reset to first page when driver changes
    setTabValue(0); // Reset to first tab when driver changes
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle order page change
  const handleOrderPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setOrderPage(value);
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return '€0.00';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Filter drivers based on search term
  const filteredDrivers = driversData?.data.filter(driver => 
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (driver.taxibee_id && driver.taxibee_id.toString().includes(searchTerm))
  ) || [];

  // Get driver status color
  const getDriverStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left side - Driver List */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 0 }}>
              <Typography variant="h6" gutterBottom>
                Drivers
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, phone, email, or ID"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
            <Divider />
            <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
              {driversLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : driversError ? (
                <Typography color="error" p={2}>
                  Error loading drivers. Please try again.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                          <TableRow 
                            key={driver.bolt_driver_uuid}
                            hover
                            onClick={() => handleDriverSelect(driver)}
                            selected={selectedDriver?.bolt_driver_uuid === driver.bolt_driver_uuid}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                {driver.full_name}
                              </Box>
                            </TableCell>
                            <TableCell>{driver.phone}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={driver.state}
                                color={getDriverStatusColor(driver.state)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No drivers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right side - Driver Details and Orders */}
        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedDriver ? (
              <>
                <CardContent sx={{ flexGrow: 0, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedDriver.full_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {selectedDriver.taxibee_id} | {selectedDriver.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Chip
                        label={selectedDriver.state}
                        color={getDriverStatusColor(selectedDriver.state)}
                      />
                    </Box>
                  </Box>

                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Driver Info" />
                    <Tab label="Orders" />
                  </Tabs>
                </CardContent>

                <Divider />

                <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
                  <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3} p={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Personal Information
                        </Typography>
                        <Divider sx={{ mb: 2, mt: 1 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Full Name</Typography>
                          <Typography variant="body1">{selectedDriver.full_name}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Phone</Typography>
                          <Typography variant="body1">{selectedDriver.phone}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1">{selectedDriver.email || 'N/A'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Chauffeurs Kaartnr</Typography>
                          <Typography variant="body1">{selectedDriver.chauffeurskaartnr || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          System Information
                        </Typography>
                        <Divider sx={{ mb: 2, mt: 1 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Taxibee ID</Typography>
                          <Typography variant="body1">{selectedDriver.taxibee_id}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Bolt Driver UUID</Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {selectedDriver.bolt_driver_uuid}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <Chip
                            label={selectedDriver.state}
                            color={getDriverStatusColor(selectedDriver.state)}
                            size="small"
                          />
                          {selectedDriver.inactivity_reason && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Reason: {selectedDriver.inactivity_reason}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Terminal Name</Typography>
                          <Typography variant="body1">{selectedDriver.today_terminal_name || 'Not Assigned'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Exact Debnr</Typography>
                          <Typography variant="body1">{selectedDriver.exact_debnr || 'N/A'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">MyPOS Operator Code</Typography>
                          <Typography variant="body1">{selectedDriver.mypos_operator_code || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={1}>
                    {ordersLoading ? (
                      <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                      </Box>
                    ) : !driverOrdersData ? (
                      <Typography color="text.secondary" align="center" p={3}>
                        No orders data available
                      </Typography>
                    ) : (
                      <Box p={2}>
                        <TableContainer component={Paper} elevation={0}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Pickup</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Net Earnings</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {driverOrdersData.data.length > 0 ? (
                                driverOrdersData.data.map((order: Order) => (
                                  <TableRow key={order.order_reference} hover>
                                    <TableCell>{formatTimestamp(order.order_created_timestamp)}</TableCell>
                                    <TableCell>
                                      {order.pickup_address
                                        ? order.pickup_address.length > 20
                                          ? `${order.pickup_address.substring(0, 20)}...`
                                          : order.pickup_address
                                        : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(order.ride_price)}</TableCell>
                                    <TableCell align="right">{formatCurrency(order.net_earnings)}</TableCell>
                                    <TableCell>{order.payment_method || 'N/A'}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={order.order_status || 'Unknown'}
                                        color={order.order_status?.toLowerCase() === 'finished' ? 'success' : 'default'}
                                        size="small"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} align="center">
                                    No orders found for this driver
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        
                        {driverOrdersData.total_pages > 1 && (
                          <Box display="flex" justifyContent="center" p={2}>
                            <Pagination
                              count={driverOrdersData.total_pages}
                              page={orderPage}
                              onChange={handleOrderPageChange}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                  </TabPanel>
                </Box>
              </>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
                p={3}
              >
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a driver to view details
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mt: 1 }}>
                  Click on any driver from the list on the left to view their profile information and order history.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDriversPage;