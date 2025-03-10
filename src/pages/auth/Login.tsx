import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';

/**
 * Login Component
 * 
 * Provides a form for users to authenticate themselves
 * Handles both driver and admin user types
 */

const Login: React.FC = () => {
  // State for form fields
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ role, setRole ] = useState<string>('admin');
  const [ localError, setLocalError ] = useState<string>('');
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

  // Get auth functionality from our custom hook
  const { login, error, loading, isAuthenticated, userRole, clearErrors } = useAuth();

  // For navigation and getting previous location
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to role-based dashboard
  const from = location.state?.from?.pathname || '/';

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [ clearErrors ]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate(from);
      }
    }
  }, [isAuthenticated, userRole, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if(!username || !password) {
      setLocalError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');

    try {
      // Call login function from our hook
      await login(username, password, role);

      // No need to navigate here - useEffect will handle it
    } catch (err) {
      console.error(err);
      // If error is not already handled by Redux, set Local error
      if (!error) {
        setLocalError('Login failed. Please try again..');
      } 
    } finally {
        setIsSubmitting(false);
      }
  };


  return (
    <>
      <h2>Sign in to your account</h2>
      {(error || localError) && (
        <div className="error-message">
          {error || localError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>

        <input
          id='username'
          name='username'
          type='text'
          autoComplete='username'
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading || isSubmitting}
        />

        <label htmlFor='password'>Password</label>

        <input
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || isSubmitting}
        />

        <label htmlFor='role'>Role</label>

        <select
          id='role'
          name='role'
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading || isSubmitting}
        >
          <option value='admin'>Admin</option>
          <option value='driver'>Driver</option>
        </select>

        <button type='submit' disabled={loading || isSubmitting}>
          {loading || isSubmitting ? 'Logging in...' : 'Sign in'}
        </button>
      </form>

      <Link
        to='/'
      >
        Back to Home
      </Link>
    </>
  )
}

export default Login;