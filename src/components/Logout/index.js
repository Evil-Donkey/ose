"use client";

import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function Logout() {
  const { logout } = useContext(AuthContext); // Use logout from context

  const handleLogout = async () => {
    await logout(); // Call the logout function from context
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
    >
      Logout
    </button>
  );
}
