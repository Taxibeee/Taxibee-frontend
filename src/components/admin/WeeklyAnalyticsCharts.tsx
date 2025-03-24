import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Skeleton,
  Typography,
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid2,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAdminQueries } from '../../hooks';
import { BarChart, SparkLineChart, LineChart } from '@mui/x-charts';
import { CustomAlert } from '../../utils/customAlert';
import { WeekDayAnalytics } from '../../types/analytics.types';

type ChartType = 'revenue' | 'orders' | 'average';

interface WeeklyAnalyticsChartsProps {
  weekOffset: number;
}

const WeeklyAnalyticsCharts: React.FC<WeeklyAnalyticsChartsProps> = ({ weekOffset }) => {
  const theme = useTheme();
  const { useWeekDayAnalytics } = useAdminQueries();
  const { data, isLoading, isError } = useWeekDayAnalytics(weekOffset);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);

  const prepareChartData = () => {
    if (!data?.daily_analytics) return null;

    return {
      days: data.daily_analytics.map((item: WeekDayAnalytics) => item.day),
      revenue: data.daily_analytics.map((item: WeekDayAnalytics) => item.total_revenue || 0),
      orders: data.daily_analytics.map((item: WeekDayAnalytics) => item.total_orders || 0),
      avgOrders: data.daily_analytics.map((item: WeekDayAnalytics) =>
        item.total_orders > 0 ? item.total_revenue / item.total_orders : 0
      ),
    };
  };

  const chartData = prepareChartData();

  const handleChartClick = (chartType: ChartType) => {
    setSelectedChart(chartType);
    setDialogOpen(true);
  };

  const DetailedChart = () => {
    if (!chartData || !selectedChart) return null;

    switch (selectedChart) {
      case 'revenue':
        return (
          <LineChart
            dataset={chartData.days.map((day, index) => ({
              day,
              revenue: chartData.revenue[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'day', label: 'Day of Week' }]}
            yAxis={[{ label: 'Revenue (€)' }]}
            series={[
              {
                dataKey: 'revenue',
                label: 'Daily Revenue',
                area: true,
                showMark: true,
              },
            ]}
            height={400}
            colors={[theme.palette.primary.main]}
          />
        );
      case 'orders':
        return (
          <BarChart
            dataset={chartData.days.map((day, index) => ({
              day,
              orders: chartData.orders[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'day', label: 'Day of Week' }]}
            yAxis={[{ label: 'Number of Orders' }]}
            series={[{ dataKey: 'orders', label: 'Orders' }]}
            height={400}
            colors={[theme.palette.secondary.main]}
          />
        );
      case 'average':
        return (
          <LineChart
            dataset={chartData.days.map((day, index) => ({
              day,
              average: chartData.avgOrders[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'day', label: 'Day of Week' }]}
            yAxis={[{ label: 'Average Order Value (€)' }]}
            series={[
              {
                dataKey: 'average',
                label: 'Avg. Order Value',
                area: true,
                showMark: true,
              },
            ]}
            height={400}
            colors={[theme.palette.success.main]}
          />
        );
    }
  };

  return (
    <>
      <Card
        elevation={1}
        sx={{
          pb: 0.8,
        }}
      >
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Weekly Analytics</Typography>
            {data?.date_range && (
              <Typography variant="caption" color="text.secondary">
                {new Date(data.date_range.start).toLocaleDateString()} -{' '}
                {new Date(data.date_range.end).toLocaleDateString()}
              </Typography>
            )}
          </Box>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              p={3}
              sx={{
                height: 350,
                width: '100%',
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  transform: 'none',
                }}
              />
            </Box>
          ) : isError ? (
            <CustomAlert severity="error">Failed to load weekday analytics data.</CustomAlert>
          ) : !data?.daily_analytics || data.daily_analytics.length === 0 ? (
            <Typography>No data available for this week yet.</Typography>
          ) : (
            <Box>
              <Grid2 spacing={2}>
                {/* Revenue Sparkline */}
                <Grid2 size={{ xs: 6 }}>
                  <Box
                    onClick={() => handleChartClick('revenue')}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Revenue Trend
                    </Typography>
                    <SparkLineChart
                      data={chartData!.revenue}
                      height={100}
                      curve="natural"
                      area
                      colors={[theme.palette.primary.main]}
                    />
                  </Box>
                </Grid2>

                {/* Orders Sparkline */}
                <Grid2 size={{ xs: 6 }}>
                  <Box
                    onClick={() => handleChartClick('orders')}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Daily Orders
                    </Typography>
                    <SparkLineChart
                      data={chartData!.orders}
                      height={100}
                      curve="natural"
                      colors={[theme.palette.secondary.main]}
                    />
                  </Box>
                </Grid2>

                {/* Average Order Value */}
                <Grid2 size={{ xs: 12 }}>
                  <Box
                    onClick={() => handleChartClick('average')}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Average Order Value
                    </Typography>
                    <SparkLineChart
                      data={chartData!.avgOrders}
                      height={100}
                      curve="natural"
                      colors={[theme.palette.success.main]}
                    />
                  </Box>
                </Grid2>
              </Grid2>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Detailed Analysis
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Click on the charts above to view detailed analysis.
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Chart Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedChart === 'revenue' && 'Revenue Analysis'}
          {selectedChart === 'orders' && 'Orders Analysis'}
          {selectedChart === 'average' && 'Average Order Value Analysis'}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DetailedChart />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyAnalyticsCharts;
