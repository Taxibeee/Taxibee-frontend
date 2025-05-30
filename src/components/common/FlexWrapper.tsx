import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

interface FlexWrapperProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  isDebugging?: boolean; // Optional prop to enable debugging border
  sx?: SxProps; // Optional prop for additional styling
}

// Map T-shirt sizes to spacing values
const gapSizes = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

const FlexWrapper: React.FC<FlexWrapperProps> = ({
  children,
  gap = 'md',
  direction = 'horizontal',
  isDebugging = false,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: gapSizes[gap],
        border: isDebugging ? '1px solid red' : 'none', // Add red border if debugging
        ...sx, // Spread additional styles
      }}
    >
      {children}
    </Box>
  );
};

export default FlexWrapper;
