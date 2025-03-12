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
  CircularProgress,
  Alert,
  Typography
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

const WeeklyAnalyticsTable: React.FC = () => {
  const { useWeekDayAnalytics } = useAdminQueries();
  const { data, isLoading, isError } = useWeekDayAnalytics();

  return (
    <Card elevation={2}>
      <CardHeader title="Daily Revenue" />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Alert severity="error">Failed to load weekday analytics data.</Alert>
        ) : !data || data.length === 0 ? (
          <Typography>No data available for this week yet.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Avg. Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((day) => (
                  <TableRow key={day.day}>
                    <TableCell component="th" scope="row">
                      {day.day}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(day.total_revenue)}</TableCell>
                    <TableCell align="right">{day.total_orders}</TableCell>
                    <TableCell align="right">
                      {day.total_orders > 0
                        ? formatCurrency(day.total_revenue / day.total_orders)
                        : '$0.00'}
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

export default WeeklyAnalyticsTable;