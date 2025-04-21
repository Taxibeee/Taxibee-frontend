import React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts';

interface LineChartWrapperProps {
  dataset: LineChartProps['dataset'];
  xAxis: LineChartProps['xAxis'];
  yAxis: LineChartProps['yAxis'];
  series: LineChartProps['series'];
  colors: LineChartProps['colors'];
}

const LineChartWrapper: React.FC<LineChartWrapperProps> = ({
  dataset,
  xAxis,
  yAxis,
  series,
  colors,
}) => {
  return (
    <LineChart
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={400}
      colors={colors}
    />
  );
};

export default LineChartWrapper;
