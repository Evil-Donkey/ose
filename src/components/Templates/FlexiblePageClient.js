"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const FlexiblePage = dynamic(() => import("./FlexiblePage"), { ssr: false });

export default function FlexiblePageClient({ children, meganavLinks, meganavData, ...props }) {
  const [isContentReady, setIsContentReady] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if the flexible content has rendered by looking for the smooth-wrapper
    const checkContentReady = () => {
      const smoothWrapper = document.getElementById('smooth-wrapper');
      if (smoothWrapper && smoothWrapper.children.length > 0) {
        setIsContentReady(true);
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkContentReady()) return;

    // If not ready, check periodically
    const interval = setInterval(() => {
      if (checkContentReady()) {
        clearInterval(interval);
      }
    }, 50);

    // Fallback timeout
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsContentReady(true);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div ref={contentRef}>
        <FlexiblePage {...props} meganavLinks={meganavLinks} meganavData={meganavData} />
      </div>
      {isContentReady && children}
    </>
  );
} 