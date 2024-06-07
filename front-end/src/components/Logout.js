import React from "react";
import { useAuthContext } from "../contexts/AuthContext";

function LogoutButton() {
    const { logout } = useAuthContext();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            console.log("Logged out successfully");
        } else {
            console.error("Logout failed");
        }
    };

    return (
        <div
            style={{ cursor: "pointer" }}
            className="dropdown-item"
            onClick={handleLogout}
        >
            Logout
        </div>
    );
}

export default LogoutButton;
