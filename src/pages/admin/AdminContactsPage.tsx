import { Box, List, ListItem, ListItemAvatar, ListItemText, NativeSelect, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Snackbar } from '@mui/material';
import emailjs from '@emailjs/browser';
import { CustomWindow } from '../../api/api';
import { Avatar, CircularProgress } from '@mui/joy';
import React from 'react';

import { useAdminQueries } from '../../hooks';
import { Contact } from '../../types/contact.types';

import { useState } from 'react';
import { WhatsApp, Email, Phone } from '@mui/icons-material';
import { CustomAlert } from '../../utils/customAlert'; 

interface ContactUs {
    name: string;
    email: string;
    message: string;
}

interface SnackbarAlert {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}


const AdminContactsPage: React.FC = () => {
    const [ openContactDialog, setOpenContactDialog ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ contactForm, setContactForm ] = useState<ContactUs>({
        name: '',
        email: '',
        message: ''
    });
   
    const [ snackbar, setSnackbar ] = useState<SnackbarAlert>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleContactDialogOpen = () => {
        setOpenContactDialog(true);
    }

    const handleContactDialogClose = () => {
        setOpenContactDialog(false);
        setContactForm({
            name: '',
            email: '',
            message: ''
        })
    }

    const handleContactFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactForm({
            ...contactForm,
            [event.target.name]: event.target.value
        })
    }

    const handleContactSubmit = async () => {
        // Basic validation
        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
          setSnackbar({
            open: true,
            message: 'Please fill in all fields',
            severity: 'error'
          });
          return;
        }
      
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactForm.email)) {
          setSnackbar({
            open: true,
            message: 'Please enter a valid email address',
            severity: 'error'
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
            severity: 'success'
          });
          handleContactDialogClose();
        } catch (error) {
          console.error('Error sending email:', error);
          setSnackbar({
            open: true,
            message: 'Error sending message. Please try again later.',
            severity: 'error'
          });
        } finally {
          setIsSubmitting(false);
        }
    }

    

    const [ selectedTag, setSelectedTag ] = useState<"driver" | "contactUs">('driver');

    // Use the appropriate query hook based on role
    const { useAdminContacts } = useAdminQueries();

    // Get contacts based on role
    const { data, isLoading, error } = useAdminContacts();

    const formatPhone = (phone: string) => {
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
        return formattedPhone;
    }

    const initiateCall = (phone: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const formattedPhone = formatPhone(phone);
        window.open(`tel:${formattedPhone}`, '_blank');
    }

    const openEmailClient = (email: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        window.open(`mailto:${email}`, '_blank');
    }

    const openWhatsappChat = (phone: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const formattedPhone = formatPhone(phone);
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }


    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh'
            }}>
                <CircularProgress color="warning" />
            </Box>
        );
    }

    if (error) {
        return <CustomAlert severity="error"><Box>{error.toString()}</Box></CustomAlert>;
    }

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTag(event.target.value as "driver" | "contactUs");
        if (event.target.value === 'contactUs') {
            handleContactDialogOpen();
            setSelectedTag('driver')
        }
    };
    

    return (
        <Box>
            <NativeSelect
                value={selectedTag}
                onChange={handleChange}
            >
                <option aria-label="None" value="" />
                <option value={'driver'}>Drivers</option>
                <option value={'contactUs'}>Contact Us</option>
            </NativeSelect>
            <List>
                {data?.data?.map((contact: Contact) => {
                    if (contact.tag === 'driver') return <React.Fragment key={contact.phone}>
                    <ListItem 
                        alignItems="flex-start"
                        sx= {{
                            transition: '0.3s ease-in-out',
                            maxWidth: '600px',
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>{contact.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="body1" color="text.primary">{contact.name}</Typography>}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.secondary" >
                                        {contact.tag.charAt(0).toUpperCase() + contact.tag.slice(1)}
                                    </Typography>
                                    <br />
                                    {`${contact.email}`}
                                    <br />
                                    {`${formatPhone(contact.phone)}`}
                                </>
                            }
                        />
                        <IconButton
                            size="small"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => initiateCall(contact.phone, e)}
                            sx={{
                                color: 'warning.main',
                                mt: 1
                            }}
                        >
                            <Phone />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => openEmailClient(contact.email, e)}
                            sx={{
                                color: 'primary.main',
                                mt: 1
                            }}
                        >
                            <Email /> 
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => openWhatsappChat(contact.phone, e)}
                            sx={{
                                color: 'success.main',
                                mt: 1
                            }}
                        >
                            <WhatsApp />
                        </IconButton>
                    </ListItem>

                    </React.Fragment>
                 } )}
            </List>
            <Dialog 
                open={openContactDialog} 
                onClose={handleContactDialogClose}
                maxWidth="sm"
                fullWidth
                >
                <DialogTitle sx={{ 
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    Contact Us
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <DialogContentText sx={{ mb: 2 }}>
                    Please fill out the form below and we'll get back to you as soon as possible.
                    </DialogContentText>
                    <TextField
                    autoFocus
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    sx={{ mb: 2 }}
                    />
                    <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    sx={{ mb: 2 }}
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
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                    onClick={handleContactDialogClose}
                    variant="outlined"
                    sx={{
                        borderColor: '#fecc04',
                        color: 'black',
                        '&:hover': {
                        borderColor: '#e5b800',
                        backgroundColor: 'rgba(254, 204, 4, 0.1)',
                        }
                    }}
                    >
                    Cancel
                    </Button>
                    <Button 
                    onClick={handleContactSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#fecc04',
                        color: 'black',
                        '&:hover': {
                        backgroundColor: '#e5b800',
                        }
                    }}
                    >
                    {isSubmitting ? 'Sending... ' : 'Send Message'}
                    </Button>
                </DialogActions>
                </Dialog>

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
}

export default AdminContactsPage;
