import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

interface FlexWrapperProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  onClick?: () => void; // Optional click handler
  isDebugging?: boolean; // Optional prop to enable debugging border
  sx?: SxProps; // Optional prop for additional styling
}

// Map T-shirt sizes to spacing values
const gapSizes = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

const FlexWrapper: React.FC<FlexWrapperProps> = ({
  children,
  gap = 'md',
  onClick = () => { },
  direction = 'horizontal',
  isDebugging = false,
  sx,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: gapSizes[gap],
        border: isDebugging ? '1px solid red' : 'none',
        ...sx, // Spread additional styles
        '& > *': direction === 'horizontal' ? { flex: 1 } : undefined, // Ensure equal widths for horizontal direction
      }}
    >
      {children}
    </Box>
  );
};

export default FlexWrapper;
