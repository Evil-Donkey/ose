"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Defaults align with `TEMPORARILY_DISABLE_PASSWORD = true` below so SSR
  // renders the real page tree instead of a blocking overlay/spinner. If
  // password gating is ever re-enabled, both defaults need to be reconsidered
  // together with `PasswordWrapper` / `LayoutClient` to avoid reintroducing
  // the "blank page until hydration" bug this caused previously.
  const [passwordVerified, setPasswordVerified] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const router = useRouter();

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        return;
      }

      // /me failed — try to refresh the token silently. If there's no
      // refresh token cookie, the refresh endpoint will short-circuit and
      // we just end up anonymous, which is fine for public pages.
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
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
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        return false;
      }

      const retryResponse = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      const retryData = await retryResponse.json();

      if (retryData.success) {
        setUser(retryData.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
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
    
    // TEMPORARY: Disable password overlay
    const TEMPORARILY_DISABLE_PASSWORD = true;
    
    if (TEMPORARILY_DISABLE_PASSWORD) {
      setPasswordVerified(true);
    } else {
      // Check if password was already verified in this session
      const isPasswordVerified = sessionStorage.getItem('passwordVerified') === 'true';
      if (isPasswordVerified) {
        setPasswordVerified(true);
      }
    }
    setPasswordLoading(false);
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
        router.push("/shareholder-portal");
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
        router.push("/shareholder-portal");
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
      setPasswordVerified,
      passwordLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
