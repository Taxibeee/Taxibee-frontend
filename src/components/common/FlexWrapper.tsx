import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';

interface FlexWrapperProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  responsiveDirection?: boolean; // New prop to enable responsive behavior
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
  responsiveDirection = false,
  isDebugging = false,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If responsiveDirection is true and we're on mobile, force vertical layout
  const effectiveDirection = (responsiveDirection && isMobile) ? 'vertical' : direction;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: effectiveDirection === 'vertical' ? 'column' : 'row',
        gap: gapSizes[gap],
        border: isDebugging ? '1px solid red' : 'none',
        ...sx, // Spread additional styles
        '& > *': effectiveDirection === 'horizontal' ? { flex: 1 } : undefined, // Ensure equal widths for horizontal direction
      }}
    >
      {children}
    </Box>
  );
};

export default FlexWrapper;
