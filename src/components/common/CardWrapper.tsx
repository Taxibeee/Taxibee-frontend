import React from 'react';
import { Card, CardContent } from '@mui/material';
import { LoadingSkeleton } from '../admin/LoadingSkeleton';

interface CardWrapperProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ isLoading = false, children }) => {
  return (
    <Card elevation={0} style={{ border: '1px solid #eef2f7' }}>
      <CardContent>{isLoading ? <LoadingSkeleton /> : children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
