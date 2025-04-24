import React from 'react';
import {
  useMediaQuery,
  useTheme,
} from '@mui/material';


import { useAdminQueries } from '../../hooks';
import { useTranslation } from 'react-i18next';
import FlexWrapper from '../common/FlexWrapper';
import CardWrapper from '../common/CardWrapper';
import HeadingsWrapper from '../common/HeadingsWrapper';
import TextWrapper from '../common/TextWrapper';


// Utility function for formatting currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '€0.00';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};


const MainSummaryCard: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <CardWrapper isLoading={false}>
      <FlexWrapper direction='vertical' gap='none'>
        <HeadingsWrapper text={title} type='subtitle1' isBold={false}/>
        <TextWrapper text={value} isBold={false} size='xxxl' />
      </FlexWrapper>
    </CardWrapper>
  );
};

const SecondarySummaryCard: React.FC<{ title: string; value: string }> = ({ title, value }) => {  
  return (
    <CardWrapper isLoading={false}>
      <FlexWrapper direction='vertical' gap='none'>
        <HeadingsWrapper text={title} type='subtitle1' isBold={false} />
        <TextWrapper text={value} isBold={false} size='lg' />
      </FlexWrapper>
    </CardWrapper>
  );
}

interface SummaryCardsProps {
  startDate: string;
  endDate: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { useWeekAnalytics } = useAdminQueries();
  const { data, isLoading, isError } = useWeekAnalytics(startDate, endDate);

  return (
    <FlexWrapper direction='horizontal'>

      <MainSummaryCard
        title={t('adminDashboard.summaryCards.totalRevenue')}
        value={formatCurrency(data?.total_revenue)}
      />

      <MainSummaryCard
        title={t('adminDashboard.summaryCards.totalOrders')}
        value={`${data?.total_orders}` || "0"}
      />

      <FlexWrapper direction='vertical'>

      <SecondarySummaryCard
        title={t('adminDashboard.summaryCards.totalDistance')}
        value={`${(data ? data.total_distance / 1000 : 0).toFixed(1)} km`}
      />
      <SecondarySummaryCard
        title={t('adminDashboard.summaryCards.averageRevenuePerOrder')}
        value={data && data.total_orders > 0
          ? formatCurrency(data.total_revenue / data.total_orders)
          : '€0.00'}
      />
      </FlexWrapper>

    </FlexWrapper>
  )

