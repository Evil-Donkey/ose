"use client";

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Footer from './Footer';

const LayoutClient = ({ children, footerData }) => {
  const { passwordLoading } = useContext(AuthContext);

  // Show loading state while password verification is being checked
  if (passwordLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Footer data={footerData} />
    </>
  );
};

export default LayoutClient; 