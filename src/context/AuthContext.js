"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to check authentication status
  const checkAuthStatus = async () => {
    const token = Cookies.get("authToken");

    if (!token) {
      setUser(null); // No token, assume user is logged out
      return;
    }

    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Check authentication on mount
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
    } catch (error) {
      console.error("Login error:", error);
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
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
