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
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
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

interface DriverPerformanceListProps {
  period: string;
}

const DriverPerformanceList: React.FC<DriverPerformanceListProps> = ({ period }) => {
  const { useDriverEarnings } = useDriverQueries();
  const { data, isLoading, isError } = useDriverEarnings(period);

  return (
    <Card elevation={2}>
      <CardHeader title="Your Performance" />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Alert severity="error">Failed to load earnings data.</Alert>
        ) : !data ? (
          <Typography>No earnings data available.</Typography>
        ) : (
          <List>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <PaymentsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Average Earnings per Ride"
                secondary={formatCurrency(data.average_ride_price)}
              />
            </ListItem>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <PlaceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Average Distance per Ride"
                secondary={`${(data.average_distance / 1000).toFixed(1)} km`}
              />
            </ListItem>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <AccessTimeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Average Time per Ride"
                secondary={formatTime(data.average_ride_time)}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <SpeedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Average Earnings per km"
                secondary={formatCurrency(data.average_price_per_mile)}
              />
            </ListItem>
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverPerformanceList;