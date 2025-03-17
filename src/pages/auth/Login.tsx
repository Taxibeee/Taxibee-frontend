import React, { useState, useEffect } from 'react';
import taxisHomePageVideo from '../../assets/taxi_vid.mp4';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import { 
  Box, 
  FormControl,
  Alert,
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  Container,
  Typography,
  InputLabel,
  InputAdornment,
  IconButton,
  TextField,
  Paper,
  OutlinedInput,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/F3-02.png'
// import logo2 from '../../assets/F4-03.png'

import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';


// Define interfaces for our types
interface LocationState {
  from: {
    pathname: string;
  };
}

interface FormState {
  username: string;
  password: string;
  role: 'admin' | 'driver';
}



const Login: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State with explicit typing
  const [formData, setFormData] = useState<FormState>({
    username: '',
    password: '',
    role: 'admin'
  });
  const [localError, setLocalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get auth functionality from our custom hook
  const { login, error, loading, isAuthenticated, userRole, clearErrors } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';


  // Track password visibility
  const [ showPassword, setShowPassword ] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  useEffect(() => {
    // Only redirect if authenticated AND we have a role AND we're not in a loading/submitting state
    if (isAuthenticated && userRole && !isSubmitting && !loading) {
      switch(userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'driver':
          navigate('/driver/dashboard');
          break;
        default:
          navigate(from);
      }
    }
  }, [isAuthenticated, userRole, navigate, from, isSubmitting, loading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password, role } = formData;

    if (!username || !password) {
      setLocalError(t('loginPage.missingInputError'));
      return;
    }

    setIsSubmitting(true);
    setLocalError('');

    try {
      await login(username, password, role);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log('Login error', err);
      setLocalError(err?.message || t('loginPage.noCredError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear errors when user starts to type
    if(error || localError) {
      setLocalError('');
      clearErrors();
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 0,
        margin: 0,
        width: '100%',
      }}
    >{!isMobile && <Box
      sx={{
        width: '40%',
        backgroundColor: 'black',
        color: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={taxisHomePageVideo} type="video/mp4" />
        {t('app.videoNoSupport')}
      </video>

      {/* overlay to make text more readable */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // opacity 
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
      <Paper sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
        <LanguageSwitcher />
      </Paper>
    </Box>
      {/* Logo and Welcome text container */}
      <Box
        sx={{
          position: 'absolute',
          top: 300,
          left: 10,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Taxibee Logo"
          sx={{
            width: 150, // Adjust size as needed
            height: 'auto',
            objectFit: 'contain',
          }}
        />
        
        {/* Welcome text */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: 'Comic Sans MS, sans-serif',
            color: 'white',
          }}
        >
          {t('loginPage.heroText')}
        </Typography>
      </Box>
    </Box>}
      
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        height: '100vh',
        width: isMobile? '100%': '60%',
        padding: 3,
        paddingTop: 30,
      }}
    >
      {isMobile && (
        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
        <Paper sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
          <LanguageSwitcher />
        </Paper>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'inherit',
          padding: 3,
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          {t('loginPage.title')}
        </Typography>
        
        {(error || localError) && (          
          <Alert severity="error" sx={{ mb: 2, mt: 2 }} >
            {error || localError}          
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label={t('auth.username')}
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            autoFocus
            sx={{
              mb: 2,
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'  // This removes the border
              },
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none'  // Removes border on hover
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none'  // Removes border on focus
                }
              }
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">{t('auth.password')}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                }
              }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onChange={handleInputChange}
            />
          </FormControl>

          
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1, color: 'black' }}>{t('auth.role')}</FormLabel>
            <RadioGroup
              aria-label="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel 
                value="admin" 
                control={<Radio
                  sx={{
                    '&.Mui-checked': {
                      color: 'black',
                    },
                  }}
                />} 
                label={t('auth.admin')}
              />
              <FormControlLabel 
                value="driver" 
                control={<Radio
                  sx={{
                    '&.Mui-checked': {
                      color: 'black',
                    },
                  }}
                />} 
                label={t('auth.driver')}
              />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#fecc04', color: 'black', p: 1.1 }}
            disabled={loading || isSubmitting}
          >
            {loading ? 'Logging In...' : t('auth.login')}
          </Button>
        </form>
        </Box>
      <Link
        to="/"
        style={{ marginTop: '1rem' }}
      >
        {t('loginPage.backToHome')}
      </Link>
    </Box>
    </Container>
  );
};

export default Login;
