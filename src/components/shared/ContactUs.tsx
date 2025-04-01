import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ContactUsProps } from '../../types/contactUsProps.types';

const ContactUs: React.FC<ContactUsProps> = ({
  open,
  onClose,
  onSubmit,
  onChange,
  formData,
  isSubmitting,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: '#1a1a1a',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {t('contactForm.contactUs')}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText sx={{ mb: 2 }}>
          {t('contactForm.instruction')}
        </DialogContentText>
        <TextField
          autoFocus
          name="name"
          label={t('contactForm.name')}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          label={t('contactForm.email')}
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={onChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="message"
          label={t('contactForm.message')}
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={formData.message}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#fecc04',
            color: 'black',
            '&:hover': {
              borderColor: '#e5b800',
              backgroundColor: 'rgba(254, 204, 4, 0.1)',
            },
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#fecc04',
            color: 'black',
            '&:hover': {
              backgroundColor: '#e5b800',
            },
          }}
        >
          {isSubmitting ? 'Sending...' : t('contacts.sendMessage')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactUs;
