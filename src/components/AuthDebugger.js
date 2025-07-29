"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthDebugger() {
  const { user, checkAuthStatus } = useContext(AuthContext);
  const [lastAuthCheck, setLastAuthCheck] = useState(null);
  const [authStatus, setAuthStatus] = useState('unknown');
  const [debugInfo, setDebugInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check auth status every 30 seconds
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setAuthStatus(data.success ? 'authenticated' : 'failed');
        setLastAuthCheck(new Date().toLocaleTimeString());
      } catch (error) {
        setAuthStatus('error');
        setLastAuthCheck(new Date().toLocaleTimeString());
      }
    };

    const checkDebugInfo = async () => {
      try {
        const response = await fetch("/api/auth/debug");
        const data = await response.json();
        setDebugInfo(data);
      } catch (error) {
        console.error("Failed to get debug info:", error);
      }
    };

    const interval = setInterval(checkAuthStatus, 30000);
    checkAuthStatus(); // Check immediately
    checkDebugInfo(); // Check debug info once

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await checkAuthStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">Auth Debugger</div>
      <div>User: {user ? user.username : 'Not logged in'}</div>
      <div>Status: {authStatus}</div>
      <div>Last Check: {lastAuthCheck || 'Never'}</div>
      {debugInfo && (
        <div className="mt-2 text-xs">
          <div>AT Secret: {debugInfo.accessTokenSecret ? '✅' : '❌'}</div>
          <div>RT Secret: {debugInfo.refreshTokenSecret ? '✅' : '❌'}</div>
          <div>WP Endpoint: {debugInfo.wordpressEndpoint ? '✅' : '❌'}</div>
        </div>
      )}
      <div className="text-xs text-gray-300 mt-1">
        Check browser console for detailed logs
      </div>
      <button 
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs px-2 py-1 rounded"
      >
        {isRefreshing ? 'Refreshing...' : 'Manual Refresh'}
      </button>
    </div>
  );
} 