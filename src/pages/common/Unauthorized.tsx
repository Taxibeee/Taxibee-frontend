import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { DashboardLayout } from '../../components';
import { sidebarItemsAdmin } from '../admin/AdminSidebar';
import { sidebarItemsDriver } from '../driver/DriverSidebar';
import { useAuth } from '../../hooks';
import { NotAccessible } from '@mui/icons-material';

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, userRole, currentUser } = useAuth();

  const provideTranslatedText = ({ items }: { items: SidebarItem[] }): SidebarItem[] => {
    return items.map((item: SidebarItem) => ({
      ...item,
      text: t(item.text),
    }));
  };

  const UnauthorizedContent = () => (
    <Box
      sx={{
        backgroundColor: '#ff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
        padding: '20px',
        textAlign: 'center',
        py: 30,
        px: 40
      }}
    >
      <Typography variant="h3" sx={{ mb: 3 }}>
        <NotAccessible sx={{ fontSize: '4rem', mr: 1 }} />
        {!isAuthenticated ? t('Please Log In') : t('Not Authorized')}
      </Typography>

      <Typography variant="body1" sx={{ color: '#000000', fontSize: '1.1rem', maxWidth: '600px' }}>
        {!isAuthenticated ? (
          t('Please log in to access this page.')
        ) : (
          <>
            {t('You do not have permission to access this page.')}
            <br />
            {currentUser && (
              <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                {t('Current Role')}: {userRole}
                <br />
                {t('User')}: {currentUser.username}
              </Typography>
            )}
          </>
        )}
      </Typography>
    </Box>
  );

  return isAuthenticated ? (
    <DashboardLayout menuItems={provideTranslatedText({ items: userRole === 'admin' ? sidebarItemsAdmin : sidebarItemsDriver })}>
      <UnauthorizedContent />
    </DashboardLayout>
  ) : (
    <UnauthorizedContent />
  );
};

export default Unauthorized;
