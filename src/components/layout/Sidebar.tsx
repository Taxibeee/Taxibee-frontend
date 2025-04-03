import React, { useState } from 'react';
import { CustomWindow } from '../../api/api';
import emailjs from '@emailjs/browser';
import { SnackbarAlert } from '../../types/snackbarAlert.types';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { SidebarItem } from './DashboardLayout';
import logo from '../../assets/F5-04.png';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ContactUs from '../shared/ContactUs';
import { feedback } from '../../types/feedback.types';

// Define drawer width - make sure this matches your DashboardLayout
const drawerWidth = 240;

interface SidebarProps {
  menuItems: SidebarItem[];
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isMobile: boolean;
  currentPath: string;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarAlert>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  open,
  onClose,
  onNavigate,
  isMobile,
  currentPath,
  setSnackbar,
}) => {
  const [openContactDialog, setOpenContactDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState<feedback>({
    name: '',
    email: '',
    message: '',
  });

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
        to_email: 'taxibee2024@gmail.com',
      };

      const VITE_EMAILJS_PUBLIC_KEY =
        (window as CustomWindow).__ENV__?.VITE_EMAILJS_PUBLIC_KEY ||
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const VITE_EMAILJS_SERVICE_ID =
        (window as CustomWindow).__ENV__?.VITE_EMAILJS_SERVICE_ID ||
        import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const VITE_EMAILJS_TEMPLATE_ID =
        (window as CustomWindow).__ENV__?.VITE_EMAILJS_TEMPLATE_ID ||
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

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
      handleContactDialogClose();
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

  const handleContactDialogOpen = () => {
    setOpenContactDialog(true);
  };

  const handleContactDialogClose = () => {
    setOpenContactDialog(false);
    setContactForm({
      name: '',
      email: '',
      message: '',
    });
  };
  const handleContactFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [event.target.name]: event.target.value,
    });
  };

  // Sidebar content - shared between mobile and desktop versions
  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between', // Pushes last item to bottom
        mt: isMobile ? 2 : -6, // Adjust the margin top if needed
      }}
    >
      <Box>
        {!isMobile && <Toolbar />} {/* Provides space at the top for AppBar in desktop mode */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: -5, mb: -4 }}>
            <img src={logo} alt="React" width={200} height={100} />
          </Box>
        )}
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  onNavigate(item.path);
                  if (isMobile) {
                    onClose();
                  }
                }}
                sx={{
                  borderRadius: 1,
                  backgroundColor: currentPath === item.path ? '#FFF27A' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPath === item.path ? '#FFF27A' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.875rem',
                        color:
                          currentPath === item.path ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.6)',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Button at the bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '14px',
            color: 'grey.500',
            fontWeight: 500,
          }}
        >
          Contact Us
        </Typography>

        <IconButton
          onClick={handleContactDialogOpen}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <ContactSupportIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>
      <ContactUs
        open={openContactDialog}
        onClose={handleContactDialogClose}
        onSubmit={handleContactSubmit}
        formData={contactForm}
        onChange={handleContactFormChange}
        isSubmitting={isSubmitting}
      />
    </Box>
  );

  if (isMobile) {
    return <Box sx={{ width: '100%' }}>{sidebarContent}</Box>;
  }

  return (
    <Box component="nav">
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            paddingTop: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensures bottom item stays at bottom
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