  // return (
  //   <Box
  //     sx={{
  //       p: 1,
  //     }}
  //   >
  //     <Typography variant="overline">{t('adminDashboard.summaryCards.weeklySummary')}</Typography>
  //     <Stack spacing={3} sx={{ mb: 4, flex: 1 }} direction={isMobile ? 'column' : 'row'}>
  //       <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           elevation={1}
  //           sx={{
  //             position: 'relative',
  //             overflow: 'hidden',
  //             ...cardBackgrounds.revenue,
  //             transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //             '&:hover': {
  //               transform: 'translateY(-2px)',
  //               boxShadow: theme => theme.shadows[4],
  //               '&::before': {
  //                 opacity: 0.15,
  //               },
  //             },
  //           }}
  //         >
  //           <CardContent>
  //             {isLoading ? (
  //               <LoadingSkeleton />
  //             ) : isError ? (
  //               <Typography color="error">
  //                 {t('adminDashboard.summaryCards.failedToLoadData')}
  //               </Typography>
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '170px',
  //                   width: '300px',
  //                   display: 'flex',
  //                   flexDirection: 'column',
  //                   justifyContent: 'flex-end',
  //                   alignItems: 'flex-start',
  //                 }}
  //               >
  //                 <Typography variant="h4">{formatCurrency(data?.total_revenue)}</Typography>
  //                 <Typography variant="caption" color="text.secondary" gutterBottom>
  //                   {t('adminDashboard.summaryCards.totalRevenue')}
  //                 </Typography>
  //               </Box>
  //             )}
  //           </CardContent>
  //         </Card>
  //       </Grid2>
  //       <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
  //         <Card
  //           elevation={1}
  //           sx={{
  //             position: 'relative',
  //             overflow: 'hidden',
  //             ...cardBackgrounds.orders,
  //             transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //             '&:hover': {
  //               transform: 'translateY(-2px)',
  //               boxShadow: theme => theme.shadows[4],
  //               '&::before': {
  //                 opacity: 0.15,
  //               },
  //             },
  //           }}
  //         >
  //           <CardContent>
  //             {isLoading ? (
  //               <LoadingSkeleton />
  //             ) : isError ? (
  //               <Typography color="error">
  //                 {t('adminDashboard.summaryCards.failedToLoadData')}
  //               </Typography>
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '170px',
  //                   width: '300px',
  //                   display: 'flex',
  //                   flexDirection: 'column',
  //                   justifyContent: 'flex-end',
  //                   alignItems: 'flex-start',
  //                 }}
  //               >
  //                 <Typography variant="h4" component="div">
  //                   {data?.total_orders || 0}
  //                 </Typography>
  //                 <Typography variant="caption" color="text.secondary" gutterBottom>
  //                   {t('adminDashboard.summaryCards.totalOrders')}
  //                 </Typography>
  //               </Box>
  //             )}
  //           </CardContent>
  //         </Card>
  //       </Grid2>
  //       <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
  //         <Card
  //           elevation={1}
  //           sx={{
  //             position: 'relative',
  //             overflow: 'hidden',
  //             ...cardBackgrounds.distance,
  //             transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //             '&:hover': {
  //               transform: 'translateY(-2px)',
  //               boxShadow: theme => theme.shadows[4],
  //               '&::before': {
  //                 opacity: 0.15,
  //               },
  //             },
  //           }}
  //         >
  //           <CardContent>
  //             {isLoading ? (
  //               <Skeleton
  //                 animation="pulse"
  //                 variant="rectangular"
  //                 height={40}
  //                 sx={{ borderRadius: 1 }}
  //               />
  //             ) : isError ? (
  //               <Typography color="error">
  //                 {t('adminDashboard.summaryCards.failedToLoadData')}
  //               </Typography>
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '55px',
  //                 }}
  //               >
  //                 <Typography variant="h5">
  //                   {data ? (data.total_distance / 1000).toFixed(1) : 0}{' '}
  //                   <Typography component="span" variant="caption">
  //                     km
  //                   </Typography>
  //                 </Typography>
  //                 <Typography variant="caption" color="text.secondary" gutterBottom>
  //                   {t('adminDashboard.summaryCards.totalDistance')}
  //                 </Typography>
  //               </Box>
  //             )}
  //           </CardContent>
  //         </Card>
  //         <Card
  //           elevation={1}
  //           sx={{
  //             position: 'relative',
  //             overflow: 'hidden',
  //             ...cardBackgrounds.average,
  //             transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  //             '&:hover': {
  //               transform: 'translateY(-2px)',
  //               boxShadow: theme => theme.shadows[4],
  //               '&::before': {
  //                 opacity: 0.15,
  //               },
  //             },
  //           }}
  //         >
  //           <CardContent>
  //             {isLoading ? (
  //               <Skeleton
  //                 animation="pulse"
  //                 variant="rectangular"
  //                 height={40}
  //                 sx={{ borderRadius: 1 }}
  //               />
  //             ) : isError ? (
  //               <Typography color="error">
  //                 {t('adminDashboard.summaryCards.failedToLoadData')}
  //               </Typography>
  //             ) : (
  //               <Box
  //                 sx={{
  //                   height: '55px',
  //                 }}
  //               >
  //                 <Typography variant="h5" component="div">
  //                   {data && data.total_orders > 0
  //                     ? formatCurrency(data.total_revenue / data.total_orders)
  //                     : '€0.00'}
  //                 </Typography>
  //                 <Typography variant="caption" color="text.secondary" gutterBottom>
  //                   {t('adminDashboard.summaryCards.averageRevenuePerOrder')}
  //                 </Typography>
  //               </Box>
  //             )}
  //           </CardContent>
  //         </Card>
  //       </Stack>
  //     </Stack>
  //   </Box>
  // );
};

export default SummaryCards;
