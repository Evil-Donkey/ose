'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

const ReCAPTCHA = forwardRef(({ siteKey }, ref) => {
  const recaptchaRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script if not already loaded
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA loaded and ready');
          setIsLoaded(true);
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
    };
  }, [siteKey]);

  const executeRecaptcha = async () => {
    if (!isLoaded || !window.grecaptcha) {
      console.error('reCAPTCHA not loaded or ready');
      return null;
    }

    try {
      console.log('Executing reCAPTCHA...');
      const token = await window.grecaptcha.execute(siteKey, { action: 'signup' });
      console.log('reCAPTCHA token generated:', token ? 'Yes' : 'No');
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  };

  // Expose the execute function to parent component
  useImperativeHandle(ref, () => ({
    executeRecaptcha
  }), [isLoaded, siteKey]);

  return (
    <div 
      ref={recaptchaRef}
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  );
});

ReCAPTCHA.displayName = 'ReCAPTCHA';

export default ReCAPTCHA;
