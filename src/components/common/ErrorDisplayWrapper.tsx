import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import FlexWrapper from './FlexWrapper';

interface ErrorDisplayWrapperProps {
  message?: string; // Optional custom error message
  title?: string; // Optional title for the error
  compact?: boolean; // Whether to show a compact version
}

const ErrorDisplayWrapper: React.FC<ErrorDisplayWrapperProps> = ({
  message = 'Sorry, an error occurred while fetching data.',
  title = 'Error',
  compact = false,
}) => {
  if (compact) {
    return (
      <FlexWrapper direction='horizontal' gap='sm'>
        <Alert severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </FlexWrapper>
    );
  }
  
  return (
    <FlexWrapper direction='vertical' gap='sm'>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </FlexWrapper>
  );
};

export default ErrorDisplayWrapper;
