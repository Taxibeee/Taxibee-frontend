import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Typography,
  Box
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAdminQueries } from '../../hooks';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Color palette for chart slices
const chartColors = [
  '#1976d2', // Primary blue
  '#2196f3', // Lighter blue
  '#0d47a1', // Darker blue
  '#64b5f6', // Very light blue
  '#bbdefb', // Pale blue
  '#3f51b5', // Indigo
  '#03a9f4', // Light blue
];

const RevenueByMethodChart: React.FC = () => {
  const { useRevenueByPaymentMethod } = useAdminQueries();
  const { data, isLoading, isError } = useRevenueByPaymentMethod();

  // Transform data for PieChart
  const prepareChartData = () => {
    if (!data) return [];
    
    // Convert object to array format required by PieChart
    return Object.entries(data).map(([method, amount], index) => ({
      id: index,
      value: amount,
      label: method,
      color: chartColors[index % chartColors.length],
    }));
  };

  // Calculate total for the summary
  const calculateTotal = () => {
    if (!data) return 0;
    return Object.values(data).reduce((sum, amount) => sum + amount, 0);
  };

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
          <Box sx={{ height: 350, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PieChart
              series={[
                {
                  data: prepareChartData(),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, color: 'gray' },
                  valueFormatter: (value) => formatCurrency(value),
                },
              ]}
              height={300}
              width={350}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  padding: 0,
                  labelStyle: {
                    fontSize: 12,
                  },
                },
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total Revenue: {formatCurrency(calculateTotal())}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueByMethodChart;