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
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
  Divider,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useDriverQueries } from '../../hooks';
import { Order } from '../../types/order.types';
import { CustomAlert } from '../../utils/customAlert';

interface DriverOrdersPageProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DriverOrdersPage: React.FC<DriverOrdersPageProps> = ({
  startDate: externalStartDate,
  endDate: externalEndDate,
  onDateRangeChange: externalOnDateRangeChange,
}) => {
  // State for selected period and order details dialog
  const [internalPeriod, setInternalPeriod] = useState<string>('week');


  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch driver orders based on selected period
  const { useDriverOrders } = useDriverQueries();
  const { data, isLoading, isError } = useDriverOrders({ period: selectedPeriod });

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: string | number | null): string => {
    if (!timestamp) return 'N/A';
    const date =
      typeof timestamp === 'string' ? timestamp : new Date(timestamp * 1000).toLocaleString();
    return date;
  };

  // Format currency
  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return '€0.00';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format distance
  const formatDistance = (meters: number | null): string => {
    if (meters === null) return 'N/A';
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    if (externalPeriodChange) {
      externalPeriodChange(period);
    } else {
      setInternalPeriod(period);
    }
  };

  // Handle opening order details dialog
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Handle closing order details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Get payment method color
  const getPaymentMethodColor = (
    method: string | null
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
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
  const getOrderStatusColor = (
    status: string | null
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
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
      <Card>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Typography variant="h5">Your Orders</Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button
                onClick={() => handlePeriodChange('week')}
                variant={selectedPeriod === 'week' ? 'contained' : 'outlined'}
              >
                This Week
              </Button>
              <Button
                onClick={() => handlePeriodChange('month')}
                variant={selectedPeriod === 'month' ? 'contained' : 'outlined'}
              >
                This Month
              </Button>
            </ButtonGroup>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <CustomAlert severity="error">Failed to load orders data.</CustomAlert>
          ) : !data || data.length === 0 ? (
            <CustomAlert severity="info">No orders found for the selected period.</CustomAlert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Pickup</TableCell>
                    <TableCell>Distance</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(order => (
                    <TableRow key={order.order_reference} hover>
                      <TableCell>{formatTimestamp(order.order_created_timestamp)}</TableCell>
                      <TableCell>
                        {order.pickup_address
                          ? order.pickup_address.length > 25
                            ? `${order.pickup_address.substring(0, 25)}...`
                            : order.pickup_address
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{formatDistance(order.ride_distance)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(order.ride_price)}
                        {order.tip && order.tip > 0 && (
                          <Typography variant="caption" color="success.main" display="block">
                            +{formatCurrency(order.tip)} Tip
                          </Typography>
                        )}
                      </TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.order_reference}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid2 spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Reference
                    </Typography>
                    <Typography variant="body1">{selectedOrder.order_reference}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.order_status || 'Unknown'}
                      color={getOrderStatusColor(selectedOrder.order_status)}
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_created_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Finished At
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_finished_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.vehicle_model || 'N/A'}
                      {selectedOrder.vehicle_license_plate
                        ? ` (${selectedOrder.vehicle_license_plate})`
                        : ''}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Terminal Name
                    </Typography>
                    <Typography variant="body1">{selectedOrder.terminal_name || 'N/A'}</Typography>
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
                    <Typography variant="body1">{selectedOrder.pickup_address || 'N/A'}</Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Distance
                    </Typography>
                    <Typography variant="body1">
                      {formatDistance(selectedOrder.ride_distance)}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
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
                      Booking Fee
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.booking_fee)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Toll Fee
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.toll_fee)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tip
                    </Typography>
                    <Typography
                      variant="body1"
                      color={
                        selectedOrder.tip && selectedOrder.tip > 0 ? 'success.main' : 'text.primary'
                      }
                    >
                      {formatCurrency(selectedOrder.tip)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cash Discount
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.cash_discount)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      In-App Discount
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.in_app_discount)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Commission
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedOrder.commission)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Net Earnings
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      {formatCurrency(selectedOrder.net_earnings)}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Trip Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid2 spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_created_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Accepted
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_accepted_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Pickup
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_pickup_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dropoff
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_dropoff_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Finished
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_finished_timestamp)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Confirmed
                    </Typography>
                    <Typography variant="body1">
                      {formatTimestamp(selectedOrder.order_finished_timestamp)}
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

export default DriverOrdersPage;
