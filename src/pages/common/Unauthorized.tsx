import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';

/**
 * Unauthorized Component
 *
 * Displayed when a user tries to access a page they don't have permissions for.
 * Provides navigation options based on the user's role.
 */

const Unauthorized: React.FC = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logging out the user
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get the correct dashboard link based on user role
  const getDashboardLink = () => {
    if (userRole === 'admin') {
      return '/admin/dashboard';
    } else if (userRole === 'driver') {
      return '/driver/dashboard';
    }
    return '/';
  };

  return (
    <>
      <p>You do not have permission to access this page</p>
      <p>This area is restricted to users with different permissions than your current Role</p>

      {userRole && <Link to={getDashboardLink()}>Go to your dashboard</Link>}
      <Link to="/">Return to Home</Link>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Unauthorized;
