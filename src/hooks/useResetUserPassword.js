import { useState } from 'react';

// Error codes mapping for better user messages
const errorCodes = {
    'invalid_key': 'The reset link is invalid or has expired. Please request a new one.',
    'invalid_login': 'Invalid username or email.',
    'password_too_weak': 'Password is too weak. Please choose a stronger password.',
    'user_not_found': 'User not found.',
    'permission_denied': 'You do not have permission to reset this password.',
};

/**
 * Hook which handles the password reset functionality
 * Following Mike Jolley's pattern from his headless WordPress implementation
 */
export const useResetUserPassword = () => {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'resolving', 'resolved', 'error'

    const resetUserPassword = async (key, login, password) => {
        setError(null);
        setStatus('resolving');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, login, newPassword: password }),
            });

            const result = await response.json();
            
            if (result.success) {
                setStatus('resolved');
            } else {
                const message = errorCodes[result.message] || result.message || 'Failed to reset password.';
                setError(message);
                setStatus('error');
            }
        } catch (errors) {
            console.error("Password reset error:", errors);
            const message = errorCodes[errors.message] || `Error: ${errors.message}` || 'Something went wrong. Please try again.';
            setError(message);
            setStatus('error');
        }
    };

    return {
        resetUserPassword,
        error,
        status,
        isResolving: status === 'resolving',
        isResolved: status === 'resolved',
        hasError: status === 'error'
    };
};
