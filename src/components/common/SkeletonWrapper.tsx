import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { SxProps, Theme } from '@mui/material/styles';

interface SkeletonWrapperProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | false;
  width?: string | number;
  height?: string | number | undefined;
  fontSize?: string | number;
  sx?: SxProps<Theme>;
}

const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  variant = 'text',
  animation = 'wave',
  width = '100%',
  height,
  fontSize,
  sx = {},
}) => {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      sx={{
        fontSize,
        ...sx,
      }}
    />
  );
};

export default SkeletonWrapper;
