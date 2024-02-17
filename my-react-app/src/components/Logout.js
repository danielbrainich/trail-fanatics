import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/useCsrfToken';


function Logout() {
  const navigate = useNavigate();

  const csrfToken = useCsrfToken();
  console.log("CSRF Token:", csrfToken);


  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/accounts/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            "X-CSRFToken": csrfToken,
          },
      });

      if (response.ok) {
        console.log("Sign-out successful");
        navigate('/login');
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="dropdown-item">Logout</button>
  );
}

export default Logout;
