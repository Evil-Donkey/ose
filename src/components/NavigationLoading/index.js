"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/Icons/Spinner';

export default function NavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loading when route changes
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 100);

    // Hide loading after a short delay to ensure the new page has loaded
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[9999]">
        <div 
          className="h-full bg-gradient-to-r from-lightblue to-darkblue transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
