"use client"
import React from 'react';

import FlexWrapper from '../../common/FlexWrapper';
import HeadingsWrapper from '../../common/HeadingsWrapper';
import { Area, AreaChart } from "recharts"
import Skeleton from '@mui/material/Skeleton';

import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";

interface AreaChartWrapperProps {
    isLoading: boolean;
    title?: string;
    chartData: number[];
    onClick: () => void;
}

const AreaChartWrapper: React.FC<AreaChartWrapperProps> = ({ title, chartData, onClick, isLoading = false }) => {

    const numArrayToChartData = (data: number[]) => {
        return data.map((value, index) => ({
            index,
            value
        }));
    };

    const transformedData = numArrayToChartData(chartData);
    
    const chartConfig = {
        value: {
            label: "Value",
            color: "hsl(210, 80%, 50%)", // Changed to blue hue
        }
    } satisfies ChartConfig;

    if (isLoading) {
        return (
            <FlexWrapper direction='vertical' gap='md'>
                {title && <HeadingsWrapper text={title} isBold={false} type='subtitle1' />}
                <Skeleton 
                    variant="rectangular" 
                    animation="wave"
                    width="100%" 
                    height={200}
                    sx={{
                        borderRadius: '8px'
                    }}
                />
            </FlexWrapper>
        );
    }

    return (
        <FlexWrapper direction='vertical' onClick={onClick} gap='md'>
            {title && <HeadingsWrapper text={title} isBold={false} type='subtitle1' />}
            <ChartContainer config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={transformedData}
                >
                    <defs>
                        <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor="hsl(210, 80%, 50%)"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="hsl(210, 80%, 50%)"
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey="value"
                        type="natural"
                        fill="url(#fillValue)"
                        fillOpacity={0.6}
                        stroke="hsl(210, 80%, 50%)"
                    />
                </AreaChart>
            </ChartContainer>
        </FlexWrapper>
    )
};

export default AreaChartWrapper;
