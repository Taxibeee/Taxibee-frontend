import React, { useState } from 'react';
import {
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart } from '@mui/x-charts';

import { useAdminQueries } from '../../hooks';
import { useTranslation } from 'react-i18next';
import FlexWrapper from '../common/FlexWrapper';
import CardWrapper from '../common/CardWrapper';
import HeadingsWrapper from '../common/HeadingsWrapper';
import TextWrapper from '../common/TextWrapper';

import { WeekDayAnalytics } from '../../types/analytics.types';
import AreaChartWrapper from '../wrappers/charts/AreaChartWrapper';
import LineChartWrapper from '../wrappers/charts/LineChartWrapper';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '€0.00';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

interface MainSummaryCardProps {
  isError?: boolean;
  isLoading: boolean;
  title: string;
  value: string;
  chartData: number[];
  onChartClick?: () => void;
}

const MainSummaryCard: React.FC<MainSummaryCardProps> = ({
  isError = false,
  isLoading = false,
  title,
  value,
  chartData,
  onChartClick = () => {},
}) => {
  return (
    <CardWrapper isLoading={false}>
      <FlexWrapper direction="vertical" gap="none">
        <HeadingsWrapper text={title} type="subtitle1" isBold={false} />
        <TextWrapper
          text={value}
          isBold={false}
          size="xxxl"
          isLoading={isLoading}
          isError={isError}
        />
        <AreaChartWrapper
          chartData={chartData}
          onClick={onChartClick}
          isLoading={isLoading}
          isError={isError}
        />
      </FlexWrapper>
    </CardWrapper>
  );
};

// Update the ChartType to include 'averageOrder'
type ChartType = 'revenue' | 'orders' | 'averageOrder';

interface SummaryCardsProps {
  startDate: string;
  endDate: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);

  const { useWeekDayAnalytics } = useAdminQueries();
  const {
    data: weekDayData,
    isLoading: isWeekDayDataLoading,
    isError: isWeekDayError,
  } = useWeekDayAnalytics(startDate, endDate);

  const { useWeekAnalytics } = useAdminQueries();
  const {
    data: weekAnalyticsData,
    isLoading: isWeekAnalyticsLoading,
    isError: isWeekAnalyticsError,
  } = useWeekAnalytics(startDate, endDate);

  const prepareChartData = () => {
    if (!weekDayData?.daily_analytics) return null;

    return {
      dates: weekDayData.daily_analytics.map((item: WeekDayAnalytics) => item.date),
      days: weekDayData.daily_analytics.map((item: WeekDayAnalytics) => item.day),
      revenue: weekDayData.daily_analytics.map((item: WeekDayAnalytics) => item.total_revenue || 0),
      orders: weekDayData.daily_analytics.map((item: WeekDayAnalytics) => item.total_orders || 0),
      avgOrders: weekDayData.daily_analytics.map((item: WeekDayAnalytics) =>
        item.total_orders > 0 ? item.total_revenue / item.total_orders : 0
      ),
    };
  };

  const chartData = prepareChartData();

  const handleChartClick = (chartType: ChartType) => {
    setSelectedChartType(chartType);
    setDialogOpen(true);
  };

  const DetailedChart = () => {
    if (!chartData || !selectedChartType) return null;

    switch (selectedChartType) {
      case 'revenue':
        return (
          <LineChartWrapper
            dataset={chartData.dates.map((date, index) => ({
              date,
              revenue: chartData.revenue[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'date', label: 'Date' }]}
            yAxis={[{ label: 'Revenue (€)' }]}
            series={[
              {
                dataKey: 'revenue',
                label: 'Daily Revenue',
                area: true,
                showMark: false,
                curve: 'linear',
              },
            ]}
            colors={[theme.palette.primary.main]}
          />
        );
      case 'orders':
        return (
          <BarChart
            dataset={chartData.dates.map((date, index) => ({
              date,
              orders: chartData.orders[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'date', label: 'Date' }]}
            yAxis={[{ label: 'Number of Orders' }]}
            series={[{ dataKey: 'orders', label: 'Orders' }]}
            height={400}
            colors={[theme.palette.secondary.main]}
          />
        );
      case 'averageOrder':
        return (
          <LineChartWrapper
            dataset={chartData.dates.map((date, index) => ({
              date,
              average: chartData.avgOrders[index],
            }))}
            xAxis={[{ scaleType: 'band', dataKey: 'date', label: 'Date' }]}
            yAxis={[{ label: 'Average Order Value (€)' }]}
            series={[
              {
                dataKey: 'average',
                label: 'Avg. Order Value',
                area: true,
                showMark: false,
                curve: 'linear',
              },
            ]}
            colors={[theme.palette.success.main]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <FlexWrapper
        direction="horizontal"
        responsiveDirection={true} // Enable responsive direction - will switch to vertical on mobile
        gap={isMobile ? 'sm' : 'md'} // Adjust gap size for mobile
      >
        <MainSummaryCard
          isLoading={isWeekAnalyticsLoading || isWeekDayDataLoading}
          isError={isWeekAnalyticsError || isWeekDayError}
          title={t('adminDashboard.summaryCards.totalRevenue')}
          chartData={chartData && chartData.revenue ? chartData.revenue : []}
          value={formatCurrency(weekAnalyticsData?.total_revenue)}
          onChartClick={() => handleChartClick('revenue')}
        />

        <MainSummaryCard
          isLoading={isWeekAnalyticsLoading || isWeekDayDataLoading}
          isError={isWeekAnalyticsError || isWeekDayError}
          title={t('adminDashboard.summaryCards.totalOrders')}
          chartData={chartData && chartData.orders ? chartData.orders : []}
          value={`${weekAnalyticsData?.total_orders}` || '0'}
          onChartClick={() => handleChartClick('orders')}
        />

        <MainSummaryCard
          isLoading={isWeekAnalyticsLoading || isWeekDayDataLoading}
          isError={isWeekAnalyticsError || isWeekDayError}
          title={t('adminDashboard.summaryCards.averageRevenuePerOrder')}
          value={
            weekAnalyticsData && weekAnalyticsData.total_orders > 0
              ? formatCurrency(weekAnalyticsData.total_revenue / weekAnalyticsData.total_orders)
              : '€0.00'
          }
          chartData={chartData && chartData.avgOrders ? chartData.avgOrders : []}
          onChartClick={() => handleChartClick('averageOrder')}
        />
      </FlexWrapper>

      {/* Detailed Chart Dialog - Make it fullScreen on mobile */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile} // Use fullScreen on mobile devices
      >
        <DialogTitle>
          {selectedChartType === 'revenue' && t('adminDashboard.summaryCards.totalRevenue')}
          {selectedChartType === 'orders' && t('adminDashboard.summaryCards.totalOrders')}
          {selectedChartType === 'averageOrder' &&
            t('adminDashboard.summaryCards.averageRevenuePerOrder')}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, height: isMobile ? 'calc(100vh - 120px)' : '400px' }}>
            <DetailedChart />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SummaryCards;
