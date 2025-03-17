import React from 'react';
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Box,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAdminQueries } from '../../hooks';
import { useTranslation } from 'react-i18next';

// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const SummaryCards: React.FC = () => {
  const { t } = useTranslation();


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { useWeekAnalytics } = useAdminQueries();
  const { data, isLoading, isError } = useWeekAnalytics();


  const LoadingSkeleton = () => {
    return (
      <Skeleton
        animation="pulse"
        variant="rectangular"
        height={170}
        width={300}
        sx={{ borderRadius: 1 }}
      />
    )
  }


  return (
    <Box sx= {{
      p: 1,
    }}>
      <Typography variant="overline">{t('adminDashboard.summaryCards.weeklySummary')}</Typography>
    <Stack container spacing={3} sx={{ mb: 4, flex: 1 }} direction={isMobile ? 'column' : 'row'}>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={1}>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <Typography color="error">{t('adminDashboard.summaryCards.failedToLoadData')}</Typography>
            ) : (
              <Box sx={{
                height: '170px',
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}>
                
                  <Typography variant="h4">
                    {formatCurrency(data?.total_revenue)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {t('adminDashboard.summaryCards.totalRevenue')}
                  </Typography>
    
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} sm={6} md={3}>
        <Card elevation={1}>
          <CardContent>
            
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <Typography color="error">{t('adminDashboard.summaryCards.failedToLoadData')}</Typography>
            ) : (
              <Box sx={{
                height: '170px',
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
              }}>
                <Typography variant="h4" component="div">
                  {data?.total_orders || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('adminDashboard.summaryCards.totalOrders')}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
        <Card elevation={1}>
          <CardContent>
            {isLoading ? (
              <Skeleton 
                animation="pulse" 
                variant="rectangular" 
                height={40} 
                sx={{ borderRadius: 1 }}
              />
            ) : isError ? (
              <Typography color="error">{t('adminDashboard.summaryCards.failedToLoadData')}</Typography>
            ) : (
              <Box sx={{
                height: '55px',
              }}>
              <Typography variant="h5">
                {data ? (data.total_distance / 1000).toFixed(1) : 0} <Typography component="span" variant="caption">
                  km
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('adminDashboard.summaryCards.totalDistance')}
              </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        <Card elevation={1}>
          <CardContent>
            
            {isLoading ? (
              <Skeleton 
              animation="pulse" 
              variant="rectangular" 
              height={40} 
              sx={{ borderRadius: 1 }}
            />
            ) : isError ? (
              <Typography color="error">{t('adminDashboard.summaryCards.failedToLoadData')}</Typography>
            ) : (
              <Box sx={{
                height: '55px',
              }}>
              <Typography variant="h5" component="div">
                {data && data.total_orders > 0
                  ? formatCurrency(data.total_revenue / data.total_orders)
                  : '$0.00'}
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('adminDashboard.summaryCards.averageRevenuePerOrder')}
              </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
    </Box>
  );
};

export default SummaryCards;