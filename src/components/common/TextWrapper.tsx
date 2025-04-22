import React from 'react';
import { Typography } from '@mui/material';

interface TextWrapperProps {
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
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
  text,
  isBold = false,
  isItalic = false,
  size = 'md',
}) => {
  return (
    <Typography
      sx={{
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        fontSize: sizeMapping[size],
        padding: 0,
        margin: 0,
      }}
    >
      {text}
    </Typography>
  );
};

export default TextWrapper;
