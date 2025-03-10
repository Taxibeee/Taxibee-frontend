import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';

/**
 * Homepage Component
 * 
 * Landing Page that welcomes users and provides navigation to authentication pages
 * or dashboards based on authentication status
 */

const HomePage: React.FC = () => {
    const { isAuthenticated, userRole } = useAuth();

    return (
        <>
        {isAuthenticated ? (
            <>
            <Link
            to='/profile'
            className='text-gray-600'
            >
                Profile
            </Link>
            {userRole === 'admin' && (
                <Link
                to='/admin/dashboard'
                className='text-gray-600'
                >
                    Admin Dashboard
                </Link>
            )}
            {userRole === 'driver' && (
                <Link
                to='/driver/dashboard'
                className='text-gray-600'
                >
                    Driver Dashboard
                </Link>
            )}
            </>
        ): (
            <Link
            to='/login'
            className='text-gray-600'
            >
                Login
            </Link>
        )}
        </>
    )
}

export default HomePage;