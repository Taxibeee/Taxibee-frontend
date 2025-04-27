import React from 'react';
import { Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

interface TextWrapperProps {
  isLoading?: boolean;
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  isDark?: boolean;
}

const sizeMapping = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  xxl: '2rem',
  xxxl: '3rem',
};

const TextWrapper: React.FC<TextWrapperProps> = ({
  isLoading = false,
  text,
  isBold = false,
  isItalic = false,
  size = 'md',
  isDark = true,
}) => {
  if (isLoading) {
    return (
      <Skeleton 
        variant="text" 
        animation="wave"
        width="80%" 
        sx={{
          fontSize: sizeMapping[size],
        }}
      />
    );
  }
  
  return (
    <Typography
      sx={{
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        fontSize: sizeMapping[size],
        color: isDark ? '#2a2d3e' : '#565b72',
        padding: 0,
        margin: 0,
      }}
    >
      {text}
    </Typography>
  );
};

export default TextWrapper;
