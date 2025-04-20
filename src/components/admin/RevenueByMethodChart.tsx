import React from 'react';
import { Card, Skeleton, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAdminQueries } from '../../hooks';
import { CustomAlert } from '../../utils/customAlert';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '€0.00';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Color palette for chart slices
const chartColors = [
  '#2E7DAF', // Deep blue
  '#FF6B6B', // Coral red
  '#4CAF50', // Green
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#00BCD4', // Cyan
];

interface RevenueByMethodChartProps {
  startDate: string;
  endDate: string;
}

const RevenueByMethodChart: React.FC<RevenueByMethodChartProps> = ({ startDate, endDate }) => {
  const { useRevenueByPaymentMethod } = useAdminQueries();
  const { data, isLoading, isError } = useRevenueByPaymentMethod(startDate, endDate);

  // Transform data for PieChart
  const prepareChartData = () => {
    if (!data) return [];

    const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);

    // Convert object to array format required by PieChart
    return Object.entries(data).map(([method, amount], index) => {
      const percentage = ((amount / total) * 100).toFixed(1);
      return {
        id: index,
        value: amount,
        label: `${method} (${percentage}%)`,
        color: chartColors[index % chartColors.length],
      };
    });
  };

  // Calculate total for the summary
  const calculateTotal = () => {
    if (!data) return 0;
    return Object.values(data).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <Card elevation={1} sx={{ p: 0 }}>
      <CardContent>
        {isLoading ? (
          <Box
            sx={{
              height: 350,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 0,
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                transform: 'none', // This prevents the skeleton from being squished
              }}
            />
          </Box>
        ) : isError ? (
          <CustomAlert severity="error">Failed to load payment method data.</CustomAlert>
        ) : !data || Object.keys(data).length === 0 ? (
          <Typography>No payment data available.</Typography>
        ) : (
          <Box
            sx={{
              height: 350,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PieChart
              series={[
                {
                  data: prepareChartData(),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  innerRadius: 100,
                  paddingAngle: 0,
                  cornerRadius: 4,
                },
              ]}
              height={300}
              width={300}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  padding: 0,
                  labelStyle: {
                    fontSize: 12,
                  },
                  itemMarkWidth: 10,
                  itemMarkHeight: 10,
                  markGap: 5,
                  itemGap: 15,
                },
              }}
            />
            <Box sx={{ alignSelf: 'flex-start', ml: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }} component="span">
                Total Revenue: {formatCurrency(calculateTotal())}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Revenue by payment method
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueByMethodChart;
