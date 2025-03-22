import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Typography,
  Box,
  Button,
} from '@mui/material';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
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

interface RecentOrdersListProps {
  period: string;
  onViewAllClick: () => void;
}

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ period, onViewAllClick }) => {
  const { useDriverOrders } = useDriverQueries();
  const { data, isLoading, isError } = useDriverOrders({ period, limit: 5 });

  return (
    <Card elevation={2}>
      <CardHeader title="Recent Orders" />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <CustomAlert severity="error">Failed to load orders data.</CustomAlert>
        ) : !data || data.length === 0 ? (
          <Typography>No recent orders found.</Typography>
        ) : (
          <List>
            {data.map(order => (
              <ListItem key={order.order_reference} divider alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <LocalTaxiIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(order.ride_price)}
                      </Typography>
                      {order.tip && order.tip > 0 && (
                        <Chip
                          label={`+${formatCurrency(order.tip)} Tip`}
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {order.pickup_address}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {order.order_created_timestamp} • {order.payment_method}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            {data.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="text" size="small" onClick={onViewAllClick}>
                  View All Orders
                </Button>
              </Box>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersList;
