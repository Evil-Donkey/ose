"use client";

import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import PasswordOverlay from './index';

const PasswordWrapper = ({ children }) => {
  const { passwordVerified, passwordLoading } = useContext(AuthContext);

  // Show nothing while password verification is being checked to prevent flash
  if (passwordLoading) {
    return null;
  }

  // If password is not verified, show the overlay
  if (!passwordVerified) {
    return <PasswordOverlay />;
  }

  // If password is verified, show the children
  return children;
};

export default PasswordWrapper; 