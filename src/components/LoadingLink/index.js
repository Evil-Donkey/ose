"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Spinner } from '@/components/Icons/Spinner';

export default function LoadingLink({ 
  href, 
  children, 
  className = "", 
  onClick,
  disabled = false,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }

    setIsLoading(true);
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Reset loading state after navigation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 ${className} ${disabled || isLoading ? 'pointer-events-none opacity-50' : ''}`}
      onClick={handleClick}
      {...props}
    >
      {isLoading && <Spinner size={16} className="text-current" />}
      {children}
    </Link>
  );
}
