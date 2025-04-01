export interface SnackbarAlert {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }