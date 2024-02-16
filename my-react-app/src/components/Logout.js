import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();


  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

    const csrfToken = getCookie('csrftoken');
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
    <button onClick={handleLogout} className="btn btn-danger">Sign Out</button>
  );
}

export default LogoutButton;
