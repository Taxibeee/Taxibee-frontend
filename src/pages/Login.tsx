import { useAuth } from "../auth/AuthProvider";
import { Paper, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";




const Login = () => {
  const { handleLogin, authToken, error } = useAuth();
  const navigate = useNavigate();

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ role, setRole ] = useState("");

  useEffect(() => {
    if (authToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [authToken, navigate])


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexWrap: 'wrap',
        '& > :not(style)': {
        m: 1,
        width: '100%',
        height: '100%',
        },
      }}
    >
      <Paper elevation={1} sx={{
        padding: 2,
        minHeight: '70vh',
        maxWidth: '80vw',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography variant="h2">Login</Typography>
        <TextField id="username-basic" variant="outlined" label={'Username'} value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mt: 2, width: '400px' }} /> 
        <TextField id="password-basic" variant="outlined" label={'Password'} value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mt: 2, width: '400px' }} />
        <TextField id="role-basic" variant="outlined" label={'Role'} value={role} onChange={(e) => setRole(e.target.value)} sx={{ mt: 2, width: '400px' }} />
        <Button onClick={() => handleLogin(username, password, role)} sx={{
          mt: 2,
          width: '400px',
          backgroundColor: '#1976d2',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1565c0',
          }
        }}>Login</Button>
        {error && <Typography variant="body1" color="error">{error.message}</Typography>}
      </Paper>
    </Box>
  )
}

export default Login;