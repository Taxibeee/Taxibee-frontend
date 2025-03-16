import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import taxisHomePageVideo from '../../assets/taxi_vid.mp4';
import logo from '../../assets/F3-02.png';

// Material UI imports
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
  Stack
} from '@mui/material';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const HomePage: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
              background: 'rgba(0, 0, 0, 0.6)',
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
                      fontWeight: 700, 
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      mb: 2,
                      fontSize: isMobile ? '1.5rem' : '2.5rem',
                      fontFamily: 'Comic Sans MS, sans-serif'
                    }}
                  >
                    Taxi fleet management with ease
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
                      onClick={() => handleNavigation('/contact')}
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
                <Grid2 item xs={12} md={4}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      }
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
                
                <Grid2 item xs={12} md={4}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      }
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
                
                <Grid2 item xs={12} md={4}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      }
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
              
              <Box sx={{ mt: 8, textAlign: 'center' }}>
                {!isAuthenticated && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleNavigation('/login')}
                    sx={{
                      backgroundColor: '#fecc04',
                      color: 'black',
                      py: 1.5,
                      px: 4,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#e5b800',
                      }
                    }}
                  >
                    Get Started Today
                  </Button>
                )}
              </Box>
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
            <Grid2 item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
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
            
            <Grid2 item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'center' }}>
                <IconButton color="inherit">
                  <PhoneIcon />
                </IconButton>
                <IconButton color="inherit">
                  <EmailIcon />
                </IconButton>
              </Stack>
            </Grid2>
            
            <Grid2 item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Taxibee. All rights reserved.
              </Typography>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;