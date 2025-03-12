import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import { useAuth } from '../../store/hooks';
import { useDriverQueries } from '../../hooks';

interface DriverWelcomeCardProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const DriverWelcomeCard: React.FC<DriverWelcomeCardProps> = ({ 
  selectedPeriod, 
  onPeriodChange 
}) => {
  const { currentUser } = useAuth();
  const { useDriverProfile } = useDriverQueries();
  const { data: profile } = useDriverProfile();

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Welcome back, {profile?.full_name || currentUser?.name || 'Driver'}!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Here's your driving summary for the {selectedPeriod}.
        </Typography>
        <Box sx={{ mt: 2, mb: 1 }}>
          <Button
            size="small"
            variant={selectedPeriod === 'today' ? 'contained' : 'outlined'}
            onClick={() => onPeriodChange('today')}
            sx={{ mr: 1 }}
          >
            Today
          </Button>
          <Button
            size="small"
            variant={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            onClick={() => onPeriodChange('week')}
            sx={{ mr: 1 }}
          >
            This Week
          </Button>
          <Button
            size="small"
            variant={selectedPeriod === 'month' ? 'contained' : 'outlined'}
            onClick={() => onPeriodChange('month')}
          >
            This Month
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DriverWelcomeCard;