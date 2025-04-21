import React from 'react';
import { LineChart } from '@mui/x-charts';

interface LineChartWrapperProps {
  dataset: any;

  xAxis: any;
  yAxis: any;

  series: any;

  colors: any;
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
