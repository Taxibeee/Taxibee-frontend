import { Box, Alert, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { Avatar, CircularProgress, Typography } from '@mui/joy';
import React from 'react';

import { useAdminQueries } from '../../hooks';
import { useDriverQueries } from '../../hooks';
import { Contact } from '../../api/adminApi';

interface ContactsPageProps {
  role: string;
}


const ContactsPage: React.FC<ContactsPageProps> = ( { role } ) => {
    // Use the appropriate query hook based on role
    const { useAdminContacts } = useAdminQueries();
    const { useDriverContacts } = useDriverQueries();

    // Get contacts based on role
    const { data: contacts, isLoading, error } = role === 'admin' ? useAdminContacts() : useDriverContacts();

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography>Contacts</Typography>
            <List>
                {contacts?.map((contact: Contact) => (
                    <React.Fragment key={contact.phone}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar>{contact.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={contact.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary" >
                                        {contact.tag}
                                    </Typography>
                                    {` - ${contact.email}`}
                                    <br />
                                    {` - ${contact.phone}`}
                                </>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </React.Fragment>
                ) )}
            </List>
        </Box>
    );
}

export default ContactsPage;