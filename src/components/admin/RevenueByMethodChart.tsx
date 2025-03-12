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
  Typography,
  LinearProgress
} from '@mui/material';
import { useAdminQueries } from '../../hooks';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const RevenueByMethodChart: React.FC = () => {
  const { useRevenueByPaymentMethod } = useAdminQueries();
  const { data, isLoading, isError } = useRevenueByPaymentMethod();

  return (
    <Card elevation={2}>
      <CardHeader title="Revenue by Payment Method" />
      <Divider />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Alert severity="error">Failed to load payment method data.</Alert>
        ) : !data || Object.keys(data).length === 0 ? (
          <Typography>No payment data available.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(data).map(([method, amount]) => {
                  const total = Object.values(data).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (amount / total) * 100 : 0;
                  
                  return (
                    <TableRow key={method}>
                      <TableCell component="th" scope="row">
                        {method}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(amount)}</TableCell>
                      <TableCell align="right">
                        {percentage.toFixed(1)}%
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 5, borderRadius: 5, mt: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueByMethodChart;