import React from 'react';
import { Typography } from '@mui/material';

interface HeadingsWrapperProps {
  text: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  isBold?: boolean;
}

const HeadingsWrapper: React.FC<HeadingsWrapperProps> = ({ text, type, isBold = true }) => {
  return (
    <Typography
      variant={type}
      sx={{
        fontWeight: isBold ? 'bold' : 'normal',
        padding: 0,
        margin: 0,
      }}
    >
      {text}
    </Typography>
  );
};

export default HeadingsWrapper;
