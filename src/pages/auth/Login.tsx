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
  TextField,
  Button,
  Paper,
  Container,
  Typography
} from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';


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

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  useEffect(() => {
    // Only redirect if authenticated AND we have a role AND we're not in a loading/submitting state
    if (isAuthenticated && userRole && !isSubmitting && !loading) {
      console.log('isAuthenticated', isAuthenticated, 'userRole', userRole, 'isSubmitting', isSubmitting, 'loading', loading)
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
      setLocalError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');

    try {
      await login(username, password, role);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log('Login error', err);
      setLocalError(err?.message || 'Invalid Credentials. Please try again.');
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
    >
      <Box
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
          Your browser does not support the video tag.
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
            zIndex: 1
          }}
        />
        <Typography variant="h5" align="left" sx={{ mb: 2, pl: 5, zIndex: 1 }}>
          Welcome Onboard!
        </Typography>
      </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        margin: '0 auto',
        padding: 3,
        mt: 10,
      }}
    >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Sign In to Taxibee
        </Typography>
        
        {(error || localError) && (          
          <Alert severity="error" sx={{ mb: 2, mt: 2 }} >
            {error || localError}          
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            autoFocus

            sx={{
              mb: 2,
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1, color: 'black' }}>Role</FormLabel>
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
                label="Admin" 
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
                label="Driver" 
              />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'black', color: 'white', p: 1.1 }}
            disabled={loading || isSubmitting}
          >
            {loading ? 'Logging In...' : 'Sign In'}
          </Button>
        </form>

      <Link
        to="/"
        style={{ marginTop: '1rem' }}
      >
        Back to Home
      </Link>
    </Box>
    </Container>
  );
};

export default Login;
