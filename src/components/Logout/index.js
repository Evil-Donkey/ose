"use client";

import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "@/components/Button";

export default function Logout() {
  const { logout } = useContext(AuthContext); // Use logout from context

  const handleLogout = async () => {
    await logout(); // Call the logout function from context
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
}
