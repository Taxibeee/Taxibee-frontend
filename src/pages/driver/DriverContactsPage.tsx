import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Stack,
  Snackbar,
  Button,
} from '@mui/material';
import { CustomWindow } from '../../api/api';
import emailjs from '@emailjs/browser';
import React, { useState } from 'react';

import { CustomAlert } from '../../utils/customAlert';

interface ContactUs {
  name: string;
  email: string;
  message: string;
}

interface SnackbarAlert {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const DriverContactsPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState<ContactUs>({
    name: '',
    email: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState<SnackbarAlert>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleContactFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async () => {
    // Basic validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        message: contactForm.message,
        to_email: 'nasrul2001@gmail.com',
      };

      const VITE_EMAILJS_PUBLIC_KEY = (window as CustomWindow).__ENV__?.VITE_EMAILJS_PUBLIC_KEY;
      const VITE_EMAILJS_SERVICE_ID = (window as CustomWindow).__ENV__?.VITE_EMAILJS_SERVICE_ID;
      const VITE_EMAILJS_TEMPLATE_ID = (window as CustomWindow).__ENV__?.VITE_EMAILJS_TEMPLATE_ID;

      await emailjs.send(
        VITE_EMAILJS_SERVICE_ID!,
        VITE_EMAILJS_TEMPLATE_ID!,
        templateParams,
        VITE_EMAILJS_PUBLIC_KEY!
      );

      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success',
      });
      // Clear form
      setContactForm({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbar({
        open: true,
        message: 'Error sending message. Please try again later.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          maxWidth: '600px',
          mt: 4,
          mb: 4,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Contact Us
          </Typography>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={contactForm.name}
              onChange={handleContactFormChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={contactForm.email}
              onChange={handleContactFormChange}
            />
            <TextField
              name="message"
              label="Message"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={contactForm.message}
              onChange={handleContactFormChange}
            />
            <Button
              variant="contained"
              onClick={handleContactSubmit}
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#fecc04',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#e5b800',
                },
              }}
            >
              {isSubmitting ? 'Sending... ' : 'Send Message'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <CustomAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </CustomAlert>
      </Snackbar>
    </Box>
  );
};

export default DriverContactsPage;
