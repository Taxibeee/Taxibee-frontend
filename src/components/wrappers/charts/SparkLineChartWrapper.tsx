import React from 'react';
import { SparkLineChart } from '@mui/x-charts';
import { Box, Typography } from '@mui/material';

interface SparkLineChartWrapperProps {
  title: string;
  chartData: number[];
  color: string;
  onClick: () => void;
}

const SparkLineChartWrapper: React.FC<SparkLineChartWrapperProps> = ({ title, chartData, color, onClick }) => {

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:hover': { opacity: 0.8 },
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <SparkLineChart data={chartData} height={100} curve="natural" colors={[color]} />
    </Box>
  );
};

export default SparkLineChartWrapper;
