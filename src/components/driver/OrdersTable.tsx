import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useDriverQueries } from '../../hooks';
import { CustomAlert } from '../../utils/customAlert';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

interface OrdersTableProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ startDate, endDate, onDateRangeChange }) => {
  const { useDriverOrders } = useDriverQueries();
  const { data, isLoading, isError } = useDriverOrders({ startDate, endDate, limit: 50 });

  return (
    <Card elevation={2}>
      <CardHeader
        title="Recent Orders"
        action={
          <Box>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onDateRangeChange('2023-01-01', '2023-01-07')} // Example
              sx={{ mr: 1 }}
            >
              Last Week
            </Button>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <CustomAlert severity="error">Failed to load orders data.</CustomAlert>
        ) : !data || data.length === 0 ? (
          <Typography>No orders found for the selected period.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Pickup</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(order => (
                  <TableRow key={order.order_reference}>
                    <TableCell>{order.order_created_timestamp}</TableCell>
                    <TableCell>
                      {order.pickup_address
                        ? order.pickup_address.length > 25
                          ? `${order.pickup_address.substring(0, 25)}...`
                          : order.pickup_address
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {order.ride_distance
                        ? `${(order.ride_distance / 1000).toFixed(1)} km`
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.ride_price)}
                      {order.tip && order.tip > 0 && (
                        <Typography variant="caption" color="success.main" display="block">
                          +{formatCurrency(order.tip)} Tip
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{order.payment_method || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.order_status}
                        color={
                          order.order_status === 'finished'
                            ? 'success'
                            : order.order_status === 'canceled'
                              ? 'error'
                              : 'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
