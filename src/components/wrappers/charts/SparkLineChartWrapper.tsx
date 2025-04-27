import React from 'react';

import FlexWrapper from '../../common/FlexWrapper';
import HeadingsWrapper from '../../common/HeadingsWrapper';


"use client"

import { Area, AreaChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";

interface AreaChartWrapperProps {
    title?: string;
    chartData: number[];
    onClick: () => void;
}

const AreaChartWrapper: React.FC<AreaChartWrapperProps> = ({ title, chartData, onClick }) => {

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
            color: "hsl(var(--chart-1))",
        }
    } satisfies ChartConfig;

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
                                offset="5%"
                                stopColor="var(--color-value, hsl(var(--chart-1)))"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--color-value, hsl(var(--chart-1)))"
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey="value"
                        type="natural"
                        fill="url(#fillValue)"
                        fillOpacity={0.6}
                        stroke="var(--color-value, hsl(var(--chart-1)))"
                    />
                </AreaChart>
            </ChartContainer>
        </FlexWrapper>
    )
};

export default AreaChartWrapper;
