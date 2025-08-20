import { useState } from 'react';

// Error codes mapping for better user messages
const errorCodes = {
    'email_not_found': 'The email doesn\'t exist. Please sign up.',
    'not_approved': 'Your email has not been approved yet. Please get in touch with a link to investors@oxfordsciences.com',
    'user_not_found': 'No user found with this email address.',
    'permission_denied': 'You do not have permission to reset this password.',
    'invalid_email': 'Please enter a valid email address.',
};

/**
 * Hook which handles the forgot password flow
 * Following Mike Jolley's pattern from his headless WordPress implementation
 */
export const useForgotPassword = () => {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'resolving', 'resolved', 'error'

    const sendResetPasswordEmail = async (email) => {
        setError(null);
        setStatus('resolving');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            
            if (result.success) {
                if (result.message === 'reset_sent') {
                    setStatus('resolved');
                } else {
                    // Handle different response messages
                    const message = errorCodes[result.message] || result.message || 'Something went wrong. Please try again.';
                    setError(message);
                    setStatus('error');
                }
            } else {
                const message = errorCodes[result.message] || result.message || 'Failed to process request.';
                setError(message);
                setStatus('error');
            }
        } catch (errors) {
            const message = errorCodes[errors.message] || `Error: ${errors.message}` || 'Something went wrong. Please try again.';
            setError(message);
            setStatus('error');
        }
    };

    return {
        sendResetPasswordEmail,
        error,
        status,
        isResolving: status === 'resolving',
        isResolved: status === 'resolved',
        hasError: status === 'error'
    };
};
