"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const router = useRouter();

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Required for cookies to be sent
      });

      const data = await response.json();
      console.log("Auth check response:", data);

      if (data.success) {
        setUser(data.user);
      } else {
        console.warn("Auth check failed, logging out.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      await refreshToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // ✅ Ensure cookies are sent
      });

      console.log("Response Headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("Refresh token response:", data);

      if (data.success) {
        console.log("Token refreshed successfully.");
        checkAuthStatus(); // Retry checking the user's status with the new token
      } else {
        console.warn("Refresh token failed, logging out.");
        setUser(null); // Force log out if refresh fails
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setUser(null);
    }
  };

  // Handle token expiration gracefully
  const handleAuthError = async (error) => {
    if (error?.message === "Invalid token" || error?.status === 401) {
      console.log("Token expired or invalid. Attempting to refresh token...");
      await refreshToken();
    } else {
      console.error("Unexpected error:", error);
      setUser(null); // Log out if any unexpected error occurs
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Check authentication on mount
    
    // Check if password was already verified in this session
    const isPasswordVerified = sessionStorage.getItem('passwordVerified') === 'true';
    if (isPasswordVerified) {
      setPasswordVerified(true);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        router.push("/investor-portal");
      } else {
        console.error(data.error);
      }
      return data; // Return the response data
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message }; // Return an error object
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (response.ok) {
        // Remove cookie (client-side fallback, but should be done server-side)
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        // Clear user state
        setUser(null);

        // Redirect to login or home page
        router.push("/investor-portal");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      checkAuthStatus, 
      handleAuthError,
      passwordVerified,
      setPasswordVerified
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
