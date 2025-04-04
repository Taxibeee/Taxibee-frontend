import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import { Avatar, CircularProgress } from '@mui/joy';
import React from 'react';

import { useAdminQueries } from '../../hooks';
import { Contact } from '../../types/contact.types';

import { WhatsApp, Email, Phone } from '@mui/icons-material';
import { CustomAlert } from '../../utils/customAlert';

const AdminContactsPage: React.FC = () => {
  // Use the appropriate query hook based on role
  const { useAdminContacts } = useAdminQueries();

  // Get contacts based on role
  const { data, isLoading, error } = useAdminContacts();

  const formatPhone = (phone: string) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    return formattedPhone;
  };

  const initiateCall = (phone: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const formattedPhone = formatPhone(phone);
    window.open(`tel:${formattedPhone}`, '_blank');
  };

  const openEmailClient = (email: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    window.open(`mailto:${email}`, '_blank');
  };

  const openWhatsappChat = (phone: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const formattedPhone = formatPhone(phone);
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  if (error) {
    return (
      <CustomAlert severity="error">
        <Box>{error.toString()}</Box>
      </CustomAlert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          mb: 2,
        }}
      ></Box>
      <List>
        {data?.data?.map((contact: Contact) => {
          if (contact.tag === 'driver')
            return (
              <React.Fragment key={contact.phone}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    transition: '0.3s ease-in-out',
                    maxWidth: '600px',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{contact.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" color="text.primary">
                        {contact.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
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
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      initiateCall(contact.phone, e)
                    }
                    sx={{
                      color: 'warning.main',
                      mt: 1,
                    }}
                  >
                    <Phone />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      openEmailClient(contact.email, e)
                    }
                    sx={{
                      color: 'primary.main',
                      mt: 1,
                    }}
                  >
                    <Email />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      openWhatsappChat(contact.phone, e)
                    }
                    sx={{
                      color: 'success.main',
                      mt: 1,
                    }}
                  >
                    <WhatsApp />
                  </IconButton>
                </ListItem>
              </React.Fragment>
            );
        })}
      </List>
    </Box>
  );
};

export default AdminContactsPage;
