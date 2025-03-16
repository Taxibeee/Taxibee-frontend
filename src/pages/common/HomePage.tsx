import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import taxisHomePageVideo from '../../assets/taxi_vid.mp4';
import logo from '../../assets/F3-02.png';

import emailjs from '@emailjs/browser';

import {
  Box,
  Button,
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Fade,
  Slide,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  DialogContentText,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

interface ContactUs {
  name: string;
  email: string;
  message: string;
}

interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string;
    readonly VITE_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface SnackbarAlert {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

const HomePage: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [ snackbar, setSnackbar ] = useState<SnackbarAlert>({
    open: false,
    message: '',
    severity: 'success' 
  }) 

  const handleSnackbarClose = () => {
    setSnackbar({
        ...snackbar, open: false
    })
  }


  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


  const [ openContactDialog, setOpenContactDialog ] = useState<boolean>(false);
  const [ contactForm, setContactForm ] = useState<ContactUs>({
    name: '',
    email: '',
    message: ''
  })

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

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });

  };

  const handleContactSubmit = async () => {
    // Basic validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      })
      return;
    }
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      })
      return;
    }
    
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        message: contactForm.message,
        to_email: 'nasrul2001@gmail.com', // Your email address
      };
  
      // Replace these with your actual EmailJS credentials
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );
  
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success'
      })
      handleContactDialogClose();
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbar({
        open: true,
        message: 'Error sending message. Please try again later.',
        severity: 'error'
      })
    } finally{
        setIsSubmitting(false);
    }
  };





  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setHeroVisible(true);
    
    const featuresTimer = setTimeout(() => {
      setFeaturesVisible(true);
    }, 500);
    
    return () => clearTimeout(featuresTimer);
  }, []);
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  // Get dashboard path based on user role
  const getDashboardPath = () => {
    return userRole === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Video Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              zIndex: 0,
            }}
          >
            <source src={taxisHomePageVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Dark overlay */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 0,
            }}
          />
        </Box>
        
        {/* Hero Content */}
        <Container maxWidth="xl">
          <Fade in={heroVisible} timeout={1500}>
            <Grid2 container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
              <Grid2 item xs={12} md={7}>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <Box
                    component="img"
                    src={logo}
                    alt="Taxibee Logo"
                    sx={{
                      width: isMobile ? 180 : 250,
                      height: 'auto',
                      mb: 4,
                      filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))',
                    }}
                  />
                  
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    color="white"
                    sx={{ 
                      fontWeight: 900, 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      mb: 2,
                      fontSize: isMobile ? '1.5rem' : '2.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Taxi fleet management with ease
                  </Typography>

                  <Typography 
                    variant="body1" 
                    color="white"
                    sx={{ 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    Get your fleet registered with us
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="gray" 
                    sx={{ 
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                      mb: 4,
                      maxWidth: '700px'
                    }}
                  >
                    Streamlined operations, real-time data, and powerful analytics for taxi companies and drivers
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                    sx={{
                      justifyContent: isMobile ? 'center' : 'flex-start',
                    }}
                  >
                    <Button
                      variant="contained"
                      size={isMobile ? 'large' : 'large'}
                      onClick={isAuthenticated ? () => handleNavigation(getDashboardPath()) : () => handleNavigation('/login')}
                      endIcon={isAuthenticated ? <DashboardIcon /> : <ArrowForwardIcon />}
                      sx={{
                        backgroundColor: '#fecc04',
                        color: 'black',
                        py: 1.5,
                        px: 4,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#e5b800',
                        },
                        width: isMobile ? '100%' : '170px',
                      }}
                    >
                        {isAuthenticated ? 'Go to your Dashboard' : 'Sign In'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleContactDialogOpen}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          borderColor: '#fecc04',
                          backgroundColor: 'rgba(254, 204, 4, 0.1)',
                        },
                        width: isMobile ? '100%' : '170px',
                      }}
                    >
                      Contact Us
                    </Button>
                  </Stack>
                </Box>
              </Grid2>
            </Grid2>
          </Fade>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Slide in={featuresVisible} direction="up" timeout={1000}>
            <Box>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 6,
                  fontFamily: 'Helvetica-Neue',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    backgroundColor: '#fecc04',
                  }
                }}
              >
                Powerful Fleet Management
              </Typography>
              
              <Grid2 container spacing={isTablet ? 3 : 4}>
                <Grid2 item size={{ xs: 12, md: 4 }} >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      backgroungColor: 'inherit'
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <LocalTaxiIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: '#fecc04',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Real-Time Driver Tracking
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Monitor your entire fleet in real-time. Track driver status, availability, and current orders from anywhere.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
                
                <Grid2 item size={{ xs: 12, md: 4 }} >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <AnalyticsIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: '#fecc04',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Comprehensive Analytics
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Gain valuable insights with detailed analytics on revenue, driver performance, and customer trends.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
                
                <Grid2 item size={{ xs: 12, md: 4 }} >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <PersonIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: '#fecc04',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        Driver Portal
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Give your drivers access to their personal dashboard with earnings, performance metrics, and order history.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </Box>
          </Slide>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ 
        py: 4, 
        backgroundColor: '#1a1a1a',
        color: 'white',
        mt: 'auto'
      }}>
        <Container>
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 item size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                component="img"
                src={logo}
                alt="Taxibee Logo"
                sx={{
                  width: 120,
                  height: 'auto',
                  mb: 2,
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Taxi fleet management made simple
              </Typography>
            </Grid2>
            
            <Grid2 item size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'center' }}>
                <IconButton color="inherit">
                  <PhoneIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleContactDialogOpen} >
                  <EmailIcon />
                </IconButton>
              </Stack>
            </Grid2>
            
            <Grid2 item size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Taxibee. All rights reserved.
              </Typography>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
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
        margin="dense"
        name="email"
        label="Email Address"
        type="email"
        fullWidth
        variant="outlined"
        value={contactForm.email}
        onChange={handleContactFormChange}
        sx={{ mb: 2 }}
        />
        <TextField
        margin="dense"
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
            {isSubmitting ? 'Sending.. ' : 'Send Message'}
        </Button>
    </DialogActions>
    </Dialog>
        
        {/* Snackbar Alert */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
            <Alert 
                onClose={handleSnackbarClose} 
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>


    </Box>
  );
};

export default HomePage;