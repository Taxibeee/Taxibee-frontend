import { ReactNode } from "react";
import { Alert, AlertProps } from '@mui/material';

interface CustomAlertProps extends AlertProps {
  children: ReactNode;
}

export const CustomAlert: React.FC<CustomAlertProps> = (props) => {
  return <Alert {...props} />;
};
