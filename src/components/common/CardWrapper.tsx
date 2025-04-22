import React from 'react';
import { Card, CardContent, CircularProgress, Box } from '@mui/material';

interface CardWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ isLoading, children }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default CardWrapper;