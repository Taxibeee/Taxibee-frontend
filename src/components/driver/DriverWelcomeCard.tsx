import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useDriverQueries } from '../../hooks';
import DateRangePicker from '../input/DateRangePicker';

interface DriverWelcomeCardProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const DriverWelcomeCard: React.FC<DriverWelcomeCardProps> = ({
  onDateRangeChange,
}) => {
  const { useDriverProfile } = useDriverQueries();
  const { data: profile } = useDriverProfile();

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" gutterBottom>
            Welcome back, {profile?.full_name || 'Driver'}!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Here's your driving summary.
          </Typography>
        </div>
        <DateRangePicker onSelect={onDateRangeChange} />
      </CardContent>
    </Card>
  );
};

export default DriverWelcomeCard;
