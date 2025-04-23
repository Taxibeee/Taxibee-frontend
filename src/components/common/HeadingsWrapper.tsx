import React from 'react';
import { Typography } from '@mui/material';

interface HeadingsWrapperProps {
  text: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2';
  isBold?: boolean;
  isLight?: boolean;
}

const HeadingsWrapper: React.FC<HeadingsWrapperProps> = ({ text, type, isBold = true, isLight = true }) => {
  return (
    <Typography
      variant={type}
      sx={{
        fontWeight: isBold ? 'bold' : 'normal',
        color: isLight ? '#565b72' : '#2a2d3e',
        padding: 0,
        margin: 0,
      }}
    >
      {text}
    </Typography>
  );
};

// SPECIFIC WRAPPERS

// ADMIN PAGE HEADINGS

interface AdminPageHeadingsWrapperProps {
  text: string;
}

const AdminPageHeadingsWrapper: React.FC<AdminPageHeadingsWrapperProps> = ({ text }) => {
  return (
    <HeadingsWrapper
      text={text}
      type='h3'
      isBold={false}
      isLight={false}
    />
  );
}

export default HeadingsWrapper;


export { AdminPageHeadingsWrapper };
