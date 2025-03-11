import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/hooks';


/**
 * Profile Component
 * 
 * Displays user profile information and allows password updates.
 * Used by both driver and admin user types
 */

const Profile: React.FC = () => {
    const { currentUser, updatePassword, error, loading, clearErrors, logout, userRole } = useAuth();


    // State for password form
    const [ passwordData, setPasswordData ] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const [ localError, setLocalError ] = useState<string>('');
    const [ success, setSuccess ] = useState<string>('');
    const [ activeTab, setActiveTab ] = useState<string>('profile');

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            clearErrors();
        };
    }, [clearErrors]);

    // Handle input changes for password form
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    // Handle password update submission
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            setLocalError('Please fill in all password fields');
            return;
        }

        setLocalError('');
        setSuccess('');

        try {
            const response = await updatePassword(
                passwordData.oldPassword,
                passwordData.newPassword
            );

            setSuccess(response.message || 'Password updated successfully!');

            // CLear form after sucessful update
            setPasswordData({
                oldPassword: '',
                newPassword: '',
            });
        } catch (err) {
            console.error(err);
            // If error is not already handled by redux, set Local error 
            if (!error) {
                setLocalError('Failed to update password');
            }
        }
    };

    // Determine dashboard link based on user role
    const getDashboardLink = () => {
        return userRole === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
    }

    // If no user is logged in, show appropriate message
    if (!currentUser) {
        return (
            <>
            <p>Please log in to view your profile.</p>
            <Link
              to='/login'
            >
                Go to Login
            </Link>
            </>
        )
    }

    return (
        <>
            {/* Header */}
            <h1>My Profile</h1>
            <Link
                to={getDashboardLink()}
            >
                Dashboard
            </Link>
            <button
                onClick={() => logout()}
            >
                Logout
            </button>


            {/* Tab Navigation */}
            <button
                onClick={() => setActiveTab('profile')}>
                Profile Information
            </button>
            <button
                onClick={() => setActiveTab('security')}
            >
                Security Settings
            </button>


            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
                <>
                <p>{currentUser.name || currentUser.full_name || 'N/A'}</p>
                <p>{currentUser.username || 'N/A'}</p>
                <p>{currentUser.role || 'N/A'}</p>
                <p>{currentUser.email || 'N/A'}</p>
                <p>{currentUser.company_id || 'N/A'}</p>
                </>
            )}

            {/* Show additional driver-specific fields if the user is a driver */}
            {currentUser.role === 'driver' && (
                <>
                <p>{currentUser.taxibee_id || 'N/A'}</p>
                <p>{currentUser.bolt_driver_uuid || 'N/A'}</p>
                </>
            )}


            {/* Security Settings Tab */}
            {activeTab === 'security' && (
                <>
                <p>Update your password and security preferences</p>
                <h3>Password Update</h3>
                <p className='text-red-500'>
                    {(error || localError) && (
                        <p>
                            {error || localError}
                        </p>
                    )}
                </p>

                <p>
                    {success && (
                        <p className='text-green-500'>
                            {success}
                        </p>
                    )}
                </p>

                <form onSubmit={handlePasswordSubmit}>
                    <label htmlFor='oldPassword'>Current Password</label>
                    <input
                        type='password'
                        id='oldPassword'
                        name='oldPassword'
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                    />

                    <label htmlFor='newPassword'>New Password</label>
                    <input
                        type='password'
                        id='newPassword'
                        name='newPassword'
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                    />

                    <button
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
                </>
            )}
        </>
    )
}

export default Profile;