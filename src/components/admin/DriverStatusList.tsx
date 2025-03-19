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
  Button
} from '@mui/material';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { useNavigate } from 'react-router-dom';
import { useAdminQueries } from '../../hooks';
import { CustomAlert } from '../../utils/customAlert';

const DriverStatusList: React.FC = () => {
  const navigate = useNavigate();
  const { useLiveDriverStatus } = useAdminQueries();
  const { data, isLoading, isError } = useLiveDriverStatus();

  return (
    <Card elevation={2}>
      <CardHeader 
        title="Live Driver Status" 
        action={
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => navigate('/admin/drivers')}
          >
            View All Drivers
          </Button>
        }
      />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <CustomAlert severity="error">Failed to load driver status data.</CustomAlert>
        ) : !data || data.length === 0 ? (
          <Typography>No active drivers at the moment.</Typography>
        ) : (
          <List>
            {data.map((driver) => (
              <ListItem
                key={driver.driver_uuid}
                secondaryAction={
                  <Chip
                    label={driver.current_status}
                    color={
                      driver.current_status === 'waiting_orders'
                        ? 'success'
                        : driver.current_status === 'has_order'
                        ? 'primary'
                        : 'default'
                    }
                    size="small"
                  />
                }
                divider
              >
                <ListItemAvatar>
                  <Avatar>
                    <LocalTaxiIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={driver.driver_name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {driver.phone}
                      </Typography>
                      {driver.status_duration && ` — ${driver.status_duration}`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverStatusList;