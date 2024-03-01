import React from 'react';
import { useAuthContext } from "../contexts/AuthContext";

function LogoutButton() {
  const { logout } = useAuthContext();


  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ cursor: 'pointer' }} className="dropdown-item" onClick={handleLogout}>Logout</div>
  );
}

export default LogoutButton;
