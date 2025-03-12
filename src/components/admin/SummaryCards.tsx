import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@mui/material';
import { useAdminQueries } from '../../hooks';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const SummaryCards: React.FC = () => {
  const { useWeekAnalytics } = useAdminQueries();
  const { data, isLoading, isError } = useWeekAnalytics();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Revenue (This Week)
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h4" component="div">
                {formatCurrency(data?.total_revenue)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Orders
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h4" component="div">
                {data?.total_orders || 0}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Distance (km)
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h4" component="div">
                {data ? (data.total_distance / 1000).toFixed(1) : 0}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg. Revenue per Order
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h4" component="div">
                {data && data.total_orders > 0
                  ? formatCurrency(data.total_revenue / data.total_orders)
                  : '$0.00'}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;