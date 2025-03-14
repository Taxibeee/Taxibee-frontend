import React from 'react';
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDriverQueries } from '../../hooks';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format seconds to hours and minutes
const formatTime = (seconds: number | undefined | null) => {
  if (seconds === undefined || seconds === null) return '0h 0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

interface DriverStatsCardsProps {
  period: string;
}

const DriverStatsCards: React.FC<DriverStatsCardsProps> = ({ period }) => {
  const { useDriverEarnings } = useDriverQueries();
  const { data, isLoading, isError } = useDriverEarnings(period);

  return (
    <Grid2 container spacing={3} sx={{ mb: 4 }}>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
              <AttachMoneyIcon />
            </Avatar>
            <Typography color="textSecondary" gutterBottom align="center">
              Total Earnings
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h5" component="div" align="center">
                {formatCurrency(data?.total_revenue)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'info.main', mb: 2 }}>
              <LocalTaxiIcon />
            </Avatar>
            <Typography color="textSecondary" gutterBottom align="center">
              Total Rides
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h5" component="div" align="center">
                {data?.total_orders || 0}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'success.main', mb: 2 }}>
              <PlaceIcon />
            </Avatar>
            <Typography color="textSecondary" gutterBottom align="center">
              Total Distance
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h5" component="div" align="center">
                {data ? (data.total_distance / 1000).toFixed(1) : 0} km
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'warning.main', mb: 2 }}>
              <AccessTimeIcon />
            </Avatar>
            <Typography color="textSecondary" gutterBottom align="center">
              Total Time
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isError ? (
              <Typography color="error">Failed to load data</Typography>
            ) : (
              <Typography variant="h5" component="div" align="center">
                {formatTime(data?.total_ride_time)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default DriverStatsCards;