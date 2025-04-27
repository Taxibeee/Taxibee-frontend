import React from 'react';
import { Typography } from '@mui/material';
import SkeletonWrapper from './SkeletonWrapper';
import ErrorDisplayWrapper from './ErrorDisplayWrapper';

interface TextWrapperProps {
  isError?: boolean;
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
  isError = false,
  isLoading = false,
  text,
  isBold = false,
  isItalic = false,
  size = 'md',
  isDark = true,
}) => {
  if (isLoading) {
    return <SkeletonWrapper variant="text" width="80%" fontSize={sizeMapping[size]} />;
  }

  if (isError) {
    return <ErrorDisplayWrapper compact={true} />;
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
