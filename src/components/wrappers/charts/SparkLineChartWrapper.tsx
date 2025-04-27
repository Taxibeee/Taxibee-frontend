import React from 'react';
import { SparkLineChart } from '@mui/x-charts';

import FlexWrapper from '../../common/FlexWrapper';
import HeadingsWrapper from '../../common/HeadingsWrapper';


interface SparkLineChartWrapperProps {
    title?: string;
    chartData: number[];
    onClick: () => void;
}

const SparkLineChartWrapper: React.FC<SparkLineChartWrapperProps> = ({ title, chartData, onClick }) => {

    return (
        <FlexWrapper direction='vertical' onClick={onClick} gap='md'>
            {title && <HeadingsWrapper text={title} isBold={false} type='subtitle1' />}
            <SparkLineChart
                data={chartData}
                height={100}
                curve="natural"
            />

        </FlexWrapper>
    )
};

export default SparkLineChartWrapper;
