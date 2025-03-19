import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Divider,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { useAdminQueries } from '../../hooks';
import { Order } from '../../types/order.types';

const AdminOrdersPage: React.FC = () => {
  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch orders with pagination
  const { useAllOrders } = useAdminQueries();
  const { data, isLoading, isError } = useAllOrders(page, 25);

  interface SearchFieldProps {
    searchTerm: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const SearchField: React.FC<SearchFieldProps> = ({
    searchTerm,
    handleSearchChange
  }) => {
    return (
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by order reference, driver name, or pickup address"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3, width: '40%' }}
          />
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
      </Box>
    )
  }

  


  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" width="60%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" width={80} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="rounded" width={70} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="rounded" width={70} height={24} />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="circular" width={30} height={30} />
      </TableCell>
    </TableRow>
  );

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

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Open order details dialog
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Close order details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Filter orders based on search term
  const filteredOrders = data?.data.filter(order => 
    order.order_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get payment method color
  const getPaymentMethodColor = (method: string | null): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return 'success';
      case 'card':
        return 'primary';
      case 'online':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get order status color
  const getOrderStatusColor = (status: string | null): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status?.toLowerCase()) {
      case 'finished':
        return 'success';
      case 'canceled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2
          }}>
          <SearchField
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
          </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Pickup</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Info</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRowSkeleton />
                    ) : isError ? (
                      <TableRow>
                        <TableCell align="center">
                          Error loading orders
                        </TableCell>
                      </TableRow>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.order_reference} hover>
                          <TableCell>{order.order_reference}</TableCell>
                          <TableCell>{formatTimestamp(order.order_created_timestamp)}</TableCell>
                          <TableCell>{order.driver_name || 'N/A'}</TableCell>
                          <TableCell>
                            {order.pickup_address
                              ? order.pickup_address.length > 30
                                ? `${order.pickup_address.substring(0, 30)}...`
                                : order.pickup_address
                              : 'N/A'}
                          </TableCell>
                          <TableCell>{formatCurrency(order.ride_price)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.payment_method || 'Unknown'}
                              color={getPaymentMethodColor(order.payment_method)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.order_status || 'Unknown'}
                              color={getOrderStatusColor(order.order_status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(order)}
                              aria-label="view details"
                            >
                              <InfoIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={data?.total_pages || 0}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - {selectedOrder?.order_reference}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid2 spacing={3}>
              <Grid2 size={{ xs: 12 }} >
                <Typography variant="subtitle1" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }} >
                    <Typography variant="body2" color="text.secondary">
                      Driver
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.driver_name || 'N/A'}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }} >
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.order_status || 'Unknown'}
                      color={getOrderStatusColor(selectedOrder.order_status)}
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }} >
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_created_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }} >
                    <Typography variant="body2" color="text.secondary">
                      Finished At
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_finished_timestamp)}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Location Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Pickup Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.pickup_address || 'N/A'}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Distance
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.ride_distance
                        ? `${(selectedOrder.ride_distance / 1000).toFixed(2)} km`
                        : 'N/A'}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.vehicle_model || 'N/A'} ({selectedOrder.vehicle_license_plate || 'N/A'})
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={{ xs: 12}} >
                <Typography variant="subtitle1" gutterBottom>
                  Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }} >
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Chip
                      label={selectedOrder.payment_method || 'Unknown'}
                      color={getPaymentMethodColor(selectedOrder.payment_method)}
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Price
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(selectedOrder.ride_price)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base Fare
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.ride_price ? selectedOrder.ride_price - (selectedOrder.booking_fee || 0) - (selectedOrder.toll_fee || 0) : null)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Booking Fee
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.booking_fee)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }} >
                    <Typography variant="body2" color="text.secondary">
                      Toll Fee
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.toll_fee)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }} >
                    <Typography variant="body2" color="text.secondary">
                      Tip
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.tip)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }} >
                    <Typography variant="body2" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.in_app_discount)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }} >
                    <Typography variant="body2" color="text.secondary">
                      Driver Commission
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.commission)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Driver Net Earnings
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(selectedOrder.net_earnings)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Confirmed
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.payment_confirmed_timestamp)}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;