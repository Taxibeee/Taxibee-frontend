import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { DashboardLayout } from '../../components';
import { sidebarItemsAdmin } from '../admin/AdminSidebar';
import unauthorizedImg from '../../assets/unauthorized.png';

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();

  const provideTranslatedText = ({ items }: { items: SidebarItem[] }): SidebarItem[] => {
    return items.map((item: SidebarItem) => ({
      ...item,
      text: t(item.text),
    }));
  };

  return (
    <DashboardLayout menuItems={provideTranslatedText({ items: sidebarItemsAdmin })}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="##fff"
        px={2}
        textAlign="center"
      >
        {/* Big heading */}
        <Typography variant="h3" sx={{ color: '#f57f17', fontWeight: 700, mb: 3 }}>
          {t('Access Denied')}
        </Typography>

        {/* Image */}
        <Box
          component="img"
          src={unauthorizedImg}
          alt="Unauthorized Access"
          sx={{
            width: '100%',
            maxWidth: 350,
            height: 'auto',
            mb: 3,
            mt: 0,
          }}
        />

        {/* Description */}
        <Typography variant="body1" sx={{ color: '#000000', fontSize: '1.1rem' }}>
          {t('You do not have permission to access this page. This area is restricted to users with different permissions than your current role.')}
        </Typography>
      </Box>
    </DashboardLayout>
  );
};

export default Unauthorized;
