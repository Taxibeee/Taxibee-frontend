import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Divider,
  Pagination,
  Avatar,
  Stack,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAdminQueries } from '../../hooks';
import { Driver } from '../../types/driver.types';
import { Order } from '../../types/order.types';
import { WhatsApp } from '@mui/icons-material';
import { RadioButtonChecked } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


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

interface SearchFieldProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterDialogOpen: boolean;
  handleFilterDialogOpen: () => void;
  handleFilterDialogClose: () => void;
  handleApplyFilters: (filters: FilterOptions) => void;
  filters: FilterOptions;

}
interface FilterOptions {
  status: 'all' | 'active' | 'inactive';
  employmentType: 'all' | 'salaried' | 'freelancer';
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}


const FilterDialog: React.FC<FilterDialogProps> = ({
  open, onClose, filters, onApplyFilters
}) => {
  const [ localFilters, setLocalFilters ] = useState<FilterOptions>(filters);
  const { t } = useTranslation();

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  }
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('adminDriversPage.filters')}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">{t('adminDriversPage.status')}</FormLabel>
          <RadioGroup
            value={localFilters.status}
            onChange={(e) => setLocalFilters(prev => ({
              ...prev,
              status: e.target.value as FilterOptions['status']
            }))}
          >
            <FormControlLabel value="all" control={<Radio />} label={t('adminDriversPage.all')} />
            <FormControlLabel value="active" control={<Radio />} label={t('adminDriversPage.active')} />
            <FormControlLabel value="inactive" control={<Radio />} label={t('adminDriversPage.inactive')} />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">{t('adminDriversPage.employmentType')}</FormLabel>
          <RadioGroup
            value={localFilters.employmentType}
            onChange={(e) => setLocalFilters(prev => ({
              ...prev,
              employmentType: e.target.value as FilterOptions['employmentType']
            }))}
          >
            <FormControlLabel value="all" control={<Radio />} label={t('adminDriversPage.all')} />
            <FormControlLabel value="salaried" control={<Radio />} label={t('adminDriversPage.salaried')} />
            <FormControlLabel value="freelancer" control={<Radio />} label={t('adminDriversPage.freelancer')} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('adminDriversPage.common.cancel')}</Button>
        <Button onClick={handleApply} variant="contained">
          {t('adminDriversPage.common.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const SearchField: React.FC<SearchFieldProps> = ({
  searchTerm,
  handleSearchChange,
  filterDialogOpen,
  handleFilterDialogOpen,
  handleFilterDialogClose,
  handleApplyFilters,
  filters
}) => {

  const { t } = useTranslation();



  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      border: '1px solid gray',
      p: 0.5,
      borderRadius: 2,
    }}>
      <InputAdornment>
        <SearchIcon />
      </InputAdornment>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('adminDriversPage.searchPlaceholder')}
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: 'none'
            }
          }
        }}
      />
    </Box>
    <Tooltip title={t('adminDriversPage.filters')}>
      <IconButton 
        onClick={handleFilterDialogOpen}
        sx={{ 
          border: '1px solid gray',
          borderRadius: 2,
          p: 1,
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        <FilterListIcon />
      </IconButton>
    </Tooltip>
    <FilterDialog
      open={filterDialogOpen}
      onClose={handleFilterDialogClose}
      filters={filters}
      onApplyFilters={handleApplyFilters}
    />
  </Box>
  )
}





const AdminDriversPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation();

  // State for filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [ filters, setFilters ] = useState<FilterOptions>({
    status: 'all',
    employmentType: 'all'
  })


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
    10,
  );
  
  // Add a refetch trigger when driver changes
  useEffect(() => {
    if (selectedDriver) {
      // This will trigger a refetch when a new driver is selected
      setOrderPage(1);
    }
  }, [selectedDriver?.bolt_driver_uuid, selectedDriver]);

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
  const formatTimestamp = (timestamp: string | number | null): string => {
    if (!timestamp) return 'N/A';
    
    let numericTimestamp: number;
    
    if (typeof timestamp === 'string') {
      numericTimestamp = parseInt(timestamp, 10);
      if (isNaN(numericTimestamp)) return 'Invalid Date';
    } else {
      numericTimestamp = timestamp;
    }
    
    return new Date(numericTimestamp * 1000).toLocaleString();
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
  const filteredDrivers = driversData?.data.filter(driver => {
    // First apply search filter
    const matchesSearch = 
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.taxibee_id && driver.taxibee_id.toString().includes(searchTerm));

    // Then apply status filter
    const matchesStatus = 
      filters.status === 'all' || 
      (filters.status === 'active' && driver.state.toLowerCase() === 'active') ||
      (filters.status === 'inactive' && driver.state.toLowerCase() !== 'active');

    // Then apply employment type filter
    const matchesEmploymentType = 
      filters.employmentType === 'all' || 
      (filters.employmentType === 'freelancer' && driver.exact_debnr) ||
      (filters.employmentType === 'salaried' && !driver.exact_debnr);

    return matchesSearch && matchesStatus && matchesEmploymentType;
  }) || [];

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  }

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  }

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  
  }

    // Total number of drivers
  const totalDrivers = driversData?.data.length || 0;
  const filteredDriversCount = filteredDrivers.length;
  const activeDrivers = filteredDrivers.filter(driver => driver.state.toLowerCase() === 'active').length;


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

  const openWhatsAppChat = (phone: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  }

  const renderStatusLegend = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <RadioButtonChecked sx={{ color: 'success.main', fontSize: 12 }} />
        <Typography variant="caption">{t('adminDriversPage.active')}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <RadioButtonChecked sx={{ color: 'grey.400', fontSize: 12 }} />
        <Typography variant="caption">{t('adminDriversPage.inActive')}</Typography>
      </Box>
    </Box>
  );

  const SkeletonLoader = () => (
    <Box p={2}>
    {[...Array(15)].map((_, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={150} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={12} height={12} />
        </Box>
      </Box>
    ))}
  </Box>
  )

  return (
    <Box>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
      >
        {/* Left side - Driver List */}
        <Box 
          sx={{
            width: isMobile ? '100%' : '300px', // Fixed width for desktop
            flexShrink: 0
          }}
        >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 0 }}>
              <Typography variant="h6" gutterBottom>
                {t('adminDriversPage.drivers')}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {searchTerm 
                  ? `Showing ${filteredDriversCount} of ${totalDrivers} drivers`
                  : `Total ${totalDrivers} drivers`
                }
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {`Active: ${activeDrivers}`}
              </Typography>
              <SearchField 
                searchTerm={searchTerm} 
                handleSearchChange={handleSearchChange}
                filterDialogOpen={filterDialogOpen}
                handleFilterDialogOpen={handleFilterDialogOpen}
                handleFilterDialogClose={handleFilterDialogClose}
                handleApplyFilters={handleApplyFilters}
                filters={filters}
              />
              {renderStatusLegend()}
            </CardContent>
            <Divider />
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'auto', 
              maxHeight: 'calc(100vh - 250px)',
              '& .MuiTableContainer-root': {
                maxWidth: '100%'
              }
            }}>
              {driversLoading ? (
                <SkeletonLoader />
              ) : driversError ? (
                <Typography color="error" p={2}>
                  {t('adminDriversPage.failedToLoadData')}
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small" stickyHeader>
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'gray.900' }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                {driver.full_name}
                              </Box>
                            </TableCell>
                            <Tooltip title="Chat on Whatsapp">
                              <IconButton
                                size="small"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => openWhatsAppChat(driver.phone, e)}
                                sx={{ 
                                  color: 'success.main',
                                  mt: 1
                                }}
                              >
                                <WhatsApp fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <TableCell align="left">
                            <RadioButtonChecked 
                              sx={{ 
                              color: driver.state.toLowerCase() === 'active' 
                                ? 'success.main' 
                                : 'grey.400',
                              fontSize: 12
                              }} 
                            />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell align="center">
                            {t('adminDriversPage.searchNoDrivers')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Card>
        </Box>

        {/* Right side - Driver Details and Orders */}
        <Box 
          sx={{
            flexGrow: 1,
            minWidth: 0
          }}
        >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedDriver ? (
              <>
                <CardContent sx={{ flexGrow: 0, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'gray.900' }}>
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

                <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    maxHeight: 'calc(100vh - 250px)',
                    '& .MuiTableContainer-root': {
                      maxWidth: '100%'
                    }
                  }}>
                  <TabPanel value={tabValue} index={0}>
                    <Grid2 container spacing={3} p={2}>
                      <Grid2 item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('adminDriversPage.personalInformation')}
                        </Typography>
                        <Divider sx={{ mb: 2, mt: 1 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.fullName')}</Typography>
                          <Typography variant="body1">{selectedDriver.full_name}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.phone')}</Typography>
                          <Typography variant="body1">{selectedDriver.phone}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.email')}</Typography>
                          <Typography variant="body1">{selectedDriver.email || 'N/A'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Chauffeurs Kaartnr</Typography>
                          <Typography variant="body1">{selectedDriver.chauffeurskaartnr || 'N/A'}</Typography>
                        </Box>
                      </Grid2>
                      
                      <Grid2 item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t('adminDriversPage.systemInformation')}
                        </Typography>
                        <Divider sx={{ mb: 2, mt: 1 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.taxibeeId')}</Typography>
                          <Typography variant="body1">{selectedDriver.taxibee_id}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Bolt {t('adminDriversPage.driver')} UUID</Typography>
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {selectedDriver.bolt_driver_uuid}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.status')}</Typography>
                          <Chip
                            label={selectedDriver.state}
                            color={getDriverStatusColor(selectedDriver.state)}
                            size="small"
                          />
                          {selectedDriver.inactivity_reason && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {t('adminDriversPage.reason')}: {selectedDriver.inactivity_reason}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.todayTerminalName')}</Typography>
                          <Typography variant="body1">{selectedDriver.today_terminal_name || 'Not Assigned'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.exactDebnr')}</Typography>
                          <Typography variant="body1">{selectedDriver.exact_debnr || 'N/A'}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">{t('adminDriversPage.myposOperatorCode')}</Typography>
                          <Typography variant="body1">{selectedDriver.mypos_operator_code || 'N/A'}</Typography>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={1}>
                    {ordersLoading ? (
                      <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                      </Box>
                    ) : !driverOrdersData ? (
                      <Typography color="text.secondary" align="center" p={3}>
                        {t('adminDriversPage.searchNoOrders')}
                      </Typography>
                    ) : (
                      <Box p={2}>
                        <TableContainer component={Paper} elevation={0}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>{t('adminOrdersPage.date')}</TableCell>
                                <TableCell>{t('adminOrdersPage.pickup')}</TableCell>
                                <TableCell align="right">{t('adminOrdersPage.price')}</TableCell>
                                <TableCell align="right">{t('adminOrdersPage.netEarnings')}</TableCell>
                                <TableCell>{t('adminOrdersPage.payment')}</TableCell>
                                <TableCell>{t('adminOrdersPage.status')}</TableCell>
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
                                  <TableCell align="center">
                                    {t('adminDriversPage.searchNoOrders')}
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
                  {t('adminDriversPage.selectADriver')}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mt: 1 }}>
                  {t('adminDriversPage.selectADriverText')}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default AdminDriversPage;
