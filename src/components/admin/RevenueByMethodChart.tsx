import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAdminQueries } from '../../hooks';
import FlexWrapper from '../common/FlexWrapper';
import CardWrapper from '../common/CardWrapper';
import HeadingsWrapper from '../common/HeadingsWrapper';
import TextWrapper from '../common/TextWrapper';

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

  const legendSize = 20;

  return (
    <CardWrapper isLoading={isLoading}>
      <FlexWrapper direction="vertical">
        <FlexWrapper direction="vertical" gap="none">
          <HeadingsWrapper text="Revenue by Payment Method" type="subtitle1" isBold={false} />
          <TextWrapper
            text={`Total Revenue: ${formatCurrency(calculateTotal())}`}
            size="lg"
            isBold={true}
            isError={isError}
          />
        </FlexWrapper>
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
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'middle', horizontal: 'right' },
              labelStyle: {
                fontSize: 12,
              },
              itemMarkWidth: legendSize,
              itemMarkHeight: legendSize,
              markGap: 5,
              itemGap: 15,
              hidden: false,
            },
          }}
        />
      </FlexWrapper>
    </CardWrapper>
  );
};

export default RevenueByMethodChart;
