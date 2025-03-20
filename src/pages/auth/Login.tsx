import React, { useState, useEffect } from 'react';
import taxisHomePageVideo from '../../assets/taxi_vid.mp4';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import { 
  Box, 
  FormControl,
  Button,
  Container,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Select as BaseSelect, SelectProps, Option as BaseOption, optionClasses } from '@mui/base';
import { styled } from '@mui/system';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/F3-02.png'
// import logo2 from '../../assets/F4-03.png'

import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { CustomAlert } from '../../utils/customAlert';

const Select = React.forwardRef(function CustomSelect<
  TValue extends string,
  Multiple extends boolean,
>(props: SelectProps<TValue, Multiple>, ref: React.ForwardedRef<HTMLButtonElement>) {
  const slots: SelectProps<TValue, Multiple>['slots'] = {
    root: Button,
    listbox: Listbox,
    popup: Popup,
    ...props.slots,
  };

  return <BaseSelect {...props} ref={ref} slots={slots} />;
}) as <TValue extends string, Multiple extends boolean>(
  props: SelectProps<TValue, Multiple> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element;

const Option = styled(BaseOption)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &:focus-visible {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  `,
);

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Popup = styled('div')`
  z-index: 1;
`;

// Define interfaces for our types
interface LocationState {
  from: {
    pathname: string;
  };
}

interface FormState {
  username: string;
  password: string;
  role: 'admin' | 'driver' | "";
}

interface PasswordFieldProps {
  id: string;
  name: string;
  value: string;
  showPassword: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  value,
  showPassword,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
}) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  }}>
  <TextField
    id={id}
    name={name}
    type={showPassword ? 'text' : 'password'}
    value={value}
    onChange={handleChange}
    variant="filled"
    label="Password"
    fullWidth
    sx={{
      position: 'absolute',
      '& .MuiFilledInput-root': {
        border: 'none',
        backgroundColor: 'white',
        '&:hover':{
          backgroundColor: 'white',
          border: 'none',
        },
        '&.Mui-focused': {
          border: 'none',
          backgroundColor: 'white',
        },
        '&::before': {
          border: 'none',
        },
        '&::after': {
          border: 'none',
        },
        '&:hover:not(.Mui-disabled):before': {
          borderBottom: 'none'  // Removes the bottom border on hover
        }
      }
    }}
  />
  <InputAdornment position='start'
    sx={{
      mb: 2
    }}
  >
    <IconButton
      aria-label={
        showPassword ? 'hide the password' : 'display password'
      }
      onClick={handleClickShowPassword}
      onMouseDown={handleMouseDownPassword}
    >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  </Box>
);




const Login: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State with explicit typing
  const [formData, setFormData] = useState<FormState>({
    username: '',
    password: '',
    role: ''
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
    } catch (err: unknown) {
      // Type guard to ensure err is an Error object
      if (err instanceof Error) {
        setLocalError(err.message || t('loginPage.noCredError'));
      } else {
        setLocalError(t('loginPage.noCredError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log(formData)


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
          <CustomAlert severity="error" sx={{ mb: 2, mt: 2 }} >
            {error || localError}
          </CustomAlert>
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
            <PasswordField
              id="filled-adornment-password"
              name="password"
              value={formData.password}
              handleChange={handleInputChange}
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
            />
          </FormControl>

          <FormControl component='fieldset' sx={{ mt: 2, width: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#e0e0e0', border: '0.5px solid gray', borderRadius: '4px', '&:hover': { backgroundColor: '#e0e0e0'}, '&:active': { backgroundColor: '#e0e0e0'} }}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              const selectELement = e.currentTarget.querySelector('[role="combobox"]');
              if (selectELement) {
                (selectELement as HTMLElement).click();
              }
            }}
            >
                <Select<string, false>
                  value={formData.role} 
                  placeholder={t('auth.role')}
                  id="named-select"
                  name='role'
                  slotProps={{
                    root: {
                      style: {
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        }
                      }
                    }
                  }}
                  onChange={(_: React.SyntheticEvent | null, newValue: string | null) => {
                    if (newValue) {
                      // Create a synthetic event object that matches what handleInputChange expects
                      const syntheticEvent = {
                        target: {
                          name: 'role',
                          value: newValue,
                        } 
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(syntheticEvent);
                    }
                  }}
                >
                  <Option value="admin">{t('auth.admin')}</Option>
                  <Option value="driver">{t('auth.driver')}</Option>
                </Select>
                <UnfoldMoreRoundedIcon
                  sx={{
                    p: 0.4
                  }}
                />
              </Box>
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
