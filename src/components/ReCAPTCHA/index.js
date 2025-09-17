'use client'

import { useEffect, useRef } from 'react';

export default function ReCAPTCHA({ onVerify, siteKey }) {
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            // reCAPTCHA is ready
          });
        }
      };
    } else if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        // reCAPTCHA is already loaded and ready
      });
    }
  }, [siteKey]);

  const executeRecaptcha = async () => {
    if (!window.grecaptcha || !window.grecaptcha.ready) {
      console.error('reCAPTCHA not ready');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action: 'signup' });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  };

  // Expose the execute function to parent component
  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.executeRecaptcha = executeRecaptcha;
    }
  }, [siteKey]);

  return (
    <div 
      ref={recaptchaRef}
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  );
}
