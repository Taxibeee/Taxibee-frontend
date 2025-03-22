import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  ListItemIcon,
  SelectChangeEvent,
  Chip,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  // Handle language change
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        <LanguageIcon fontSize="small" />
      </ListItemIcon>
      <Typography variant="body2" sx={{ mr: 1 }}>
        {t('common.language')}:
      </Typography>
      <FormControl variant="standard" size="small">
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          displayEmpty
          sx={{ minWidth: 80 }}
        >
          <MenuItem value="en">{t('common.english')}</MenuItem>
          <MenuItem value="nl">{t('common.dutch')}</MenuItem>
        </Select>
      </FormControl>
      <Chip
        label="Beta"
        color="primary"
        size="small"
        sx={{
          ml: 1,
          height: '20px',
          '& .MuiChip-label': {
            px: 1,
            fontSize: '0.625rem',
          },
          backgroundColor: 'warning.main',
        }}
      />
    </Box>
  );
};

export default LanguageSwitcher;
