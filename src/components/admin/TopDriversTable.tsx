import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  LinearProgress,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { useAdminQueries } from '../../hooks';
import { CustomAlert } from '../../utils/customAlert';
import CardWrapper from '../common/CardWrapper';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

interface TopDriversTableProps {
  startDate: string;
  endDate: string;
}

const TopDriversTable: React.FC<TopDriversTableProps> = ({ startDate, endDate }) => {
  const theme = useTheme();
  const [showAllDrivers, setShowAllDrivers] = useState(false);
  const { useRevenueByDriver } = useAdminQueries();
  const { data, isLoading, isError } = useRevenueByDriver(startDate, endDate);

  const displayedDrivers = showAllDrivers ? data : data?.slice(0, 10);

  const handleToggleView = () => {
    setShowAllDrivers(!showAllDrivers);
  };

  return (
    <CardWrapper isLoading={isLoading}>

        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <CustomAlert severity="error">Failed to load driver revenue data.</CustomAlert>
        ) : !data || data.length === 0 ? (
          <Typography>No driver revenue data available.</Typography>
        ) : (
          <TableContainer
            sx={{
              maxHeight: 800,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.divider,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedDrivers?.map(driver => {
                  const totalRevenue = data.reduce(
                    (sum, current) => sum + current.total_revenue,
                    0
                  );
                  const percentage =
                    totalRevenue > 0 ? (driver.total_revenue / totalRevenue) * 100 : 0;

                  return (
                    <TableRow key={driver.driver_uuid}>
                      <TableCell component="th" scope="row">
                        {driver.driver_name}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(driver.total_revenue)}</TableCell>
                      <TableCell align="right">
                        {percentage.toFixed(1)}%
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 5, borderRadius: 5, mt: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {data.length > 5 && (
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 0,
                  p: 0,
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    mt: 5,
                  }}
                >
                  {showAllDrivers ? 'All drivers' : 'Top performance drivers'}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleToggleView}
                  sx={{
                    mt: 4,
                  }}
                >
                  {showAllDrivers ? 'Show Less' : 'View All Drivers'}
                </Button>
              </Box>
            )}
          </TableContainer>
        )}
    </CardWrapper>
  );
};

export default TopDriversTable;
