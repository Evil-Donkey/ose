"use client";

import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import PasswordOverlay from './index';

const PasswordWrapper = ({ children }) => {
  const { passwordVerified } = useContext(AuthContext);

  // If password is not verified, show the overlay
  if (!passwordVerified) {
    return <PasswordOverlay />;
  }

  // If password is verified, show the children
  return children;
};

export default PasswordWrapper; 